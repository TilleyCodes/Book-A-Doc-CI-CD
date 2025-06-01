import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, beforeEach, afterEach, expect, it } from 'vitest';
import { BrowserRouter } from 'react-router';
import { SearchBar } from '../components/SearchBar';

// Create mock data
const doctorsData = [
  { doctorName: 'Dr. John', specialtyId: { specialtyName: 'Cardiology' } },
  { doctorName: 'Dr. Smith', specialtyId: { specialtyName: 'Dermatology' } },
];

const medicalCentresData = [
  { medicalCentreName: 'Central Clinic' },
  { medicalCentreName: 'West Clinic' },
];

describe('SearchBar component', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', (url) => {
      if (url.includes('doctors')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(doctorsData),
        });
      }
      if (url.includes('medicalCentres') || url.includes('medical-centres')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(medicalCentresData),
        });
      }
      return Promise.reject(new Error(`Unhandled URL: ${url}`));
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders search bar input and shows suggestions when typing', async () => {
    render(
      <BrowserRouter>
        <SearchBar />
      </BrowserRouter>,
    );

    const input = screen.getByPlaceholderText(/search gp, specialty or medical centre/i);
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'dr' } });

    await waitFor(() => {
      // Our mock doctor data contains "Dr. John", so we expect to see that suggestion.
      expect(screen.getByText(/dr\. john/i)).toBeInTheDocument();
    });
  });

  // Add a second test for clicking suggestions
  it('selects a suggestion when clicked', async () => {
    render(
      <BrowserRouter>
        <SearchBar />
      </BrowserRouter>,
    );

    const input = screen.getByPlaceholderText(/search gp, specialty or medical centre/i);

    // Type in the search box
    fireEvent.change(input, { target: { value: 'cen' } });

    // Wait for suggestions to appear
    await waitFor(() => {
      expect(screen.getByText(/central clinic/i)).toBeInTheDocument();
    });

    // Click on a suggestion
    fireEvent.click(screen.getByText(/central clinic/i));

    // Verify input was updated
    expect(input.value).toBe('Central Clinic');
  });
});
