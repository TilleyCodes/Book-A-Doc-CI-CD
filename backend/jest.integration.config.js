module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
  testMatch: ['**/tests/**/*.integration.test.js'],
  testTimeout: 60000,
  detectOpenHandles: true,
  forceExit: true,
  verbose: true,
  maxWorkers: 1,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/tests/**',
    '!src/utils/**',
    '!src/index.js',
  ],
  coverageDirectory: 'coverage/integration',
  coverageReporters: ['text', 'lcov', 'html'],
  // Clear mocks between tests
  clearMocks: true,
  // Reset modules between tests
  resetModules: true,
};
