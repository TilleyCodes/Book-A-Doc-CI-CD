/* eslint-disable no-unused-vars */
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

// Simplified validation for your tests
const validateBookingData = (req, res, next) => {
  const {
    patientId, doctorId, date, time,
  } = req.body;
  const errors = [];

  if (!patientId) {
    errors.push('Patient ID is required');
  }
  if (!doctorId) {
    errors.push('Doctor ID is required');
  }
  if (!date) {
    errors.push('Date is required');
  }
  if (!time) {
    errors.push('Time is required');
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

// GET ONE | http://localhost:3000/bookings/id
bookingRouter.get('/:id', auth, errorHandler(async (req, res) => {
  const booking = await getBooking(req.params.id);
  res.status(200).json(booking);
}));

// CREATE | http://localhost:3000/bookings
bookingRouter.post('/', auth, validateBookingData, errorHandler(async (req, res) => {
  const newBooking = await createBooking(req.body);
  res.status(201).json(newBooking);
}));

// UPDATE | http://localhost:3000/bookings/id
bookingRouter.patch('/:id', auth, errorHandler(async (req, res) => {
  const updatedBooking = await updateBooking(req.params.id, req.body);
  res.status(200).json(updatedBooking);
}));

// DELETE | http://localhost:3000/bookings/id
bookingRouter.delete('/:id', auth, errorHandler(async (req, res) => {
  const deletedBooking = await deleteBooking(req.params.id);
  res.status(200).json(deletedBooking);
}));

module.exports = bookingRouter;
