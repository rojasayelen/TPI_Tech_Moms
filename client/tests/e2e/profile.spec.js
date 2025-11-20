import { test, expect } from '@playwright/test';

test.describe('User Profile Management', () => {
  // Helper function to login as different user types
  const loginAsUser = async (page, email = 'student@example.com', password = '12345678') => {
    await page.goto('/login');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/, { timeout: 10000 });
  };

  test('should display user profile information', async ({ page }) => {
    await loginAsUser(page);
    
    // Navigate to profile page
    await page.goto('/dashboard/profile');
    
    // Should display user information
    await expect(page.locator('text=Perfil, text=Información Personal')).toBeVisible();
    await expect(page.locator('input[name="firstName"], input[name="email"]')).toBeVisible();
    
    // Profile fields should be populated
    await expect(page.locator('input[name="email"]')).toHaveValue(/\S+@\S+\.\S+/);
  });

  test('should edit profile information successfully', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/dashboard/profile');
    
    // Edit profile fields
    await page.fill('input[name="firstName"]', 'Juan Carlos');
    await page.fill('input[name="lastName"]', 'Rodríguez');
    await page.fill('input[name="phone"]', '+54911999888');
    
    // Save changes
    await page.click('button:has-text("Guardar"), button:has-text("Actualizar")');
    
    // Should show success message
    await expect(page.locator('text=actualizado, text=guardado, text=exitoso')).toBeVisible({ timeout: 5000 });
  });

  test('should save profile changes successfully', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/dashboard/profile');
    
    const newPhone = `+549${Date.now().toString().slice(-8)}`;
    
    // Update phone number
    await page.fill('input[name="phone"]', newPhone);
    await page.click('button[type="submit"]');
    
    // Wait for save confirmation
    await expect(page.locator('.success, [style*="color: green"], text=guardado')).toBeVisible({ timeout: 5000 });
    
    // Reload page and verify changes persisted
    await page.reload();
    await expect(page.locator('input[name="phone"]')).toHaveValue(newPhone);
  });

  test('should update academic information for students', async ({ page }) => {
    await loginAsUser(page, 'student@example.com', '12345678');
    await page.goto('/dashboard/profile');
    
    // Update academic level
    await page.selectOption('select[name="nivel"]', 'B2');
    await page.selectOption('select[name="estado"]', 'en_curso');
    
    await page.click('button:has-text("Actualizar Información Académica")');
    
    // Should show success message
    await expect(page.locator('text=actualizado, text=académica')).toBeVisible({ timeout: 5000 });
  });

  test('should update teaching information for professors', async ({ page }) => {
    await loginAsUser(page, 'teacher@example.com', '23456789');
    await page.goto('/dashboard/profile');
    
    // Update teaching information
    await page.selectOption('select[name="especialidad"]', 'frances');
    await page.fill('input[name="tarifa"]', '3500');
    
    // Update availability
    await page.check('input[name="disponibilidad"][value="lunes"]');
    await page.check('input[name="disponibilidad"][value="miercoles"]');
    
    await page.click('button:has-text("Actualizar Información Profesional")');
    
    // Should show success message
    await expect(page.locator('text=actualizado, text=profesional')).toBeVisible({ timeout: 5000 });
  });

  test('should validate required fields when editing', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/dashboard/profile');
    
    // Clear required field
    await page.fill('input[name="firstName"]', '');
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('input:invalid, .error, [style*="color: red"]')).toBeVisible();
  });

  test('should change password successfully', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/dashboard/profile');
    
    // Navigate to change password section
    await page.click('text=Cambiar Contraseña, button:has-text("Cambiar Contraseña")');
    
    // Fill password change form
    await page.fill('input[name="currentPassword"]', '12345678');
    await page.fill('input[name="newPassword"]', 'NewPassword123');
    await page.fill('input[name="confirmPassword"]', 'NewPassword123');
    
    await page.click('button:has-text("Cambiar Contraseña")');
    
    // Should show success message
    await expect(page.locator('text=contraseña, text=actualizada, text=cambiada')).toBeVisible({ timeout: 5000 });
  });
});