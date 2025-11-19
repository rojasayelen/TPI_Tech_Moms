module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'services/**/*.js',
    'controllers/**/*.js',
    'models/**/*.js',
    '!**/node_modules/**',
    '!**/__tests__/**',
    'models/PerfilEstudiante.js',
    'models/ReporteAcademico.js',
    'models/ReporteFinanciero.js',
    'services/perfilesService.js',
    'services/reportesAcademicosService.js',
    'services/reportesFinancierosService.js',
    'controllers/perfilesController.js',
    'controllers/reportesAcademicosController.js',
    'controllers/reportesFinancierosController.js'
  ],
  // coverageThreshold: {
  //   global: {
  //     branches: 1,
  //     functions: 1,
  //     lines: 3,
  //     statements: 3
  //   }
  // },
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  testTimeout: 10000
};
