import { test, expect } from '@playwright/test';

test.describe('Courses', () => {
  test('should display courses page', async ({ page }) => {
    await page.goto('/cursos');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('should show featured courses on home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Cursos destacados')).toBeVisible();
    await expect(page.locator('.service-card--course').first()).toBeVisible();
  });

  test('should navigate from home to courses page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Ver todos los cursos');
    await expect(page).toHaveURL('/cursos');
  });
});