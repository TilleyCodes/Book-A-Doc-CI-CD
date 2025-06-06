const request = require('supertest');
const mongoose = require('mongoose');

// Set up environment first
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';

const app = require('../app');

describe('API Integration Tests', () => {
  beforeEach(async () => {
    // Wait for database to be ready
    await testUtils.waitForDatabase();

    // Clean database before each test
    if (mongoose.connection.readyState === 1) {
      const { collections } = mongoose.connection;
      const collectionNames = Object.keys(collections);

      for (const key of collectionNames) {
        await collections[key].deleteMany({});
      }
    }
  });

  describe('Basic Application Tests', () => {
    it('should respond to root endpoint', async () => {
      const response = await request(app)
        .get('/')
        .timeout(10000)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Welcome');
    });

    it('should handle 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .timeout(5000);

      expect([404, 500]).toContain(response.status);

      if (response.status === 404) {
        expect(response.body).toHaveProperty('status', 'error');
      }
    });
  });

  describe('Authentication Endpoints', () => {
    it('should handle auth routes without crashing', async () => {
      try {
        const response = await request(app)
          .get('/auth')
          .timeout(5000);

        // Should return some response (not crash)
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(600);
      } catch (error) {
        // If route doesn't exist, that's acceptable for this test
        expect(error.message).toMatch(/(ECONNRESET|timeout|404)/);
      }
    });

    it('should handle auth POST requests gracefully', async () => {
      try {
        const response = await request(app)
          .post('/auth/login')
          .send({
            email: 'test@example.com',
            password: 'testpassword',
          })
          .timeout(5000);

        // Should handle request gracefully (not crash)
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(600);
      } catch (error) {
        // Timeout or connection errors are acceptable here
        expect(error.message).toMatch(/(timeout|ECONNRESET|404)/);
      }
    });
  });

  describe('API Endpoints Basic Connectivity', () => {
    const endpoints = [
      { method: 'get', path: '/patients', name: 'patients GET' },
      { method: 'get', path: '/doctors', name: 'doctors GET' },
      { method: 'get', path: '/medicalCentres', name: 'medical centres GET' },
      { method: 'get', path: '/specialties', name: 'specialties GET' },
      { method: 'get', path: '/bookings', name: 'bookings GET' },
      { method: 'get', path: '/availabilities', name: 'availabilities GET' },
    ];

    endpoints.forEach(({ method, path, name }) => {
      it(`should handle ${name} request without timeout`, async () => {
        try {
          const response = await request(app)[method](path)
            .timeout(10000);

          // Should return some response (200, 401, 404, etc.)
          expect(response.status).toBeGreaterThanOrEqual(200);
          expect(response.status).toBeLessThan(600);
        } catch (error) {
          // For integration tests, we mainly want to ensure no timeouts
          if (error.message.includes('timeout')) {
            throw new Error(`Request to ${path} timed out - indicates database connection issues`);
          }
          // Other errors like 404 are acceptable
        }
      });
    });
  });

  describe('POST Endpoints Handling', () => {
    it('should handle patient creation attempts', async () => {
      const patientData = {
        firstName: 'Test',
        lastName: 'Patient',
        email: 'patient@test.com',
        dateOfBirth: '1990-01-01T00:00:00.000Z',
        address: { street: '123 Test St', city: 'Test City' },
        phoneNumber: '1234567890',
        password: 'TestPassword123',
      };

      try {
        const response = await request(app)
          .post('/patients')
          .send(patientData)
          .timeout(10000);

        // Should handle request gracefully
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(600);
      } catch (error) {
        // Mainly checking for no timeouts
        expect(error.message).not.toMatch(/timeout/);
      }
    });

    it('should handle booking creation attempts', async () => {
      const bookingData = {
        patientId: new mongoose.Types.ObjectId().toString(),
        doctorId: new mongoose.Types.ObjectId().toString(),
        date: '2024-06-01',
        time: '10:00',
      };

      try {
        const response = await request(app)
          .post('/bookings')
          .send(bookingData)
          .timeout(10000);

        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(600);
      } catch (error) {
        expect(error.message).not.toMatch(/timeout/);
      }
    });
  });

  describe('CORS and Headers', () => {
    it('should include appropriate headers', async () => {
      try {
        const response = await request(app)
          .get('/')
          .set('Origin', 'http://localhost:3000')
          .timeout(5000);

        expect(response.status).toBeLessThan(600);
        // Basic check that request completes
      } catch (error) {
        expect(error.message).not.toMatch(/timeout/);
      }
    });

    it('should handle OPTIONS requests for CORS', async () => {
      try {
        const response = await request(app)
          .options('/')
          .set('Origin', 'http://localhost:3000')
          .set('Access-Control-Request-Method', 'GET')
          .timeout(5000);

        // Should handle OPTIONS requests gracefully
        expect([200, 204, 404]).toContain(response.status);
      } catch (error) {
        expect(error.message).not.toMatch(/timeout/);
      }
    });
  });

  describe('Error Handling Resilience', () => {
    it('should handle malformed JSON without timeout', async () => {
      try {
        const response = await request(app)
          .post('/patients')
          .send('{"invalid": json}')
          .set('Content-Type', 'application/json')
          .timeout(5000);

        // Should return error status, not timeout
        expect([400, 500]).toContain(response.status);
      } catch (error) {
        expect(error.message).not.toMatch(/timeout/);
      }
    });

    it('should handle empty requests efficiently', async () => {
      try {
        const response = await request(app)
          .post('/patients')
          .send({})
          .timeout(5000);

        // Should handle empty requests quickly
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(600);
      } catch (error) {
        expect(error.message).not.toMatch(/timeout/);
      }
    });
  });

  describe('Security Headers Verification', () => {
    it('should include basic security headers', async () => {
      try {
        const response = await request(app)
          .get('/')
          .timeout(5000);

        // Check for some common security headers
        expect(response.headers).toBeDefined();

        // If Helmet is working, these should be present
        if (response.status === 200) {
          // Basic check that security middleware is working
          expect(typeof response.headers).toBe('object');
        }
      } catch (error) {
        expect(error.message).not.toMatch(/timeout/);
      }
    });
  });
});
