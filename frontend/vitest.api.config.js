import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'api-integration',
    globals: true,
    environment: 'node',
    include: ['src/tests/api.integration.test.js'],
    exclude: ['**/*.cy.js', '**/*.e2e.js'],
    timeout: 30000,
    testTimeout: 30000,
    hookTimeout: 30000,
    teardownTimeout: 30000,
    reporters: ['verbose'],
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
});
