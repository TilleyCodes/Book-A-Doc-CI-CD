const request = require('supertest');
const mongoose = require('mongoose');

// Set up environment first
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';

const app = require('../app');

describe('Patient Routes', () => {
  beforeEach(async () => {
    // Wait for database to be ready
    await testUtils.waitForDatabase();

    // Clear any existing test data
    const { collections } = mongoose.connection;
    const collectionKeys = Object.keys(collections);
    for (const key of collectionKeys) {
      await collections[key].deleteMany({});
    }
  });

  // Test create patient
  test('POST /patients should create a new patient', async () => {
    const patientData = {
      firstName: 'Test',
      lastName: 'Patient',
      email: 'test.patient@email.com',
      dateOfBirth: '1990-01-01T00:00:00.000Z',
      address: { street: '8 Test St', city: 'Test Town' },
      phoneNumber: '9878 2233',
      password: 'TestPassword1234',
    };

    const res = await request(app)
      .post('/patients')
      .send(patientData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.newPatient).toHaveProperty('firstName', patientData.firstName);

    // Get the created patient and auth token for verification
    const { newPatient: testPatient } = res.body;

    // Login to get auth token
    const loginRes = await request(app)
      .post('/patients/login')
      .send({ email: patientData.email, password: patientData.password });

    const authToken = loginRes.body.token;

    // Verify we have both the patient and token
    expect(testPatient).toBeDefined();
    expect(authToken).toBeDefined();
  });

  // Test patient login auth
  test('POST /patients/login should authenticate a patient', async () => {
    // First create a patient
    const patientData = {
      firstName: 'Login',
      lastName: 'Test',
      email: 'login.test@email.com',
      dateOfBirth: '1990-01-01T00:00:00.000Z',
      address: { street: '9 Login St', city: 'Login Town' },
      phoneNumber: '9878 2234',
      password: 'LoginPassword1234',
    };

    await request(app).post('/patients').send(patientData);

    const loginData = {
      email: 'login.test@email.com',
      password: 'LoginPassword1234',
    };

    const res = await request(app)
      .post('/patients/login')
      .send(loginData);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('status', 'success');
  });

  // Test login error for invalid patient password
  test('POST /patients/login should return 401 for wrong password', async () => {
    // First create a patient
    const patientData = {
      firstName: 'Wrong',
      lastName: 'Password',
      email: 'wrong.password@email.com',
      dateOfBirth: '1990-01-01T00:00:00.000Z',
      address: { street: '10 Wrong St', city: 'Wrong Town' },
      phoneNumber: '9878 2235',
      password: 'RightPassword1234',
    };

    await request(app).post('/patients').send(patientData);

    const loginData = {
      email: 'wrong.password@email.com',
      password: 'WrongPassword124',
    };

    const res = await request(app)
      .post('/patients/login')
      .send(loginData);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('status', 'error');
  });

  // Test get all Patients
  test('GET /patients should return all patients', async () => {
    // Create a few test patients
    const patients = [
      {
        firstName: 'Patient',
        lastName: 'One',
        email: 'patient1@email.com',
        dateOfBirth: '1990-01-01T00:00:00.000Z',
        address: { street: '11 One St', city: 'One Town' },
        phoneNumber: '9878 2236',
        password: 'Password1234',
      },
      {
        firstName: 'Patient',
        lastName: 'Two',
        email: 'patient2@email.com',
        dateOfBirth: '1985-01-01T00:00:00.000Z',
        address: { street: '12 Two St', city: 'Two Town' },
        phoneNumber: '9878 2237',
        password: 'Password1234',
      },
    ];

    // Create patients using Promise.all instead of for-of loop
    await Promise.all(
      patients.map((patient) => request(app).post('/patients').send(patient)),
    );

    const res = await request(app).get('/patients');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);

    // Validate age requirement must be 18 or over
    res.body.forEach((patient) => {
      const dob = new Date(patient.dateOfBirth);
      const diffMs = Date.now() - dob.getTime();
      const ageDate = new Date(diffMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);

      expect(age).toBeGreaterThanOrEqual(18);
    });
  });

  // Test get a single patient by id
  test('GET /patients/:id should return a specific patient', async () => {
    // Create a patient first
    const patientData = {
      firstName: 'Specific',
      lastName: 'Patient',
      email: 'specific.patient@email.com',
      dateOfBirth: '1990-01-01T00:00:00.000Z',
      address: { street: '13 Specific St', city: 'Specific Town' },
      phoneNumber: '9878 2238',
      password: 'SpecificPassword1234',
    };

    const createRes = await request(app).post('/patients').send(patientData);
    const { newPatient: patient } = createRes.body;

    const res = await request(app).get(`/patients/${patient._id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('firstName', patient.firstName);
  });

  // test get patient profile with successful auth
  test('GET /patients/profile should return patient profile when authenticated', async () => {
    // Create a patient and get token
    const patientData = {
      firstName: 'Profile',
      lastName: 'Patient',
      email: 'profile.patient@email.com',
      dateOfBirth: '1990-01-01T00:00:00.000Z',
      address: { street: '14 Profile St', city: 'Profile Town' },
      phoneNumber: '9878 2239',
      password: 'ProfilePassword1234',
    };

    const createRes = await request(app).post('/patients').send(patientData);
    const loginRes = await request(app)
      .post('/patients/login')
      .send({ email: patientData.email, password: patientData.password });

    const { token } = loginRes.body;
    const { newPatient: patient } = createRes.body;

    const res = await request(app)
      .get('/patients/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('firstName', patient.firstName);
  });

  // Test get patient profile with unsuccessful auth
  test('GET /patients/profile should return 401 when not authenticated', async () => {
    const res = await request(app).get('/patients/profile');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('status', 'error');
  });

  // test update patient
  test('PATCH /patients/:id should update a patient', async () => {
    // Create a patient and get token
    const patientData = {
      firstName: 'Update',
      lastName: 'Patient',
      email: 'update.patient@email.com',
      dateOfBirth: '1990-01-01T00:00:00.000Z',
      address: { street: '15 Update St', city: 'Update Town' },
      phoneNumber: '9878 2240',
      password: 'UpdatePassword1234',
    };

    const createRes = await request(app).post('/patients').send(patientData);
    const loginRes = await request(app)
      .post('/patients/login')
      .send({ email: patientData.email, password: patientData.password });

    const { token } = loginRes.body;
    const { newPatient: patient } = createRes.body;

    const updateData = {
      firstName: 'Updated',
      lastName: 'Patient',
      email: 'update.patient@email.com',
      dateOfBirth: '1990-01-01T00:00:00.000Z',
      address: { street: '5 Up St', city: 'Dated' },
      phoneNumber: '9934 6577',
      password: 'UpdatePassword1234',
    };

    const res = await request(app)
      .patch(`/patients/${patient._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('firstName', updateData.firstName);
  });

  // Test Delete patient
  test('DELETE /patients/:id should delete a patient', async () => {
    // Create a patient and get token
    const patientData = {
      firstName: 'Delete',
      lastName: 'Patient',
      email: 'delete.patient@email.com',
      dateOfBirth: '1990-01-01T00:00:00.000Z',
      address: { street: '16 Delete St', city: 'Delete Town' },
      phoneNumber: '9878 2241',
      password: 'DeletePassword1234',
    };

    const createRes = await request(app).post('/patients').send(patientData);
    const loginRes = await request(app)
      .post('/patients/login')
      .send({ email: patientData.email, password: patientData.password });

    const { token } = loginRes.body;
    const { newPatient: patient } = createRes.body;

    const res = await request(app)
      .delete(`/patients/${patient._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('firstName', 'Delete');

    // Verify it's deleted
    const getRes = await request(app).get(`/patients/${patient._id}`);
    expect(getRes.status).toBe(404);
  });
});
