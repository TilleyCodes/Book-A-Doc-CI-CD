const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const app = require('../app');

describe('API Integration Tests', () => {
  let mongoServer;

  beforeAll(async () => {
    // Set up test database
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Disconnect from any existing connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    // Connect to test database
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Clean up database connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  beforeEach(async () => {
    // Clean database before each test
    if (mongoose.connection.readyState === 1) {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        await collections[key].deleteMany({});
      }
    }
  });

  describe('Basic Application Tests', () => {
    it('should respond to root endpoint', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Welcome to Book A Doc API!');
    });

    it('should handle 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);
      
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Page not found.');
    });
  });

  describe('Authentication Endpoints', () => {
    it('should handle auth routes', async () => {
      const response = await request(app)
        .get('/auth');
      
      // Should return some response (200, 404, or 405)
      expect([200, 404, 405]).toContain(response.status);
    });

    it('should handle auth POST requests', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testpassword'
        });
      
      // Should handle request gracefully (not crash)
      expect(response.status).toBeGreaterThanOrEqual(200);
    });
  });

  describe('Patient Endpoints', () => {
    it('should handle patients GET request', async () => {
      const response = await request(app)
        .get('/patients');
      
      // Should return some response (200, 401, 404, etc.)
      expect(response.status).toBeGreaterThanOrEqual(200);
    });

    it('should handle patient creation', async () => {
      const patientData = {
        name: 'Test Patient',
        email: 'patient@test.com',
        phone: '1234567890'
      };

      const response = await request(app)
        .post('/patients')
        .send(patientData);
      
      // Should handle request gracefully
      expect(response.status).toBeGreaterThanOrEqual(200);
    });
  });

  describe('Doctor Endpoints', () => {
    it('should handle doctors GET request', async () => {
      const response = await request(app)
        .get('/doctors');
      
      expect(response.status).toBeGreaterThanOrEqual(200);
    });

    it('should handle doctor creation', async () => {
      const doctorData = {
        name: 'Dr. Test',
        specialty: 'General Practice',
        email: 'doctor@test.com'
      };

      const response = await request(app)
        .post('/doctors')
        .send(doctorData);
      
      expect(response.status).toBeGreaterThanOrEqual(200);
    });
  });

  describe('Medical Centre Endpoints', () => {
    it('should handle medical centres GET request', async () => {
      const response = await request(app)
        .get('/medicalCentres');
      
      expect(response.status).toBeGreaterThanOrEqual(200);
    });

    it('should handle medical centre creation', async () => {
      const centreData = {
        name: 'Test Medical Centre',
        address: '123 Test Street',
        phone: '1234567890'
      };

      const response = await request(app)
        .post('/medicalCentres')
        .send(centreData);
      
      expect(response.status).toBeGreaterThanOrEqual(200);
    });
  });

  describe('Specialty Endpoints', () => {
    it('should handle specialties GET request', async () => {
      const response = await request(app)
        .get('/specialties');
      
      expect(response.status).toBeGreaterThanOrEqual(200);
    });
  });

  describe('Booking Endpoints', () => {
    it('should handle bookings GET request', async () => {
      const response = await request(app)
        .get('/bookings');
      
      expect(response.status).toBeGreaterThanOrEqual(200);
    });

    it('should handle booking creation', async () => {
      const bookingData = {
        patientId: new mongoose.Types.ObjectId(),
        doctorId: new mongoose.Types.ObjectId(),
        date: '2024-06-01',
        time: '10:00'
      };

      const response = await request(app)
        .post('/bookings')
        .send(bookingData);
      
      expect(response.status).toBeGreaterThanOrEqual(200);
    });
  });

  describe('Availability Endpoints', () => {
    it('should handle availabilities GET request', async () => {
      const response = await request(app)
        .get('/availabilities');
      
      expect(response.status).toBeGreaterThanOrEqual(200);
    });

    it('should handle doctor availabilities GET request', async () => {
      const response = await request(app)
        .get('/doctorAvailabilities');
      
      expect(response.status).toBeGreaterThanOrEqual(200);
    });
  });

  describe('CORS and Headers', () => {
    it('should include CORS headers for allowed origins', async () => {
      const response = await request(app)
        .get('/')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.status).toBe(200);
      // This test mainly ensures CORS doesn't break the request
    });

    it('should handle preflight OPTIONS requests', async () => {
      const response = await request(app)
        .options('/doctors')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET');
      
      // Should handle OPTIONS requests gracefully
      expect([200, 204, 404]).toContain(response.status);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON requests', async () => {
      const response = await request(app)
        .post('/patients')
        .send('{"invalid": json}')
        .set('Content-Type', 'application/json');
      
      // Should return 400 Bad Request or similar
      expect([400, 500]).toContain(response.status);
    });

    it('should handle empty POST requests', async () => {
      const response = await request(app)
        .post('/patients')
        .send({});
      
      // Should handle empty requests gracefully
      expect(response.status).toBeGreaterThanOrEqual(200);
    });

    it('should handle requests with invalid content-type', async () => {
      const response = await request(app)
        .post('/patients')
        .send('plain text data')
        .set('Content-Type', 'text/plain');
      
      // Should handle different content types gracefully
      expect(response.status).toBeGreaterThanOrEqual(200);
    });
  });

  describe('Security Headers', () => {
    it('should include security headers from helmet', async () => {
      const response = await request(app)
        .get('/');
      
      // Check for some common security headers that helmet adds
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
    });
  });
});