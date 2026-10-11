import React from 'react';
import { BookingStatus, ApplicationStatus } from '../../types';

interface StatusBadgeProps {
  status: BookingStatus | ApplicationStatus | string;
  type?: 'booking' | 'application';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'booking' }) => {
  let badgeClass = 'badge-neutral';
  let label = status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  switch (status) {
    case 'confirmed':
    case 'selected':
      badgeClass = 'badge-green';
      break;
    case 'in_progress':
    case 'shortlisted':
      badgeClass = 'badge-orange';
      break;
    case 'completed':
      badgeClass = 'badge-green';
      break;
    case 'requested':
    case 'applied':
    case 'under_review':
      badgeClass = 'badge-warning';
      break;
    case 'declined':
    case 'cancelled':
    case 'rejected':
      badgeClass = 'badge-error';
      break;
    case 'withdrawn':
      badgeClass = 'badge-neutral';
      break;
    default:
      badgeClass = 'badge-neutral';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor', display: 'inline-block' }} />
      {label}
    </span>
  );
};
