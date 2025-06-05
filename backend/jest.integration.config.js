module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
  testMatch: ['**/tests/**/*.integration.test.js'],
  testTimeout: 30000,
  detectOpenHandles: true,
  forceExit: true,
  verbose: true,
};
