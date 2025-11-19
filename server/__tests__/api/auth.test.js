const request = require('supertest');
const {
  setupTestDB,
  teardownTestDB,
  clearDatabase,
  createTestAdmin,
  createTestStudent,
  createTestTeacher,
  loginUser,
  getAuthHeaders,
  app
} = require('./helpers');

describe('Auth API Tests', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /api/auth/login', () => {
    test('debe hacer login exitoso con credenciales correctas', async () => {
      const admin = await createTestAdmin();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'AdminPassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('admin@test.com');
      expect(response.body.user.role).toBe('admin');
      expect(response.body.user.password).toBeUndefined();
    });

    test('debe fallar con credenciales incorrectas', async () => {
      const admin = await createTestAdmin();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'WrongPassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Credenciales inválidas');
      expect(response.body.token).toBeUndefined();
    });

    test('debe fallar con usuario no existente', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'noexiste@test.com',
          password: 'Password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Credenciales inválidas');
    });

    test('debe fallar con datos faltantes', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/verify-token', () => {
    test('debe verificar token válido', async () => {
      const admin = await createTestAdmin();
      const token = await loginUser('admin@test.com', 'AdminPassword123');

      const response = await request(app)
        .get('/api/auth/verify-token')
        .set(getAuthHeaders(token));

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('admin@test.com');
    });

    test('debe fallar con token inválido', async () => {
      const response = await request(app)
        .get('/api/auth/verify-token')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('debe fallar sin token', async () => {
      const response = await request(app)
        .get('/api/auth/verify-token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    test('debe hacer logout correctamente', async () => {
      const admin = await createTestAdmin();
      const token = await loginUser('admin@test.com', 'AdminPassword123');

      const response = await request(app)
        .post('/api/auth/logout')
        .set(getAuthHeaders(token));

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Logout exitoso');
    });
  });

  describe('GET /api/auth/profile', () => {
    test('debe obtener perfil propio del usuario autenticado', async () => {
      const student = await createTestStudent();
      const token = await loginUser('student@test.com', 'StudentPassword123');

      const response = await request(app)
        .get('/api/auth/profile')
        .set(getAuthHeaders(token));

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('student@test.com');
      expect(response.body.user.role).toBe('estudiante');
      expect(response.body.user.password).toBeUndefined();
    });

    test('debe fallar sin autenticación', async () => {
      const response = await request(app)
        .get('/api/auth/profile');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/auth/change-password', () => {
    test('debe cambiar contraseña correctamente', async () => {
      const student = await createTestStudent();
      const token = await loginUser('student@test.com', 'StudentPassword123');

      const response = await request(app)
        .put('/api/auth/change-password')
        .set(getAuthHeaders(token))
        .send({
          currentPassword: 'StudentPassword123',
          newPassword: 'NewPassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Contraseña actualizada');
    });

    test('debe fallar con contraseña actual incorrecta', async () => {
      const student = await createTestStudent();
      const token = await loginUser('student@test.com', 'StudentPassword123');

      const response = await request(app)
        .put('/api/auth/change-password')
        .set(getAuthHeaders(token))
        .send({
          currentPassword: 'WrongPassword',
          newPassword: 'NewPassword123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});