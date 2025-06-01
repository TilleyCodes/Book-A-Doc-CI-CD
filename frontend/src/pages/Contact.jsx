import { useState } from 'react';
import '../styles/contact.css';
import { handleChange } from '../utils/handleChange';

export function Contact() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  function submitForm(event) {
    event.preventDefault();
    setFormSubmitted(true);
  }

  return (
    <form className="box" onSubmit={submitForm}>
      <div className="box-container">
        <div className="input-wrapper">
          <input
            className="input-field"
            placeholder=" "
            type="text"
            name="fullName"
            id="fullName"
            value={fullName}
            onChange={handleChange(setFullName)}
            required
          />
          <label className="input-label" htmlFor="fullName">
            Full Name
          </label>
        </div>

        <div className="input-wrapper">
          <input
            className="input-field"
            placeholder=" "
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={handleChange(setEmail)}
            required
          />
          <label className="input-label" htmlFor="email">
            Email
          </label>
        </div>

        <div className="input-wrapper">
          <textarea
            className="input-field textarea-field"
            placeholder=" "
            name="message"
            id="message"
            value={message}
            onChange={handleChange(setMessage)}
            required
          />
          <label className="input-label" htmlFor="message">
            Your Message
          </label>
        </div>

        <div className="form-button">
          <button type="submit">SEND MESSAGE</button>
        </div>

        {formSubmitted && (
          <p className="success-message">Thank you! Your message has been received.</p>
        )}
      </div>
    </form>
  );
}
