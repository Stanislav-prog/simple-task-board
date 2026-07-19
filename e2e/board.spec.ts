import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("create, persist, move, delete, and reload tasks", async ({ page }) => {
  const input = page.getByRole("textbox", { name: "Add a task" });

  await input.fill("Keep this task");
  await page.getByRole("button", { name: "Add task" }).click();
  await input.fill("Move then delete");
  await page.getByRole("button", { name: "Add task" }).click();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Keep this task" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Move then delete" }),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Move “Move then delete” to In Progress" })
    .click();
  await page.reload();

  const inProgress = page
    .getByRole("heading", { name: "In Progress" })
    .locator("..")
    .locator("..");
  await expect(
    inProgress.getByRole("heading", { name: "Move then delete" }),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Delete “Move then delete”" })
    .click();
  await page.reload();

  await expect(
    page.getByRole("heading", { name: "Move then delete" }),
  ).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Keep this task" })).toBeVisible();
});

test.describe("mobile board", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("scrolls columns horizontally and keeps controls touch-friendly and operable", async ({
    page,
  }) => {
    const board = page.locator(".board");
    const dimensions = await board.evaluate((element) => {
      const styles = getComputedStyle(element);
      return {
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        overflowX: styles.overflowX,
      };
    });

    expect(dimensions.scrollWidth).toBeGreaterThan(dimensions.clientWidth);
    expect(dimensions.overflowX).toBe("auto");

    await board.evaluate((element) => {
      element.scrollLeft = element.scrollWidth;
    });
    await expect
      .poll(() => board.evaluate((element) => element.scrollLeft))
      .toBeGreaterThan(0);

    const input = page.getByRole("textbox", { name: "Add a task" });
    await input.fill("Mobile task");
    const addButton = page.getByRole("button", { name: "Add task" });
    const addBox = await addButton.boundingBox();
    expect(addBox).not.toBeNull();
    expect(addBox!.height).toBeGreaterThanOrEqual(44);

    await addButton.click();
    const moveButton = page.getByRole("button", {
      name: /Move .*Mobile task.* to In Progress/,
    });
    const moveBox = await moveButton.boundingBox();
    expect(moveBox).not.toBeNull();
    expect(moveBox!.width).toBeGreaterThanOrEqual(44);
    expect(moveBox!.height).toBeGreaterThanOrEqual(44);

    await moveButton.click();
    const inProgress = page
      .getByRole("heading", { name: "In Progress" })
      .locator("..")
      .locator("..");
    await expect(
      inProgress.getByRole("heading", { name: "Mobile task" }),
    ).toBeVisible();
  });
});
