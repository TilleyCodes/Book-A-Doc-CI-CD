import React from 'react';
import { NavLink } from 'react-router';
import '../styles/home.css';
import steth from '../assets/stethoscope.png';
import calendar from '../assets/calendar.svg';
import medical from '../assets/medical-clinic.png';
import { useUserJwtContext } from '../hooks/useUserJwtData';
import { SearchBar } from '../components/SearchBar';

export function Home() {
  const { userJwtData } = useUserJwtContext();
  const isLoggedIn = Boolean(userJwtData && userJwtData.token);

  return (
    <>
      {/* Search bar componenet */}
      <SearchBar />

      {/* Main feature buttons for navigation */}
      {/* My Appointments will only appear when the patient is logged in */}
      <div className="main-option-container">
        <NavLink className="feature-link" to="/doctors">
          <div className="main-option-feature" id="doctors">
            <img className="feature-icon" src={steth} alt="Stethoscope icon" />
            <h3>General Practitioners</h3>
          </div>
        </NavLink>

        {isLoggedIn && (
          <NavLink className="feature-link" to="/appointments">
            <div className="main-option-feature" id="appointments">
              <img className="feature-icon" src={calendar} alt="Calendar icon" />
              <h3>My Appointments</h3>
            </div>
          </NavLink>
        )}
        <NavLink className="feature-link" to="/medical-centres">
          <div className="main-option-feature" id="centres">
            <img className="feature-icon" src={medical} alt="Medical center icon" />
            <h3>Medical Centres</h3>
          </div>
        </NavLink>
      </div>
    </>
  );
}
