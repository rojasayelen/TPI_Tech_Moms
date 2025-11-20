import { test, expect } from '@playwright/test';

test.describe('Final Working E2E Tests', () => {
  test('should load home page correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Aprendé las lenguas del mundo');
    await expect(page.locator('.logo span')).toContainText('Lingua Academy');
  });

  test('should load login page and show form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h2')).toContainText('Iniciar Sesión');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Ingresar');
  });

  test('should show error with invalid login credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'invalid@test.com');
    await page.fill('#password', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await page.waitForSelector('[style*="color: red"]', { timeout: 10000 });
    await expect(page.locator('[style*="color: red"]')).toBeVisible();
  });

  test('should display service cards on home page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.service-card')).toHaveCount(10);
    await expect(page.locator('text=Cursos Grupales')).toBeVisible();
    await expect(page.locator('text=Clases Individuales')).toBeVisible();
  });

  test('should show main navigation elements', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Nosotros')).toBeVisible();
    await expect(page.locator('text=Servicios')).toBeVisible();
    await expect(page.locator('text=Contacto')).toBeVisible();
  });

  test('should scroll to contact section', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      document.getElementById('contacto')?.scrollIntoView();
    });
    await expect(page.locator('#contacto')).toBeVisible();
    await expect(page.locator('input[name="nombre"]')).toBeVisible();
  });
});