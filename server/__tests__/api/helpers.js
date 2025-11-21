const request = require('supertest');
const app = require('../../app');
const BaseUser = require('../../models/BaseUser');
const jwt = require('jsonwebtoken');

// Helper para crear usuarios de test
const createTestUser = async (userData = {}) => {
  const defaultData = {
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    role: 'estudiante',
    dni: '12345678',
    phone: '1234567890',
    birthDate: '1990-01-01',
    address: 'Test Address 123',
    nivel: 'A1' // Requerido para estudiantes
  };

  const user = await BaseUser.create({ ...defaultData, ...userData });
  return user;
};

// Helper para crear admin de test
const createTestAdmin = async () => {
  return createTestUser({
    email: 'admin@test.com',
    role: 'admin',
    dni: '11111111'
  });
};

// Helper para crear profesor de test
const createTestProfesor = async () => {
  return createTestUser({
    email: 'profesor@test.com',
    role: 'profesor',
    dni: '22222222',
    tarifa: 2500,
    especialidades: ['ingles']
  });
};

// Helper para generar JWT token
const generateToken = (userId, role = 'estudiante') => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'test-secret-key',
    { expiresIn: '24h' }
  );
};

// Helper para hacer request autenticado
const authenticatedRequest = (token) => {
  return request(app).set('Authorization', `Bearer ${token}`);
};

module.exports = {
  createTestUser,
  createTestAdmin,
  createTestProfesor,
  generateToken,
  authenticatedRequest
};