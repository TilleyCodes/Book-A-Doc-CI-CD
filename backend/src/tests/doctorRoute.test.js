const request = require('supertest');
const mongoose = require('mongoose');

// Set up environment first
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';

const app = require('../app');

describe('Doctor Routes', () => {
  let authToken;
  let testSpecialty;
  let testDoctor;

  beforeEach(async () => {
    // Wait for database to be ready
    await testUtils.waitForDatabase();

    // Clear any existing test data
    const { collections } = mongoose.connection;
    const collectionKeys = Object.keys(collections);
    for (const key of collectionKeys) {
      await collections[key].deleteMany({});
    }

    // Create a test patient / admin for auth token
    const patientData = {
      firstName: 'Admin',
      lastName: 'Doctor',
      email: 'admin.doctor@email.com',
      dateOfBirth: '1990-01-01T00:00:00.000Z',
      address: { street: '1 Doc St', city: 'Doctown' },
      phoneNumber: '9988 7766',
      password: 'DocPassword123',
    };

    await request(app).post('/patients').send(patientData);

    const loginRes = await request(app)
      .post('/patients/login')
      .send({ email: patientData.email, password: patientData.password });

    authToken = loginRes.body.token;

    // Create a specialty
    const specialtyRes = await request(app)
      .post('/specialties')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        specialtyName: 'Doctor Test Specialty',
        description: 'Description for doctor test specialty',
      });
    testSpecialty = specialtyRes.body;

    // Create a doctor
    const doctorData = {
      doctorName: 'Dr. Initial Test',
      specialtyId: testSpecialty._id,
    };

    const doctorRes = await request(app)
      .post('/doctors')
      .send(doctorData);

    testDoctor = doctorRes.body;
  });

  // Test get all doctors
  test('GET /doctors should return all doctors', async () => {
    const res = await request(app).get('/doctors');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Test get a single doctor by id
  test('GET /doctors/:id should return a specific doctor', async () => {
    const res = await request(app).get(`/doctors/${testDoctor._id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('doctorName', testDoctor.doctorName);
  });

  // Test create doctor
  test('POST /doctors should create a new doctor', async () => {
    const doctorData = {
      doctorName: 'Dr. John Doe',
      specialtyId: testSpecialty._id,
    };

    const res = await request(app)
      .post('/doctors')
      .send(doctorData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('doctorName', doctorData.doctorName);
  });

  // Test update doctor
  test('PATCH /doctors/:id should update a doctor', async () => {
    const updateData = {
      doctorName: 'Dr. Jane Doe',
      specialtyId: testSpecialty._id,
    };

    const res = await request(app)
      .patch(`/doctors/${testDoctor._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('doctorName', updateData.doctorName);
  });

  // test delete doctor
  test('DELETE /doctors/:id should delete a doctor', async () => {
    const res = await request(app)
      .delete(`/doctors/${testDoctor._id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);

    // Verify it's deleted
    const getRes = await request(app).get(`/doctors/${testDoctor._id}`);
    expect(getRes.status).toBe(404);
  });
});
