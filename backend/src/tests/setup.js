const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

// Global setup before all tests
beforeAll(async () => {
  // Suppress console output during tests
  const originalLog = console.log;
  const originalError = console.error;
  
  console.log = (...args) => {
    if (!args[0]?.includes?.('MongoMemoryServer')) {
      originalLog.apply(console, args);
    }
  };
  
  console.error = (...args) => {
    if (!args[0]?.includes?.('deprecated') && !args[0]?.includes?.('Warning')) {
      originalError.apply(console, args);
    }
  };
});

// Global cleanup after all tests
afterAll(async () => {
  // Ensure all connections are closed
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  if (mongoServer) {
    await mongoServer.stop();
  }
});

// Clean up after each test
afterEach(async () => {
  // Clear all test data
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test_db';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';

// Global test utilities
global.testUtils = {
  createTestUser: () => ({
    email: 'test@example.com',
    password: 'testPassword123',
    name: 'Test User'
  }),
  
  createTestDoctor: () => ({
    name: 'Dr. Test',
    specialty: 'General Practice',
    email: 'doctor@test.com',
    availability: []
  }),
  
  createTestBooking: () => ({
    patientId: new mongoose.Types.ObjectId(),
    doctorId: new mongoose.Types.ObjectId(),
    date: new Date(),
    time: '10:00',
    status: 'scheduled'
  })
};