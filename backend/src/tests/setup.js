const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

// Setup before all tests
beforeAll(async () => {
  // Set longer timeout for tests
  jest.setTimeout(60000);

  // Quiet the console during tests
  const originalLog = console.log;
  const originalError = console.error;

  console.log = (...args) => {
    if (!args[0] || !args[0].includes('MongoMemoryServer')) {
      originalLog.apply(console, args);
    }
  };

  console.error = (...args) => {
    if (!args[0] || (!args[0].includes('deprecated') && !args[0].includes('Warning') && !args[0].includes('buffering timed out'))) {
      originalError.apply(console, args);
    }
  };

  try {
    // Close any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Create test database
    mongoServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'testdb',
      },
    });

    const mongoUri = mongoServer.getUri();

    // Connect to test database
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      bufferMaxEntries: 0,
      bufferCommands: false,
    });

    // Wait for connection
    await mongoose.connection.readyState;
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
      const collections = mongoose.connection.collections;
      const promises = Object.keys(collections).map(async (key) => {
        return collections[key].deleteMany({});
      });
      await Promise.all(promises);
    }
  } catch (error) {
    // Just warn, don't fail the test
    console.warn('Test cleanup warning:', error.message);
  }
});

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only-super-secure-long-key';

// Simple test helpers
global.testUtils = {
  createTestUser: () => {
    return {
      email: 'test@example.com',
      password: 'testPassword123',
      name: 'Test User',
    };
  },

  createTestDoctor: () => {
    return {
      name: 'Dr. Test',
      specialty: 'General Practice',
      email: 'doctor@test.com',
      availability: [],
    };
  },

  createTestBooking: () => {
    return {
      patientId: new mongoose.Types.ObjectId(),
      doctorId: new mongoose.Types.ObjectId(),
      date: new Date(),
      time: '10:00',
      status: 'scheduled',
    };
  },

  // Wait for database to be ready
  waitForDatabase: async () => {
    const maxAttempts = 30;
    let attempts = 0;

    while (attempts < maxAttempts) {
      if (mongoose.connection.readyState === 1) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts = attempts + 1;
    }
    throw new Error('Database connection timeout');
  },
};
