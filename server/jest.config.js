module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  // testMatch: ['**/__tests__/**/*.test.js'],
  testMatch: ['**/__tests__/**/*.test.js', '!**/__tests__/disabled/**'],
  collectCoverageFrom: [
    'models/**/*.js',
    'services/**/*.js',
    'controllers/**/*.js',
    '!**/node_modules/**',
    '!**/__tests__/**'
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60
    }
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  testTimeout: 10000
};
