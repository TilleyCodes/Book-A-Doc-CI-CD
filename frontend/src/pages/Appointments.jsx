import React, { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useUserJwtContext } from '../hooks/useUserJwtData';
import { FormatDate } from '../utils/FormatDate';
import { FormatTime } from '../utils/FormatTime';
import calendar from '../assets/calendar.png';
import '../styles/appointments.css';
import { PatientConfirmation } from '../components/PatientConfirmation';
import { endpoints, cancelBookingById } from '../config/api';
import { ErrorMessage } from '../components/ErrorMessage';

export function Appointments() {
  const { userJwtData } = useUserJwtContext();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hiddenStatus = ['cancelled', 'completed'];
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    if (!userJwtData?.patientId) {
      setTimeout(() => setLoading(false), 1500);
      return;
    }

    async function fetchAppointments() {
      try {
        const response = await fetch(endpoints.bookings, {
          headers: {
            Authorization: `Bearer ${userJwtData.token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch appointments');
        }

        const filteredData = data.filter(
          (booking) => booking.patientId._id === userJwtData.patientId,
        );
        setAppointments(filteredData);
      } catch (err) {
        setError(`Error fetching appointments: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, [userJwtData?.patientId, userJwtData.token]);

  function confirmCancellation(appointment) {
    if (!appointment || !appointment._id) {
      setError('Error: Appointment ID is undefined');
      return;
    }
    setSelectedAppointment(appointment);
    setShowConfirmation(true);
  }

  async function cancelBooking(appointment) {
    if (!appointment || !appointment._id) {
      setError('Error: Appointment ID is undefined');
      return;
    }

    try {
      const response = await fetch(cancelBookingById(appointment._id), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userJwtData.token}`,
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel appointment');
      }

      setAppointments((prevAppointments) => (
        prevAppointments.map((appt) => (
          appt._id === appointment._id
            ? { ...appt, status: 'cancelled' }
            : appt
        ))
      ));
    } catch (err) {
      setError(`Error cancelling appointment: ${err.message}`);
    } finally {
      setShowConfirmation(false);
      setSelectedAppointment(null);
    }
  }

  // Define handlers to avoid jsx-no-bind warnings
  const handleCloseConfirmation = () => setShowConfirmation(false);
  const handleCancelClick = (appt) => () => confirmCancellation(appt);

  // Helper function for skeleton rows with unique keys
  const renderSkeletonRow = (width, rowIndex) => (
    <tr key={`skeleton-row-${rowIndex}`}>
      <td style={{ textAlign: 'center' }}>
        <Skeleton
          style={{ minWidth: width, width: '80%' }}
        />
      </td>
    </tr>
  );

  const skeletonWidths = ['80px', '80px', '120px', '150px', '100px'];

  // Render skeleton loading state
  const renderLoadingState = () => (
    <div className="appointment-feature">
      <div className="appointment-feature-details">
        <table className="appointment-feature-details-table">
          <tbody>
            {skeletonWidths.map((width, index) => renderSkeletonRow(width, index))}
          </tbody>
        </table>
        <div className="appointment-feature-buttons">
          <button type="button" style={{ backgroundColor: 'transparent' }}>
            <Skeleton style={{ minWidth: '100px' }} height={30} />
          </button>
        </div>
      </div>
    </div>
  );

  // Render appointment content
  const renderAppointmentContent = () => {
    if (appointments.length === 0) {
      return <p>No appointments found</p>;
    }

    return appointments.map((appointment) => (
      <div key={appointment._id} className="appointment-feature">
        <div className="appointment-feature-image">
          <img src={calendar} className="calendar-image" alt="Calendar" />
        </div>
        <div className="appointment-feature-details">
          <table className="appointment-feature-details-table">
            <tbody>
              <tr>
                <th>Date:</th>
                <td>{FormatDate(appointment.availabilityId.date)}</td>
              </tr>
              <tr>
                <th>Time:</th>
                <td>{FormatTime(appointment.availabilityId.startTime)}</td>
              </tr>
              <tr>
                <th>Doctor:</th>
                <td>{appointment.doctorId.doctorName}</td>
              </tr>
              <tr>
                <th>Centre:</th>
                <td>{appointment.medicalCentreId.medicalCentreName}</td>
              </tr>
              <tr>
                <th>Status:</th>
                <td>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="appointment-feature-buttons">
            {!hiddenStatus.includes(appointment.status.trim().toLowerCase()) && (
              <button
                type="button"
                onClick={handleCancelClick(appointment)}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div className="appointment-container">
        {loading ? renderLoadingState() : renderAppointmentContent()}
        {error && <ErrorMessage message={error} />}
      </div>
      {showConfirmation && (
        <PatientConfirmation
          selectedAppointment={selectedAppointment}
          onClose={handleCloseConfirmation}
          onConfirm={cancelBooking}
          className="patient-confirmation-window"
        />
      )}
    </SkeletonTheme>
  );
}
