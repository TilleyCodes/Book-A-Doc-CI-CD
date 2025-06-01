import { http, HttpResponse } from 'msw';

// Mock data with MongoDB models and API response formats
const specialties = [
  {
    _id: 'S001',
    specialtyName: 'GP Women\'s Health',
    description: "Specialised care in women's health including reproductive health, pregnancy care, and menopause management.",
  },
  {
    _id: 'S002',
    specialtyName: 'GP Men\'s Health',
    description: 'Focused on male-specific health issues including prostate health and testosterone management.',
  },
  {
    _id: 'S003',
    specialtyName: 'GP Skin Checks',
    description: 'Comprehensive skin examinations and early detection of skin cancers.',
  },
  {
    _id: 'S004',
    specialtyName: 'GP Baby & Child Health',
    description: 'Specialised care for infants and children including vaccinations and developmental assessments.',
  },
  {
    _id: 'S005',
    specialtyName: 'GP Mental Health',
    description: 'Support for anxiety, depression, and other mental health concerns.',
  },
];

const doctors = [
  {
    _id: 'D001',
    doctorName: 'Dr. Sarah Johnson',
    specialtyId: {
      _id: 'S001',
      specialtyName: 'GP Women\'s Health',
    },
  },
  {
    _id: 'D002',
    doctorName: 'Dr. Michael Chen',
    specialtyId: {
      _id: 'S002',
      specialtyName: 'GP Men\'s Health',
    },
  },
  {
    _id: 'D003',
    doctorName: 'Dr. Emily Wilson',
    specialtyId: {
      _id: 'S004',
      specialtyName: 'GP Baby & Child Health',
    },
  },
  {
    _id: 'D004',
    doctorName: 'Dr. David Smith',
    specialtyId: {
      _id: 'S003',
      specialtyName: 'GP Skin Checks',
    },
  },
  {
    _id: 'D005',
    doctorName: 'Dr. Jessica Brown',
    specialtyId: {
      _id: 'S005',
      specialtyName: 'GP Mental Health',
    },
  },
];

const medicalCentres = [
  {
    _id: 'MC001',
    medicalCentreName: 'World Square Medical Centre',
    operatingHours: '8am - 6pm',
    address: {
      street: '1 Victoria Road',
      city: 'Melbourne',
    },
    contacts: {
      email: 'worldsquaremc@email.com',
      phone: '+61 39735 8466',
    },
  },
  {
    _id: 'MC002',
    medicalCentreName: 'Coogee Medical Centre',
    operatingHours: '8am - 5pm',
    address: {
      street: '2 Coogee Bay Road',
      city: 'Sydney',
    },
    contacts: {
      email: 'coogeemc@email.com',
      phone: '+61 29671 5382',
    },
  },
  {
    _id: 'MC003',
    medicalCentreName: 'Sunshine Medical Centre',
    operatingHours: '7am - 6pm',
    address: {
      street: '3 Sunny Street',
      city: 'Brisbane',
    },
    contacts: {
      email: 'sunshinemc@email.com',
      phone: '07 8224 6953',
    },
  },
];

// Mock doctor-centre
const doctorCentres = [
  {
    _id: 'DC001',
    doctorId: { _id: 'D001', doctorName: 'Dr. Sarah Johnson' },
    medicalCentreId: { _id: 'MC001', medicalCentreName: 'World Square Medical Centre' },
  },
  {
    _id: 'DC002',
    doctorId: { _id: 'D002', doctorName: 'Dr. Michael Chen' },
    medicalCentreId: { _id: 'MC001', medicalCentreName: 'World Square Medical Centre' },
  },
  {
    _id: 'DC003',
    doctorId: { _id: 'D003', doctorName: 'Dr. Emily Wilson' },
    medicalCentreId: { _id: 'MC002', medicalCentreName: 'Coogee Medical Centre' },
  },
  {
    _id: 'DC004',
    doctorId: { _id: 'D001', doctorName: 'Dr. Sarah Johnson' },
    medicalCentreId: { _id: 'MC002', medicalCentreName: 'Coogee Medical Centre' },
  },
  {
    _id: 'DC005',
    doctorId: { _id: 'D004', doctorName: 'Dr. David Smith' },
    medicalCentreId: { _id: 'MC003', medicalCentreName: 'Sunshine Medical Centre' },
  },
  {
    _id: 'DC006',
    doctorId: { _id: 'D005', doctorName: 'Dr. Jessica Brown' },
    medicalCentreId: { _id: 'MC003', medicalCentreName: 'Sunshine Medical Centre' },
  },
];

// Mock availabilities
const availabilities = [
  {
    _id: 'A001',
    date: '2025-03-20',
    startTime: '09:00',
    endTime: '09:15',
    isBooked: false,
  },
  {
    _id: 'A002',
    date: '2025-03-20',
    startTime: '09:15',
    endTime: '09:30',
    isBooked: false,
  },
  {
    _id: 'A003',
    date: '2025-03-20',
    startTime: '09:30',
    endTime: '09:45',
    isBooked: true,
  },
  {
    _id: 'A004',
    date: '2025-03-21',
    startTime: '10:00',
    endTime: '10:15',
    isBooked: false,
  },
  {
    _id: 'A005',
    date: '2025-03-21',
    startTime: '10:15',
    endTime: '10:30',
    isBooked: false,
  },
];

// Mock doctor availabilities
const doctorAvailabilities = [
  {
    _id: 'DA001',
    doctorId: { _id: 'D001', doctorName: 'Dr. Sarah Johnson' },
    availabilityId: {
      _id: 'A001',
      date: '2025-03-20',
      startTime: '09:00',
      endTime: '09:15',
      isBooked: false,
    },
  },
  {
    _id: 'DA002',
    doctorId: { _id: 'D001', doctorName: 'Dr. Sarah Johnson' },
    availabilityId: {
      _id: 'A002',
      date: '2025-03-20',
      startTime: '09:15',
      endTime: '09:30',
      isBooked: false,
    },
  },
  {
    _id: 'DA003',
    doctorId: { _id: 'D002', doctorName: 'Dr. Michael Chen' },
    availabilityId: {
      _id: 'A004',
      date: '2025-03-21',
      startTime: '10:00',
      endTime: '10:15',
      isBooked: false,
    },
  },
];

// Mock bookings
const bookings = [
  {
    _id: 'B001',
    patientId: {
      _id: 'P001',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
    },
    doctorId: {
      _id: 'D001',
      doctorName: 'Dr. Sarah Johnson',
    },
    medicalCentreId: {
      _id: 'MC001',
      medicalCentreName: 'World Square Medical Centre',
    },
    availabilityId: {
      _id: 'A003',
      date: '2025-03-20',
      startTime: '09:30',
      endTime: '09:45',
    },
    status: 'confirmed',
    createdAt: '2025-03-15T10:30:00.000Z',
  },
];

// Mock patients
const patients = [
  {
    _id: 'P001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'patient@example.com',
    dateOfBirth: '1985-06-15',
    address: {
      street: '123 Patient St',
      city: 'Sydney',
    },
    phoneNumber: '0400123456',
  },
];

// Generate available times for doctors used in doctorRoutes.js endpoint
const getAvailableTimes = () => {
  // Similar to doctorRoutes.js return an array of time strings
  const timeSlots = ['09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45',
    '11:00', '11:15', '11:30', '11:45', '14:00', '14:15', '14:30', '14:45'];

  // Randomly remove some slots to simulate already booked slots
  return timeSlots.filter(() => Math.random() > 0.3);
};

export const handlers = [
  // GET specialties
  http.get('/api/specialties', () => {
    return HttpResponse.json(specialties);
  }),

  // GET doctors - used in useDoctors.jsx
  http.get('/api/doctors', () => {
    // Your doctors are already populated with specialtyId
    return HttpResponse.json(doctors);
  }),

  // GET a specific doctor
  http.get('/api/doctors/:id', ({ params }) => {
    const { id } = params;
    const doctor = doctors.find((d) => d._id === id);

    if (!doctor) {
      return new HttpResponse(
        JSON.stringify({ status: 'error', message: `Doctor with id ${id} not found` }),
        { status: 404 },
      );
    }

    return HttpResponse.json(doctor);
  }),

  // GET doctor availabilities - matching your doctorRoutes.js implementation
  http.get('/api/doctors/:id/availabilities', ({ params, request }) => {
    const { id } = params;
    const url = new URL(request.url);
    const date = url.searchParams.get('date');

    if (!date) {
      return new HttpResponse(
        JSON.stringify({
          status: 'error',
          message: 'Date parameter is required',
        }),
        { status: 400 },
      );
    }

    const availableTimes = getAvailableTimes(id, date);
    return HttpResponse.json(availableTimes);
  }),

  // GET medical centres - used in useMedicalCentres.jsx
  http.get('/api/medicalCentres', () => {
    return HttpResponse.json(medicalCentres);
  }),

  // GET a specific medical centre
  http.get('/api/medicalCentres/:id', ({ params }) => {
    const { id } = params;
    const centre = medicalCentres.find((c) => c._id === id);

    if (!centre) {
      return new HttpResponse(
        JSON.stringify({ status: 'error', message: 'Medical centre not found' }),
        { status: 404 },
      );
    }

    return HttpResponse.json(centre);
  }),

  // GET doctor-centre relationships - used in DoctorList.jsx and Doctors.jsx
  http.get('/api/doctorCentres', () => {
    return HttpResponse.json(doctorCentres);
  }),

  // GET doctor availabilities
  http.get('/api/doctorAvailabilities', () => {
    return HttpResponse.json(doctorAvailabilities);
  }),

  // POST create availability - used in DoctorAvailabilities.jsx
  http.post('/api/availabilities', async ({ request }) => {
    const availabilityData = await request.json();
    const availabilityId = `A${(availabilities.length + 1).toString().padStart(3, '0')}`;

    const newAvailability = {
      _id: availabilityId,
      ...availabilityData,
      isBooked: false,
    };

    return HttpResponse.json(newAvailability, { status: 201 });
  }),

  // POST create a booking - used in DoctorAvailabilities.jsx
  http.post('/api/bookings', async ({ request }) => {
    const bookingData = await request.json();
    const bookingId = `B${(bookings.length + 1).toString().padStart(3, '0')}`;

    // simulate the populated response
    const doctor = doctors.find((d) => d._id === bookingData.doctorId);
    const medicalCentre = medicalCentres.find((mc) => mc._id === bookingData.medicalCentreId);
    const availability = availabilities.find((a) => a._id === bookingData.availabilityId);
    const patient = { _id: bookingData.patientId };

    const newBooking = {
      _id: bookingId,
      patientId: patient,
      doctorId: doctor,
      medicalCentreId: medicalCentre,
      availabilityId: availability,
      status: bookingData.status || 'confirmed',
      createdAt: new Date().toISOString(),
    };

    return HttpResponse.json(newBooking, { status: 201 });
  }),

  // GET bookings - used in Appointments.jsx
  http.get('/api/bookings', ({ request }) => {
    const url = new URL(request.url);
    const patientId = url.searchParams.get('patientId');
    const doctorId = url.searchParams.get('doctorId');

    let filteredBookings = [...bookings];

    if (patientId) {
      filteredBookings = filteredBookings.filter((b) =>
        b.patientId._id === patientId,
      );
    }

    if (doctorId) {
      filteredBookings = filteredBookings.filter((b) =>
        b.doctorId._id === doctorId,
      );
    }

    return HttpResponse.json(filteredBookings);
  }),

  // PATCH update booking status (used for cancellation) - used in Appointments.jsx
  http.patch('/api/bookings/:id', async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json();
    const bookingIndex = bookings.findIndex((b) => b._id === id);

    if (bookingIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ status: 'error', message: `Booking with id ${id} not found` }),
        { status: 404 },
      );
    }

    // Create updated booking object
    const updatedBooking = {
      ...bookings[bookingIndex],
      ...updates,
    };

    return HttpResponse.json(updatedBooking);
  }),

  // POST login - from PatientController.loginPatient
  http.post('/api/patients/login', async ({ request }) => {
    const { email, password } = await request.json();

    // Simple mock authentication
    if (email === 'patient@example.com' && password === 'password') {
      const patient = patients.find((p) => p.email === email);

      return HttpResponse.json({
        status: 'success',
        token: 'mock-jwt-token',
        patient: {
          _id: patient._id,
          firstName: patient.firstName,
          lastName: patient.lastName,
          email: patient.email,
        },
      });
    }

    return new HttpResponse(
      JSON.stringify({
        status: 'error',
        message: 'Invalid email or password',
      }),
      { status: 401 },
    );
  }),

  // POST login legacy endpoint - for older components that use /api/login
  http.post('/api/login', async ({ request }) => {
    const { email, password } = await request.json();

    // Simple mock authentication
    if (email === 'patient@example.com' && password === 'password') {
      const patient = patients.find((p) => p.email === email);

      return HttpResponse.json({
        token: 'mock-jwt-token',
        patient: {
          _id: patient._id,
          firstName: patient.firstName,
          lastName: patient.lastName,
          email: patient.email,
        },
      });
    }

    return new HttpResponse(
      JSON.stringify({ message: 'Invalid email or password' }),
      { status: 401 },
    );
  }),

  // POST register (create patient) - used in SignUpForm.jsx
  http.post('/api/patients', async ({ request }) => {
    const userData = await request.json();

    // Check if email already exists
    if (userData.email === 'existing@example.com') {
      return new HttpResponse(
        JSON.stringify({
          status: 'error',
          message: 'Email already exists',
        }),
        { status: 400 },
      );
    }

    const patientId = `P${(patients.length + 1).toString().padStart(3, '0')}`;

    // The response follows your patientController.createPatient format
    return HttpResponse.json({
      token: 'mock-jwt-token',
      newPatient: {
        _id: patientId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      },
    }, { status: 201 });
  }),
];
