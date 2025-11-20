import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form with valid credentials
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'validPassword123');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard after successful login
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
    
    // Should show user info or dashboard content
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should fail login with incorrect password', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form with invalid password
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'wrongPassword');
    await page.click('button[type="submit"]');
    
    // Should stay on login page
    await expect(page).toHaveURL('/login');
    
    // Should show error message
    await expect(page.locator('div').filter({ hasText: /error|Error|credenciales|Credenciales|inválid/ })).toBeVisible({ timeout: 5000 });
  });

  test('should display error message for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Try login with non-existent user
    await page.fill('input[name="email"]', 'nonexistent@example.com');
    await page.fill('input[name="password"]', 'anyPassword');
    await page.click('button[type="submit"]');
    
    // Error message should be visible
    await expect(page.locator('[style*="color: red"], [style*="background: #ffe6e6"]')).toBeVisible({ timeout: 5000 });
  });

  test('should redirect after successful login', async ({ page }) => {
    await page.goto('/login');
    
    // Login with valid admin credentials
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'adminPassword');
    await page.click('button[type="submit"]');
    
    // Should redirect to appropriate dashboard based on role
    await page.waitForURL(/dashboard/, { timeout: 10000 });
    
    // URL should contain dashboard
    expect(page.url()).toMatch(/dashboard/);
  });

  test('should show loading state during login', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'validPassword');
    
    // Click submit and immediately check for loading state
    await page.click('button[type="submit"]');
    
    // Should show loading text or disabled button
    await expect(page.locator('text=Ingresando..., button:disabled')).toBeVisible({ timeout: 2000 });
  });
});