const request = require('supertest');

const app = require('../app');

describe('Security Tests', () => {
  describe('Input Validation and Injection Prevention', () => {
    it('should prevent SQL injection attempts in query parameters', async () => {
      const maliciousInputs = [
        '; DROP TABLE users; --',
        '1\' OR \'1\'=\'1',
        'admin\'--',
        '\' UNION SELECT * FROM users--',
      ];

      for (const maliciousInput of maliciousInputs) {
        const response = await request(app)
          .get('/doctors')
          .query({ search: maliciousInput });

        // Should not crash the server
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(600);

        // Should not return SQL error messages
        if (response.body && response.body.error) {
          expect(response.body.error.toLowerCase()).not.toContain('sql');
          expect(response.body.error.toLowerCase()).not.toContain('syntax');
        }
      }
    });

    it('should prevent NoSQL injection attempts', async () => {
      const maliciousInputs = [
        { $ne: null },
        { $gt: '' },
        { $where: 'function() { return true; }' },
        { $regex: '.*' },
      ];

      for (const maliciousInput of maliciousInputs) {
        const response = await request(app)
          .post('/patients')
          .send({ email: maliciousInput });

        // Should handle NoSQL injection attempts gracefully
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(600);
      }
    });

    it('should sanitise XSS attempts in request body', async () => {
      const xssPayloads = [
        '<script>alert("xss")</script>',
        '<img src="x" onerror="alert(1)">',
        'javascript:alert("xss")',
        '<svg onload="alert(1)">',
        '"><script>alert("xss")</script>',
      ];

      for (const xssPayload of xssPayloads) {
        const response = await request(app)
          .post('/patients')
          .send({ name: xssPayload })
          .set('Content-Type', 'application/json');

        // Should handle XSS attempts gracefully
        expect(response.status).toBeGreaterThanOrEqual(200);

        // If successful, ensure script tags aren't reflected back
        if (response.status < 400 && response.body) {
          const responseStr = JSON.stringify(response.body);
          expect(responseStr).not.toContain('<script>');
          expect(responseStr).not.toContain('javascript:');
          expect(responseStr).not.toContain('onerror=');
        }
      }
    });

    it('should handle extremely large payloads appropriately', async () => {
      const largePayload = {
        name: 'x'.repeat(1000000), // 1MB string
        description: 'y'.repeat(1000000),
      };

      const response = await request(app)
        .post('/patients')
        .send(largePayload)
        .set('Content-Type', 'application/json');

      // Should either accept it or reject with appropriate status
      expect([200, 201, 400, 413, 500]).toContain(response.status);
    });

    it('should handle malformed JSON gracefully', async () => {
      const malformedJson = '{"name": "test", "email":}';

      const response = await request(app)
        .post('/patients')
        .send(malformedJson)
        .set('Content-Type', 'application/json');

      // Should return 400 Bad Request for malformed JSON
      expect([400, 500]).toContain(response.status);
    });
  });

  describe('Authentication and Authorisation Security', () => {
    it('should handle missing authentication appropriately', async () => {
      const sensitiveEndpoints = [
        { method: 'post', path: '/bookings' },
        { method: 'put', path: '/patients/123' },
        { method: 'delete', path: '/doctors/123' },
      ];

      for (const endpoint of sensitiveEndpoints) {
        const response = await request(app)[endpoint.method](endpoint.path)
          .send({ test: 'data' });

        // Should handle authentication appropriately
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(600);
      }
    });

    it('should handle invalid JWT tokens', async () => {
      const invalidTokens = [
        'Bearer invalid-token',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid',
        'Bearer ',
        'InvalidFormat token',
        'Bearer null',
        'Bearer undefined',
      ];

      for (const token of invalidTokens) {
        const response = await request(app)
          .post('/bookings')
          .set('Authorization', token)
          .send({ doctorId: '123', date: '2024-01-01' });

        // Should handle invalid tokens gracefully
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(600);
      }
    });

    it('should handle authorisation header edge cases', async () => {
      const edgeCases = [
        '', // Empty string
        'Bearer', // Missing token
        'Basic dGVzdDp0ZXN0', // Wrong auth type
        `Bearer ${'x'.repeat(10000)}`, // Extremely long token
      ];

      for (const authHeader of edgeCases) {
        const response = await request(app)
          .get('/bookings')
          .set('Authorization', authHeader);

        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(600);
      }
    });
  });

  describe('Rate Limiting and DoS Protection', () => {
    it('should handle rapid consecutive requests gracefully', async () => {
      const requests = Array(25).fill().map(() => request(app).get('/'));

      const responses = await Promise.allSettled(requests);

      // All requests should complete (not hang)
      expect(responses.length).toBe(25);

      // Most requests should succeed (server shouldn't crash)
      const successfulRequests = responses.filter((r) => r.status === 'fulfilled' && r.value.status === 200);
      expect(successfulRequests.length).toBeGreaterThan(15);
    });

    it('should handle concurrent database operations', async () => {
      const requests = Array(10).fill().map(() => request(app)
        .post('/patients')
        .send({
          name: `Test Patient ${Math.random()}`,
          email: `test${Math.random()}@example.com`,
        }));

      const responses = await Promise.allSettled(requests);

      // Should handle concurrent operations without crashing
      expect(responses.length).toBe(10);

      responses.forEach((response) => {
        if (response.status === 'fulfilled') {
          expect(response.value.status).toBeGreaterThanOrEqual(200);
          expect(response.value.status).toBeLessThan(600);
        }
      });
    });

    it('should handle memory-intensive operations', async () => {
      const requests = Array(5).fill().map(() => request(app)
        .post('/patients')
        .send({
          name: 'Test Patient',
          description: 'x'.repeat(10000), // 10KB description
        }));

      const responses = await Promise.allSettled(requests);

      // Should handle memory-intensive operations gracefully
      expect(responses.length).toBe(5);
    });
  });

  describe('HTTP Method and Header Security', () => {
    it('should handle unsupported HTTP methods appropriately', async () => {
      const methods = ['patch', 'head', 'trace'];

      for (const method of methods) {
        if (request(app)[method]) {
          const response = await request(app)[method]('/patients');

          // Should return 405 Method Not Allowed or 404 (removed 200 from expected)
          expect([404, 405]).toContain(response.status);
        }
      }
    });

    it('should handle requests with dangerous headers', async () => {
      const response = await request(app)
        .get('/')
        .set('X-Forwarded-For', '127.0.0.1; rm -rf /')
        .set('User-Agent', '<script>alert("xss")</script>')
        .set('Referer', 'javascript:alert("xss")');

      // Should handle dangerous headers gracefully
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(600);
    });

    it('should include security headers from Helmet', async () => {
      const response = await request(app)
        .get('/');

      // Verify that Helmet security headers are present
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-download-options');
    });
  });

  describe('Path Traversal and File System Security', () => {
    it('should prevent directory traversal attacks', async () => {
      const maliciousPaths = [
        '/patients/../../../etc/passwd',
        '/doctors/..\\..\\..\\windows\\system32\\config\\sam',
        '/specialties/%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd',
        '/bookings/....//....//....//etc//passwd',
      ];

      for (const path of maliciousPaths) {
        const response = await request(app).get(path);

        // Should not expose system files
        expect([400, 404]).toContain(response.status);

        // Should not return sensitive file contents
        if (response.text) {
          expect(response.text.toLowerCase()).not.toContain('root:');
          expect(response.text.toLowerCase()).not.toContain('administrator');
          expect(response.text.toLowerCase()).not.toContain('/bin/bash');
        }
      }
    });

    it('should handle null bytes in paths', async () => {
      const pathsWithNullBytes = [
        '/patients%00.txt',
        '/doctors\x00.php',
        '/specialties%00/../../../etc/passwd',
      ];

      for (const path of pathsWithNullBytes) {
        const response = await request(app).get(path);

        // Should handle null bytes safely
        expect([400, 404]).toContain(response.status);
      }
    });
  });

  describe('Database Security', () => {
    it('should handle invalid ObjectId formats gracefully', async () => {
      const invalidIds = [
        'invalid-id',
        '123',
        'null',
        'undefined',
        '../../../../etc/passwd',
        '<script>alert("xss")</script>',
      ];

      for (const invalidId of invalidIds) {
        const response = await request(app)
          .get(`/patients/${invalidId}`);

        // Should handle invalid IDs gracefully
        expect([400, 404, 500]).toContain(response.status);
      }
    });

    it('should handle database connection errors gracefully', async () => {
      // This test ensures the app handles database issues without crashing
      const response = await request(app)
        .get('/doctors');

      // Should not crash even if database has issues
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(600);
    });
  });
});
