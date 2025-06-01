import { BrowserRouter } from 'react-router';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Doctors } from '../components/Doctors';

// Mock data
const mockDoctorsData = [
  { _id: 'doc1', doctorName: 'Dr. John Smith', specialtyId: { specialtyName: 'GP Women\'s Health' } },
  { _id: 'doc2', doctorName: 'Dr. Jane Doe', specialtyId: { specialtyName: 'GP Men\'s Health' } },
  { _id: 'doc3', doctorName: 'Dr. Emily Jones', specialtyId: { specialtyName: 'GP Baby & Child Health' } },
];

const mockDoctorCentres = [
  {
    doctorId: { _id: 'doc1', doctorName: 'Dr. John Smith' },
    medicalCentreId: { _id: 'mc1', medicalCentreName: 'Medical Centre 1' },
  },
  {
    doctorId: { _id: 'doc2', doctorName: 'Dr. Jane Doe' },
    medicalCentreId: { _id: 'mc2', medicalCentreName: 'Medical Centre 2' },
  },
];

describe('Doctors component', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', (url) => {
      if (url.includes('doctors') && !url.includes('availabilities')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockDoctorsData),
        });
      }
      if (url.includes('doctorCentres')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockDoctorCentres),
        });
      }
      return Promise.reject(new Error(`Unhandled URL: ${url}`));
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the loading state initially', () => {
    render(
      <BrowserRouter>
        <Doctors />
      </BrowserRouter>,
    );

    // Check that loading is displayed initially
    expect(screen.getByText('Loading doctors...')).toBeInTheDocument();
  });

  it('renders doctors after loading', async () => {
    render(
      <BrowserRouter>
        <Doctors />
      </BrowserRouter>,
    );

    // Wait for doctors to load
    await waitFor(() => {
      expect(screen.queryByText('Loading doctors...')).not.toBeInTheDocument();
    });

    // Check if at least one doctor is rendered
    await waitFor(() => {
      const doctorElements = screen.getAllByText(/^Dr\./);
      expect(doctorElements.length).toBeGreaterThan(0);
    });
  });

  it('renders specialty filter with options', async () => {
    render(
      <BrowserRouter>
        <Doctors />
      </BrowserRouter>,
    );

    // Wait for doctors to load
    await waitFor(() => {
      expect(screen.queryByText('Loading doctors...')).not.toBeInTheDocument();
    });

    // Check for specialty filter
    await waitFor(() => {
      const specialtyFilter = screen.getByLabelText(/filter by specialty/i);
      expect(specialtyFilter).toBeInTheDocument();
    });
  });
});
