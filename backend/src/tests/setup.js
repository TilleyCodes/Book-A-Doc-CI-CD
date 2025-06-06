// src/tests/setup.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

// Setup before all tests
beforeAll(async () => {
  // Set longer timeout for tests
  jest.setTimeout(60000);

  // Quiet the console during tests - be more aggressive about silencing
  const originalLog = console.log;
  const originalError = console.error;

  console.log = (...args) => {
    // Only allow critical logs, suppress most noise
    if (args[0] && (args[0].includes('CRITICAL') || args[0].includes('FATAL'))) {
      originalLog.apply(console, args);
    }
  };

  console.error = (...args) => {
    // Allow specific errors but silence expected test errors
    if (!args[0] || (
      !args[0].includes('deprecated')
      && !args[0].includes('Warning')
      && !args[0].includes('buffering timed out')
      && !args[0].includes('PayloadTooLargeError')
      && !args[0].includes('Unexpected token')
      && !args[0].includes('CastError')
      && !args[0].includes('Invalid email or password')
      && !args[0].includes('not found')
      && !args[0].includes('Password hashed')
    )) {
      originalError.apply(console, args);
    }
  };

  try {
    // Only setup if not already connected
    if (mongoose.connection.readyState === 0) {
      // Create test database
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();

      // Set environment variable for other files
      process.env.MONGODB_URI = mongoUri;

      // Connect to test database
      await mongoose.connect(mongoUri);
    }

  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
});

// Cleanup after all tests
afterAll(async () => {
  try {
    // Close connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error('Database cleanup failed:', error);
  }
});

// Clean up after each test
afterEach(async () => {
  try {
    // Clear test data
    if (mongoose.connection.readyState === 1) {
      const { collections } = mongoose.connection;
      const promises = Object.keys(collections).map(async (key) => {
        return collections[key].deleteMany({});
      });
      await Promise.all(promises);
    }
  } catch (error) {
    // Just warn, don't fail the test - but silence this too
    // console.warn('Test cleanup warning:', error.message);
  }
});

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only-super-secure-long-key';

// Simple test helpers
global.testUtils = {
  createTestUser: () => ({
    email: 'test@example.com',
    password: 'testPassword123',
    name: 'Test User',
  }),

  createTestDoctor: () => ({
    name: 'Dr. Test',
    specialty: 'General Practice',
    email: 'doctor@test.com',
    availability: [],
  }),

  createTestBooking: () => ({
    patientId: new mongoose.Types.ObjectId(),
    doctorId: new mongoose.Types.ObjectId(),
    date: new Date(),
    time: '10:00',
    status: 'scheduled',
  }),

  // Wait for database to be ready
  waitForDatabase: async () => {
    const maxAttempts = 30;
    let attempts = 0;

    while (attempts < maxAttempts) {
      if (mongoose.connection.readyState === 1) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts += 1;
    }
    throw new Error('Database connection timeout');
  },
};
