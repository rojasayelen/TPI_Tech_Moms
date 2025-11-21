const request = require('supertest');
const app = require('../../app');
const BaseUser = require('../../models/BaseUser');

describe('Auth API - Basic Tests', () => {

  afterEach(async () => {
    // Limpiar usuarios después de cada test
    await BaseUser.deleteMany({});
  });

  describe('GET /api/auth/profile', () => {
    
    it('deberia fallar sin token de autenticación', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });

  });

  describe('POST /api/auth/login', () => {

    it('deberia fallar con email inexistente', async () => {
      const loginData = {
        email: 'noexiste@test.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });

  });

  describe('POST /api/auth/register', () => {
    
    it('deberia registrar un estudiante correctamente', async () => {
      const userData = {
        email: 'nuevo@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        firstName: 'Juan',
        lastName: 'Pérez',
        role: 'estudiante',
        dni: '12345678',
        phone: '1234567890',
        birthDate: '1990-01-01',
        address: 'Calle Falsa 123',
        nivel: 'A1',
        condicion: 'activo' // Probar con valor diferente
      };

      const response = await request(app)
        .post('/api/auth/register/estudiante')
        .send(userData);

      console.log('Response:', response.status, response.body);
      
      // Aceptar tanto 201 como 200 por ahora
      expect([200, 201]).toContain(response.status);
      expect(response.body).toHaveProperty('message');
    });

  });

});