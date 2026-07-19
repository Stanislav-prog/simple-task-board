export const STATUSES = ["todo", "in_progress", "done"] as const;

export type TaskStatus = (typeof STATUSES)[number];

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: string;
}

const REQUIRED_TASK_KEYS = ["createdAt", "id", "status", "title"].sort();
const UTC_ISO_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?Z$/;

export function validateTitle(value: string): string | null {
  const title = value.trim();
  return title.length >= 1 && title.length <= 120 ? title : null;
}

export function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === "string" && STATUSES.includes(value as TaskStatus);
}

export function isValidUtcTimestamp(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const match = UTC_ISO_PATTERN.exec(value);
  if (!match) {
    return false;
  }

  const [, year, month, day, hour, minute, second, fraction = ""] = match;
  const parts = [year, month, day, hour, minute, second].map(Number);
  const [yearNumber, monthNumber, dayNumber, hourNumber, minuteNumber, secondNumber] =
    parts;
  const millisecondNumber = Number(fraction.padEnd(3, "0"));

  const instant = new Date(0);
  instant.setUTCFullYear(yearNumber, monthNumber - 1, dayNumber);
  instant.setUTCHours(
    hourNumber,
    minuteNumber,
    secondNumber,
    millisecondNumber,
  );

  return (
    Number.isFinite(instant.getTime()) &&
    instant.getUTCFullYear() === yearNumber &&
    instant.getUTCMonth() === monthNumber - 1 &&
    instant.getUTCDate() === dayNumber &&
    instant.getUTCHours() === hourNumber &&
    instant.getUTCMinutes() === minuteNumber &&
    instant.getUTCSeconds() === secondNumber &&
    instant.getUTCMilliseconds() === millisecondNumber
  );
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

export function isValidTask(value: unknown): value is Task {
  if (!isPlainRecord(value)) {
    return false;
  }

  const keys = Object.keys(value).sort();
  if (
    keys.length !== REQUIRED_TASK_KEYS.length ||
    keys.some((key, index) => key !== REQUIRED_TASK_KEYS[index])
  ) {
    return false;
  }

  const { id, title, status, createdAt } = value;
  return (
    typeof id === "string" &&
    id.length > 0 &&
    typeof title === "string" &&
    validateTitle(title) === title &&
    isTaskStatus(status) &&
    isValidUtcTimestamp(createdAt)
  );
}

export function compareTasksNewestFirst(a: Task, b: Task): number {
  const timeDifference = Date.parse(b.createdAt) - Date.parse(a.createdAt);
  if (timeDifference !== 0) {
    return timeDifference;
  }

  if (a.id === b.id) {
    return 0;
  }

  return a.id < b.id ? 1 : -1;
}

export function orderedTasks(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter((task) => task.status === status).sort(compareTasksNewestFirst);
}
