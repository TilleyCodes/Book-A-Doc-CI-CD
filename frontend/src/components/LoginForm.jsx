import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useUserJwtContext } from '../hooks/useUserJwtData';
import eyeOpen from '../assets/eye-open.svg';
import eyeClosed from '../assets/eye-closed.svg';
import { endpoints } from '../config/api';
import { calculatePasswordStrength } from '../utils/calculatePasswordStrength';
import { handleChange } from '../utils/handleChange';

export function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginSuccessful, setLoginSuccessful] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const { setUserJwtData } = useUserJwtContext();

  async function submitForm(event) {
    event.preventDefault();

    setLoading(true);

    const targetUrl = endpoints.login;
    const bodyDataToSend = JSON.stringify({ email, password });

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyDataToSend,
      });

      const bodyData = await response.json();

      if (!response.ok) {
        setLoginSuccessful(false);
        setLoading(false);
        setErrorMessage(bodyData.message || 'Invalid email or password');
        return;
      }

      setLoginSuccessful(true);
      setLoading(false);
      setUserJwtData({
        token: bodyData.token,
        patient: bodyData.patient,
        patientId: bodyData.patient._id,
      });
      navigate('/');
    } catch (err) {
      setLoginSuccessful(false);
      setErrorMessage('Network error. Please try again');
    }
  }

  return (
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
            onChange={handleChange(setEmail)}
          />
          <label className="input-label" htmlFor="userEmail">Email</label>
        </div>
        <div className="input-wrapper">
          <input
            className="input-field"
            placeholder=" "
            pattern="^(?!\s*$).{10,}"
            title="Must contain at least 10 or more characters"
            type={showPassword ? 'text' : 'password'}
            name="userPassword"
            id="userPassword"
            value={password}
            onChange={(event) => {
              const newPassword = event.target.value;
              setPassword(newPassword);
              setPasswordStrength(calculatePasswordStrength(newPassword));
            }}
          />
          <label className="input-label" htmlFor="userPassword">Password</label>
          <button
            type="button"
            className="input-icon password-toggle-btn"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <img
              alt={showPassword ? 'eye closed' : 'eye open'}
              title={showPassword ? 'Hide password' : 'Show password'}
              src={showPassword ? eyeClosed : eyeOpen}
              style={{ display: 'block' }}
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
        {loading ? <div className="loader" style={{ width: '25px', height: '25px' }} /> : (
          <div className="form-button">
            <button type="submit">LOGIN</button>
          </div>
        )}
        <div className="forgotpassword">
          <NavLink to="/forgot-password">
            Forgot Password?
          </NavLink>
        </div>
        {!loginSuccessful && (
          <p className="error-message">{errorMessage}</p>
        )}
      </div>
    </form>
  );
}
