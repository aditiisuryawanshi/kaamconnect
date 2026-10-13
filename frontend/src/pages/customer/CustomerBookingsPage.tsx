import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, MapPin, Phone, ShieldCheck, AlertCircle, X, Check } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { Booking } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Link } from 'react-router-dom';

export const CustomerBookingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [cancelingBookingId, setCancelingBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const { data: bookingData, isLoading } = useQuery({
    queryKey: ['customer-bookings', statusFilter],
    queryFn: async () => {
      const url = statusFilter
        ? `/bookings/my?role=customer&status=${statusFilter}`
        : '/bookings/my?role=customer';
      const res = await apiRequest<Booking[]>(url);
      return res;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      return await apiRequest(`/bookings/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-bookings'] });
      setCancelingBookingId(null);
      setCancelReason('');
    },
  });

  const bookings = bookingData?.data || [];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 className="brand-title" style={{ fontSize: '1.8rem', marginBottom: '6px' }}>
          My Service Bookings
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          Track scheduled appointments, technician acceptance, work progress, and verified completion.
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
              backgroundColor: statusFilter === tab.value ? 'var(--color-brand-primary)' : 'var(--color-surface-white)',
              color: statusFilter === tab.value ? '#fff' : 'var(--color-text-ink)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2].map((n) => (
            <div key={n} className="card skeleton" style={{ height: '140px' }} />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No bookings match this filter"
          description="Ready to schedule an electrician, cleaning expert, or technician?"
          actionText="Find Services"
          actionPath="/services"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {bookings.map((bkg) => (
            <div key={bkg.id} className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                      #{bkg.booking_reference}
                    </span>
                    <StatusBadge status={bkg.status} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px', color: 'var(--color-brand-deep)' }}>
                    {bkg.service_title_snapshot}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    Provider: <strong style={{ color: 'var(--color-brand-primary)' }}>{bkg.worker_name}</strong> {bkg.worker_phone ? `(📞 ${bkg.worker_phone})` : '(Phone unlocked upon confirmation)'}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
                    ₹{bkg.pricing_snapshot.estimated_total}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    Estimated Total Fee
                  </div>
                </div>
              </div>

              {/* Schedule and Locality */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', backgroundColor: 'var(--color-surface-tint)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.85rem', border: '1px solid #C7D9ED' }}>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', fontWeight: 700 }}>DATE & TIME</span>
                  <p style={{ fontWeight: 600 }}>{bkg.scheduled_date} • {bkg.scheduled_time_slot}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', fontWeight: 700 }}>MUMBAI REGION</span>
                  <p style={{ fontWeight: 600 }}>{bkg.locality_name}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', fontWeight: 700 }}>PAYMENT TERMS</span>
                  <p style={{ fontWeight: 600, color: 'var(--color-brand-primary)' }}>Pay Direct (Cash / UPI)</p>
                </div>
              </div>

              {bkg.cancellation_reason && (
                <div style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.825rem', marginBottom: '14px', border: '1px solid #FECACA' }}>
                  <strong>Cancellation Reason:</strong> {bkg.cancellation_reason}
                </div>
              )}

              {/* Action buttons */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                  Created on {new Date(bkg.created_at).toLocaleDateString()}
                </span>

                {['requested', 'confirmed'].includes(bkg.status) && (
                  <button
                    onClick={() => setCancelingBookingId(bkg.id)}
                    className="btn btn-outline btn-sm"
                    style={{ color: 'var(--color-error)', borderColor: '#FECACA' }}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      {cancelingBookingId && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 300,
          padding: '16px'
        }}>
          <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', color: 'var(--color-brand-deep)' }}>Cancel Booking</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
              Please specify the reason for cancellation. The technician will be notified immediately.
            </p>
            <div className="form-group">
              <label className="form-label">Cancellation Reason *</label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Schedule conflict, problem solved already..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="form-textarea"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button onClick={() => setCancelingBookingId(null)} className="btn btn-outline btn-sm">
                Keep Booking
              </button>
              <button
                onClick={() => {
                  if (cancelReason.trim().length >= 5) {
                    cancelMutation.mutate({ id: cancelingBookingId, reason: cancelReason });
                  } else {
                    alert('Please enter at least 5 characters for the reason.');
                  }
                }}
                className="btn btn-danger btn-sm"
                disabled={cancelMutation.isPending}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
