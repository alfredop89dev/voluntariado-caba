import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("renders hero section with title", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toContainText("Venezuela");
  });

  test("shows calendar section with events", async ({ page }) => {
    await page.goto("/");
    const calendarSection = page.locator("#calendario");
    await expect(calendarSection).toBeVisible();
    const eventCards = calendarSection.locator("article");
    await expect(eventCards.first()).toBeVisible();
  });

  test("search filters events in calendar", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.locator('input[placeholder*="Buscar"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill("Acopio");
    const eventCards = page.locator("#calendario article");
    await expect(eventCards.first()).toBeVisible();
  });

  test("clear search button works", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.locator('input[placeholder*="Buscar"]');
    await searchInput.fill("xyz-not-found");
    const clearButton = page.locator("#calendario button").filter({ has: page.locator("svg") });
    await expect(clearButton).toBeVisible();
    await clearButton.click();
    await expect(searchInput).toHaveValue("");
  });

  test("volunteer section is present", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#voluntariado")).toBeVisible();
  });

  test("donations section is present", async ({ page }) => {
    await page.goto("/");
    const donateSection = page.locator("#donaciones");
    await expect(donateSection).toBeVisible();
  });

  test("header nav links work", async ({ page }) => {
    await page.goto("/");
    const navLinks = page.locator("header nav a");
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("footer is visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("footer")).toBeVisible();
  });
});

test.describe("Event detail page", () => {
  test("shows 404 for non-existent event", async ({ page }) => {
    const response = await page.goto("/events/invalid-id");
    expect(response?.status()).toBe(404);
  });
});

test.describe("Admin login", () => {
  test("login page renders", async ({ page }) => {
    await page.goto("/admin-voluntariado-eventos/login");
    await expect(page.locator("h1")).toBeVisible();
  });
});
