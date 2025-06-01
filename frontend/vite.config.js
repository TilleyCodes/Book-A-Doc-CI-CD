import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['msw']
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
    environmentOptions: {
      jsdom: {
        globals: true,
      },
    },
    testTimeout: 15000,
    // Added these for debugging
    reporters: ['default'],
    coverage: {
      reporter: ['text', 'html'],
    }
  },
})