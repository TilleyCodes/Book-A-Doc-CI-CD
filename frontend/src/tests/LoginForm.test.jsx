import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, beforeEach, afterEach, expect, it } from 'vitest';
import { BrowserRouter } from 'react-router';
import { LoginForm } from '../components/LoginForm';
import { UserJwtContext } from '../hooks/useUserJwtData';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LoginForm component', () => {
  const mockSetUserJwtData = vi.fn();
  beforeEach(() => {
    // Reset mocks before each test
    mockSetUserJwtData.mockClear();
    mockNavigate.mockClear();

    // Mock fetch calls
    vi.stubGlobal('fetch', (url) => {
      // For successful login
      if (url.includes('login') && url.includes('test@example.com')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            token: 'fake-jwt-token',
            patient: { _id: 'patient123', firstName: 'John', lastName: 'Doe' },
          }),
        });
      }
      // For failed login
      if (url.includes('login')) {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({
            message: 'Invalid email or password',
          }),
        });
      }
      return Promise.reject(new Error(`Unhandled URL: ${url}`));
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the login form correctly with required fields', () => {
    render(
      <BrowserRouter>
        <UserJwtContext.Provider value={{ setUserJwtData: mockSetUserJwtData }}>
          <LoginForm />
        </UserJwtContext.Provider>
      </BrowserRouter>,
    );

    // Check for email and password fields
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // Check for login button
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();

    // Check for forgot password link
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  it('handles form submission with correct credentials', async () => {
    // Mock fetch call more specifically for this test
    vi.stubGlobal('fetch', () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          token: 'fake-jwt-token',
          patient: { _id: 'patient123', firstName: 'John', lastName: 'Doe' },
        }),
      }),
    );

    render(
      <BrowserRouter>
        <UserJwtContext.Provider value={{ setUserJwtData: mockSetUserJwtData }}>
          <LoginForm />
        </UserJwtContext.Provider>
      </BrowserRouter>,
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for the API call to complete
    await waitFor(() => {
      expect(mockSetUserJwtData).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('displays error message when login fails', async () => {
    // Mock fetch specifically for failed login
    vi.stubGlobal('fetch', () =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({
          message: 'Invalid email or password',
        }),
      }),
    );

    render(
      <BrowserRouter>
        <UserJwtContext.Provider value={{ setUserJwtData: mockSetUserJwtData }}>
          <LoginForm />
        </UserJwtContext.Provider>
      </BrowserRouter>,
    );

    // Fill in the form with incorrect credentials
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for any error message to appear (not checking specific text)
    await waitFor(() => {
      expect(screen.getByText((content, element) => {
        return element.tagName.toLowerCase() === 'p' &&
               element.className === 'error-message';
      })).toBeInTheDocument();
    });
  });
});
