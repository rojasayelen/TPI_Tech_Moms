const request = require('supertest');
const {
  setupTestDB,
  teardownTestDB,
  clearDatabase,
  createTestAdmin,
  createTestStudent,
  createTestTeacher,
  app
} = require('./helpers');

describe('Users API Tests', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /api/auth/register/estudiante-admin', () => {
    test('debe crear un estudiante correctamente', async () => {
      const admin = await createTestAdmin();
      
      const studentData = {
        email: 'nuevo@test.com',
        firstName: 'Nuevo',
        lastName: 'Estudiante',
        role: 'estudiante',
        dni: '99999999',
        nivel: 'B1',
        phone: '+54911111111'
      };

      const response = await request(app)
        .post('/api/auth/register/estudiante-admin')
        .send(studentData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('nuevo@test.com');
      expect(response.body.user.role).toBe('estudiante');
    });

    test('debe fallar con email duplicado', async () => {
      const admin = await createTestAdmin();
      const student = await createTestStudent();
      
      const studentData = {
        email: 'student@test.com',
        firstName: 'Duplicado',
        lastName: 'Estudiante',
        role: 'estudiante',
        dni: '88888888',
        nivel: 'A1'
      };

      const response = await request(app)
        .post('/api/auth/register/estudiante-admin')
        .send(studentData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('debe fallar con DNI duplicado', async () => {
      const admin = await createTestAdmin();
      const student = await createTestStudent();
      
      const studentData = {
        email: 'nuevo2@test.com',
        firstName: 'Nuevo',
        lastName: 'Estudiante',
        role: 'estudiante',
        dni: '12345678',
        nivel: 'A1'
      };

      const response = await request(app)
        .post('/api/auth/register/estudiante-admin')
        .send(studentData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('debe fallar con datos faltantes', async () => {
      const admin = await createTestAdmin();
      
      const studentData = {
        email: 'incompleto@test.com',
        firstName: 'Incompleto'
      };

      const response = await request(app)
        .post('/api/auth/register/estudiante-admin')
        .send(studentData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/register/profesor', () => {
    test('debe crear un profesor correctamente', async () => {
      const admin = await createTestAdmin();
      
      const profesorData = {
        email: 'profesor@test.com',
        firstName: 'Nuevo',
        lastName: 'Profesor',
        role: 'profesor',
        dni: '77777777',
        tarifaPorHora: 3000,
        especialidades: ['ingles']
      };

      const response = await request(app)
        .post('/api/auth/register/profesor')
        .send(profesorData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('profesor@test.com');
      expect(response.body.user.role).toBe('profesor');
    });

    test('debe fallar sin tarifa', async () => {
      const admin = await createTestAdmin();
      
      const profesorData = {
        email: 'profesor2@test.com',
        firstName: 'Sin',
        lastName: 'Tarifa',
        role: 'profesor',
        dni: '66666666',
        especialidades: ['ingles']
      };

      const response = await request(app)
        .post('/api/auth/register/profesor')
        .send(profesorData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/students', () => {
    test('debe listar estudiantes', async () => {
      const admin = await createTestAdmin();
      const student = await createTestStudent();

      const response = await request(app)
        .get('/api/auth/students');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.students)).toBe(true);
      expect(response.body.students.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/auth/professors', () => {
    test('debe listar profesores', async () => {
      const admin = await createTestAdmin();
      const teacher = await createTestTeacher();

      const response = await request(app)
        .get('/api/auth/professors');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.professors)).toBe(true);
      expect(response.body.professors.length).toBeGreaterThan(0);
    });
  });
});