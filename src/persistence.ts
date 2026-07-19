import { isValidTask, type Task } from "./task";

export const STORAGE_KEY = "simple-task-board:v1";

export interface PersistedEnvelope {
  version: 1;
  tasks: Task[];
}

export interface LoadedBoard {
  tasks: Task[];
  hasPersistenceWarning: boolean;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const EMPTY_ENVELOPE: PersistedEnvelope = { version: 1, tasks: [] };

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

export function parseEnvelope(serialized: string): PersistedEnvelope | null {
  let value: unknown;

  try {
    value = JSON.parse(serialized);
  } catch {
    return null;
  }

  if (!isPlainRecord(value)) {
    return null;
  }

  const keys = Object.keys(value).sort();
  if (
    keys.length !== 2 ||
    keys[0] !== "tasks" ||
    keys[1] !== "version" ||
    value.version !== 1 ||
    !Array.isArray(value.tasks)
  ) {
    return null;
  }

  const ids = new Set<string>();
  for (const task of value.tasks) {
    if (!isValidTask(task) || ids.has(task.id)) {
      return null;
    }
    ids.add(task.id);
  }

  return { version: 1, tasks: value.tasks };
}

function serialize(tasks: Task[]): string {
  return JSON.stringify({ version: 1, tasks } satisfies PersistedEnvelope);
}

export function loadBoard(getStorage: () => StorageLike): LoadedBoard {
  let storage: StorageLike;
  let serialized: string | null;

  try {
    storage = getStorage();
    serialized = storage.getItem(STORAGE_KEY);
  } catch {
    return { tasks: [], hasPersistenceWarning: true };
  }

  if (serialized === null) {
    return { tasks: [], hasPersistenceWarning: false };
  }

  const envelope = parseEnvelope(serialized);
  if (envelope) {
    return { tasks: envelope.tasks, hasPersistenceWarning: false };
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(EMPTY_ENVELOPE));
    return { tasks: [], hasPersistenceWarning: false };
  } catch {
    return { tasks: [], hasPersistenceWarning: true };
  }
}

export function persistBoard(
  tasks: Task[],
  getStorage: () => StorageLike,
): boolean {
  try {
    getStorage().setItem(STORAGE_KEY, serialize(tasks));
    return true;
  } catch {
    return false;
  }
}
