const mongoose = require('mongoose');
require('../models/patient');
require('../models/doctor');
require('../models/medicalCentre');
require('../models/availability');
const Booking = require('../models/booking');

async function fetchBookings() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/book_a_doc_db');

    const bookings = await Booking.find({})
      .populate('patientId', 'firstName lastName')
      .populate('doctorId', 'doctorName')
      .populate('medicalCentreId', 'medicalCentreName')
      .populate('availabilityId', 'date startTime endTime isBooked');
    console.log('Current Bookings:', bookings);

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error fetching bookings:', error);
  }
}

fetchBookings();
