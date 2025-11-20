const mongoose = require('mongoose');
const BaseUser = require('../../models/BaseUser');
const Estudiante = require('../../models/Estudiante');

describe('BaseUser Model', () => {
  
  describe('Crear usuario estudiante', () => {
    it('deberia crear un estudiante correctamente', async () => {
      const estudianteData = {
        email: 'estudiante@test.com',
        password: 'password123',
        firstName: 'Juan',
        lastName: 'Perez',
        role: 'estudiante',
        phone: '1234567890',
        dni: '12345678',
        nivel: 'A1'
      };

      const estudiante = new Estudiante(estudianteData);
      const savedEstudiante = await estudiante.save();

      expect(savedEstudiante._id).toBeDefined();
      expect(savedEstudiante.email).toBe('estudiante@test.com');
      expect(savedEstudiante.firstName).toBe('Juan');
      expect(savedEstudiante.lastName).toBe('Perez');
      expect(savedEstudiante.role).toBe('estudiante');
      expect(savedEstudiante.dni).toBe('12345678');
      expect(savedEstudiante.nivel).toBe('A1');
      expect(savedEstudiante.isActive).toBe(true);
      expect(savedEstudiante.mustChangePassword).toBe(true);
    });
  });

  describe('Validacion de email unico', () => {
    it('no deberia permitir emails duplicados', async () => {
      const estudianteData = {
        email: 'duplicado@test.com',
        password: 'password123',
        firstName: 'Maria',
        lastName: 'Garcia',
        role: 'estudiante',
        dni: '87654321',
        nivel: 'B1'
      };

      const estudiante1 = new Estudiante(estudianteData);
      await estudiante1.save();

      const estudiante2 = new Estudiante({
        ...estudianteData,
        dni: '11111111'
      });

      await expect(estudiante2.save()).rejects.toThrow();
    });
  });

  describe('Validacion de DNI formato', () => {
    it('deberia requerir DNI para estudiantes', async () => {
      const estudianteData = {
        email: 'sindni@test.com',
        password: 'password123',
        firstName: 'Pedro',
        lastName: 'Lopez',
        role: 'estudiante',
        nivel: 'A2'
      };

      const estudiante = new Estudiante(estudianteData);

      await expect(estudiante.save()).rejects.toThrow();
    });

    it('deberia aceptar DNI valido', async () => {
      const estudianteData = {
        email: 'condni@test.com',
        password: 'password123',
        firstName: 'Ana',
        lastName: 'Martinez',
        role: 'estudiante',
        dni: '98765432',
        nivel: 'B2'
      };

      const estudiante = new Estudiante(estudianteData);
      const savedEstudiante = await estudiante.save();

      expect(savedEstudiante.dni).toBe('98765432');
    });
  });

  describe('Hash de password', () => {
    it('deberia hashear el password antes de guardar', async () => {
      const plainPassword = 'mySecurePassword123';
      const estudianteData = {
        email: 'hashtest@test.com',
        password: plainPassword,
        firstName: 'Carlos',
        lastName: 'Sanchez',
        role: 'estudiante',
        dni: '55555555',
        nivel: 'C1'
      };

      const estudiante = new Estudiante(estudianteData);
      const savedEstudiante = await estudiante.save();

      expect(savedEstudiante.password).toBeDefined();
      expect(savedEstudiante.password).not.toBe(plainPassword);
      expect(savedEstudiante.password.length).toBeGreaterThan(20);
    });

    it('deberia comparar password correctamente', async () => {
      const plainPassword = 'testPassword456';
      const estudianteData = {
        email: 'comparetest@test.com',
        password: plainPassword,
        firstName: 'Laura',
        lastName: 'Rodriguez',
        role: 'estudiante',
        dni: '66666666',
        nivel: 'A1'
      };

      const estudiante = new Estudiante(estudianteData);
      const savedEstudiante = await estudiante.save();

      const isMatch = await savedEstudiante.comparePassword(plainPassword);
      expect(isMatch).toBe(true);

      const isNotMatch = await savedEstudiante.comparePassword('wrongPassword');
      expect(isNotMatch).toBe(false);
    });
  });

  describe('Validaciones de email', () => {
    it('deberia rechazar email invalido', async () => {
      const estudianteData = {
        email: 'emailinvalido',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        role: 'estudiante',
        dni: '77777777',
        nivel: 'A1'
      };

      const estudiante = new Estudiante(estudianteData);

      await expect(estudiante.save()).rejects.toThrow();
    });

    it('deberia aceptar email valido', async () => {
      const estudianteData = {
        email: 'valid.email@domain.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'Valid',
        role: 'estudiante',
        dni: '88888888',
        nivel: 'B1'
      };

      const estudiante = new Estudiante(estudianteData);
      const savedEstudiante = await estudiante.save();

      expect(savedEstudiante.email).toBe('valid.email@domain.com');
    });
  });
});
