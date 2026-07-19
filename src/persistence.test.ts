import {
  loadBoard,
  parseEnvelope,
  persistBoard,
  STORAGE_KEY,
  type StorageLike,
} from "./persistence";
import type { Task } from "./task";

const EMPTY_V1 = JSON.stringify({ version: 1, tasks: [] });
const validTask: Task = {
  id: "task-1",
  title: "Persist me",
  status: "todo",
  createdAt: "2026-07-19T10:00:00.000Z",
};

class MemoryStorage implements StorageLike {
  value: string | null = null;
  writes: string[] = [];
  failWrites = false;

  getItem(key: string) {
    expect(key).toBe(STORAGE_KEY);
    return this.value;
  }

  setItem(key: string, value: string) {
    expect(key).toBe(STORAGE_KEY);
    if (this.failWrites) {
      throw new Error("quota");
    }
    this.value = value;
    this.writes.push(value);
  }
}

function omitField(
  value: Record<string, unknown>,
  field: string,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).filter(([key]) => key !== field),
  );
}

function envelopeWith(invalidTask: unknown): string {
  return JSON.stringify({
    version: 1,
    tasks: [validTask, invalidTask],
  });
}

const distinctTask = { ...validTask, id: "task-2" };

const invalidPersistedValues: Array<[string, string]> = [
  ["malformed JSON", "{broken"],
  ["null envelope", "null"],
  ["array envelope", "[]"],
  ["string envelope", '"invalid"'],
  ["numeric envelope", "1"],
  ["missing version", JSON.stringify({ tasks: [validTask] })],
  ["missing tasks", JSON.stringify({ version: 1 })],
  [
    "extra envelope field",
    JSON.stringify({ version: 1, tasks: [validTask], extra: true }),
  ],
  ["zero version", JSON.stringify({ version: 0, tasks: [validTask] })],
  ["future version", JSON.stringify({ version: 2, tasks: [validTask] })],
  ["string version", JSON.stringify({ version: "1", tasks: [validTask] })],
  ["null tasks", JSON.stringify({ version: 1, tasks: null })],
  ["object tasks", JSON.stringify({ version: 1, tasks: {} })],
  ["string tasks", JSON.stringify({ version: 1, tasks: "tasks" })],
  ["null task", envelopeWith(null)],
  ["array task", envelopeWith([])],
  ["string task", envelopeWith("task")],
  ["missing task id", envelopeWith(omitField(distinctTask, "id"))],
  ["numeric task id", envelopeWith({ ...distinctTask, id: 2 })],
  ["empty task id", envelopeWith({ ...distinctTask, id: "" })],
  ["duplicate task id", envelopeWith({ ...distinctTask, id: validTask.id })],
  ["missing task title", envelopeWith(omitField(distinctTask, "title"))],
  ["numeric task title", envelopeWith({ ...distinctTask, title: 2 })],
  ["empty task title", envelopeWith({ ...distinctTask, title: "" })],
  ["whitespace task title", envelopeWith({ ...distinctTask, title: "   " })],
  [
    "overlong task title",
    envelopeWith({ ...distinctTask, title: "x".repeat(121) }),
  ],
  ["untrimmed task title", envelopeWith({ ...distinctTask, title: " padded " })],
  ["missing task status", envelopeWith(omitField(distinctTask, "status"))],
  ["numeric task status", envelopeWith({ ...distinctTask, status: 1 })],
  ["invalid task status", envelopeWith({ ...distinctTask, status: "review" })],
  [
    "missing task createdAt",
    envelopeWith(omitField(distinctTask, "createdAt")),
  ],
  ["numeric task createdAt", envelopeWith({ ...distinctTask, createdAt: 1 })],
  [
    "malformed task createdAt",
    envelopeWith({ ...distinctTask, createdAt: "July 19, 2026" }),
  ],
  [
    "rollover task createdAt",
    envelopeWith({
      ...distinctTask,
      createdAt: "2026-02-30T00:00:00.000Z",
    }),
  ],
  ["extra task field", envelopeWith({ ...distinctTask, extra: true })],
];

describe("persistence envelope", () => {
  it("accepts an exact valid v1 envelope", () => {
    expect(
      parseEnvelope(JSON.stringify({ version: 1, tasks: [validTask] })),
    ).toEqual({ version: 1, tasks: [validTask] });
  });

  it.each(invalidPersistedValues)(
    "rejects and fully recovers %s without salvaging tasks",
    (_name, serialized) => {
      expect(parseEnvelope(serialized)).toBeNull();

      const storage = new MemoryStorage();
      storage.value = serialized;

      expect(loadBoard(() => storage)).toEqual({
        tasks: [],
        hasPersistenceWarning: false,
      });
      expect(storage.value).toBe(EMPTY_V1);
      expect(storage.writes).toEqual([EMPTY_V1]);
    },
  );

  it("keeps memory usable and warns when reads or recovery writes fail", () => {
    expect(
      loadBoard(() => {
        throw new Error("blocked");
      }),
    ).toEqual({ tasks: [], hasPersistenceWarning: true });

    const storage = new MemoryStorage();
    storage.value = "{broken";
    storage.failWrites = true;
    expect(loadBoard(() => storage).hasPersistenceWarning).toBe(true);
  });

  it("reports failed writes and succeeds on a later retry", () => {
    const storage = new MemoryStorage();
    storage.failWrites = true;
    expect(persistBoard([validTask], () => storage)).toBe(false);

    storage.failWrites = false;
    expect(persistBoard([validTask], () => storage)).toBe(true);
    expect(JSON.parse(storage.value!)).toEqual({
      version: 1,
      tasks: [validTask],
    });
  });
});
