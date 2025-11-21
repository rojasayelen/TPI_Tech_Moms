const request = require('supertest');
const app = require('../../app');
const BaseUser = require('../../models/BaseUser');
const { createTestUser, createTestAdmin, generateToken, authenticatedRequest } = require('./helpers');

describe('Auth Endpoints', () => {

  afterEach(async () => {
    // Limpiar usuarios después de cada test
    await BaseUser.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    
    it('deberia registrar un estudiante correctamente', async () => {
      const userData = {
        email: 'nuevo@test.com',
        password: 'password123',
        firstName: 'Juan',
        lastName: 'Pérez',
        role: 'estudiante',
        dni: '12345678',
        phone: '1234567890',
        birthDate: '1990-01-01',
        address: 'Calle Falsa 123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.role).toBe('estudiante');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('deberia fallar al registrar con email duplicado', async () => {
      await createTestUser({ email: 'duplicado@test.com' });

      const userData = {
        email: 'duplicado@test.com',
        password: 'password123',
        firstName: 'Juan',
        lastName: 'Pérez',
        role: 'estudiante',
        dni: '87654321'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('deberia fallar al registrar con DNI duplicado', async () => {
      await createTestUser({ dni: '12345678' });

      const userData = {
        email: 'nuevo@test.com',
        password: 'password123',
        firstName: 'Juan',
        lastName: 'Pérez',
        role: 'estudiante',
        dni: '12345678'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

  });

  describe('POST /api/auth/login', () => {

    it('deberia hacer login correctamente', async () => {
      const user = await createTestUser();

      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(user.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('deberia fallar con credenciales incorrectas', async () => {
      await createTestUser();

      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('deberia fallar con email inexistente', async () => {
      const loginData = {
        email: 'noexiste@test.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

  });

  describe('GET /api/auth/profile', () => {

    it('deberia obtener el perfil del usuario autenticado', async () => {
      const user = await createTestUser();
      const token = generateToken(user._id, user.role);

      const response = await authenticatedRequest(token)
        .get('/api/auth/profile')
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(user.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('deberia fallar sin token de autenticación', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

  });

  describe('PUT /api/auth/change-password', () => {

    it('deberia cambiar contraseña correctamente', async () => {
      const user = await createTestUser();
      const token = generateToken(user._id, user.role);

      const passwordData = {
        currentPassword: 'password123',
        newPassword: 'newpassword456'
      };

      const response = await authenticatedRequest(token)
        .put('/api/auth/change-password')
        .send(passwordData)
        .expect(200);

      expect(response.body).toHaveProperty('message');

      // Verificar que puede hacer login con nueva contraseña
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'newpassword456'
        })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('token');
    });

    it('deberia fallar con contraseña actual incorrecta', async () => {
      const user = await createTestUser();
      const token = generateToken(user._id, user.role);

      const passwordData = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword456'
      };

      const response = await authenticatedRequest(token)
        .put('/api/auth/change-password')
        .send(passwordData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

  });

  describe('GET /api/auth/students (Admin only)', () => {

    it('deberia listar estudiantes si es admin', async () => {
      const admin = await createTestAdmin();
      const student1 = await createTestUser({ email: 'student1@test.com', dni: '11111111' });
      const student2 = await createTestUser({ email: 'student2@test.com', dni: '22222222' });
      
      const token = generateToken(admin._id, 'admin');

      const response = await authenticatedRequest(token)
        .get('/api/auth/students')
        .expect(200);

      expect(response.body).toHaveProperty('students');
      expect(Array.isArray(response.body.students)).toBe(true);
      expect(response.body.students.length).toBeGreaterThanOrEqual(2);
    });

    it('deberia fallar si no es admin', async () => {
      const user = await createTestUser();
      const token = generateToken(user._id, 'estudiante');

      const response = await authenticatedRequest(token)
        .get('/api/auth/students')
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

  });

});