import { test, expect } from "@playwright/test";

test.describe("Home", () => {
  test("muestra el hero y el CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/destilada en oro/i);
    await expect(page.getByRole("link", { name: /descubrir perfumes/i })).toBeVisible();
  });

  test("navega al catálogo", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /descubrir perfumes/i }).click();
    await expect(page).toHaveURL(/\/perfumes/);
  });
});

test("ferias muestra al menos un evento", async ({ page }) => {
  await page.goto("/ferias");
  await expect(page.getByRole("heading", { name: /Calendario/i })).toBeVisible();
});

test("ICS público responde con texto/calendar", async ({ request }) => {
  const res = await request.get("/api/ferias/ical");
  expect(res.ok()).toBeTruthy();
  expect(res.headers()["content-type"]).toContain("text/calendar");
});
