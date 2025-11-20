import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should display home page content', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Aprendé las lenguas del mundo');
    await expect(page.locator('.logo span')).toContainText('Lingua Academy');
  });

  test('should navigate to courses page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Ver todos los cursos');
    await expect(page).toHaveURL('/cursos');
  });

  test('should scroll to sections on home page', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="#nosotros"]');
    await expect(page.locator('#nosotros')).toBeVisible();
  });
});