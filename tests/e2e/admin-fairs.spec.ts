import { test, expect } from "@playwright/test";

test("acceso a /admin sin sesión redirige a login", async ({ page }) => {
  const response = await page.goto("/admin/dashboard");
  expect(response?.url()).toContain("iniciar-sesion");
});

test("ICS de feria individual responde", async ({ request }) => {
  const list = await request.get("/api/ferias/ical");
  expect(list.ok()).toBeTruthy();
  const body = await list.text();
  expect(body).toContain("BEGIN:VCALENDAR");
  expect(body).toContain("END:VCALENDAR");
});
