import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { BaseLayout } from './pages/layouts/BaseLayout';
import './styles/index.css';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Logout } from './pages/Logout';
import { MedicalCentresPage } from './pages/MedicalCentres';
import { Privacy } from './pages/Privacy';
import { TermsAndCond } from './pages/TermsAndCond';
import { UserJwtProvider } from './contexts/userJwtContext';
import { ForgotPassword } from './pages/ForgotPassword';
import { GeneralPractitionersPage } from './pages/Doctors';
import { Appointments } from './pages/Appointments';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserJwtProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BaseLayout />}>
            {/* localhost:5173/ */}
            <Route index element={<Home />} />

            {/* localhost:5173/about */}
            <Route path="about" element={<About />} />

            {/* localhost:5173/login */}
            <Route path="login" element={<Login />} />

            {/* localhost:5173/sign-up */}
            <Route path="sign-up" element={<SignUp />} />

            {/* localhost:5173/logout */}
            <Route path="logout" element={<Logout />} />

            {/* localhost:5173/medical-centres */}
            <Route path="medical-centres" element={<MedicalCentresPage />} />

            {/* localhost:5173/contact */}
            <Route path="contact" element={<Contact />} />

            {/* localhost:5173/privacy */}
            <Route path="privacy" element={<Privacy />} />

            {/* localhost:5173/termsandconditions */}
            <Route path="termsandconditions" element={<TermsAndCond />} />

            {/* localhost:5173/forgot-password */}
            <Route path="forgot-password" element={<ForgotPassword />} />

            {/* localhost:5173/doctors */}
            <Route path="doctors" element={<GeneralPractitionersPage />} />

            {/* localhost:5173/appointments */}
            <Route path="appointments" element={<Appointments />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </UserJwtProvider>
  </StrictMode>,
);
