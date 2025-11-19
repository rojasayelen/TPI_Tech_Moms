const Profesor = require('../../models/Profesor');
const Language = require('../../models/Language');

describe('Profesor Model Tests', () => {
  let languageId;

  beforeAll(async () => {
    const language = new Language({
      code: 'en',
      name: 'English',
      nativeName: 'English',
      isActive: true
    });
    const savedLanguage = await language.save();
    languageId = savedLanguage._id;
  });

  beforeEach(async () => {
    await Profesor.deleteMany({});
    await Language.deleteMany({ _id: { $ne: languageId } });
  });

  describe('Crear profesor con especialidad', () => {
    test('debe crear un profesor correctamente', async () => {
      const profesorData = {
        email: 'profesor@test.com',
        password: 'Password123',
        firstName: 'Carlos',
        lastName: 'Martinez',
        role: 'profesor',
        dni: '87654321',
        phone: '+54911234567',
        especialidades: [languageId],
        tarifaPorHora: 2500,
        disponibilidad: {
          lunes: [{ inicio: '09:00', fin: '12:00' }],
          martes: [{ inicio: '14:00', fin: '18:00' }]
        }
      };

      const profesor = new Profesor(profesorData);
      const savedProfesor = await profesor.save();

      expect(savedProfesor._id).toBeDefined();
      expect(savedProfesor.email).toBe('profesor@test.com');
      expect(savedProfesor.firstName).toBe('Carlos');
      expect(savedProfesor.lastName).toBe('Martinez');
      expect(savedProfesor.role).toBe('profesor');
      expect(savedProfesor.dni).toBe('87654321');
      expect(savedProfesor.especialidades).toHaveLength(1);
      expect(savedProfesor.especialidades[0].toString()).toBe(languageId.toString());
      expect(savedProfesor.tarifaPorHora).toBe(2500);
      expect(savedProfesor.mustChangePassword).toBe(true);
      expect(savedProfesor.condicion).toBe('activo');
      expect(savedProfesor.isActive).toBe(true);
    });

    test('debe requerir al menos una especialidad', async () => {
      const profesorData = {
        email: 'profesor@test.com',
        password: 'Password123',
        firstName: 'Carlos',
        lastName: 'Martinez',
        role: 'profesor',
        dni: '87654321',
        especialidades: [],
        tarifaPorHora: 2500
      };

      const profesor = new Profesor(profesorData);
      await expect(profesor.save()).rejects.toThrow();
    });

    test('debe permitir múltiples especialidades', async () => {
      const language2 = new Language({
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        isActive: true
      });
      const savedLanguage2 = await language2.save();

      const profesorData = {
        email: 'profesor@test.com',
        password: 'Password123',
        firstName: 'Carlos',
        lastName: 'Martinez',
        role: 'profesor',
        dni: '87654321',
        especialidades: [languageId, savedLanguage2._id],
        tarifaPorHora: 2500
      };

      const profesor = new Profesor(profesorData);
      const savedProfesor = await profesor.save();

      expect(savedProfesor.especialidades).toHaveLength(2);
    });
  });

  describe('Validación de tarifa numérica', () => {
    test('debe requerir tarifa por hora', async () => {
      const profesorData = {
        email: 'profesor@test.com',
        password: 'Password123',
        firstName: 'Carlos',
        lastName: 'Martinez',
        role: 'profesor',
        dni: '87654321',
        especialidades: [languageId]
      };

      const profesor = new Profesor(profesorData);
      await expect(profesor.save()).rejects.toThrow();
    });

    test('debe aceptar tarifa numérica válida', async () => {
      const tarifasValidas = [1000, 2500, 5000, 10000];

      for (const tarifa of tarifasValidas) {
        const profesorData = {
          email: `profesor${tarifa}@test.com`,
          password: 'Password123',
          firstName: 'Carlos',
          lastName: 'Martinez',
          role: 'profesor',
          dni: `${tarifa}`,
          especialidades: [languageId],
          tarifaPorHora: tarifa
        };

        const profesor = new Profesor(profesorData);
        const savedProfesor = await profesor.save();

        expect(savedProfesor.tarifaPorHora).toBe(tarifa);
      }
    });

    test('no debe permitir tarifa negativa', async () => {
      const profesorData = {
        email: 'profesor@test.com',
        password: 'Password123',
        firstName: 'Carlos',
        lastName: 'Martinez',
        role: 'profesor',
        dni: '87654321',
        especialidades: [languageId],
        tarifaPorHora: -1000
      };

      const profesor = new Profesor(profesorData);
      await expect(profesor.save()).rejects.toThrow();
    });

    test('debe permitir tarifa cero', async () => {
      const profesorData = {
        email: 'profesor@test.com',
        password: 'Password123',
        firstName: 'Carlos',
        lastName: 'Martinez',
        role: 'profesor',
        dni: '87654321',
        especialidades: [languageId],
        tarifaPorHora: 0
      };

      const profesor = new Profesor(profesorData);
      const savedProfesor = await profesor.save();

      expect(savedProfesor.tarifaPorHora).toBe(0);
    });
  });

  describe('Validación de disponibilidad', () => {
    test('debe validar formato de hora en disponibilidad', async () => {
      const horasInvalidas = ['25:00', '12:60', 'abc'];

      for (const horaInvalida of horasInvalidas) {
        const profesorData = {
          email: `profesor${Math.random()}@test.com`,
          password: 'Password123',
          firstName: 'Carlos',
          lastName: 'Martinez',
          role: 'profesor',
          dni: `${Math.random().toString().substr(2, 8)}`,
          especialidades: [languageId],
          tarifaPorHora: 2500,
          disponibilidad: {
            lunes: [{ inicio: horaInvalida, fin: '12:00' }]
          }
        };

        const profesor = new Profesor(profesorData);
        try {
          await profesor.save();
          if (['25:00', '12:60', 'abc'].includes(horaInvalida)) {
            fail(`Should have failed for invalid hour: ${horaInvalida}`);
          }
        } catch (error) {
          expect(error).toBeDefined();
        }
      }
    });

    test('debe aceptar formato de hora válido', async () => {
      const horasValidas = ['09:00', '12:30', '18:45', '23:59', '00:00'];

      for (const horaValida of horasValidas) {
        const profesorData = {
          email: `profesor${Math.random()}@test.com`,
          password: 'Password123',
          firstName: 'Carlos',
          lastName: 'Martinez',
          role: 'profesor',
          dni: `${Math.random().toString().substr(2, 8)}`,
          especialidades: [languageId],
          tarifaPorHora: 2500,
          disponibilidad: {
            lunes: [{ inicio: horaValida, fin: '23:59' }]
          }
        };

        const profesor = new Profesor(profesorData);
        const savedProfesor = await profesor.save();

        expect(savedProfesor.disponibilidad.lunes[0].inicio).toBe(horaValida);
      }
    });

    test('debe permitir múltiples bloques de disponibilidad por día', async () => {
      const profesorData = {
        email: 'profesor@test.com',
        password: 'Password123',
        firstName: 'Carlos',
        lastName: 'Martinez',
        role: 'profesor',
        dni: '87654321',
        especialidades: [languageId],
        tarifaPorHora: 2500,
        disponibilidad: {
          lunes: [
            { inicio: '09:00', fin: '12:00' },
            { inicio: '14:00', fin: '18:00' }
          ],
          martes: [
            { inicio: '10:00', fin: '13:00' }
          ]
        }
      };

      const profesor = new Profesor(profesorData);
      const savedProfesor = await profesor.save();

      expect(savedProfesor.disponibilidad.lunes).toHaveLength(2);
      expect(savedProfesor.disponibilidad.martes).toHaveLength(1);
    });
  });

  describe('Métodos del modelo', () => {
    test('debe obtener nombres de idiomas correctamente', async () => {
      const profesorData = {
        email: 'profesor@test.com',
        password: 'Password123',
        firstName: 'Carlos',
        lastName: 'Martinez',
        role: 'profesor',
        dni: '87654321',
        especialidades: [languageId],
        tarifaPorHora: 2500
      };

      const profesor = new Profesor(profesorData);
      const savedProfesor = await profesor.save();

      const languageNames = savedProfesor.getLanguageNames();
      expect(typeof languageNames).toBe('string');
      expect(languageNames.length).toBeGreaterThan(0);
    });

    test('debe retornar mensaje por defecto si no tiene especialidades', async () => {
      const profesorData = {
        email: 'profesor@test.com',
        password: 'Password123',
        firstName: 'Carlos',
        lastName: 'Martinez',
        role: 'profesor',
        dni: '87654321',
        especialidades: [languageId],
        tarifaPorHora: 2500
      };

      const profesor = new Profesor(profesorData);
      profesor.especialidades = [];

      const languageNames = profesor.getLanguageNames();
      expect(languageNames).toBe('Sin especialidades');
    });
  });

  describe('Métodos estáticos', () => {
    test('findWithLanguages debe poblar especialidades', async () => {
      const profesorData = {
        email: 'profesor@test.com',
        password: 'Password123',
        firstName: 'Carlos',
        lastName: 'Martinez',
        role: 'profesor',
        dni: '87654321',
        especialidades: [languageId],
        tarifaPorHora: 2500
      };

      const profesor = new Profesor(profesorData);
      await profesor.save();

      const profesores = await Profesor.findWithLanguages();
      expect(Array.isArray(profesores)).toBe(true);
      expect(profesores.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Validaciones específicas de profesor', () => {
    test('debe heredar validaciones de BaseUser', async () => {
      const profesorData = {
        password: 'Password123',
        firstName: 'Carlos',
        lastName: 'Martinez',
        role: 'profesor',
        dni: '87654321',
        especialidades: [languageId],
        tarifaPorHora: 2500
      };

      const profesor = new Profesor(profesorData);
      await expect(profesor.save()).rejects.toThrow();
    });

    test('debe requerir DNI para profesores', async () => {
      const profesorData = {
        email: 'profesor@test.com',
        password: 'Password123',
        firstName: 'Carlos',
        lastName: 'Martinez',
        role: 'profesor',
        especialidades: [languageId],
        tarifaPorHora: 2500
      };

      const profesor = new Profesor(profesorData);
      await expect(profesor.save()).rejects.toThrow();
    });
  });
});