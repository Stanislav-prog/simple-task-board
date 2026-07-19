import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, vi } from "vitest";
import App from "./App";
import type { StorageLike } from "./persistence";
import type { Task } from "./task";

class TestStorage implements StorageLike {
  value: string | null = null;
  failReads = false;
  failWrites = false;
  writeCount = 0;

  getItem() {
    if (this.failReads) {
      throw new Error("blocked");
    }
    return this.value;
  }

  setItem(_key: string, value: string) {
    this.writeCount += 1;
    if (this.failWrites) {
      throw new Error("blocked");
    }
    this.value = value;
  }
}

const originalStorage = window.localStorage;
let storage: TestStorage;

beforeEach(() => {
  storage = new TestStorage();
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: storage,
  });
  vi.stubGlobal("crypto", {
    randomUUID: vi.fn(() => "00000000-0000-4000-8000-000000000001"),
  });
});

afterEach(() => {
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: originalStorage,
  });
  vi.unstubAllGlobals();
});

function task(overrides: Partial<Task>): Task {
  return {
    id: "task-1",
    title: "First task",
    status: "todo",
    createdAt: "2026-07-19T10:00:00.000Z",
    ...overrides,
  };
}

function seed(tasks: Task[]) {
  storage.value = JSON.stringify({ version: 1, tasks });
}

describe("task board UI", () => {
  it("shows empty columns and rejects invalid titles without writing", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getAllByText("No tasks here yet.")).toHaveLength(3);
    await user.click(screen.getByRole("button", { name: "Add task" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter a title between 1 and 120 characters.",
    );
    expect(storage.writeCount).toBe(0);
  });

  it("creates one trimmed task, persists it, clears the field, and refocuses", async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByRole("textbox", { name: "Add a task" });

    await user.type(input, "  Ship MVP  ");
    await user.keyboard("{Enter}");

    expect(screen.getByRole("heading", { name: "Ship MVP" })).toBeVisible();
    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
    expect(JSON.parse(storage.value!)).toMatchObject({
      version: 1,
      tasks: [{ title: "Ship MVP", status: "todo" }],
    });
  });

  it("retains focus on the invoking rightward move control", async () => {
    seed([task({})]);
    const user = userEvent.setup();
    render(<App />);
    const moveRight = screen.getByRole("button", {
      name: "Move “First task” to In Progress",
    });

    moveRight.focus();
    await user.keyboard("{Enter}");

    expect(
      screen.getByRole("heading", { name: "In Progress" }).closest("section"),
    ).toContainElement(screen.getByRole("heading", { name: "First task" }));
    expect(
      screen.getByRole("button", {
        name: "Move “First task” to Done",
      }),
    ).toHaveFocus();
  });

  it("retains focus on the invoking leftward move control", async () => {
    seed([task({ status: "in_progress" })]);
    const user = userEvent.setup();
    render(<App />);
    const moveLeft = screen.getByRole("button", {
      name: /Move .*First task.* to To Do/,
    });

    moveLeft.focus();
    await user.keyboard("{Enter}");

    expect(
      screen.getByRole("heading", { name: "To Do" }).closest("section"),
    ).toContainElement(screen.getByRole("heading", { name: "First task" }));
    expect(
      screen.getByRole("button", {
        name: /Cannot move .*First task.* further left/,
      }),
    ).toHaveFocus();
  });

  it("focuses the next task primary action after deletion", async () => {
    seed([
      task({ id: "new", title: "New", createdAt: "2026-07-19T11:00:00.000Z" }),
      task({ id: "old", title: "Old", createdAt: "2026-07-19T10:00:00.000Z" }),
    ]);
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Delete “New”" }));

    expect(
      screen.getByRole("button", { name: "Move “Old” to In Progress" }),
    ).toHaveFocus();
  });

  it("focuses the previous task primary action when deleting the last task", async () => {
    seed([
      task({ id: "new", title: "New", createdAt: "2026-07-19T11:00:00.000Z" }),
      task({ id: "old", title: "Old", createdAt: "2026-07-19T10:00:00.000Z" }),
    ]);
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /Delete .*Old/ }));

    expect(
      screen.getByRole("button", { name: /Move .*New.* to In Progress/ }),
    ).toHaveFocus();
  });

  it("focuses the empty To Do add control after deleting its final task", async () => {
    seed([task({})]);
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: "Delete “First task”" }),
    );

    const todo = screen.getByRole("heading", { name: "To Do" }).closest("section")!;
    expect(within(todo).getByRole("button", { name: "Add a task" })).toHaveFocus();
  });

  it.each([
    ["in_progress", "In Progress"],
    ["done", "Done"],
  ] as const)(
    "focuses the title input when the emptied %s column has no action",
    async (status, label) => {
      seed([task({ status })]);
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByRole("button", { name: /Delete .*First task/ }));

      expect(screen.getByRole("textbox", { name: "Add a task" })).toHaveFocus();
      const column = screen
        .getByRole("heading", { name: label })
        .closest("section")!;
      expect(within(column).getByText("No tasks here yet.")).toBeVisible();
    },
  );

  it.each(["read exception", "failed corrupt-data recovery"])(
    "does not steal existing focus for a load warning caused by %s",
    (failureMode) => {
      if (failureMode === "read exception") {
        storage.failReads = true;
      } else {
        storage.value = "{broken";
        storage.failWrites = true;
      }

      const previouslyFocused = document.createElement("button");
      previouslyFocused.textContent = "Existing focus";
      document.body.append(previouslyFocused);
      previouslyFocused.focus();

      render(<App />);

      expect(screen.getByText(/browser storage is unavailable/i)).toBeVisible();
      expect(previouslyFocused).toHaveFocus();
      previouslyFocused.remove();
    },
  );

  it("shows a non-blocking warning after a write failure and clears it on retry", async () => {
    storage.failWrites = true;
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByRole("textbox", { name: "Add a task" });

    await user.type(input, "Offline task");
    await user.keyboard("{Enter}");

    expect(screen.getByText(/browser storage is unavailable/i)).toBeVisible();
    expect(screen.getByRole("heading", { name: "Offline task" })).toBeVisible();
    expect(input).toHaveFocus();

    storage.failWrites = false;
    await user.click(
      screen.getByRole("button", {
        name: "Move “Offline task” to In Progress",
      }),
    );

    expect(screen.queryByText(/browser storage is unavailable/i)).toBeNull();
    const persisted = JSON.parse(storage.value!);
    expect(persisted.tasks).toHaveLength(1);
    expect(persisted.tasks[0]).toMatchObject({
      title: "Offline task",
      status: "in_progress",
    });
  });
});
