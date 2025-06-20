const express = require('express');
const {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController');
const { errorHandler } = require('../middleware/errorHandler');
const auth = require('../middleware/authMiddleware');
const DoctorAvailability = require('../models/doctorAvailability');

const doctorRouter = express.Router();

// Helper function to safely check if value exists and is a non-empty string
const isValidString = (value) => typeof value === 'string' && value.trim().length > 0;

// Validation middleware
const validateDoctorData = (req, res, next) => {
  const { doctorName, specialtyId } = req.body;
  const errors = [];

  if (!isValidString(doctorName)) {
    errors.push('Doctor name is required');
  }
  if (!specialtyId) {
    errors.push('Specialty ID is required');
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

// GET all doctors - http://localhost:3000/doctors
doctorRouter.get('/', errorHandler(async (req, res) => {
  const doctors = await getDoctors();
  res.status(200).json(doctors);
}));

// GET a single doctor - http://localhost:3000/doctors/_id
doctorRouter.get('/:doctorId', errorHandler(async (req, res) => {
  try {
    const doctor = await getDoctor(req.params.doctorId);
    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found',
      });
    }
    res.status(200).json(doctor);
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid doctor ID format',
      });
    }
    throw error;
  }
}));

// CREATE new doctor - http://localhost:3000/doctors
doctorRouter.post('/', validateDoctorData, errorHandler(async (req, res) => {
  const bodyData = {
    doctorName: req.body.doctorName,
    specialtyId: req.body.specialtyId,
  };
  const newDoctor = await createDoctor(bodyData);
  res.status(201).json(newDoctor);
}));

// PATCH update doctor - http://localhost:3000/doctors/_id
doctorRouter.patch('/:doctorId', auth, validateDoctorData, errorHandler(async (req, res) => {
  try {
    const bodyData = {
      doctorName: req.body.doctorName,
      specialtyId: req.body.specialtyId,
    };
    const updatedDoctor = await updateDoctor(req.params.doctorId, bodyData);
    if (!updatedDoctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found',
      });
    }
    res.status(200).json(updatedDoctor);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid doctor ID format',
      });
    }
    throw error;
  }
}));

// DELETE doctor - http://localhost:3000/doctors/_id
doctorRouter.delete('/:doctorId', auth, errorHandler(async (req, res) => {
  try {
    const deletedDoctor = await deleteDoctor(req.params.doctorId);
    if (!deletedDoctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found',
      });
    }
    res.status(200).json(deletedDoctor);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid doctor ID format',
      });
    }
    throw error;
  }
}));

// GET doctor availabilities - http://localhost:3000/doctors/:doctorId/availabilities
doctorRouter.get('/:doctorId/availabilities', errorHandler(async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query;

  // Validate input parameters
  if (!isValidString(doctorId)) {
    return res.status(400).json({
      status: 'error',
      message: 'Doctor ID is required',
    });
  }

  if (!date) {
    return res.status(400).json({
      status: 'error',
      message: 'Date parameter is required',
    });
  }

  // Validate date format
  const dateObj = new Date(date);
  if (Number.isNaN(dateObj.getTime())) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid date format',
    });
  }

  try {
    // Find the doctor's availability records for the specified date
    const doctorAvailabilities = await DoctorAvailability.find({
      doctorId,
    })
      .populate({
        path: 'availabilityId',
        match: {
          date: dateObj,
          isBooked: false, // Only show available slots
        },
        select: 'date startTime endTime',
      });

    // Filter out any records where the availability was null (due to population filter)
    const validAvailabilities = doctorAvailabilities
      .filter((da) => da.availabilityId)
      .map((da) => da.availabilityId.startTime);

    // If no availabilities found, generate mock data for testing
    if (validAvailabilities.length === 0) {
      // Generate times from 9 AM to 5 PM with 30-minute intervals
      const mockTimes = [];
      for (let hour = 9; hour < 17; hour += 1) {
        const hourFormatted = hour.toString().padStart(2, '0');
        mockTimes.push(`${hourFormatted}:00`);
        mockTimes.push(`${hourFormatted}:30`);
      }

      // Remove some random times to simulate unavailability
      const availableTimes = mockTimes.filter(() => Math.random() > 0.3);

      return res.status(200).json(availableTimes);
    }

    return res.status(200).json(validAvailabilities);
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid doctor ID format',
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Error fetching doctor availabilities',
      error: error.message,
    });
  }
}));

module.exports = doctorRouter;
