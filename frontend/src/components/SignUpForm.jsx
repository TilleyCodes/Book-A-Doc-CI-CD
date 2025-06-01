// Imports
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link, useNavigate } from 'react-router';
import { CustomInput } from './CustomInput';
import '../styles/reactDatePicker.css';
import eyeOpen from '../assets/eye-open.svg';
import eyeClosed from '../assets/eye-closed.svg';
import { endpoints } from '../config/api';
import { useUserJwtContext } from '../hooks/useUserJwtData';
import { calculatePasswordStrength } from '../utils/calculatePasswordStrength';
import { handleChange } from '../utils/handleChange';

// Main function
export function SignUpForm() {
  // Define hooks
  const navigate = useNavigate();
  const { setUserJwtData } = useUserJwtContext();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [dateError, setDateError] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successfulSignup, setSuccessfulSignup] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(10);
  const [passwordStrength, setPasswordStrength] = useState('');

  const today = new Date();
  const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  const maxYear = today.getFullYear();
  const minYear = maxYear - 100;

  function handleDateChange(date) {
    if (!date) {
      setDateError('Date of birth is required');
      return;
    }
    if (date > today) {
      setDateError('Date cannot be in the future');
    } else if (date > minAgeDate) {
      setDateError('You must be at least 18 years old');
    } else {
      setDateError('');
    }
    setDateOfBirth(date);
  }

  // Handle countdown and redirection after successful signup
  useEffect(() => {
    let timer;
    if (showWelcomeMessage && redirectCountdown > 0) {
      timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
    } else if (showWelcomeMessage && redirectCountdown === 0) {
      navigate('/');
    }
    return () => clearTimeout(timer);
  }, [showWelcomeMessage, redirectCountdown, navigate]);

  // onSubmit event handler
  async function submitForm(event) {
    event.preventDefault();

    // Post function to API
    const targetUrl = endpoints.patients;

    const bodyDataToSend = JSON.stringify({
      firstName,
      lastName,
      email,
      dateOfBirth,
      address: { street, city },
      phoneNumber,
      password,
    });

    try {
      const response = await fetch(
        targetUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: bodyDataToSend,
        },
      );

      const data = await response.json();
      if (data.someErrorProperty) {
        setErrorMessage(data.someErrorProperty);
      }

      if (!response.ok) {
        setSuccessfulSignup(false);
        setErrorMessage('Email already exists');
        return;
      }

      // Store the JWT token for the newly registered user
      if (data.token) {
        setUserJwtData({
          token: data.token,
          patient: data.newPatient,
          patientId: data.newPatient._id,
        });
      }

      setSuccessfulSignup(true);
      setShowWelcomeMessage(true);
    } catch (err) {
      setSuccessfulSignup(false);
      setErrorMessage(err.message || 'Failed to create account');
    }
  }

  // If showing welcome message, display it instead of the form
  if (showWelcomeMessage) {
    return (
      <div className="welcome-message-container">
        <h2>
          Welcome to Book-a-Doc,
          {' '}
          {firstName}
          !
        </h2>
        <p>Your account has been created successfully.</p>
        <p>
          You will be redirected to the home page in
          {' '}
          {redirectCountdown}
          {' '}
          seconds...
        </p>
        <button
          type="button"
          className="redirect-now-btn"
          onClick={() => navigate('/')}
        >
          Go to Home Page Now
        </button>
      </div>
    );
  }

  return (
    <form className="box" onSubmit={submitForm}>
      <div className="box-container">
        <div className="input-wrapper">
          <input
            type="email"
            className="input-field"
            placeholder=" "
            name="patientEmail"
            id="patientEmail"
            required
            value={email}
            onChange={handleChange(setEmail)}
          />
          <label className="input-label" htmlFor="patientEmail">Email</label>
        </div>

        {!successfulSignup && errorMessage && (
          <p className="sign-in-error">{errorMessage}</p>
        )}

        <div className="name-container">
          <div className="input-wrapper">
            <input
              type="text"
              className="input-field"
              placeholder=" "
              name="patientFirstName"
              id="patientFirstName"
              required
              value={firstName}
              onChange={handleChange(setFirstName)}
            />
            <label className="input-label" htmlFor="patientFirstName">First Name</label>
          </div>
          <div className="input-wrapper">
            <input
              type="text"
              className="input-field"
              placeholder=" "
              name="patientLastName"
              id="patientLastName"
              required
              value={lastName}
              onChange={handleChange(setLastName)}
            />
            <label className="input-label" htmlFor="patientLastName">Last Name</label>
          </div>
        </div>

        <div>
          <DatePicker
            id="patientDateOfBirth"
            selected={dateOfBirth}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            required
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            minDate={new Date(minYear, 0, 1)}
            maxDate={today}
            yearDropdownItemNumber={15}
            scrollableYearDropdown
            placeholderText=" "
            popperPlacement="bottom-start"
            aria-labelledby="dob-label"
            customInput={(
              <CustomInput
                id="patientDateOfBirth"
                labelText="Date of Birth"
              />
            )}
          />
          <span id="dob-label" className="sr-only">Date of Birth</span>
          {dateError && (
            <p className="sign-in-error">{dateError}</p>
          )}
        </div>

        <div className="input-wrapper">
          <input
            type="text"
            className="input-field"
            placeholder=" "
            name="address-street"
            id="address-street"
            required
            value={street}
            onChange={handleChange(setStreet)}
          />
          <label className="input-label" htmlFor="address-street">Street</label>
        </div>

        <div className="input-wrapper">
          <input
            type="text"
            className="input-field"
            placeholder=" "
            name="address-city"
            id="address-city"
            value={city}
            onChange={handleChange(setCity)}
          />
          <label className="input-label" htmlFor="address-city">City</label>
        </div>

        <div className="input-wrapper">
          <input
            type="tel"
            className="input-field"
            placeholder=" "
            name="phoneNumber"
            id="phoneNumber"
            required
            pattern="^(?:\+61|0)[2-478](?:[ -]?[0-9]){8}$"
            title="Please enter a valid Australian phone number"
            value={phoneNumber}
            onChange={handleChange(setPhoneNumber)}
          />
          <label className="input-label" htmlFor="phoneNumber">Phone Number</label>
        </div>

        <div className="input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            className="input-field"
            placeholder=" "
            name="password"
            id="password"
            required
            pattern="^(?!\s*$).{10,}"
            title="Must contain at least 10 or more characters"
            value={password}
            onChange={(event) => {
              const newPassword = event.target.value;
              setPassword(newPassword);
              setPasswordStrength(calculatePasswordStrength(newPassword));
            }}
          />
          <label className="input-label" htmlFor="password">Password</label>
          <button
            type="button"
            className="input-icon"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((prev) => !prev)}
            style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
          >
            <img
              src={showPassword ? eyeClosed : eyeOpen}
              alt={showPassword ? 'eye closed' : 'eye open'}
            />
          </button>
        </div>

        {password && (
          <div className={`password-strength ${passwordStrength}`}>
            <span>
              Password strength:
              {' '}
              {passwordStrength}
            </span>
          </div>
        )}

        {password.length < 10 && (
          <div className="password-requirements">
            <small>Password must be at least 10 characters long</small>
          </div>
        )}

        <div className="form-checkbox">
          <input
            type="checkbox"
            name="acknowledge"
            id="acknowledge"
            required
          />
          <label htmlFor="acknowledge">
            I agree to the
            {' '}
            <Link to="/termsandconditions" target="_blank" className="inline-link">
              Terms & Conditions
            </Link>
            {', and '}
            <Link to="/privacy" target="_blank" className="inline-link">
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        <div className="form-button">
          <button type="submit">SIGN UP</button>
        </div>
      </div>
    </form>
  );
}
