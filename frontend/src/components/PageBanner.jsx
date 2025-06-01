import React, { useEffect, useState } from 'react';
import '../styles/pageBanner.css';
import { useLocation } from 'react-router';

export function PageBanner() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Need to get req.params e.g., /about
  // Assign that to a variable
  const location = useLocation();
  const currentRoute = location.pathname.replace(/^\//, '');

  // Switch case to determine what the title and description variables will be
  useEffect(() => {
    switch (currentRoute) {
      case 'about':
        setTitle('About Us');
        setDescription('Learn more about Book-a-Doc');
        break;
      case 'login':
        setTitle('Patient Login');
        setDescription('Log in to view and manager your appointments');
        break;
      case 'contact':
        setTitle('Contact Us');
        setDescription('You can reach out to us using the form below');
        break;
      case 'privacy':
        setTitle('Privacy Policy');
        setDescription('Access our privacy policy below');
        break;
      case 'termsandconditions':
        setTitle('Terms and Conditions');
        setDescription('View Book-a-Docs terms and conditions below');
        break;
      case 'sign-up':
        setTitle('Create An Account');
        setDescription('Complete the form below to sign up and create a profile');
        break;
      case 'medical-centres':
        setTitle('Medical Centres');
        setDescription('Available Medical Centres for booking');
        break;
      case 'appointments':
        setTitle('My Appointments');
        setDescription('Past and future appointments');
        break;
      default:
        setTitle('Book Your Next Appointment');
        setDescription('Find and book with a general practitioner');
        break;
    }
  }, [currentRoute]);

  return (
    <div className="banner-box">
      <h1 className="banner-title">{title}</h1>
      <p className="banner-text">{description}</p>
    </div>
  );
}
