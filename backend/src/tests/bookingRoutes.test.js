const request = require('supertest');
const mongoose = require('mongoose');

// Set up environment first
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';

const app = require('../app');

describe('Booking Routes', () => {
  let authToken;
  let testPatient;
  let testDoctor;
  let testAvailability;

  beforeEach(async () => {
    // Wait for database to be ready
    await testUtils.waitForDatabase();

    // Clear any existing test data
    const { collections } = mongoose.connection;
    const collectionKeys = Object.keys(collections);
    for (const key of collectionKeys) {
      await collections[key].deleteMany({});
    }

    // Create test patient
    const patientData = {
      firstName: 'Booking',
      lastName: 'Patient',
      email: 'booking@email.com',
      dateOfBirth: '1990-01-01T00:00:00.000Z',
      address: { street: '2 Book St', city: 'Booking City' },
      phoneNumber: '9876 2345',
      password: 'BookingPassword123',
    };

    const patientRes = await request(app).post('/patients').send(patientData);
    testPatient = patientRes.body.newPatient;

    // Login to get auth token
    const loginRes = await request(app)
      .post('/patients/login')
      .send({ email: patientData.email, password: patientData.password });

    authToken = loginRes.body.token;

    // Create a specialty
    const specialtyRes = await request(app)
      .post('/specialties')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        specialtyName: 'Test Specialty',
        description: 'Description for test specialty',
      });

    // Create a doctor
    const doctorRes = await request(app)
      .post('/doctors')
      .send({
        doctorName: 'Dr Test',
        specialtyId: specialtyRes.body._id,
      });
    testDoctor = doctorRes.body;

    // Create an availability
    const availabilityRes = await request(app)
      .post('/availabilities')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        date: '2025-05-01',
        startTime: '09:00',
        endTime: '10:00',
        isBooked: false,
      });
    testAvailability = availabilityRes.body;
  });

  // Test get all bookings
  test('GET /bookings should return all bookings', async () => {
    // Create a booking first
    const bookingData = {
      patientId: testPatient._id,
      doctorId: testDoctor._id,
      availabilityId: testAvailability._id,
      status: 'confirmed',
    };

    await request(app)
      .post('/bookings')
      .set('Authorization', `Bearer ${authToken}`)
      .send(bookingData);

    const res = await request(app)
      .get('/bookings')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Test get a single booking by id
  test('GET /bookings/:id should return a specific booking', async () => {
    // Create a booking first
    const bookingData = {
      patientId: testPatient._id,
      doctorId: testDoctor._id,
      availabilityId: testAvailability._id,
      status: 'confirmed',
    };

    const bookingRes = await request(app)
      .post('/bookings')
      .set('Authorization', `Bearer ${authToken}`)
      .send(bookingData);

    const testBooking = bookingRes.body;

    const res = await request(app)
      .get(`/bookings/${testBooking._id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', testBooking._id);
  });

  // test create new booking
  test('POST /bookings should create a new booking', async () => {
    const bookingData = {
      patientId: testPatient._id,
      doctorId: testDoctor._id,
      availabilityId: testAvailability._id,
      status: 'confirmed',
    };

    const res = await request(app)
      .post('/bookings')
      .set('Authorization', `Bearer ${authToken}`)
      .send(bookingData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('status', 'confirmed');
  });

  // test update booking by id
  test('PATCH /bookings/:id should update a booking', async () => {
    // Create a booking first
    const bookingData = {
      patientId: testPatient._id,
      doctorId: testDoctor._id,
      availabilityId: testAvailability._id,
      status: 'confirmed',
    };

    const bookingRes = await request(app)
      .post('/bookings')
      .set('Authorization', `Bearer ${authToken}`)
      .send(bookingData);

    const testBooking = bookingRes.body;

    const updateData = {
      status: 'cancelled',
      patientId: testPatient._id,
      doctorId: testDoctor._id,
      availabilityId: testAvailability._id,
    };

    const res = await request(app)
      .patch(`/bookings/${testBooking._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'cancelled');
  });

  // Test delete booking
  test('DELETE /bookings/:id should delete a booking', async () => {
    // Create a booking first
    const bookingData = {
      patientId: testPatient._id,
      doctorId: testDoctor._id,
      availabilityId: testAvailability._id,
      status: 'confirmed',
    };

    const bookingRes = await request(app)
      .post('/bookings')
      .set('Authorization', `Bearer ${authToken}`)
      .send(bookingData);

    const testBooking = bookingRes.body;

    const res = await request(app)
      .delete(`/bookings/${testBooking._id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);

    // Verify it's deleted
    const getRes = await request(app)
      .get(`/bookings/${testBooking._id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(getRes.status).toBe(404);
  });
});
