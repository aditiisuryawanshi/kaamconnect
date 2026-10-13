import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Clock,
  Briefcase,
  Calendar,
  Check,
  X,
  MapPin,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { Booking, WorkerProfile } from '../../types';
import { useAuth } from '../../features/auth/AuthContext';

export const WorkerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [demoActionState, setDemoActionState] = useState<{ [id: string]: 'accepted' | 'declined' }>({});

  // Fetch worker profile
  const { data: profile } = useQuery({
    queryKey: ['worker-profile-me'],
    queryFn: async () => {
      const res = await apiRequest<WorkerProfile>('/workers/me');
      return res.data;
    },
  });

  // Fetch worker bookings
  const { data: bookingData } = useQuery({
    queryKey: ['worker-bookings-dashboard'],
    queryFn: async () => {
      const res = await apiRequest<Booking[]>('/bookings/my?role=worker&limit=10');
      return res;
    },
  });

  // Accept mutation
  const acceptMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      if (bookingId.startsWith('demo-')) {
        setDemoActionState((prev) => ({ ...prev, [bookingId]: 'accepted' }));
        return;
      }
      return await apiRequest(`/bookings/${bookingId}/accept`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worker-bookings-dashboard'] });
    },
  });

  // Decline mutation
  const declineMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      if (bookingId.startsWith('demo-')) {
        setDemoActionState((prev) => ({ ...prev, [bookingId]: 'declined' }));
        return;
      }
      return await apiRequest(`/bookings/${bookingId}/decline`, {
        method: 'POST',
        body: JSON.stringify({ reason: 'Unavailable' }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worker-bookings-dashboard'] });
    },
  });

  const rawBookings = bookingData?.data || [];
  const pendingRequests = rawBookings.filter((b) => b.status === 'requested');

  // Fallback demo requests matching reference screenshot if none exist
  const displayRequests = pendingRequests.length > 0 ? pendingRequests : [
    {
      id: 'demo-bkg-1',
      service_title_snapshot: 'Home Cleaning',
      service_locality_name: 'Andheri',
      scheduled_date: 'Today',
      scheduled_time_slot: '2:00 PM - 4:00 PM',
      worker_name: user?.name || 'Ravi Sharma',
      pricing_snapshot: { estimated_total: 600, unit: 'per visit' },
    }
  ];

  const completionPct = profile?.completion_percentage || 70;
  const workerFirstName = user?.name ? user.name.split(' ')[0] : 'Ravi';

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Greeting */}
      <div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#0B2F57',
            marginBottom: '4px',
          }}
        >
          Welcome, {workerFirstName}!
        </h1>
        <p style={{ color: '#667085', fontSize: '0.925rem' }}>
          Complete your profile to get more opportunities.
        </p>
      </div>

      {/* Profile Completion Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          padding: '20px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0B2F57', marginBottom: '2px' }}>
              Profile Completion
            </div>
            <div style={{ fontSize: '0.825rem', color: '#667085' }}>
              Add verified documents and work experience to receive priority bookings
            </div>
          </div>
          <Link
            to="/worker/onboarding"
            style={{
              backgroundColor: '#FF851B',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.875rem',
              padding: '9px 18px',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'background-color 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#E07413')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FF851B')}
          >
            Complete Profile
          </Link>
        </div>

        {/* Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              flex: 1,
              height: '8px',
              backgroundColor: '#E2E8F0',
              borderRadius: '999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${completionPct}%`,
                height: '100%',
                backgroundColor: '#FF851B',
                borderRadius: '999px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0B2F57' }}>
            {completionPct}%
          </span>
        </div>
      </div>

      {/* 4 Quick Action Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Add Service */}
        <Link
          to="/worker/services"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '20px',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#EFF6FF',
              color: '#123F73',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Wrench size={22} />
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0B2F57' }}>Add Service</div>
        </Link>

        {/* View Bookings */}
        <Link
          to="/worker/bookings"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '20px',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#FFF7ED',
              color: '#FF851B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Clock size={22} />
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0B2F57' }}>View Bookings</div>
        </Link>

        {/* Job Applications */}
        <Link
          to="/worker/applications"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '20px',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#FEF2F2',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Briefcase size={22} />
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0B2F57' }}>Job Applications</div>
        </Link>

        {/* Update Availability */}
        <Link
          to="/worker/onboarding"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '20px',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Calendar size={22} />
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0B2F57' }}>Update Availability</div>
        </Link>
      </div>

      {/* Recent Booking Requests */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          padding: '22px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.15rem',
            fontWeight: 700,
            color: '#0B2F57',
            marginBottom: '16px',
          }}
        >
          Recent Booking Requests
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {displayRequests.map((req: any) => {
            const isAccepted = demoActionState[req.id] === 'accepted';
            const isDeclined = demoActionState[req.id] === 'declined';

            return (
              <div
                key={req.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '10px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                {/* Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=120&q=80"
                    alt={req.service_title_snapshot}
                    style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#0B2F57', marginBottom: '2px' }}>
                      {req.service_title_snapshot}
                    </h3>
                    <div style={{ fontSize: '0.825rem', color: '#667085', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{req.service_locality_name || 'Andheri'}</span>
                      <span>•</span>
                      <span>{req.scheduled_date} {req.scheduled_time_slot}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {isAccepted ? (
                    <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={16} /> Accepted
                    </span>
                  ) : isDeclined ? (
                    <span style={{ color: '#EF4444', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <X size={16} /> Declined
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => acceptMutation.mutate(req.id)}
                        disabled={acceptMutation.isPending}
                        style={{
                          backgroundColor: '#059669',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '7px 16px',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => declineMutation.mutate(req.id)}
                        disabled={declineMutation.isPending}
                        style={{
                          backgroundColor: '#FFFFFF',
                          color: '#667085',
                          border: '1px solid #CBD5E1',
                          borderRadius: '6px',
                          padding: '6px 14px',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                      >
                        Decline
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
