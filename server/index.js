if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const mongoose = require('mongoose');
const logger = require('./config/logger');
const app = require('./app');

const startServer = async () => {
  try {
    logger.info('Starting server...');
    logger.info('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('MongoDB connected successfully');

    require('./models');

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`API URL: http://localhost:${PORT}`);
      logger.info(`Auth endpoints: http://localhost:${PORT}/api/auth`);
      logger.info(`Dashboard endpoints: http://localhost:${PORT}/api/dashboard`);
      logger.info(`Auditoría endpoints: http://localhost:${PORT}/api/auditoria`);
      logger.info(`Cursos endpoints: http://localhost:${PORT}/api/cursos`);
      logger.info(`Clases endpoints: http://localhost:${PORT}/api/clases`);
      logger.info(`Financial endpoints: http://localhost:${PORT}/api/cobros`);
    });

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// startServer();
if (require.main === module) {
  startServer();
}

module.exports = app;