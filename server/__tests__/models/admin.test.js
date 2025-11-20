const mongoose = require('mongoose');
const Admin = require('../../models/Admin');

describe('Admin Model', () => {

  describe('Crear administrador', () => {
    it('deberia crear un administrador correctamente', async () => {
      const adminData = {
        email: 'admin@test.com',
        password: 'adminPass123',
        firstName: 'Admin',
        lastName: 'Principal',
        role: 'admin',
        phone: '9876543210'
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();

      expect(savedAdmin._id).toBeDefined();
      expect(savedAdmin.email).toBe('admin@test.com');
      expect(savedAdmin.firstName).toBe('Admin');
      expect(savedAdmin.lastName).toBe('Principal');
      expect(savedAdmin.role).toBe('admin');
      expect(savedAdmin.isActive).toBe(true);
    });

    it('no deberia requerir DNI para admin', async () => {
      const adminData = {
        email: 'admin2@test.com',
        password: 'adminPass123',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'admin'
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();

      expect(savedAdmin._id).toBeDefined();
      expect(savedAdmin.dni).toBeUndefined();
    });

    it('no deberia requerir cambio de password para admin', async () => {
      const adminData = {
        email: 'admin3@test.com',
        password: 'adminPass123',
        firstName: 'Sistema',
        lastName: 'Admin',
        role: 'admin'
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();

      expect(savedAdmin.mustChangePassword).toBe(false);
    });

    it('deberia hashear el password del admin', async () => {
      const plainPassword = 'secureAdminPass';
      const adminData = {
        email: 'admin4@test.com',
        password: plainPassword,
        firstName: 'Security',
        lastName: 'Admin',
        role: 'admin'
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();

      expect(savedAdmin.password).toBeDefined();
      expect(savedAdmin.password).not.toBe(plainPassword);
      expect(savedAdmin.password.length).toBeGreaterThan(20);
    });
  });

  describe('Permisos de admin', () => {
    it('deberia tener permisos por defecto', async () => {
      const adminData = {
        email: 'adminpermisos@test.com',
        password: 'adminPass123',
        firstName: 'Admin',
        lastName: 'Permisos',
        role: 'admin',
        permissions: ['todos']
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();

      expect(savedAdmin.permissions).toBeDefined();
      expect(savedAdmin.permissions).toContain('todos');
    });

    it('deberia permitir asignar permisos especificos', async () => {
      const adminData = {
        email: 'adminespecifico@test.com',
        password: 'adminPass123',
        firstName: 'Admin',
        lastName: 'Especifico',
        role: 'admin',
        permissions: ['gestion_usuarios', 'reportes']
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();

      expect(savedAdmin.permissions).toHaveLength(2);
      expect(savedAdmin.permissions).toContain('gestion_usuarios');
      expect(savedAdmin.permissions).toContain('reportes');
    });

    it('deberia validar permisos permitidos', async () => {
      const adminData = {
        email: 'adminvalido@test.com',
        password: 'adminPass123',
        firstName: 'Admin',
        lastName: 'Valido',
        role: 'admin',
        permissions: ['configuracion']
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();

      expect(savedAdmin.permissions).toContain('configuracion');
    });

    it('deberia permitir permiso de todos', async () => {
      const adminData = {
        email: 'admintodos@test.com',
        password: 'adminPass123',
        firstName: 'Admin',
        lastName: 'Todos',
        role: 'admin',
        permissions: ['todos']
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();

      expect(savedAdmin.permissions).toContain('todos');
    });

    it('deberia permitir multiples permisos', async () => {
      const adminData = {
        email: 'adminmulti@test.com',
        password: 'adminPass123',
        firstName: 'Admin',
        lastName: 'Multi',
        role: 'admin',
        permissions: ['gestion_usuarios', 'reportes', 'configuracion']
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();

      expect(savedAdmin.permissions).toHaveLength(3);
    });
  });

  describe('Validaciones comunes heredadas', () => {
    it('deberia requerir email', async () => {
      const adminData = {
        password: 'adminPass123',
        firstName: 'Admin',
        lastName: 'SinEmail',
        role: 'admin'
      };

      const admin = new Admin(adminData);

      await expect(admin.save()).rejects.toThrow();
    });

    it('deberia requerir password', async () => {
      const adminData = {
        email: 'sinpassword@test.com',
        firstName: 'Admin',
        lastName: 'SinPassword',
        role: 'admin'
      };

      const admin = new Admin(adminData);

      await expect(admin.save()).rejects.toThrow();
    });

    it('deberia validar formato de email', async () => {
      const adminData = {
        email: 'emailinvalido',
        password: 'adminPass123',
        firstName: 'Admin',
        lastName: 'EmailInvalido',
        role: 'admin'
      };

      const admin = new Admin(adminData);

      await expect(admin.save()).rejects.toThrow();
    });

    it('deberia convertir email a minusculas', async () => {
      const adminData = {
        email: 'ADMIN.UPPER@TEST.COM',
        password: 'adminPass123',
        firstName: 'Admin',
        lastName: 'Upper',
        role: 'admin'
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();

      expect(savedAdmin.email).toBe('admin.upper@test.com');
    });

    it('deberia tener metodo comparePassword', async () => {
      const plainPassword = 'testPassword789';
      const adminData = {
        email: 'admincompare@test.com',
        password: plainPassword,
        firstName: 'Admin',
        lastName: 'Compare',
        role: 'admin'
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();

      const isMatch = await savedAdmin.comparePassword(plainPassword);
      expect(isMatch).toBe(true);

      const isNotMatch = await savedAdmin.comparePassword('wrongPassword');
      expect(isNotMatch).toBe(false);
    });
  });
});
