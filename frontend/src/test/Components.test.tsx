import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EmptyState } from '../components/ui/EmptyState';

describe('UI Components Unit Tests', () => {
  it('renders StatusBadge with appropriate text formatting', () => {
    const { rerender } = render(<StatusBadge status="confirmed" type="booking" />);
    expect(screen.getByText('Confirmed')).toBeTruthy();

    rerender(<StatusBadge status="in_progress" type="booking" />);
    expect(screen.getByText('In Progress')).toBeTruthy();

    rerender(<StatusBadge status="selected" type="application" />);
    expect(screen.getByText('Selected')).toBeTruthy();
  });

  it('renders EmptyState with custom title, description, and action button', () => {
    render(
      <BrowserRouter>
        <EmptyState
          title="No Open Shifts"
          description="Check back tomorrow for morning shifts."
          actionText="Browse All"
          actionPath="/gigs"
        />
      </BrowserRouter>
    );

    expect(screen.getByText('No Open Shifts')).toBeTruthy();
    expect(screen.getByText('Check back tomorrow for morning shifts.')).toBeTruthy();
    expect(screen.getByText('Browse All')).toBeTruthy();
  });
});
