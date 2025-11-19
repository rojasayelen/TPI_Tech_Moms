const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const createApp = require('../../app');
const app = createApp();
const BaseUser = require('../../models/BaseUser');
const Admin = require('../../models/Admin');
const Estudiante = require('../../models/Estudiante');
const Profesor = require('../../models/Profesor');
const Language = require('../../models/Language');

let mongoServer;

const setupTestDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  await mongoose.connect(mongoUri);
};

const teardownTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};

const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

const createTestAdmin = async () => {
  const adminData = {
    email: 'admin@test.com',
    password: 'AdminPassword123',
    firstName: 'Test',
    lastName: 'Admin',
    role: 'admin',
    permissions: ['todos']
  };
  
  const admin = new Admin(adminData);
  return await admin.save();
};

const createTestStudent = async () => {
  const studentData = {
    email: 'student@test.com',
    password: 'StudentPassword123',
    firstName: 'Test',
    lastName: 'Student',
    role: 'estudiante',
    dni: '12345678',
    nivel: 'A2'
  };
  
  const student = new Estudiante(studentData);
  return await student.save();
};

const createTestTeacher = async () => {
  const language = new Language({
    code: 'en',
    name: 'English',
    nativeName: 'English',
    isActive: true
  });
  const savedLanguage = await language.save();

  const teacherData = {
    email: 'teacher@test.com',
    password: 'TeacherPassword123',
    firstName: 'Test',
    lastName: 'Teacher',
    role: 'profesor',
    dni: '87654321',
    especialidades: [savedLanguage._id],
    tarifaPorHora: 2500
  };
  
  const teacher = new Profesor(teacherData);
  return await teacher.save();
};

const loginUser = async (email, password) => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email, password });
  
  return response.body.token;
};

const getAuthHeaders = (token) => {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

module.exports = {
  setupTestDB,
  teardownTestDB,
  clearDatabase,
  createTestAdmin,
  createTestStudent,
  createTestTeacher,
  loginUser,
  getAuthHeaders,
  app
};