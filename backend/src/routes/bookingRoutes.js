const express = require('express');
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
} = require('../controllers/bookingController');
const { errorHandler } = require('../middleware/errorHandler');
const auth = require('../middleware/authMiddleware');

const bookingRouter = express.Router();

// Helper function to safely check if value exists and is a non-empty string
const isValidString = (value) => typeof value === 'string' && value.trim().length > 0;

// Validate booking data middleware
const validateBookingData = (req, res, next) => {
  const {
    patientId,
    doctorId,
    medicalCentreId,
    availabilityId,
    status,
  } = req.body;
  const errors = [];

  if (!isValidString(patientId)) {
    errors.push('Patient ID is required');
  }
  if (!isValidString(doctorId)) {
    errors.push('Doctor ID is required');
  }
  if (!isValidString(medicalCentreId)) {
    errors.push('Medical Centre ID is required');
  }
  if (!isValidString(availabilityId)) {
    errors.push('Availability ID is required');
  }
  if (status && !['completed', 'confirmed', 'cancelled'].includes(status)) {
    errors.push('Status must be one of: completed, confirmed, cancelled');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors,
    });
  }
  return next();
};

// GET ALL | http://localhost:3000/bookings
bookingRouter.get('/', auth, errorHandler(async (req, res) => {
  const bookings = await getBookings();
  res.status(200).json(bookings);
}));

// GET ONE | http://localhost:3000/bookings/bookingId
bookingRouter.get('/:bookingId', auth, errorHandler(async (req, res) => {
  try {
    const booking = await getBooking(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found',
      });
    }
    res.status(200).json(booking);
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid booking ID format',
      });
    }
    throw error;
  }
}));

// CREATE | http://localhost:3000/bookings
bookingRouter.post('/', auth, validateBookingData, errorHandler(async (req, res) => {
  const newBooking = await createBooking(req.body);
  res.status(201).json(newBooking);
}));

// UPDATE | http://localhost:3000/bookings/bookingId
bookingRouter.patch('/:bookingId', auth, errorHandler(async (req, res) => {
  try {
    const updatedBooking = await updateBooking(req.params.bookingId, req.body);
    if (!updatedBooking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found',
      });
    }
    res.status(200).json(updatedBooking);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid booking ID format',
      });
    }
    throw error;
  }
}));

// DELETE | http://localhost:3000/bookings/bookingId
bookingRouter.delete('/:bookingId', auth, errorHandler(async (req, res) => {
  try {
    const deletedBooking = await deleteBooking(req.params.bookingId);
    if (!deletedBooking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found',
      });
    }
    res.status(200).json(deletedBooking);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid booking ID format',
      });
    }
    throw error;
  }
}));

module.exports = bookingRouter;
