const BaseUser = require('../../models/BaseUser');
const Estudiante = require('../../models/Estudiante');

describe('BaseUser Model Tests', () => {
  beforeEach(async () => {
    await BaseUser.deleteMany({});
  });

  describe('Crear usuario estudiante', () => {
    test('debe crear un estudiante correctamente', async () => {
      const estudianteData = {
        email: 'estudiante@test.com',
        password: 'Password123',
        firstName: 'Juan',
        lastName: 'Perez',
        role: 'estudiante',
        dni: '12345678',
        phone: '+54911234567',
        nivel: 'A2'
      };

      const estudiante = new Estudiante(estudianteData);
      const savedEstudiante = await estudiante.save();

      expect(savedEstudiante._id).toBeDefined();
      expect(savedEstudiante.email).toBe('estudiante@test.com');
      expect(savedEstudiante.firstName).toBe('Juan');
      expect(savedEstudiante.lastName).toBe('Perez');
      expect(savedEstudiante.role).toBe('estudiante');
      expect(savedEstudiante.dni).toBe('12345678');
      expect(savedEstudiante.nivel).toBe('A2');
      expect(savedEstudiante.mustChangePassword).toBe(true);
      expect(savedEstudiante.condicion).toBe('activo');
      expect(savedEstudiante.isActive).toBe(true);
    });

    test('debe generar fullName virtual correctamente', async () => {
      const estudianteData = {
        email: 'test@test.com',
        password: 'Password123',
        firstName: 'Maria',
        lastName: 'Garcia',
        role: 'estudiante',
        dni: '87654321',
        nivel: 'B1'
      };

      const estudiante = new Estudiante(estudianteData);
      expect(estudiante.fullName).toBe('Maria Garcia');
    });
  });

  describe('Validación de email único', () => {
    test('no debe permitir emails duplicados', async () => {
      const userData1 = {
        email: 'duplicado@test.com',
        password: 'Password123',
        firstName: 'Usuario',
        lastName: 'Uno',
        role: 'estudiante',
        dni: '11111111',
        nivel: 'A1'
      };

      const userData2 = {
        email: 'duplicado@test.com',
        password: 'Password456',
        firstName: 'Usuario',
        lastName: 'Dos',
        role: 'estudiante',
        dni: '22222222',
        nivel: 'A2'
      };

      const estudiante1 = new Estudiante(userData1);
      await estudiante1.save();

      const estudiante2 = new Estudiante(userData2);
      
      await expect(estudiante2.save()).rejects.toThrow();
    });

    test('debe validar formato de email', async () => {
      const invalidEmails = [
        'invalid-email',
        '@test.com',
        'test@',
        'test.com',
        'test@.com'
      ];

      for (const email of invalidEmails) {
        const userData = {
          email: email,
          password: 'Password123',
          firstName: 'Test',
          lastName: 'User',
          role: 'estudiante',
          dni: `${Math.random().toString().substr(2, 8)}`,
          nivel: 'A1'
        };

        const estudiante = new Estudiante(userData);
        await expect(estudiante.save()).rejects.toThrow();
      }
    });
  });

  describe('Validación de DNI formato', () => {
    test('debe requerir DNI para estudiantes y profesores', async () => {
      const estudianteData = {
        email: 'estudiante@test.com',
        password: 'Password123',
        firstName: 'Test',
        lastName: 'Student',
        role: 'estudiante',
        nivel: 'A1'
      };

      const estudiante = new Estudiante(estudianteData);
      await expect(estudiante.save()).rejects.toThrow();
    });

    test('debe permitir DNI único para diferentes usuarios', async () => {
      const estudiante1Data = {
        email: 'estudiante1@test.com',
        password: 'Password123',
        firstName: 'Estudiante',
        lastName: 'Uno',
        role: 'estudiante',
        dni: '12345678',
        nivel: 'A1'
      };

      const estudiante2Data = {
        email: 'estudiante2@test.com',
        password: 'Password123',
        firstName: 'Estudiante',
        lastName: 'Dos',
        role: 'estudiante',
        dni: '87654321',
        nivel: 'A2'
      };

      const estudiante1 = new Estudiante(estudiante1Data);
      const estudiante2 = new Estudiante(estudiante2Data);

      const saved1 = await estudiante1.save();
      const saved2 = await estudiante2.save();

      expect(saved1.dni).toBe('12345678');
      expect(saved2.dni).toBe('87654321');
    });

    test('no debe permitir DNI duplicados', async () => {
      const estudiante1Data = {
        email: 'estudiante1@test.com',
        password: 'Password123',
        firstName: 'Estudiante',
        lastName: 'Uno',
        role: 'estudiante',
        dni: '12345678',
        nivel: 'A1'
      };

      const estudiante2Data = {
        email: 'estudiante2@test.com',
        password: 'Password123',
        firstName: 'Estudiante',
        lastName: 'Dos',
        role: 'estudiante',
        dni: '12345678',
        nivel: 'A2'
      };

      const estudiante1 = new Estudiante(estudiante1Data);
      await estudiante1.save();

      const estudiante2 = new Estudiante(estudiante2Data);
      await expect(estudiante2.save()).rejects.toThrow();
    });
  });

  describe('Hash de password', () => {
    test('debe hashear la contraseña antes de guardar', async () => {
      const plainPassword = 'Password123';
      const estudianteData = {
        email: 'test@test.com',
        password: plainPassword,
        firstName: 'Test',
        lastName: 'User',
        role: 'estudiante',
        dni: '12345678',
        nivel: 'A1'
      };

      const estudiante = new Estudiante(estudianteData);
      const savedEstudiante = await estudiante.save();

      expect(savedEstudiante.password).not.toBe(plainPassword);
      expect(savedEstudiante.password).toMatch(/^\$2[aby]\$\d+\$/);
    });

    test('debe comparar contraseñas correctamente', async () => {
      const plainPassword = 'Password123';
      const estudianteData = {
        email: 'test@test.com',
        password: plainPassword,
        firstName: 'Test',
        lastName: 'User',
        role: 'estudiante',
        dni: '12345678',
        nivel: 'A1'
      };

      const estudiante = new Estudiante(estudianteData);
      const savedEstudiante = await estudiante.save();

      const isMatch = await savedEstudiante.comparePassword(plainPassword);
      const isNotMatch = await savedEstudiante.comparePassword('WrongPassword');

      expect(isMatch).toBe(true);
      expect(isNotMatch).toBe(false);
    });

    test('no debe re-hashear si la contraseña no cambió', async () => {
      const estudianteData = {
        email: 'test@test.com',
        password: 'Password123',
        firstName: 'Test',
        lastName: 'User',
        role: 'estudiante',
        dni: '12345678',
        nivel: 'A1'
      };

      const estudiante = new Estudiante(estudianteData);
      const savedEstudiante = await estudiante.save();
      const originalHash = savedEstudiante.password;

      savedEstudiante.firstName = 'Updated Name';
      const updatedEstudiante = await savedEstudiante.save();

      expect(updatedEstudiante.password).toBe(originalHash);
    });
  });

  describe('Validaciones de campos requeridos', () => {
    test('debe requerir email', async () => {
      const estudianteData = {
        password: 'Password123',
        firstName: 'Test',
        lastName: 'User',
        role: 'estudiante',
        dni: '12345678',
        nivel: 'A1'
      };

      const estudiante = new Estudiante(estudianteData);
      await expect(estudiante.save()).rejects.toThrow();
    });

    test('debe requerir password', async () => {
      const estudianteData = {
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'estudiante',
        dni: '12345678',
        nivel: 'A1'
      };

      const estudiante = new Estudiante(estudianteData);
      await expect(estudiante.save()).rejects.toThrow();
    });

    test('debe requerir firstName', async () => {
      const estudianteData = {
        email: 'test@test.com',
        password: 'Password123',
        lastName: 'User',
        role: 'estudiante',
        dni: '12345678',
        nivel: 'A1'
      };

      const estudiante = new Estudiante(estudianteData);
      await expect(estudiante.save()).rejects.toThrow();
    });

    test('debe requerir lastName', async () => {
      const estudianteData = {
        email: 'test@test.com',
        password: 'Password123',
        firstName: 'Test',
        role: 'estudiante',
        dni: '12345678',
        nivel: 'A1'
      };

      const estudiante = new Estudiante(estudianteData);
      await expect(estudiante.save()).rejects.toThrow();
    });
  });

  describe('Método toJSON', () => {
    test('no debe incluir password en JSON', async () => {
      const estudianteData = {
        email: 'test@test.com',
        password: 'Password123',
        firstName: 'Test',
        lastName: 'User',
        role: 'estudiante',
        dni: '12345678',
        nivel: 'A1'
      };

      const estudiante = new Estudiante(estudianteData);
      const savedEstudiante = await estudiante.save();
      const json = savedEstudiante.toJSON();

      expect(json.password).toBeUndefined();
      expect(json.__v).toBeUndefined();
      expect(json.email).toBe('test@test.com');
      expect(json.firstName).toBe('Test');
    });
  });
});