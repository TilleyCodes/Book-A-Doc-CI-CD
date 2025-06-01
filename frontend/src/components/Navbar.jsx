import { NavLink } from 'react-router';
import { useState } from 'react';
import { useUserJwtContext } from '../hooks/useUserJwtData';
import '../styles/navbar.css';

export function Navbar() {
  const { userJwtData } = useUserJwtContext();
  const isLoggedIn = Boolean(userJwtData && userJwtData.token);

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <button
        type="button"
        className="burger-menu"
        onClick={toggleMenu}
      >
        ☰
      </button>
      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <NavLink to="/" id="nav-home" onClick={closeMenu}>
          Home
        </NavLink>
        <NavLink to="/about" id="nav-about" onClick={closeMenu}>
          About
        </NavLink>

        {/* Show login and sign up links when patient is not signed in */}
        {!isLoggedIn && (
          <>
            <NavLink to="/login" id="nav-login" onClick={closeMenu}>
              Login
            </NavLink>
            <NavLink to="/sign-up" id="nav-sign-up" onClick={closeMenu}>
              Sign Up
            </NavLink>
          </>
        )}
        {/* Show logout link when patient is logged in */}
        {isLoggedIn && (
          <NavLink to="/logout" id="nav-logout" onClick={closeMenu}>
            Logout
          </NavLink>
        )}
      </div>
    </nav>
  );
}
