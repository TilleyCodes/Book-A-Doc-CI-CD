import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, beforeEach, afterEach, expect, it } from 'vitest';
import { BrowserRouter } from 'react-router';
import { SignUpForm } from '../components/SignUpForm';

// Mock DatePicker component
vi.mock('react-datepicker', () => ({
  // eslint-disable-next-line no-unused-vars
  default: ({ selected, onChange, customInput }) => {
    return (
      <input
        type="date"
        data-testid="date-picker"
        value={selected ? selected.toISOString().split('T')[0] : ''}
        onChange={(e) => {
          const date = new Date(e.target.value);
          onChange(date);
        }}
      />
    );
  },
}));

describe('SignUpForm component', () => {
  // Mock console.error to reduce noise in test output
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = vi.fn();

    vi.stubGlobal('fetch', (url) => {
      // For successful signup (any email except existing@example.com)
      if (url.includes('patients') && !url.includes('existing@example.com')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            token: 'fake-token',
            newPatient: { _id: 'patient123' },
          }),
        });
      }
      // For email already exists error
      if (url.includes('patients')) {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({
            message: 'Email already exists',
          }),
        });
      }
      return Promise.reject(new Error(`Unhandled URL: ${url}`));
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    console.error = originalConsoleError;
  });

  it('renders the sign up form with all required fields', () => {
    render(
      <BrowserRouter>
        <SignUpForm />
      </BrowserRouter>,
    );

    // Check all required input fields
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    expect(screen.getByLabelText(/street/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // Check for checkbox and submit button
    expect(screen.getByText(/i agree to the/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('submits form data correctly and shows success message', async () => {
    // Specifically mock successful signup
    vi.stubGlobal('fetch', () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          token: 'fake-token',
          newPatient: { _id: 'patient123' },
        }),
      }),
    );

    render(
      <BrowserRouter>
        <SignUpForm />
      </BrowserRouter>,
    );

    // Fill all required fields
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    });

    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });

    // Set date to be 20 years ago
    const twentyYearsAgo = new Date();
    twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20);

    fireEvent.change(screen.getByTestId('date-picker'), {
      target: { value: twentyYearsAgo.toISOString().split('T')[0] },
    });

    fireEvent.change(screen.getByLabelText(/street/i), {
      target: { value: '123 Test Street' },
    });

    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: 'Test City' },
    });

    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '0400123456' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password1234' },
    });

    // Check the terms checkbox
    fireEvent.click(screen.getByLabelText(/i agree to the/i));

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Wait for API call and success message
    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument();
    });
  });

  it('shows error message when email already exists', async () => {
    // Specifically mock failed signup
    vi.stubGlobal('fetch', () =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({
          message: 'Email already exists',
        }),
      }),
    );

    render(
      <BrowserRouter>
        <SignUpForm />
      </BrowserRouter>,
    );

    // Fill all required fields
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'existing@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    });

    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });

    // Set date to be 20 years ago
    const twentyYearsAgo = new Date();
    twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20);

    fireEvent.change(screen.getByTestId('date-picker'), {
      target: { value: twentyYearsAgo.toISOString().split('T')[0] },
    });

    fireEvent.change(screen.getByLabelText(/street/i), {
      target: { value: '123 Test Street' },
    });

    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: 'Test City' },
    });

    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '0400123456' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password1234' },
    });

    // Check the terms checkbox
    fireEvent.click(screen.getByLabelText(/i agree to the/i));

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Wait for error message to appear (checking for the class, not specific text)
    await waitFor(() => {
      expect(screen.getByText((content, element) => {
        return element.tagName.toLowerCase() === 'p' &&
               element.className === 'sign-in-error';
      })).toBeInTheDocument();
    });
  });
});
