import React from 'react';
import '../styles/about.css';

export function About() {
  return (
    <div className="about-container">
      <p className="about-description">
        Welcome to Book-a-Doc, your trusted platform for seamless healthcare appointments.
        We make it easy to find, book, and manage doctor visits online, ensuring that quality
        healthcare is just a few clicks away.
      </p>
      <br />
      <h2 className="about-title">What We Offer</h2>
      <ul className="about-services">
        <li>📅 Easy online appointment booking</li>
        <li>🔍 Find general practitioners and specialists</li>
        <li>🏥 Browse trusted medical centres</li>
        <li>📲 Manage your appointments anytime, anywhere</li>
      </ul>

      <p className="about-cta">
        <br />
        Our mission is to simplify healthcare access by connecting patients with top medical
        professionals.
        Start booking your appointments today!
      </p>
    </div>
  );
}
