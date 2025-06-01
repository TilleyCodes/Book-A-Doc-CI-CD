import React, { useEffect } from 'react';
import { NavLink } from 'react-router';
import '../styles/logout.css';
import { useUserJwtContext } from '../hooks/useUserJwtData';

export function Logout() {
  const { setUserJwtData } = useUserJwtContext();

  useEffect(() => {
    setUserJwtData({ token: '', patient: {} });
  }, [setUserJwtData]);

  return (
    <div className="logout-container">
      <p>You have been successfully logged out</p>
      <NavLink to="/">Return Home</NavLink>
    </div>
  );
}
