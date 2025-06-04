import React from 'react';
import { NavLink } from 'react-router';
import { Navbar } from './Navbar';
import logo from '../assets/heart-with-pulse.png';
import '../styles/header.css';

export function Header() {
  return (
    <header>
      <NavLink className="logo-inline-link" to="/">
        <div className="main-logo-container">
          <img src={logo} className="site-logo" alt="heart with pulse logo" />
          <h1 className="site-title">Book a Doc</h1>
        </div>
      </NavLink>
      <Navbar />
    </header>
  );
}
