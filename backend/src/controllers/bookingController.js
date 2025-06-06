const mongoose = require('mongoose');
const Booking = require('../models/booking');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');

// GET ALL data from Booking model db
async function getBookings() {
  const bookings = await Booking.find()
    .populate('patientId', 'firstName lastName')
    .populate('doctorId', 'doctorName')
    .populate('medicalCentreId', 'medicalCentreName')
    .populate('availabilityId', 'date startTime endTime')
    .sort({ createdAt: -1 });
  return bookings;
}

// GET ONE Booking by ID
async function getBooking(id) {
  const booking = await Booking.findById(id)
    .populate('patientId', 'firstName lastName')
    .populate('doctorId', 'doctorName')
    .populate('medicalCentreId', 'medicalCentreName')
    .populate('availabilityId', 'date startTime endTime');

  if (!booking) {
    const error = new Error(`Booking with id ${id} not found`);
    error.status = 404;
    throw error;
  }
  return booking;
}

// CREATE data from Booking model db
async function createBooking(data) {
  const
    {
      patientId, doctorId, date, time, medicalCentreId, availabilityId, status,
    } = data;

  // Validate required fields based on your test
  if (!patientId || !doctorId || !date || !time) {
    const error = new Error('Missing required fields: patientId, doctorId, date, time');
    error.status = 400;
    throw error;
  }

  // Validate ObjectId formats
  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    const error = new Error('Invalid patientId format');
    error.status = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    const error = new Error('Invalid doctorId format');
    error.status = 400;
    throw error;
  }

  // Check if patient exists
  const patient = await Patient.findById(patientId);
  if (!patient) {
    const error = new Error('Patient not found');
    error.status = 400;
    throw error;
  }

  // Check if doctor exists
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    const error = new Error('Doctor not found');
    error.status = 400;
    throw error;
  }

  // Create booking with validated data
  const bookingData = {
    patientId,
    doctorId,
    date,
    time,
    status: status || 'confirmed',
  };

  // Add optional fields if provided
  if (medicalCentreId) bookingData.medicalCentreId = medicalCentreId;
  if (availabilityId) bookingData.availabilityId = availabilityId;

  const newBooking = await Booking.create(bookingData);
  return newBooking;
}

// UPDATE data from Booking model db
async function updateBooking(id, data) {
  const updatedBooking = await Booking.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true },
  );

  if (!updatedBooking) {
    const error = new Error(`Booking with id ${id} not found`);
    error.status = 404;
    throw error;
  }
  return updatedBooking;
}

// DELETE data from Booking model db
async function deleteBooking(id) {
  const deletedBooking = await Booking.findByIdAndDelete(id);
  if (!deletedBooking) {
    const error = new Error(`Booking with id ${id} not found`);
    error.status = 404;
    throw error;
  }
  return deletedBooking;
}

module.exports = {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
};
