const mongoose = require('mongoose');
const Profesor = require('../../models/Profesor');
const Language = require('../../models/Language');

describe('Profesor Model', () => {

  let languageId;

  beforeEach(async () => {
    const language = new Language({
      code: 'EN',
      name: 'English',
      nativeName: 'English',
      isActive: true
    });
    const savedLanguage = await language.save();
    languageId = savedLanguage._id;
  });

  describe('Crear profesor con especialidad', () => {
    it('deberia crear un profesor correctamente con especialidad', async () => {
      const profesorData = {
        email: 'profesor@test.com',
        password: 'password123',
        firstName: 'Roberto',
        lastName: 'Gomez',
        role: 'profesor',
        phone: '1234567890',
        dni: '22222222',
        especialidades: [languageId],
        tarifaPorHora: 50
      };

      const profesor = new Profesor(profesorData);
      const savedProfesor = await profesor.save();

      expect(savedProfesor._id).toBeDefined();
      expect(savedProfesor.email).toBe('profesor@test.com');
      expect(savedProfesor.firstName).toBe('Roberto');
      expect(savedProfesor.lastName).toBe('Gomez');
      expect(savedProfesor.role).toBe('profesor');
      expect(savedProfesor.dni).toBe('22222222');
      expect(savedProfesor.tarifaPorHora).toBe(50);
      expect(savedProfesor.especialidades).toHaveLength(1);
      expect(savedProfesor.especialidades[0].toString()).toBe(languageId.toString());
    });

    it('deberia poblar las especialidades correctamente', async () => {
      const profesorData = {
        email: 'profesor2@test.com',
        password: 'password123',
        firstName: 'Ana',
        lastName: 'Torres',
        role: 'profesor',
        dni: '33333333',
        especialidades: [languageId],
        tarifaPorHora: 60
      };

      const profesor = new Profesor(profesorData);
      await profesor.save();

      const foundProfesor = await Profesor.findOne({ email: 'profesor2@test.com' })
        .populate('especialidades');

      expect(foundProfesor.especialidades[0].name).toBe('English');
      expect(foundProfesor.especialidades[0].code.toUpperCase()).toBe('EN');
    });
  });

  describe('Validacion de tarifa numerica', () => {
    it('deberia requerir tarifa por hora', async () => {
      const profesorData = {
        email: 'sintarifa@test.com',
        password: 'password123',
        firstName: 'Miguel',
        lastName: 'Ruiz',
        role: 'profesor',
        dni: '44444444',
        especialidades: [languageId]
      };

      const profesor = new Profesor(profesorData);

      await expect(profesor.save()).rejects.toThrow();
    });

    it('no deberia permitir tarifa negativa', async () => {
      const profesorData = {
        email: 'tarifanegativa@test.com',
        password: 'password123',
        firstName: 'Sofia',
        lastName: 'Vargas',
        role: 'profesor',
        dni: '55555555',
        especialidades: [languageId],
        tarifaPorHora: -10
      };

      const profesor = new Profesor(profesorData);

      await expect(profesor.save()).rejects.toThrow();
    });

    it('deberia aceptar tarifa valida', async () => {
      const profesorData = {
        email: 'tarifavalida@test.com',
        password: 'password123',
        firstName: 'Diego',
        lastName: 'Castro',
        role: 'profesor',
        dni: '66666666',
        especialidades: [languageId],
        tarifaPorHora: 75.50
      };

      const profesor = new Profesor(profesorData);
      const savedProfesor = await profesor.save();

      expect(savedProfesor.tarifaPorHora).toBe(75.50);
    });

    it('deberia aceptar tarifa en cero', async () => {
      const profesorData = {
        email: 'tarifacero@test.com',
        password: 'password123',
        firstName: 'Carmen',
        lastName: 'Flores',
        role: 'profesor',
        dni: '77777777',
        especialidades: [languageId],
        tarifaPorHora: 0
      };

      const profesor = new Profesor(profesorData);
      const savedProfesor = await profesor.save();

      expect(savedProfesor.tarifaPorHora).toBe(0);
    });
  });

  describe('Validacion de especialidades validas', () => {
    it('no deberia permitir crear profesor sin especialidades', async () => {
      const profesorData = {
        email: 'sinespecialidad@test.com',
        password: 'password123',
        firstName: 'Luis',
        lastName: 'Mendez',
        role: 'profesor',
        dni: '88888888',
        especialidades: [],
        tarifaPorHora: 50
      };

      const profesor = new Profesor(profesorData);

      await expect(profesor.save()).rejects.toThrow();
    });

    it('deberia permitir multiples especialidades', async () => {
      const language2 = new Language({
        code: 'FR',
        name: 'French',
        nativeName: 'Francais',
        isActive: true
      });
      const savedLanguage2 = await language2.save();

      const profesorData = {
        email: 'multiespecialidad@test.com',
        password: 'password123',
        firstName: 'Patricia',
        lastName: 'Navarro',
        role: 'profesor',
        dni: '99999999',
        especialidades: [languageId, savedLanguage2._id],
        tarifaPorHora: 80
      };

      const profesor = new Profesor(profesorData);
      const savedProfesor = await profesor.save();

      expect(savedProfesor.especialidades).toHaveLength(2);
    });

    it('deberia tener metodo getLanguageNames', async () => {
      const profesorData = {
        email: 'metodonombres@test.com',
        password: 'password123',
        firstName: 'Fernando',
        lastName: 'Ortiz',
        role: 'profesor',
        dni: '11112222',
        especialidades: [languageId],
        tarifaPorHora: 55
      };

      const profesor = new Profesor(profesorData);
      const savedProfesor = await profesor.save();
      await savedProfesor.populate('especialidades');

      const languageNames = savedProfesor.getLanguageNames();
      expect(languageNames).toContain('English');
    });

    it('deberia retornar mensaje cuando no hay especialidades', async () => {
      const profesorData = {
        email: 'vacio@test.com',
        password: 'password123',
        firstName: 'Elena',
        lastName: 'Ramos',
        role: 'profesor',
        dni: '22223333',
        especialidades: [languageId],
        tarifaPorHora: 45
      };

      const profesor = new Profesor(profesorData);
      const savedProfesor = await profesor.save();
      
      savedProfesor.especialidades = [];
      const languageNames = savedProfesor.getLanguageNames();
      
      expect(languageNames).toBe('Sin especialidades');
    });
  });

  describe('Validacion de DNI para profesores', () => {
    it('deberia requerir DNI para profesores', async () => {
      const profesorData = {
        email: 'profesorsindni@test.com',
        password: 'password123',
        firstName: 'Ricardo',
        lastName: 'Vega',
        role: 'profesor',
        especialidades: [languageId],
        tarifaPorHora: 50
      };

      const profesor = new Profesor(profesorData);

      await expect(profesor.save()).rejects.toThrow();
    });
  });
});
