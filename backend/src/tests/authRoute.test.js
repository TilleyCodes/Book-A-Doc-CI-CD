const request = require('supertest');
const mongoose = require('mongoose');

// Set up environment first
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';

const app = require('../app');

describe('Patient Authentication', () => {
  let testPatient;

  beforeEach(async () => {
    // Wait for database to be ready
    await testUtils.waitForDatabase();

    // Clear any existing test data
    const { collections } = mongoose.connection;
    const collectionKeys = Object.keys(collections);
    for (const key of collectionKeys) {
      await collections[key].deleteMany({});
    }

    // Create dummy patient (registration)
    testPatient = {
      firstName: 'Jeff',
      lastName: 'Test',
      email: 'mynameisjeff@gmail.com',
      dateOfBirth: '1990-01-01T00:00:00.000Z',
      address: { street: '123 Test St', city: 'Testville' },
      phoneNumber: '1234567890',
      password: 'DaBestPasswordEva4Jeff',
    };

    await request(app).post('/patients').send(testPatient);
  });

  // Test Patient login credentials
  test('Should return token with valid patient login', async () => {
    const res = await request(app)
      .post('/patients/login')
      .send({ email: testPatient.email, password: testPatient.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('status', 'success');
  });

  // Test error for invalid patient email
  test('Should return 401 with invalid patient login email', async () => {
    const res = await request(app)
      .post('/patients/login')
      .send({ email: 'manameisjeff@gmail.com', password: testPatient.password });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('status', 'error');
  });

  // Test error for invalid patient password
  test('Should return 401 with invalid patient login password', async () => {
    const res = await request(app)
      .post('/patients/login')
      .send({ email: testPatient.email, password: 'DeBestPasswordEva4Jeff' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('status', 'error');
  });

  // Test route with valid token
  test('Should be able to access route with valid token', async () => {
    // First login to get a token
    const loginRes = await request(app)
      .post('/patients/login')
      .send({ email: testPatient.email, password: testPatient.password });

    const { token } = loginRes.body;

    // Then access a route
    const res = await request(app)
      .get('/patients/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('firstName', testPatient.firstName);
  });

  // Test route error with invalid token
  test('Should return 401 access route with invalid token', async () => {
    const res = await request(app).get('/patients/profile');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('status', 'error');
  });
});
