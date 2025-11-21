const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Middlewares
app.use(helmet());

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Language Consultancy API v1.0',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      auth: '/api/auth',
      dashboard: '/api/dashboard',
      auditoria: '/api/auditoria',
      students: '/api/students',
      teachers: '/api/teachers',
      languages: '/api/languages',
      cursos: '/api/cursos',
      clases: '/api/clases',
      uploads: '/api/uploads',
      cobros: '/api/cobros',
      facturas: '/api/facturas',
      perfiles: '/api/perfiles',
      reportesAcademicos: '/api/reportes-academicos',
      reportesFinancieros: '/api/reportes-financieros',
      test: '/api/auth/test'
    }
  });
});

// Debug endpoint
app.get('/debug/counts', async (req, res) => {
  try {
    const { BaseUser } = require('./models');
    const students = await BaseUser.countDocuments({ role: 'estudiante' });
    const teachers = await BaseUser.countDocuments({ role: 'profesor' });
    res.json({
      success: true,
      data: { students, teachers }
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Routes principales (solo las necesarias para tests)
const authRoutes = require('./routes/authNew');
app.use('/api/auth', authRoutes);

const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);

// Cargar otras rutas solo si existen y son válidas
try {
  const auditoriaRoutes = require('./routes/auditoria');
  app.use('/api/auditoria', auditoriaRoutes);
} catch (e) { console.log('Auditoria routes not loaded'); }

try {
  const cursosRoutes = require('./routes/cursos');
  app.use('/api/cursos', cursosRoutes);
} catch (e) { console.log('Cursos routes not loaded'); }

try {
  const clasesRoutes = require('./routes/clases');
  app.use('/api/clases', clasesRoutes);
} catch (e) { console.log('Clases routes not loaded'); }

try {
  const languageRoutes = require('./routes/languages');
  app.use('/api/languages', languageRoutes);
} catch (e) { console.log('Languages routes not loaded'); }

// Error handler
try {
  const { errorHandler } = require('./shared/middleware');
  app.use(errorHandler);
} catch (e) {
  // Error handler básico si no existe
  app.use((error, req, res, next) => {
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  });
}

module.exports = app;