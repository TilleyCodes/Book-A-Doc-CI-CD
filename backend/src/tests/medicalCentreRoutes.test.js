const request = require('supertest');
const mongoose = require('mongoose');

// Set up environment first
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';

const app = require('../app');

describe('Medical Centre Routes', () => {
  let authToken;
  let testMedicalCentre;

  beforeEach(async () => {
    // Wait for database to be ready
    await testUtils.waitForDatabase();

    // Clear any existing test data
    const { collections } = mongoose.connection;
    const collectionKeys = Object.keys(collections);
    for (const key of collectionKeys) {
      await collections[key].deleteMany({});
    }

    // Create a test patient / admin and get auth token
    const testPatient = {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@email.com',
      dateOfBirth: '1990-01-01T00:00:00.000Z',
      address: { street: '123 Admin St', city: 'Adminville' },
      phoneNumber: '9876 5432',
      password: 'AdminPassword123',
    };

    await request(app).post('/patients').send(testPatient);

    const loginRes = await request(app)
      .post('/patients/login')
      .send({ email: testPatient.email, password: testPatient.password });

    authToken = loginRes.body.token;
  });

  // Test create medical centre
  test('POST /medicalCentres should create a new medical centre', async () => {
    const centreData = {
      medicalCentreName: 'World Square Medical Centre',
      operatingHours: '8am - 6pm',
      address: {
        street: '1 Shelley St',
        city: 'Sydney',
      },
      contacts: {
        email: 'worldsquaremc@email.com',
        phone: '+61 39735 8466',
      },
    };

    const res = await request(app)
      .post('/medicalCentres')
      .set('Authorization', `Bearer ${authToken}`)
      .send(centreData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('medicalCentreName', centreData.medicalCentreName);
    testMedicalCentre = res.body;
  });

  // Test get all Medical Centres
  test('GET ALL /medicalCentres should return all medical centres', async () => {
    // Create a medical centre first
    const centreData = {
      medicalCentreName: 'Test Medical Centre',
      operatingHours: '9am - 5pm',
      address: {
        street: '123 Test St',
        city: 'Test City',
      },
      contacts: {
        email: 'test@email.com',
        phone: '1234567890',
      },
    };

    await request(app)
      .post('/medicalCentres')
      .set('Authorization', `Bearer ${authToken}`)
      .send(centreData);

    const res = await request(app).get('/medicalCentres');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // Test get a single medical centre
  test('GET /medicalCentres/:id should return medical centre by id', async () => {
    // Create a medical centre first
    const centreData = {
      medicalCentreName: 'Specific Medical Centre',
      operatingHours: '8am - 6pm',
      address: {
        street: '456 Specific St',
        city: 'Specific City',
      },
      contacts: {
        email: 'specific@email.com',
        phone: '0987654321',
      },
    };

    const createRes = await request(app)
      .post('/medicalCentres')
      .set('Authorization', `Bearer ${authToken}`)
      .send(centreData);

    testMedicalCentre = createRes.body;

    const res = await request(app).get(`/medicalCentres/${testMedicalCentre._id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('medicalCentreName', testMedicalCentre.medicalCentreName);
  });

  // Test update medical centre
  test('PATCH /medicalCentres/:id should update a specific medical centre', async () => {
    // Create a medical centre first
    const centreData = {
      medicalCentreName: 'Original Medical Centre',
      operatingHours: '8am - 6pm',
      address: {
        street: '123 Original St',
        city: 'Original City',
      },
      contacts: {
        email: 'original@email.com',
        phone: '1111111111',
      },
    };

    const createRes = await request(app)
      .post('/medicalCentres')
      .set('Authorization', `Bearer ${authToken}`)
      .send(centreData);

    testMedicalCentre = createRes.body;

    const updatedData = {
      medicalCentreName: 'Updated Medical Centre',
      operatingHours: '8am - 6pm',
      address: {
        street: '456 Updated St',
        city: 'Updated City',
      },
      contacts: {
        email: 'updated@email.com',
        phone: '0987654321',
      },
    };

    const res = await request(app)
      .patch(`/medicalCentres/${testMedicalCentre._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('medicalCentreName', updatedData.medicalCentreName);
  });

  // Test delete medical centre
  test('DELETE /medicalCentres/:id should delete a specific medical centre', async () => {
    // Create a medical centre first
    const centreData = {
      medicalCentreName: 'Delete Medical Centre',
      operatingHours: '8am - 6pm',
      address: {
        street: '789 Delete St',
        city: 'Delete City',
      },
      contacts: {
        email: 'delete@email.com',
        phone: '2222222222',
      },
    };

    const createRes = await request(app)
      .post('/medicalCentres')
      .set('Authorization', `Bearer ${authToken}`)
      .send(centreData);

    testMedicalCentre = createRes.body;

    const res = await request(app)
      .delete(`/medicalCentres/${testMedicalCentre._id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);

    // Verify it's deleted
    const getRes = await request(app).get(`/medicalCentres/${testMedicalCentre._id}`);
    expect(getRes.status).toBe(404);
  });
});
