import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Simple component for testing
function SampleComponent({ title = 'Test Component' }) {
  return (
    <div data-testid="sample-component">
      <h1>{title}</h1>
      <p>This is a sample component for testing.</p>
    </div>
  );
}

describe('Sample Component Tests', () => {
  it('renders with default title', () => {
    render(<SampleComponent />);

    expect(screen.getByTestId('sample-component')).toBeInTheDocument();
    expect(screen.getByText('Test Component')).toBeInTheDocument();
    expect(screen.getByText('This is a sample component for testing.')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    const customTitle = 'Custom Title';
    render(<SampleComponent title={customTitle} />);

    expect(screen.getByText(customTitle)).toBeInTheDocument();
  });

  it('has correct structure', () => {
    render(<SampleComponent />);

    const component = screen.getByTestId('sample-component');
    expect(component).toBeInTheDocument();

    const heading = component.querySelector('h1');
    const paragraph = component.querySelector('p');

    expect(heading).toBeInTheDocument();
    expect(paragraph).toBeInTheDocument();
  });
});
