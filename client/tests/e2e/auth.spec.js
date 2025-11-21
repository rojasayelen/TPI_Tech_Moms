import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h2')).toContainText('Iniciar Sesión');
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Wait for error message to appear
    await expect(page.locator('div').filter({ hasText: /error|Error|credenciales|Credenciales/ }).first()).toBeVisible({ timeout: 10000 });
  });

  test('should display information for first-time users', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('text=Información importante')).toBeVisible();
    await expect(page.locator('text=usa tu DNI como contraseña')).toBeVisible();
  });
});