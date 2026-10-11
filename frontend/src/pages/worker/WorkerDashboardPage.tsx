import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Briefcase,
  Wrench,
  AlertCircle,
  ArrowRight,
  MapPin,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { Booking, Application, WorkerProfile } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAuth } from '../../features/auth/AuthContext';

export const WorkerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch worker profile
  const { data: profile } = useQuery({
    queryKey: ['worker-profile-me'],
    queryFn: async () => {
      const res = await apiRequest<WorkerProfile>('/workers/me');
      return res.data;
    },
  });

  // Fetch worker bookings
  const { data: bookingData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['worker-bookings-dashboard'],
    queryFn: async () => {
      const res = await apiRequest<Booking[]>('/bookings/my?role=worker&limit=10');
      return res;
    },
  });

  // Fetch worker applications
  const { data: applicationData, isLoading: appsLoading } = useQuery({
    queryKey: ['worker-applications-dashboard'],
    queryFn: async () => {
      const res = await apiRequest<Application[]>('/applications/my?limit=5');
      return res;
    },
  });

  // Accept booking mutation
  const acceptMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      return await apiRequest(`/bookings/${bookingId}/accept`, { method: 'POST', body: JSON.stringify({}) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worker-bookings-dashboard'] });
    },
  });

  // Decline booking mutation
  const declineMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      return await apiRequest(`/bookings/${bookingId}/decline`, { method: 'POST', body: JSON.stringify({ reason: 'Unavailable' }) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worker-bookings-dashboard'] });
    },
  });

  const bookings = bookingData?.data || [];
  const applications = applicationData?.data || [];

  const pendingRequests = bookings.filter((b) => b.status === 'requested');
  const upcomingBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'in_progress');

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Welcome & Profile Status Banner */}
      <div className="card" style={{ padding: '28px', marginBottom: '28px', backgroundColor: 'var(--color-primary-green)', color: '#fff' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px' }}>
              Namaste, {user?.name}!
            </h2>
            <p style={{ color: '#D4E2D8', fontSize: '0.9rem' }}>
              {profile?.headline || 'Welcome to your KaamConnect worker hub'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#B3C8BA', fontWeight: 700 }}>
                Profile Completion
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-saffron-orange)' }}>
                {profile?.completion_percentage || 50}%
              </div>
            </div>
            <Link to="/worker/profile" className="btn btn-primary btn-sm">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <Link to="/worker/services" className="card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'var(--color-pale-green)', color: 'var(--color-primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wrench size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>My Services</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>Manage listings & rates</div>
          </div>
        </Link>

        <Link to="/gigs" className="card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#FEF0E6', color: 'var(--color-action-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Find Gigs</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>Immediate shifts</div>
          </div>
        </Link>

        <Link to="/jobs" className="card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Find Jobs</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>Full-time openings</div>
          </div>
        </Link>
      </div>

      {/* INCOMING PENDING REQUESTS */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            Pending Service Requests
            {pendingRequests.length > 0 && (
              <span className="badge badge-orange">{pendingRequests.length}</span>
            )}
          </h3>
          <Link to="/worker/bookings" style={{ fontSize: '0.85rem', color: 'var(--color-action-orange)', fontWeight: 600 }}>
            View All
          </Link>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-secondary-text)' }}>
            No pending booking requests at the moment. Keep your service listings active to receive requests.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {pendingRequests.map((bkg) => (
              <div key={bkg.id} className="card" style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--color-action-orange)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-secondary-text)' }}>
                      #{bkg.booking_reference}
                    </span>
                    <StatusBadge status={bkg.status} />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
                    {bkg.service_title_snapshot}
                  </h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    <span>Customer: <strong>{bkg.customer_name}</strong></span>
                    <span>Date: <strong>{bkg.scheduled_date}</strong> ({bkg.scheduled_time_slot})</span>
                    <span>Locality: <strong>{bkg.locality_name}</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => acceptMutation.mutate(bkg.id)}
                    className="btn btn-primary btn-sm"
                    disabled={acceptMutation.isPending}
                  >
                    Accept Request
                  </button>
                  <button
                    onClick={() => declineMutation.mutate(bkg.id)}
                    className="btn btn-outline btn-sm"
                    disabled={declineMutation.isPending}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* UPCOMING CONFIRMED BOOKINGS */}
      <div style={{ marginBottom: '36px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
          Upcoming Confirmed Bookings ({upcomingBookings.length})
        </h3>
        {upcomingBookings.length === 0 ? (
          <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-secondary-text)' }}>
            No confirmed upcoming visits scheduled.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {upcomingBookings.map((bkg) => (
              <div key={bkg.id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <StatusBadge status={bkg.status} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{bkg.scheduled_date}</span>
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px' }}>
                  {bkg.service_title_snapshot}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', marginBottom: '12px' }}>
                  Client: {bkg.customer_name} {bkg.customer_phone ? `(${bkg.customer_phone})` : ''}
                </p>
                <div style={{ fontSize: '0.8rem', backgroundColor: '#FAF8F3', padding: '10px', borderRadius: 'var(--radius-sm)', marginBottom: '14px' }}>
                  <strong>Address:</strong> {bkg.service_address_private}
                </div>
                <Link to="/worker/bookings" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                  Manage Visit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECENT APPLICATIONS */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            Recent Job & Gig Applications
          </h3>
          <Link to="/worker/applications" style={{ fontSize: '0.85rem', color: 'var(--color-action-orange)', fontWeight: 600 }}>
            View All ({applications.length})
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-secondary-text)' }}>
            You haven't applied to any gigs or jobs yet.{' '}
            <Link to="/gigs" style={{ color: 'var(--color-action-orange)', fontWeight: 600 }}>Browse active gigs</Link>.
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FAF8F3', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>Opportunity</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>Type</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>Applied On</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                        {app.listing_title}
                      </td>
                      <td style={{ padding: '14px 16px', textTransform: 'capitalize' }}>
                        {app.listing_type}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <StatusBadge status={app.status} type="application" />
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-secondary-text)' }}>
                        {new Date(app.applied_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
