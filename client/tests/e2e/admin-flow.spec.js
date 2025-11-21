import { test, expect } from '@playwright/test';

test.describe('Admin Flow - User Management', () => {
  // Helper function to login as admin
  const loginAsAdmin = async (page) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'adminPassword');
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/, { timeout: 10000 });
  };

  test('should allow admin to create new student', async ({ page }) => {
    await loginAsAdmin(page);
    
    // Navigate to student management
    await page.goto('/dashboard/students');
    
    // Click create new student button
    await page.click('button:has-text("Nuevo Estudiante"), button:has-text("Agregar Estudiante")');
    
    // Fill student creation form
    const uniqueEmail = `student${Date.now()}@test.com`;
    await page.fill('input[name="firstName"]', 'Carlos');
    await page.fill('input[name="lastName"]', 'Mendoza');
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="dni"]', '34567890');
    await page.fill('input[name="phone"]', '+54933456789');
    await page.selectOption('select[name="nivel"]', 'A1');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=creado, text=exitoso, text=estudiante')).toBeVisible({ timeout: 10000 });
    
    // Should appear in students list
    await expect(page.locator(`text=${uniqueEmail}`)).toBeVisible({ timeout: 5000 });
  });

  test('should allow admin to create new teacher', async ({ page }) => {
    await loginAsAdmin(page);
    
    // Navigate to teacher management
    await page.goto('/dashboard/teachers');
    
    // Click create new teacher button
    await page.click('button:has-text("Nuevo Profesor"), button:has-text("Agregar Profesor")');
    
    // Fill teacher creation form
    const uniqueEmail = `teacher${Date.now()}@test.com`;
    await page.fill('input[name="firstName"]', 'Ana');
    await page.fill('input[name="lastName"]', 'López');
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="dni"]', '45678901');
    await page.fill('input[name="phone"]', '+54944567890');
    await page.selectOption('select[name="especialidad"]', 'italiano');
    await page.fill('input[name="tarifa"]', '2800');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=creado, text=exitoso, text=profesor')).toBeVisible({ timeout: 10000 });
    
    // Should appear in teachers list
    await expect(page.locator(`text=${uniqueEmail}`)).toBeVisible({ timeout: 5000 });
  });

  test('should allow admin to deactivate users', async ({ page }) => {
    await loginAsAdmin(page);
    
    // Navigate to students management
    await page.goto('/dashboard/students');
    
    // Find a student row and click deactivate
    const studentRow = page.locator('.student-row, tr').first();
    await studentRow.locator('button:has-text("Desactivar"), button:has-text("Inactivar")').click();
    
    // Confirm deactivation in modal/dialog
    await page.click('button:has-text("Confirmar"), button:has-text("Sí")');
    
    // Should show success message
    await expect(page.locator('text=desactivado, text=inactivo')).toBeVisible({ timeout: 5000 });
    
    // User should show as inactive
    await expect(page.locator('text=Inactivo, .status-inactive')).toBeVisible({ timeout: 5000 });
  });

  test('should allow admin to reactivate users', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/students');
    
    // Filter to show inactive users
    await page.click('select[name="status"], button:has-text("Filtros")');
    await page.selectOption('select[name="status"]', 'inactivo');
    
    // Find inactive user and reactivate
    const inactiveRow = page.locator('.student-row, tr').first();
    await inactiveRow.locator('button:has-text("Reactivar"), button:has-text("Activar")').click();
    
    // Confirm reactivation
    await page.click('button:has-text("Confirmar"), button:has-text("Sí")');
    
    // Should show success message
    await expect(page.locator('text=reactivado, text=activo')).toBeVisible({ timeout: 5000 });
  });

  test('should allow admin to permanently delete users', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/students');
    
    // Find a student and click delete
    const studentRow = page.locator('.student-row, tr').first();
    await studentRow.locator('button:has-text("Eliminar"), .delete-btn').click();
    
    // Confirm permanent deletion
    await page.click('button:has-text("Eliminar Permanentemente"), button:has-text("Confirmar Eliminación")');
    
    // Should show success message
    await expect(page.locator('text=eliminado, text=borrado')).toBeVisible({ timeout: 5000 });
  });

  test('should display user statistics in admin dashboard', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard');
    
    // Should show statistics cards
    await expect(page.locator('text=Total Estudiantes, text=Total Profesores')).toBeVisible();
    await expect(page.locator('.stat-card, .dashboard-card')).toHaveCount({ min: 3 });
    
    // Should show numbers
    await expect(page.locator('text=/\\d+/')).toBeVisible();
  });

  test('should allow admin to view user details', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/students');
    
    // Click on first student to view details
    await page.locator('.student-row, tr').first().click();
    
    // Should open user details modal/page
    await expect(page.locator('text=Detalles, text=Información del Usuario')).toBeVisible({ timeout: 5000 });
    
    // Should show user information
    await expect(page.locator('text=Email, text=DNI, text=Teléfono')).toBeVisible();
  });

  test('should allow admin to edit user information', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/students');
    
    // Find edit button for first student
    const studentRow = page.locator('.student-row, tr').first();
    await studentRow.locator('button:has-text("Editar"), .edit-btn').click();
    
    // Edit user information
    await page.fill('input[name="phone"]', '+54955555555');
    await page.click('button:has-text("Guardar"), button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=actualizado, text=guardado')).toBeVisible({ timeout: 5000 });
  });

  test('should show admin-only navigation options', async ({ page }) => {
    await loginAsAdmin(page);
    
    // Should see admin-specific menu items
    await expect(page.locator('text=Gestión de Usuarios, text=Estudiantes, text=Profesores')).toBeVisible();
    await expect(page.locator('text=Reportes, text=Configuración')).toBeVisible();
    
    // Should not see student/teacher specific options
    await expect(page.locator('text=Mis Clases, text=Mi Horario')).not.toBeVisible();
  });
});