import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Clock, Wrench, MapPin, Calendar, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { Booking, ServiceListing } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAuth } from '../../features/auth/AuthContext';

export const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Fetch customer bookings
  const { data: bookingData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['customer-bookings-dashboard'],
    queryFn: async () => {
      const res = await apiRequest<Booking[]>('/bookings/my?role=customer&limit=5');
      return res;
    },
  });

  // Fetch recommended services
  const { data: serviceData } = useQuery({
    queryKey: ['customer-recommended-services'],
    queryFn: async () => {
      const res = await apiRequest<ServiceListing[]>('/services?limit=4');
      return res;
    },
  });

  const bookings = bookingData?.data || [];
  const recommendedServices = serviceData?.data || [];

  const upcomingBookings = bookings.filter((b) => ['requested', 'confirmed', 'in_progress'].includes(b.status));

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto' }}>
      {/* Welcome Banner */}
      <div className="card" style={{ padding: '28px', marginBottom: '28px', backgroundColor: 'var(--color-primary-green)', color: '#fff' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px' }}>
              Welcome back, {user?.name}!
            </h2>
            <p style={{ color: '#D4E2D8', fontSize: '0.9rem' }}>
              Manage your Mumbai household services and upcoming technician appointments.
            </p>
          </div>

          <Link to="/services" className="btn btn-primary btn-sm">
            Discover Services
          </Link>
        </div>
      </div>

      {/* Upcoming / Active Bookings */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            Active & Upcoming Bookings ({upcomingBookings.length})
          </h3>
          <Link to="/customer/bookings" style={{ fontSize: '0.85rem', color: 'var(--color-action-orange)', fontWeight: 600 }}>
            View Booking History
          </Link>
        </div>

        {bookingsLoading ? (
          <div className="card skeleton" style={{ height: '140px' }} />
        ) : upcomingBookings.length === 0 ? (
          <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-secondary-text)', marginBottom: '16px' }}>
              You don't have any active service requests right now.
            </p>
            <Link to="/services" className="btn btn-primary btn-sm">
              Book a Service Now
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {upcomingBookings.map((bkg) => (
              <div key={bkg.id} className="card" style={{ padding: '22px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-secondary-text)' }}>
                      #{bkg.booking_reference}
                    </span>
                    <StatusBadge status={bkg.status} />
                  </div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
                    {bkg.service_title_snapshot}
                  </h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span>Provider: <strong>{bkg.worker_name}</strong></span>
                    <span>•</span>
                    <span>Date: <strong>{bkg.scheduled_date} ({bkg.scheduled_time_slot})</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary-green)' }}>
                      ₹{bkg.pricing_snapshot.estimated_total}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
                      {bkg.pricing_snapshot.unit} rate
                    </div>
                  </div>
                  <Link to={`/customer/bookings`} className="btn btn-outline btn-sm">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Services in Mumbai */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            Popular Services in Mumbai
          </h3>
          <Link to="/services" style={{ fontSize: '0.85rem', color: 'var(--color-action-orange)', fontWeight: 600 }}>
            Browse All Services
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {recommendedServices.map((srv) => (
            <div key={srv.id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="badge badge-green" style={{ marginBottom: 10 }}>{srv.category_name}</span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 8 }}>
                  <Link to={`/services/${srv.id}`}>{srv.title}</Link>
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--color-secondary-text)', lineHeight: 1.4, marginBottom: 12 }}>
                  By {srv.worker_name}
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 10 }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary-green)' }}>
                  ₹{srv.pricing.amount} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-secondary-text)' }}>/ {srv.pricing.unit}</span>
                </span>
                <Link to={`/services/${srv.id}`} className="btn btn-primary btn-sm">
                  Book Slot
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
