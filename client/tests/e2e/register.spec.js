import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
  // Helper function to login as admin first
  const loginAsAdmin = async (page) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'adminPassword');
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/, { timeout: 10000 });
  };

  test('should complete student registration successfully', async ({ page }) => {
    // Login as admin first
    await loginAsAdmin(page);
    
    // Navigate to student registration
    await page.goto('/dashboard/register-student');
    
    // Fill complete registration form
    await page.fill('input[name="firstName"]', 'Juan');
    await page.fill('input[name="lastName"]', 'Pérez');
    await page.fill('input[name="email"]', `student${Date.now()}@test.com`);
    await page.fill('input[name="dni"]', '12345678');
    await page.fill('input[name="phone"]', '+54911234567');
    await page.selectOption('select[name="nivel"]', 'A2');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show success message or redirect
    await expect(page.locator('text=exitoso, text=creado, text=registrado')).toBeVisible({ timeout: 10000 });
  });

  test('should validate required fields', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/register-student');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('input:invalid, .error, [style*="color: red"]')).toHaveCount({ min: 1 });
  });

  test('should show error for duplicate email', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/register-student');
    
    // Fill form with existing email
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="email"]', 'admin@example.com'); // Existing email
    await page.fill('input[name="dni"]', '87654321');
    await page.fill('input[name="phone"]', '+54911111111');
    await page.selectOption('select[name="nivel"]', 'B1');
    
    await page.click('button[type="submit"]');
    
    // Should show duplicate email error
    await expect(page.locator('text=existe, text=duplicado, text=ya registrado')).toBeVisible({ timeout: 5000 });
  });

  test('should complete teacher registration successfully', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/register-teacher');
    
    // Fill teacher registration form
    await page.fill('input[name="firstName"]', 'María');
    await page.fill('input[name="lastName"]', 'García');
    await page.fill('input[name="email"]', `teacher${Date.now()}@test.com`);
    await page.fill('input[name="dni"]', '23456789');
    await page.fill('input[name="phone"]', '+54922345678');
    await page.selectOption('select[name="especialidad"]', 'ingles');
    await page.fill('input[name="tarifa"]', '3000');
    
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=exitoso, text=creado, text=registrado')).toBeVisible({ timeout: 10000 });
  });

  test('should validate DNI format', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/register-student');
    
    // Fill form with invalid DNI
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="email"]', `test${Date.now()}@test.com`);
    await page.fill('input[name="dni"]', '123'); // Invalid DNI
    await page.fill('input[name="phone"]', '+54911111111');
    
    await page.click('button[type="submit"]');
    
    // Should show DNI validation error
    await expect(page.locator('text=DNI, text=dígitos, input:invalid')).toBeVisible({ timeout: 5000 });
  });
});