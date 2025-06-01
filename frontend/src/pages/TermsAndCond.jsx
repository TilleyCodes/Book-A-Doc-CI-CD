import React from 'react';
import { Link } from 'react-router';
import '../styles/general.css';

export function TermsAndCond() {
  return (
    <div className="general-container">
      <p className="general-last-updated">Last updated: March 2025</p>

      <section className="general-section">
        <p className="general-intro">
          By accessing our website, you agree to comply with and be bound by the following terms and
          conditions. Please read them carefully.
        </p>
      </section>

      <section className="general-section">
        <h2 className="general-subheading">1. Acceptance of Terms</h2>
        <p className="general-text">
          By using our services, you acknowledge that you have read, understood, and agreed to these
          terms. If you do not agree, please do not use our website.
        </p>
      </section>

      <section className="general-section">
        <h2 className="general-subheading">2. Use of Services</h2>
        <ul className="general-list">
          <li>Appointments must be booked using accurate personal details.</li>
          <li>
            Users must be at least 18 years old or have parental consent to use our services.
          </li>
          <li>Book-a-Doc reserves the right to modify or discontinue services at any time.</li>
        </ul>
      </section>

      <section className="general-section">
        <h2 className="general-subheading">3. User Responsibilities</h2>
        <ul className="general-list">
          <li>
            You are responsible for maintaining the confidentiality of your login credentials.
          </li>
          <li>Any misuse or fraudulent activity may result in account termination.</li>
        </ul>
      </section>

      <section className="general-section">
        <h2 className="general-subheading">4. Cancellations and Refunds</h2>
        <p className="general-text">
          Cancellations must be made at least 24 hours before the appointment. Refund policies may
          vary depending on the healthcare provider.
        </p>
      </section>

      <section className="general-section">
        <h2 className="general-subheading">5. Limitation of Liability</h2>
        <p className="general-text">
          Book-a-Doc is not responsible for the quality of care provided by healthcare
          {' '}
          professionals. We act solely as a booking platform.
        </p>
      </section>

      <section className="general-section">
        <h2 className="general-subheading">6. Changes to Terms</h2>
        <p className="general-text">
          We may update these terms at any time. Continued use of our services constitutes
          {' '}
          acceptance of the revised terms.
        </p>
      </section>

      <section className="general-section">
        <h2 className="general-subheading">7. Contact Us</h2>
        <p className="general-text">
          If you have any questions about our terms and conditions, please
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
