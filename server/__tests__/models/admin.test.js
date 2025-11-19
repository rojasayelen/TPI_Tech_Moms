const Admin = require('../../models/Admin');

describe('Admin Model Tests', () => {
  beforeEach(async () => {
    await Admin.deleteMany({});
  });

  describe('Crear administrador', () => {
    test('debe crear un administrador correctamente', async () => {
      const adminData = {
        email: 'admin@test.com',
        password: 'AdminPassword123',
        firstName: 'Admin',
        lastName: 'Principal',
        role: 'admin',
        phone: '+54911234567'
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();

      expect(savedAdmin._id).toBeDefined();
      expect(savedAdmin.email).toBe('admin@test.com');
      expect(savedAdmin.firstName).toBe('Admin');
      expect(savedAdmin.lastName).toBe('Principal');
      expect(savedAdmin.role).toBe('admin');
      expect(savedAdmin.mustChangePassword).toBe(false);
      expect(savedAdmin.condicion).toBe('activo');
      expect(savedAdmin.isActive).toBe(true);
      expect(Array.isArray(savedAdmin.permissions)).toBe(true);
    });

    test('no debe requerir DNI para administradores', async () => {
      const adminData = {
        email: 'admin@test.com',
        password: 'AdminPassword123',
        firstName: 'Admin',
        lastName: 'Principal',
        role: 'admin'
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();

      expect(savedAdmin.dni).toBeUndefined();
      expect(savedAdmin._id).toBeDefined();
    });

    test('debe permitir DNI opcional para administradores', async () => {
      const adminData = {
        email: 'admin@test.com',
        password: 'AdminPassword123',
        firstName: 'Admin',
        lastName: 'Principal',
        role: 'admin',
        dni: '12345678'
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();

      expect(savedAdmin.dni).toBe('12345678');
    });

    test('debe tener mustChangePassword false por defecto', async () => {
      const adminData = {
        email: 'admin@test.com',
        password: 'AdminPassword123',
        firstName: 'Admin',
        lastName: 'Principal',
        role: 'admin'
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();

      expect(savedAdmin.mustChangePassword).toBe(false);
    });
  });

  describe('Permisos de admin', () => {
    test('debe tener permisos por defecto', async () => {
      const adminData = {
        email: 'admin@test.com',
        password: 'AdminPassword123',
        firstName: 'Admin',
        lastName: 'Principal',
        role: 'admin'
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();

      expect(Array.isArray(savedAdmin.permissions)).toBe(true);
    });

    test('debe permitir permisos específicos', async () => {
      const adminData = {
        email: 'admin@test.com',
        password: 'AdminPassword123',
        firstName: 'Admin',
        lastName: 'Principal',
        role: 'admin',
        permissions: ['gestion_usuarios', 'reportes']
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();

      expect(savedAdmin.permissions).toEqual(['gestion_usuarios', 'reportes']);
    });

    test('debe validar permisos válidos', async () => {
      const permisosValidos = [
        ['gestion_usuarios'],
        ['reportes'],
        ['configuracion'],
        ['todos'],
        ['gestion_usuarios', 'reportes'],
        ['gestion_usuarios', 'reportes', 'configuracion']
      ];

      for (const permisos of permisosValidos) {
        const adminData = {
          email: `admin${Math.random()}@test.com`,
          password: 'AdminPassword123',
          firstName: 'Admin',
          lastName: 'Test',
          role: 'admin',
          permissions: permisos
        };

        const admin = new Admin(adminData);
        const savedAdmin = await admin.save();

        expect(savedAdmin.permissions).toEqual(permisos);
      }
    });

    test('debe rechazar permisos inválidos', async () => {
      const adminData = {
        email: 'admin@test.com',
        password: 'AdminPassword123',
        firstName: 'Admin',
        lastName: 'Principal',
        role: 'admin',
        permissions: ['permiso_invalido']
      };

      const admin = new Admin(adminData);
      await expect(admin.save()).rejects.toThrow();
    });

    test('debe permitir array vacío de permisos', async () => {
      const adminData = {
        email: 'admin@test.com',
        password: 'AdminPassword123',
        firstName: 'Admin',
        lastName: 'Principal',
        role: 'admin',
        permissions: []
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();

      expect(savedAdmin.permissions).toEqual([]);
    });
  });

  describe('Herencia de BaseUser', () => {
    test('debe heredar validaciones de email', async () => {
      const adminData = {
        password: 'AdminPassword123',
        firstName: 'Admin',
        lastName: 'Principal',
        role: 'admin'
      };

      const admin = new Admin(adminData);
      await expect(admin.save()).rejects.toThrow();
    });

    test('debe heredar validaciones de password', async () => {
      const adminData = {
        email: 'admin@test.com',
        firstName: 'Admin',
        lastName: 'Principal',
        role: 'admin'
      };

      const admin = new Admin(adminData);
      await expect(admin.save()).rejects.toThrow();
    });

    test('debe heredar hash de password', async () => {
      const plainPassword = 'AdminPassword123';
      const adminData = {
        email: 'admin@test.com',
        password: plainPassword,
        firstName: 'Admin',
        lastName: 'Principal',
        role: 'admin'
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();

      expect(savedAdmin.password).not.toBe(plainPassword);
      expect(savedAdmin.password).toMatch(/^\$2[aby]\$\d+\$/);

      const isMatch = await savedAdmin.comparePassword(plainPassword);
      expect(isMatch).toBe(true);
    });

    test('debe heredar método toJSON', async () => {
      const adminData = {
        email: 'admin@test.com',
        password: 'AdminPassword123',
        firstName: 'Admin',
        lastName: 'Principal',
        role: 'admin'
      };

      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();
      const json = savedAdmin.toJSON();

      expect(json.password).toBeUndefined();
      expect(json.__v).toBeUndefined();
      expect(json.email).toBe('admin@test.com');
      expect(json.firstName).toBe('Admin');
      expect(Array.isArray(json.permissions)).toBe(true);
    });

    test('debe heredar virtual fullName', async () => {
      const adminData = {
        email: 'admin@test.com',
        password: 'AdminPassword123',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'admin'
      };

      const admin = new Admin(adminData);
      expect(admin.fullName).toBe('Super Admin');
    });
  });

  describe('Validaciones específicas de admin', () => {
    test('debe permitir crear múltiples admins', async () => {
      const admin1Data = {
        email: 'admin1@test.com',
        password: 'AdminPassword123',
        firstName: 'Admin',
        lastName: 'Uno',
        role: 'admin'
      };

      const admin2Data = {
        email: 'admin2@test.com',
        password: 'AdminPassword123',
        firstName: 'Admin',
        lastName: 'Dos',
        role: 'admin'
      };

      const admin1 = new Admin(admin1Data);
      const admin2 = new Admin(admin2Data);

      const savedAdmin1 = await admin1.save();
      const savedAdmin2 = await admin2.save();

      expect(savedAdmin1._id).toBeDefined();
      expect(savedAdmin2._id).toBeDefined();
      expect(savedAdmin1.email).toBe('admin1@test.com');
      expect(savedAdmin2.email).toBe('admin2@test.com');
    });

    test('debe mantener unicidad de email entre todos los usuarios', async () => {
      const admin1Data = {
        email: 'duplicado@test.com',
        password: 'AdminPassword123',
        firstName: 'Admin',
        lastName: 'Uno',
        role: 'admin'
      };

      const admin2Data = {
        email: 'duplicado@test.com',
        password: 'AdminPassword456',
        firstName: 'Admin',
        lastName: 'Dos',
        role: 'admin'
      };

      const admin1 = new Admin(admin1Data);
      await admin1.save();

      const admin2 = new Admin(admin2Data);
      await expect(admin2.save()).rejects.toThrow();
    });
  });
});