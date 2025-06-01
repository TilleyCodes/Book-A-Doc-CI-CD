import { useState, useEffect } from 'react';
import '../styles/doctorList.css';
import stethoscopeIcon from '../assets/stethoscope.png';
import { DoctorAvailabilities } from './DoctorAvailabilities';
import { endpoints } from '../config/api';
import { ErrorMessage } from './ErrorMessage';
import { fetchJson } from '../utils/fetchJson';

export function DoctorList({ medicalCentreId, onClose }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  if (!medicalCentreId) {
    return (
      <div className="doctor-list-modal">
        <ErrorMessage message="No medical centre selected" />
      </div>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);

        // Fetch the doctor-centre relationships using the proxy
        const doctorCentreData = await fetchJson(endpoints.doctorCentres);

        // Filter relationships for selected medical centre
        const relevantDoctorCentres = doctorCentreData.filter(
          (dc) => dc.medicalCentreId && dc.medicalCentreId._id === medicalCentreId,
        );

        // Get all doctor IDs associated with this centre
        const doctorIds = relevantDoctorCentres.flatMap((dc) =>
          (dc.doctorId?._id ? [dc.doctorId._id] : []),
        );

        if (doctorIds.length === 0) {
          setDoctors([]);
          setLoading(false);
          return;
        }

        // Fetch all doctors
        const allDoctors = await fetchJson(endpoints.doctors);

        // Filter doctors based on the IDs
        const centreSpecificDoctors = allDoctors.filter((doctor) =>
          doctor._id && doctorIds.includes(doctor._id),
        );

        setDoctors(centreSpecificDoctors);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (medicalCentreId) {
      fetchDoctors();
    } else {
      setLoading(false);
      setError('No medical centre selected');
    }
  }, [medicalCentreId]);

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBooking(true);
  };

  const handleCloseBooking = () => {
    setShowBooking(false);
  };

  return (
    <div className="doctor-list-modal">
      <div className="doctor-list-content">
        <div className="doctor-list-header">
          <h2>Available Doctors</h2>
          <button
            type="button"
            className="dl-close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {loading && <div className="doctor-list-loading">Loading doctors...</div>}

        {error && <ErrorMessage message={`Error: ${error}`} />}

        {!loading && !error && (
          <div>
            {doctors.length > 0 ? (
              <div className="doctors-container">
                {doctors.map((doctor) => (
                  <div key={doctor._id} className="doctor-card">
                    <div className="doctor-icon">
                      <img src={stethoscopeIcon} alt="Doctor" />
                    </div>
                    <div className="doctor-info">
                      <h3>{doctor.doctorName}</h3>
                      <p className="doctor-specialty">
                        <span className="specialty-label">
                          Specialty:
                        </span>
                        {' '}
                        {doctor.specialtyId?.specialtyName || 'General Practice'}
                      </p>
                      <button
                        type="button"
                        className="book-appointment-btn"
                        onClick={() => handleBookAppointment(doctor)}
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-doctors-message">
                No doctors available at this medical centre.
              </div>
            )}
          </div>
        )}
      </div>

      {showBooking && selectedDoctor && (
        <DoctorAvailabilities
          doctor={selectedDoctor}
          medicalCentreId={medicalCentreId}
          onClose={handleCloseBooking}
        />
      )}
    </div>
  );
}
