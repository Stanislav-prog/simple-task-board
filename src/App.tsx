import {
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { loadBoard, persistBoard } from "./persistence";
import {
  STATUSES,
  orderedTasks,
  validateTitle,
  type Task,
  type TaskStatus,
} from "./task";

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

type MoveDirection = "left" | "right";
type PendingFocus =
  | { type: "move"; taskId: string; direction: MoveDirection }
  | { type: "task"; taskId: string }
  | { type: "empty"; status: TaskStatus };

function browserStorage() {
  return window.localStorage;
}

function adjacentStatus(
  status: TaskStatus,
  direction: MoveDirection,
): TaskStatus | null {
  const index = STATUSES.indexOf(status);
  const nextIndex = direction === "left" ? index - 1 : index + 1;
  return STATUSES[nextIndex] ?? null;
}

export default function App() {
  const initial = useRef(loadBoard(browserStorage));
  const [tasks, setTasks] = useState<Task[]>(initial.current.tasks);
  const [hasPersistenceWarning, setHasPersistenceWarning] = useState(
    initial.current.hasPersistenceWarning,
  );
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);
  const moveRefs = useRef(new Map<string, HTMLButtonElement>());
  const primaryActionRefs = useRef(new Map<string, HTMLButtonElement>());
  const emptyActionRefs = useRef(new Map<TaskStatus, HTMLButtonElement>());
  const pendingFocus = useRef<PendingFocus | null>(null);

  useLayoutEffect(() => {
    const target = pendingFocus.current;
    if (!target) {
      return;
    }

    pendingFocus.current = null;
    if (target.type === "move") {
      moveRefs.current
        .get(`${target.taskId}:${target.direction}`)
        ?.focus();
      return;
    }

    if (target.type === "task") {
      primaryActionRefs.current.get(target.taskId)?.focus();
      return;
    }

    const emptyAction = emptyActionRefs.current.get(target.status);
    if (emptyAction) {
      emptyAction.focus();
    } else {
      titleInputRef.current?.focus();
    }
  }, [tasks]);

  function save(nextTasks: Task[]) {
    setTasks(nextTasks);
    setHasPersistenceWarning(!persistBoard(nextTasks, browserStorage));
  }

  function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validTitle = validateTitle(title);

    if (validTitle === null) {
      setTitleError("Enter a title between 1 and 120 characters.");
      return;
    }

    const task: Task = {
      id: crypto.randomUUID(),
      title: validTitle,
      status: "todo",
      createdAt: new Date().toISOString(),
    };

    save([...tasks, task]);
    setTitle("");
    setTitleError("");
    setAnnouncement(`Created “${validTitle}” in To Do.`);
    titleInputRef.current?.focus();
  }

  function moveTask(task: Task, direction: MoveDirection) {
    const nextStatus = adjacentStatus(task.status, direction);
    if (nextStatus === null) {
      return;
    }

    pendingFocus.current = { type: "move", taskId: task.id, direction };
    save(
      tasks.map((candidate) =>
        candidate.id === task.id
          ? { ...candidate, status: nextStatus }
          : candidate,
      ),
    );
    setAnnouncement(`Moved “${task.title}” to ${STATUS_LABELS[nextStatus]}.`);
  }

  function deleteTask(task: Task) {
    const columnTasks = orderedTasks(tasks, task.status);
    const taskIndex = columnTasks.findIndex(
      (candidate) => candidate.id === task.id,
    );
    const focusTask =
      columnTasks[taskIndex + 1] ?? columnTasks[taskIndex - 1] ?? null;

    pendingFocus.current = focusTask
      ? { type: "task", taskId: focusTask.id }
      : { type: "empty", status: task.status };
    save(tasks.filter((candidate) => candidate.id !== task.id));
    setAnnouncement(`Deleted “${task.title}”.`);
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">My workspace</p>
          <h1>Simple Task Board</h1>
          <p className="subtitle">Keep work moving, one clear step at a time.</p>
        </div>

        <form className="task-form" onSubmit={createTask} noValidate>
          <label htmlFor="task-title">Add a task</label>
          <div className="task-form__controls">
            <input
              id="task-title"
              ref={titleInputRef}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (titleError) {
                  setTitleError("");
                }
              }}
              aria-describedby={titleError ? "task-title-error" : "task-title-help"}
              aria-invalid={Boolean(titleError)}
              placeholder="What needs to be done?"
              autoComplete="off"
            />
            <button type="submit" className="button button--primary">
              Add task
            </button>
          </div>
          <p id="task-title-help" className="form-help">
            1–120 characters. New tasks start in To Do.
          </p>
          {titleError && (
            <p id="task-title-error" className="form-error" role="alert">
              {titleError}
            </p>
          )}
        </form>
      </header>

      {hasPersistenceWarning && (
        <div className="storage-warning" role="status">
          <span aria-hidden="true">!</span>
          <p>
            Changes are available for this session, but browser storage is
            unavailable. We’ll retry when the board changes again.
          </p>
        </div>
      )}

      <p className="visually-hidden" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>

      <div className="board" aria-label="Task board">
        {STATUSES.map((status) => {
          const columnTasks = orderedTasks(tasks, status);
          const headingId = `${status}-heading`;

          return (
            <section
              className="column"
              aria-labelledby={headingId}
              key={status}
            >
              <div className="column__header">
                <h2 id={headingId}>{STATUS_LABELS[status]}</h2>
                <span
                  className="task-count"
                  aria-label={`${columnTasks.length} ${
                    columnTasks.length === 1 ? "task" : "tasks"
                  }`}
                >
                  {columnTasks.length}
                </span>
              </div>

              <div className="task-list">
                {columnTasks.length === 0 ? (
                  <div className="empty-state">
                    <p>No tasks here yet.</p>
                    {status === "todo" && (
                      <button
                        type="button"
                        className="button button--quiet"
                        ref={(node) => {
                          if (node) {
                            emptyActionRefs.current.set(status, node);
                          } else {
                            emptyActionRefs.current.delete(status);
                          }
                        }}
                        onClick={() => titleInputRef.current?.focus()}
                      >
                        Add a task
                      </button>
                    )}
                  </div>
                ) : (
                  columnTasks.map((task) => {
                    const primaryDirection: MoveDirection =
                      task.status === "todo" ? "right" : "left";

                    return (
                      <article className="task-card" key={task.id}>
                        <h3>{task.title}</h3>
                        <div className="task-card__actions">
                          {(["left", "right"] as const).map((direction) => {
                            const destination = adjacentStatus(
                              task.status,
                              direction,
                            );
                            const isPrimary = direction === primaryDirection;

                            return (
                              <button
                                type="button"
                                className="icon-button"
                                key={direction}
                                aria-disabled={destination === null}
                                aria-label={
                                  destination
                                    ? `Move “${task.title}” to ${STATUS_LABELS[destination]}`
                                    : `Cannot move “${task.title}” ${
                                        direction === "left"
                                          ? "further left"
                                          : "further right"
                                      }`
                                }
                                ref={(node) => {
                                  const key = `${task.id}:${direction}`;
                                  if (node) {
                                    moveRefs.current.set(key, node);
                                    if (isPrimary) {
                                      primaryActionRefs.current.set(task.id, node);
                                    }
                                  } else {
                                    moveRefs.current.delete(key);
                                    if (isPrimary) {
                                      primaryActionRefs.current.delete(task.id);
                                    }
                                  }
                                }}
                                onClick={() => {
                                  if (destination) {
                                    moveTask(task, direction);
                                  }
                                }}
                              >
                                <span aria-hidden="true">
                                  {direction === "left" ? "←" : "→"}
                                </span>
                              </button>
                            );
                          })}
                          <button
                            type="button"
                            className="button button--danger"
                            aria-label={`Delete “${task.title}”`}
                            onClick={() => deleteTask(task)}
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
