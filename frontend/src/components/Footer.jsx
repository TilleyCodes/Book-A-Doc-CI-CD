import React from 'react';
import { NavLink } from 'react-router';

export function Footer() {
  return (
    <footer>
      <NavLink to="/contact">
        Contact Us
      </NavLink>
      <NavLink to="/privacy">
        Privacy Policy
      </NavLink>
      <NavLink to="/termsandconditions">
        Terms & Conditions
      </NavLink>
    </footer>
  );
}
