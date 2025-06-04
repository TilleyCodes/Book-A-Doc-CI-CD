import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API calls to backend during development
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setupTests.js'],

    // Basic test coverage setup
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'src/setupTests.js',
        'src/main.jsx',
        '**/*.config.js',
      ],
      // Basic coverage thresholds - trying to get good test coverage
      thresholds: {
        branches: 60,
        functions: 60,
        lines: 60,
        statements: 60,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
