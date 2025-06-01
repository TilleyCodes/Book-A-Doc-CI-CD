export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://book-a-doc-back-end-web-application.onrender.com';

export const endpoints = {
  doctors: `${API_BASE_URL}/doctors`,
  doctorCentres: `${API_BASE_URL}/doctorCentres`,
  medicalCentres: `${API_BASE_URL}/medicalCentres`,
  bookings: `${API_BASE_URL}/bookings`,
  login: `${API_BASE_URL}/patients/login`,
  patients: `${API_BASE_URL}/patients`,
  availabilities: (doctorId, date, medicalCentreId) =>
    `${API_BASE_URL}/doctors/${doctorId}/availabilities?date=${date}&medicalCentreId=${medicalCentreId}`,
};

// helper functions for endpoints with parameter
export const getBookingById = (id) => `${API_BASE_URL}/bookings/${id}`;
export const getPatientById = (id) => `${API_BASE_URL}/patients/${id}`;
export const deleteBookingById = (id) => `${endpoints.bookings}/${id}`;
export const cancelBookingById = (id) => `${endpoints.bookings}/${id}`;
