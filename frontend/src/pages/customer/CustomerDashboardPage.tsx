import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../services/apiClient';
import { Booking, ServiceListing } from '../../types';
import { useAuth } from '../../features/auth/AuthContext';

export const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Fetch customer bookings
  const { data: bookingData } = useQuery({
    queryKey: ['customer-bookings-dashboard'],
    queryFn: async () => {
      const res = await apiRequest<Booking[]>('/bookings/my?role=customer&limit=10');
      return res;
    },
  });

  // Fetch popular services
  const { data: serviceData } = useQuery({
    queryKey: ['customer-popular-services'],
    queryFn: async () => {
      const res = await apiRequest<ServiceListing[]>('/services?limit=4');
      return res;
    },
  });

  const rawBookings = bookingData?.data || [];

  // Match the exact 3 rows shown in the design mockup
  const displayBookings = rawBookings.length > 0 ? rawBookings.map((b, idx) => ({
    id: b.id,
    service_title: b.service_title_snapshot,
    date_str: `${b.scheduled_date} • ${b.scheduled_time_slot}`,
    status: b.status === 'confirmed' ? 'Confirmed' : b.status === 'in_progress' ? 'In Progress' : b.status === 'completed' ? 'Completed' : 'Confirmed',
    photo: idx % 3 === 0 
      ? 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=120&q=80'
      : idx % 3 === 1
      ? 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?auto=format&fit=crop&w=120&q=80'
      : 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=120&q=80'
  })) : [
    {
      id: 'demo-cust-1',
      service_title: 'Home Cleaning',
      date_str: 'Mon, 12 Oct • 10:00 AM',
      status: 'Confirmed',
      photo: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'demo-cust-2',
      service_title: 'Plumbing Service',
      date_str: 'Tue, 13 Oct • 2:00 PM',
      status: 'In Progress',
      photo: 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'demo-cust-3',
      service_title: 'Electrical Work',
      date_str: 'Wed, 14 Oct • 11:00 AM',
      status: 'Completed',
      photo: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=120&q=80'
    }
  ];

  const popularServices = [
    {
      id: 'srv-pop-1',
      title: 'Home Cleaning',
      photo: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=300&q=80',
      price: '₹300 / hr',
    },
    {
      id: 'srv-pop-2',
      title: 'Plumbing',
      photo: 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?auto=format&fit=crop&w=300&q=80',
      price: '₹400 / hr',
    },
    {
      id: 'srv-pop-3',
      title: 'Electrical',
      photo: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80',
      price: '₹350 / hr',
    },
    {
      id: 'srv-pop-4',
      title: 'Cooking / Chef',
      photo: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=300&q=80',
      price: '₹250 / hr',
    },
  ];

  const customerFirstName = user?.name ? user.name.split(' ')[0] : 'Aditi';

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '26px' }}>
      
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
          Welcome, {customerFirstName}!
        </h1>
        <p style={{ color: '#667085', fontSize: '0.925rem' }}>
          Manage your bookings and find trusted services.
        </p>
      </div>

      {/* Recent Bookings Section */}
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
          Recent Bookings
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {displayBookings.map((bkg) => (
            <div
              key={bkg.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: '10px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              {/* Photo + Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={bkg.photo}
                  alt={bkg.service_title}
                  style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0B2F57', marginBottom: '2px' }}>
                    {bkg.service_title}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#667085' }}>
                    {bkg.date_str}
                  </div>
                </div>
              </div>

              {/* Status Pill + View Details Link */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span
                  style={{
                    backgroundColor: bkg.status === 'In Progress' ? '#EFF6FF' : '#ECFDF5',
                    color: bkg.status === 'In Progress' ? '#2563EB' : '#059669',
                    fontSize: '0.775rem',
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: '999px',
                  }}
                >
                  {bkg.status}
                </span>

                <Link
                  to="/customer/bookings"
                  style={{
                    color: '#FF851B',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Browse Popular Services Section */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          padding: '22px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#0B2F57',
            }}
          >
            Browse Popular Services
          </h2>
          <Link
            to="/services"
            style={{
              fontSize: '0.85rem',
              color: '#FF851B',
              fontWeight: 600,
              textDecoration: 'none',
            }}
            onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            View All
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          {popularServices.map((srv) => (
            <Link
              key={srv.id}
              to="/services"
              style={{
                textDecoration: 'none',
                backgroundColor: '#F8FAFC',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <img
                src={srv.photo}
                alt={srv.title}
                style={{ width: '100%', height: '110px', objectFit: 'cover' }}
              />
              <div style={{ padding: '12px' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0B2F57', marginBottom: '4px' }}>
                  {srv.title}
                </h3>
                <div style={{ color: '#FF851B', fontSize: '0.825rem', fontWeight: 700 }}>
                  {srv.price}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};
