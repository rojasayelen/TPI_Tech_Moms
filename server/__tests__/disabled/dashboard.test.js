// Disabled test: moved to disabled/ because it connects to the real MongoDB and
// can modify or delete production/test databases. Kept here for reference.

const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../index')

describe.skip('Dashboard API (DISABLED)', () => {
  let adminToken
  
  beforeAll(async () => {
    // Conect to testing database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI_TEST || process.env.MONGODB_URI)
    }
    
    // Login as admin to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin123'
      })
    
    adminToken = loginResponse.body.token
  })
  
  afterAll(async () => {
    await mongoose.connection.close()
  })
  
  describe('GET /api/dashboard/empresa', () => {
    test('Debe obtener información de la empresa', async () => {
      const response = await request(app)
        .get('/api/dashboard/empresa')
        .set('Authorization', `Bearer ${adminToken}`)
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('nombre')
      expect(response.body.data).toHaveProperty('contacto')
      expect(response.body.data.contacto).toHaveProperty('email')
    })
    
    test('Debe crear empresa por defecto si no existe', async () => {
      const response = await request(app)
        .get('/api/dashboard/empresa')
        .set('Authorization', `Bearer ${adminToken}`)
      
      expect(response.status).toBe(200)
      expect(response.body.data.nombre).toBeDefined()
      expect(response.body.data.activa).toBe(true)
    })
  })

  // other tests omitted for brevity in disabled copy
})
