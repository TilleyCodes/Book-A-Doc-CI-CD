import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    screenshot: false,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    setupNodeEvents(on, config) {
      on('task', {
        'db:seed': () => {
          // Seed test database if needed
          console.log('Seeding test database...');
          return null;
        },
        'db:clear': () => {
          // Clear test database if needed
          console.log('Clearing test database...');
          return null;
        },
      });
    },
  },
});
