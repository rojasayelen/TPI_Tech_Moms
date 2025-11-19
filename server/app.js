const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const createApp = () => {
  const app = express();

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

  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Language Consultancy API v1.0',
      version: '1.0.0',
      status: 'active'
    });
  });

  const authRoutes = require('./routes/authNew');
  app.use('/api/auth', authRoutes);

  const studentRoutes = require('./routes/studentRoutes');
  const teacherRoutes = require('./routes/teacherRoutes');
  app.use('/api/students', studentRoutes);
  app.use('/api/teachers', teacherRoutes);

  const auditoriaRoutes = require('./routes/auditoria');
  app.use('/api/auditoria', auditoriaRoutes);

  const cursosRoutes = require('./routes/cursos');
  const clasesRoutes = require('./routes/clases');
  const uploadsRoutes = require('./routes/uploads');
  app.use('/api/cursos', cursosRoutes);
  app.use('/api/clases', clasesRoutes);
  app.use('/api/uploads', uploadsRoutes);

  const languageRoutes = require('./routes/languages');
  app.use('/api/languages', languageRoutes);

  const cobrosRoutes = require('./routes/cobros.routes');
  const facturasRoutes = require('./routes/facturas.routes');
  const conceptCategoryRoutes = require('./routes/conceptCategory.routes');
  const conceptosCobrosRoutes = require('./routes/conceptosCobros.routes');
  app.use('/api/cobros', cobrosRoutes);
  app.use('/api/facturas', facturasRoutes);
  app.use('/api/concept-categories', conceptCategoryRoutes);
  app.use('/api/conceptos-cobros', conceptosCobrosRoutes);

  const perfilesRoutes = require('./routes/perfiles');
  const reportesAcademicosRoutes = require('./routes/reportes-academicos');
  const reportesFinancierosRoutes = require('./routes/reportes-financieros');
  app.use('/api/perfiles', perfilesRoutes);
  app.use('/api/reportes-academicos', reportesAcademicosRoutes);
  app.use('/api/reportes-financieros', reportesFinancierosRoutes);

  app.get('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `Ruta ${req.originalUrl} no encontrada`
    });
  });

  const { errorHandler } = require('./shared/middleware');
  app.use(errorHandler);

  return app;
};

module.exports = createApp;