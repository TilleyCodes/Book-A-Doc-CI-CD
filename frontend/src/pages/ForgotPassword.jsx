import React, { useState } from 'react';
import '../styles/login.css';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function submitForm(event) {
    event.preventDefault();

    setEmail('');
    setMessage(
      'Email successfully submitted.\nIf an account with that email exists, you will receive an email with further instructions',
    );
  }

  return (
    <>
      <p>Enter your email address below and submit</p>
      <form className="box" onSubmit={submitForm}>
        <div className="box-container">
          <div className="input-wrapper">
            <input
              className="input-field"
              placeholder=" "
              type="email"
              name="userEmail"
              id="userEmail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <label className="input-label" htmlFor="userEmail">
              Email
            </label>
          </div>

          <div className="form-button">
            <button type="submit">SUBMIT</button>
          </div>
          {message && <p id="forgot-password-message">{message}</p>}
        </div>
      </form>
    </>
  );
}
