import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, MapPin, Phone, CheckCircle, XCircle, Play, Check } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { Booking } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';

export const WorkerBookingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');

  const { data: bookingData, isLoading, refetch } = useQuery({
    queryKey: ['worker-bookings', statusFilter],
    queryFn: async () => {
      const url = statusFilter
        ? `/bookings/my?role=worker&status=${statusFilter}`
        : '/bookings/my?role=worker';
      const res = await apiRequest<Booking[]>(url);
      return res;
    },
  });

  const acceptMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/bookings/${id}/accept`, { method: 'POST', body: JSON.stringify({}) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['worker-bookings'] }),
  });

  const declineMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/bookings/${id}/decline`, { method: 'POST', body: JSON.stringify({ reason: 'Provider declined' }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['worker-bookings'] }),
  });

  const startMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/bookings/${id}/start`, { method: 'POST', body: JSON.stringify({}) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['worker-bookings'] }),
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/bookings/${id}/complete`, { method: 'POST', body: JSON.stringify({}) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['worker-bookings'] }),
  });

  const bookings = bookingData?.data || [];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 className="editorial-title" style={{ fontSize: '1.8rem', marginBottom: '6px' }}>
          Service Bookings Management
        </h2>
        <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem' }}>
          Inspect incoming requests, schedule visits, and manage execution states.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '6px' }}>
        {[
          { label: 'All Bookings', value: '' },
          { label: 'Requested', value: 'requested' },
          { label: 'Confirmed', value: 'confirmed' },
          { label: 'In Progress', value: 'in_progress' },
          { label: 'Completed', value: 'completed' },
          { label: 'Cancelled', value: 'cancelled' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: '1px solid var(--color-border)',
              backgroundColor: statusFilter === tab.value ? 'var(--color-primary-green)' : 'var(--color-white)',
              color: statusFilter === tab.value ? '#fff' : 'var(--color-dark-ink)',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="card skeleton" style={{ height: '150px' }} />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No bookings in this status"
          description="Bookings received from Mumbai customers will appear here."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {bookings.map((bkg) => (
            <div key={bkg.id} className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-secondary-text)' }}>
                      #{bkg.booking_reference}
                    </span>
                    <StatusBadge status={bkg.status} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                    {bkg.service_title_snapshot}
                  </h3>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-green)' }}>
                    ₹{bkg.pricing_snapshot.estimated_total}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
                    Est. Total ({bkg.pricing_snapshot.unit})
                  </div>
                </div>
              </div>

              {/* Schedule and Locality */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', backgroundColor: '#FAF8F3', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--color-secondary-text)', fontSize: '0.75rem' }}>CUSTOMER</span>
                  <p style={{ fontWeight: 600 }}>{bkg.customer_name} {bkg.customer_phone ? `(${bkg.customer_phone})` : ''}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--color-secondary-text)', fontSize: '0.75rem' }}>DATE & TIME</span>
                  <p style={{ fontWeight: 600 }}>{bkg.scheduled_date} • {bkg.scheduled_time_slot}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--color-secondary-text)', fontSize: '0.75rem' }}>LOCATION</span>
                  <p style={{ fontWeight: 600 }}>{bkg.locality_name}</p>
                </div>
              </div>

              {/* Customer Address (private) */}
              {bkg.service_address_private && (
                <div style={{ fontSize: '0.85rem', marginBottom: '14px' }}>
                  <strong>Address:</strong> {bkg.service_address_private}
                </div>
              )}

              {bkg.customer_instructions && (
                <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', fontStyle: 'italic', marginBottom: '16px' }}>
                  "{bkg.customer_instructions}"
                </div>
              )}

              {/* Action Buttons based on status */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                {bkg.status === 'requested' && (
                  <>
                    <button
                      onClick={() => declineMutation.mutate(bkg.id)}
                      className="btn btn-outline btn-sm"
                      disabled={declineMutation.isPending}
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => acceptMutation.mutate(bkg.id)}
                      className="btn btn-primary btn-sm"
                      disabled={acceptMutation.isPending}
                    >
                      Accept Booking
                    </button>
                  </>
                )}

                {bkg.status === 'confirmed' && (
                  <button
                    onClick={() => startMutation.mutate(bkg.id)}
                    className="btn btn-primary btn-sm"
                    disabled={startMutation.isPending}
                  >
                    <Play size={14} /> Start Service
                  </button>
                )}

                {bkg.status === 'in_progress' && (
                  <button
                    onClick={() => completeMutation.mutate(bkg.id)}
                    className="btn btn-primary btn-sm"
                    disabled={completeMutation.isPending}
                  >
                    <Check size={14} /> Mark Job Completed
                  </button>
                )}

                {bkg.status === 'completed' && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={16} /> Completed & Collected Directly
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
