import { test, expect } from '@playwright/test';

test.describe('Working E2E Tests', () => {
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
    
    // Wait for error message
    await page.waitForSelector('[style*="color: red"]', { timeout: 10000 });
    await expect(page.locator('[style*="color: red"]')).toBeVisible();
  });

  test('should navigate to courses page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('text=Ver todos los cursos').first().click();
    await expect(page).toHaveURL('/cursos');
  });

  test('should show navigation menu', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav a[href="#nosotros"]').first()).toBeVisible();
    await expect(page.locator('nav a[href="#servicios"]').first()).toBeVisible();
    await expect(page.locator('nav a[href="#contacto"]').first()).toBeVisible();
  });

  test('should scroll to sections on home page', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav a[href="#nosotros"]').first().click();
    await expect(page.locator('#nosotros')).toBeVisible();
  });

  test('should show contact form', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('nav a[href="#contacto"]').first().click();
    await expect(page.locator('#contacto')).toBeVisible();
    await expect(page.locator('input[name="nombre"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('should display service cards', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.service-card')).toHaveCount(6);
    await expect(page.locator('text=Cursos Grupales')).toBeVisible();
    await expect(page.locator('text=Clases Individuales')).toBeVisible();
  });
});