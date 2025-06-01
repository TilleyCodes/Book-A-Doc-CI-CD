import { expect, test, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router';
import { Home } from '../pages/Home';
import { GeneralPractitionersPage } from '../pages/Doctors';

vi.mock('../hooks/useUserJwtData', () => ({
  useUserJwtContext: () => ({
    userJwtData: { token: 'mock-token', patient: { _id: 'mock-id' } },
  }),
}));

vi.mock('../components/Doctors', () => ({
  Doctors: () => <div>Mocked Doctors Component</div>,
}));

test('Renders home page with Appointments link when user is logged in', () => {
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>,
  );

  const appointmentsLink = screen.getByText(/my appointments/i);
  expect(appointmentsLink).toBeInTheDocument();
});

test('Navigates to General Practitioners page when link is clicked', async () => {
  // Render Home inside a BrowserRouter
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>,
  );

  const gpLink = screen.getByText(/general practitioners/i);
  expect(gpLink).toBeInTheDocument();

  fireEvent.click(gpLink);

  render(
    <MemoryRouter initialEntries={['/doctors']}>
      <Routes>
        <Route path="/doctors" element={<GeneralPractitionersPage />} />
      </Routes>
    </MemoryRouter>,
  );

  await waitFor(() => {
    const doctorsComponent = screen.getByText(/mocked doctors component/i);
    expect(doctorsComponent).toBeInTheDocument();
  });
});
