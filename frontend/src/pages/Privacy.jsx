import React from 'react';
import '../styles/general.css';
import { Link } from 'react-router';

export function Privacy() {
  return (
    <div className="general-container">
      <p className="general-last-updated">Last updated: March 2025</p>

      <section className="general-section">
        <h2 className="general-subheading">1. Introduction</h2>
        <p className="general-text">
          Welcome to Book-a-Doc. Your privacy is important to us, and we are committed to protecting
          your personal information.
        </p>
      </section>

      <section className="general-section">
        <h2 className="general-subheading">2. Information We Collect</h2>
        <p className="general-text">We may collect and store the following types of information:</p>
        <ul className="general-list">
          <li>Personal details (e.g., name, email, phone number)</li>
          <li>Booking and appointment history</li>
          <li>Medical center and doctor preferences</li>
        </ul>
      </section>

      <section className="general-section">
        <h2 className="general-subheading">3. How We Use Your Information</h2>
        <p className="general-text">We use your information to:</p>
        <ul className="general-list">
          <li>Provide and manage your bookings</li>
          <li>Improve our services and user experience</li>
          <li>Communicate important updates and confirmations</li>
        </ul>
      </section>

      <section className="general-section">
        <h2 className="general-subheading">4. Data Security</h2>
        <p className="general-text">
          We implement industry-standard security measures to protect your information from
          unauthorized access or disclosure.
        </p>
      </section>

      <section className="general-section">
        <h2 className="general-subheading">5. Your Rights</h2>
        <p className="general-text">
          You have the right to access, update, or delete your personal data. Contact us if you wish
          to make any changes.
        </p>
      </section>

      <section className="general-section">
        <h2 className="general-subheading">6. Contact Us</h2>
        <p className="general-text">
          If you have any questions about this Privacy Policy, please
          {' '}
          <Link className="inline-link" to="/contact">
            contact us
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
