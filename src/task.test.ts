import {
  compareTasksNewestFirst,
  isValidUtcTimestamp,
  isValidTask,
  orderedTasks,
  validateTitle,
  type Task,
} from "./task";

const task = (overrides: Partial<Task> = {}): Task => ({
  id: "task-a",
  title: "A task",
  status: "todo",
  createdAt: "2026-07-19T10:00:00.000Z",
  ...overrides,
});

describe("task validation", () => {
  it("trims valid titles and rejects empty or overlong titles", () => {
    expect(validateTitle("  Write tests  ")).toBe("Write tests");
    expect(validateTitle(" \n ")).toBeNull();
    expect(validateTitle("x".repeat(121))).toBeNull();
  });

  it("accepts only the exact canonical task schema", () => {
    expect(isValidTask(task())).toBe(true);
    expect(isValidTask({ ...task(), status: "review" })).toBe(false);
    expect(isValidTask({ ...task(), title: " padded " })).toBe(false);
    expect(isValidTask({ ...task(), createdAt: "July 19, 2026" })).toBe(false);
    expect(isValidTask({ ...task(), extra: true })).toBe(false);
  });

  it.each([
    "2026-02-29T00:00:00.000Z",
    "2026-02-30T00:00:00.000Z",
    "2026-04-31T23:59:59.999Z",
    "2026-13-01T00:00:00.000Z",
    "2026-12-31T24:00:00.000Z",
  ])("rejects calendar or time rollover timestamp %s", (createdAt) => {
    expect(isValidUtcTimestamp(createdAt)).toBe(false);
    expect(isValidTask(task({ createdAt }))).toBe(false);
  });

  it.each([
    "0000-01-01T00:00:00Z",
    "2024-02-29T23:59:59.999Z",
    "2026-02-28T23:59:59.9Z",
    "2026-12-31T23:59:59.999Z",
    "9999-12-31T23:59:59.999Z",
  ])("preserves valid ISO-8601 UTC boundary timestamp %s", (createdAt) => {
    expect(isValidUtcTimestamp(createdAt)).toBe(true);
    expect(isValidTask(task({ createdAt }))).toBe(true);
  });
});

describe("task ordering", () => {
  it("orders by instant descending, then id lexical descending", () => {
    const tasks = [
      task({ id: "b", createdAt: "2026-07-19T09:00:00.000Z" }),
      task({ id: "a", createdAt: "2026-07-19T10:00:00.000Z" }),
      task({ id: "z", createdAt: "2026-07-19T10:00:00.000Z" }),
      task({ id: "done", status: "done" }),
    ];

    expect(orderedTasks(tasks, "todo").map(({ id }) => id)).toEqual([
      "z",
      "a",
      "b",
    ]);
    expect([...tasks.slice(0, 3)].sort(compareTasksNewestFirst)[0].id).toBe("z");
  });
});
