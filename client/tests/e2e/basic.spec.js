import { test, expect } from '@playwright/test';

test.describe('Basic App Tests', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Aprendé las lenguas del mundo');
  });

  test('should load login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h2')).toContainText('Iniciar Sesión');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('should show error with invalid login', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'test@invalid.com');
    await page.fill('#password', 'wrongpass');
    await page.click('button[type="submit"]');
    
    // Wait for error to appear
    await page.waitForSelector('[style*="color: red"]', { timeout: 10000 });
    await expect(page.locator('[style*="color: red"]')).toBeVisible();
  });
});