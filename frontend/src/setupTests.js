import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Set up environment variables for testing
vi.stubEnv('VITE_API_URL', 'http://localhost:3000');

// Global test setup - learned this from the React Testing Library docs
beforeAll(() => {
  // Mock ResizeObserver - had to add this because some components use it
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock window.matchMedia for responsive components
  // Found this solution on Stack Overflow
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock fetch for API testing
  global.fetch = vi.fn();

  // Mock localStorage - needed for auth testing
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
});

afterEach(() => {
  // Clean up after each test
  cleanup();
  vi.clearAllMocks();

  // Reset mocks
  if (global.fetch) {
    global.fetch.mockClear();
  }
  window.localStorage.clear();
});

afterAll(() => {
  // Final cleanup
  vi.clearAllTimers();
  vi.restoreAllMocks();
});

// Suppress annoying console warnings during tests
// TODO: Figure out how to fix these warnings properly
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning:')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
