// app file for testing purposes only
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { globalErrorHandler } = require('./middleware/errorHandler');

// Import all routers
const authRouter = require('./routes/authRoutes');
const patientRouter = require('./routes/patientRoutes');
const medicalCentreRouter = require('./routes/medicalCentreRoutes');
const specialtyRouter = require('./routes/specialtyRoutes');
const doctorRouter = require('./routes/doctorRoutes');
const doctorCentreRouter = require('./routes/doctorCentreRoutes');
const availabilityRouter = require('./routes/availabilityRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const doctorAvailabilityRouter = require('./routes/doctorAvailabilityRoutes');

const app = express();

// Security middleware
app.use(helmet());

// Middleware, allow JSON body data request
app.use(express.json({ limit: '100kb' }));

// Configure CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Book A Doc API!',
  });
});

// Router handlers
app.use('/auth', authRouter);
app.use('/patients', patientRouter);
app.use('/medicalCentres', medicalCentreRouter);
app.use('/specialties', specialtyRouter);
app.use('/doctors', doctorRouter);
app.use('/doctorCentres', doctorCentreRouter);
app.use('/availabilities', availabilityRouter);
app.use('/bookings', bookingRouter);
app.use('/doctorAvailabilities', doctorAvailabilityRouter);

// Health check endpoint for AWS ECS and CI/CD
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Method Not Allowed handler - catches unsupported HTTP methods
app.use((req, res, next) => {
  const allowedMethods = {
    '/patients': ['GET', 'POST'],
    '/doctors': ['GET', 'POST'],
    '/specialties': ['GET', 'POST'],
    '/bookings': ['GET', 'POST'],
    '/medicalCentres': ['GET', 'POST'],
    '/availabilities': ['GET', 'POST'],
    '/doctorCentres': ['GET', 'POST'],
    '/doctorAvailabilities': ['GET', 'POST'],
    '/auth': ['GET', 'POST'],
  };

  const basePath = req.path.split('/')[1] ? `/${req.path.split('/')[1]}` : req.path;
  const pathKey = Object.keys(allowedMethods).find((path) => basePath.startsWith(path));

  if (pathKey) {
    const allowed = allowedMethods[pathKey];
    if (!allowed.includes(req.method)) {
      return res.status(405).json({
        status: 'error',
        message: `Method ${req.method} not allowed`,
        allowedMethods: allowed,
      });
    }
  }

  next();
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Page not found.',
    path: req.path,
  });
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
