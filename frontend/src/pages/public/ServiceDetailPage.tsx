import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  MapPin,
  Clock,
  ShieldCheck,
  Check,
  AlertCircle,
  Star,
  MessageSquare,
  Zap,
  Mail,
  Phone,
} from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { ServiceListing, Locality } from '../../types';
import { useAuth } from '../../features/auth/AuthContext';

// Helper for category-matched photographic hero images
const getServiceDetailHero = (category: string = '', title: string = ''): string => {
  const q = (category + ' ' + title).toLowerCase();
  if (q.includes('plumb') || q.includes('pipe') || q.includes('leak') || q.includes('drain')) {
    return 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?auto=format&fit=crop&w=1200&q=80';
  }
  if (q.includes('clean') || q.includes('house') || q.includes('deep clean')) {
    return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80';
  }
  if (q.includes('electric') || q.includes('wiring') || q.includes('appliance')) {
    return 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80';
  }
  if (q.includes('cook') || q.includes('chef') || q.includes('food')) {
    return 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80';
  }
  if (q.includes('carpent') || q.includes('wood') || q.includes('furniture')) {
    return 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80';
  }
  if (q.includes('paint')) {
    return 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80';
  }
  if (q.includes('beauty') || q.includes('salon')) {
    return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80';
  }
  return 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?auto=format&fit=crop&w=1200&q=80';
};

// Fallback services offered tags
const getDefaultOfferings = (category: string = ''): string[] => {
  const cat = category.toLowerCase();
  if (cat.includes('plumb')) {
    return ['Leakage Repair', 'Bathroom Fitting', 'Pipe Installation', 'Sink Repair', 'Water Heater Installation'];
  }
  if (cat.includes('clean')) {
    return ['Deep Cleaning', 'Kitchen Degreasing', 'Bathroom Sanitization', 'Sofa & Carpet Shampoo', 'Window Cleaning'];
  }
  if (cat.includes('electric')) {
    return ['Switchboard Wiring', 'Ceiling Fan Installation', 'MCB Tripping Repair', 'Short Circuit Check', 'Inverter Setup'];
  }
  if (cat.includes('cook')) {
    return ['North & South Indian Meals', 'Rotis & Parathas', 'Weekly Meal Prep', 'Kitchen Sanitization', 'Dietary Customization'];
  }
  return ['Expert Diagnostic', 'Same Day Service', 'Genuine Spare Parts', 'Workmanship Warranty', 'Post-Service Cleanup'];
};

export const ServiceDetailPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Booking Form state
  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [localityId, setLocalityId] = useState('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Fetch localities
  const { data: allLocalities = [] } = useQuery({
    queryKey: ['localities'],
    queryFn: async () => {
      const res = await apiRequest<Locality[]>('/meta/localities');
      return res.data;
    },
  });

  // Fetch service listing
  const { data: service, isLoading, isError } = useQuery({
    queryKey: ['service-detail', serviceId],
    queryFn: async () => {
      const res = await apiRequest<ServiceListing>(`/services/${serviceId}`);
      if (res.data.service_areas && res.data.service_areas.length > 0 && !localityId) {
        setLocalityId(res.data.service_areas[0].id);
      }
      return res.data;
    },
    enabled: !!serviceId && !serviceId.startsWith('demo-'),
  });

  // Booking mutation
  const bookingMutation = useMutation({
    mutationFn: async () => {
      setErrorMessage('');
      const payload = {
        service_listing_id: service?.id || serviceId,
        scheduled_date: scheduledDate,
        scheduled_time_slot: timeSlot,
        service_locality_id: localityId || (allLocalities[0]?.id || 'loc-1'),
        service_address: address,
        customer_instructions: instructions,
      };
      return await apiRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (data) => {
      navigate('/customer/bookings', { state: { newBookingId: data.data.id } });
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to submit booking request. Please check fields.');
    },
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { returnTo: `/services/${serviceId}` } });
      return;
    }
    if (!address || address.length < 8) {
      setErrorMessage('Please provide a complete service address (at least 8 characters).');
      return;
    }
    bookingMutation.mutate();
  };

  // Safe fallback display data matching design mockup
  const displayTitle = service?.title || 'Professional Plumbing Services';
  const displayCategory = service?.category_name || 'Plumbing';
  const displayPrice = service?.pricing?.amount || 400;
  const displayUnit = service?.pricing?.unit || 'hour';
  const displayWorkerName = service?.worker_name || 'Ravi Sharma';
  const displayWorkerPhoto = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80';
  const heroImage = getServiceDetailHero(displayCategory, displayTitle);
  const offerings = getDefaultOfferings(displayCategory);

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '85vh', padding: '24px 0 64px' }}>
      <div className="container" style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 20px' }}>
        {/* Top Header / Breadcrumb */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#667085' }}>
          <Link to="/" style={{ color: '#123F73', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/services" style={{ color: '#123F73', textDecoration: 'none' }}>Services</Link>
          <span>/</span>
          <span style={{ color: '#0B2F57', fontWeight: 600 }}>{displayTitle}</span>
        </div>

        {/* 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '28px', alignItems: 'start' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '28px' }}>
            
            {/* Left Column: Details */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              {/* Hero Image */}
              <div style={{ position: 'relative', width: '100%', height: '340px', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
                <img
                  src={heroImage}
                  alt={displayTitle}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Title & Reviews */}
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: '#0B2F57',
                  marginBottom: '10px',
                }}
              >
                {displayTitle}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 700, color: '#1E293B' }}>
                  <Star size={16} fill="#FF851B" color="#FF851B" />
                  <span>4.8</span>
                  <span style={{ color: '#667085', fontWeight: 400 }}>(32 reviews)</span>
                </div>
              </div>

              {/* Price, Experience, Availability */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', paddingBottom: '20px', borderBottom: '1px solid #E2E8F0', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FF851B' }}>
                  ₹{displayPrice} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#667085' }}>/ {displayUnit}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#667085', fontWeight: 500 }}>
                  5+ years experience
                </div>
                <div
                  style={{
                    backgroundColor: '#ECFDF5',
                    color: '#059669',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669' }}></span>
                  Available today
                </div>
              </div>

              {/* About */}
              <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: '#0B2F57', marginBottom: '10px' }}>
                  About
                </h2>
                <p style={{ color: '#475467', fontSize: '0.925rem', lineHeight: 1.6 }}>
                  {service?.description || 'Professional plumbing services including leakage repair, bathroom fitting, sink installation and more.'}
                </p>
              </div>

              {/* Services Offered */}
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: '#0B2F57', marginBottom: '12px' }}>
                  Services Offered
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {offerings.map((offering, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: '#F1F5F9',
                        color: '#334155',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      {offering}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Provider Card & Booking Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Provider Card */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  textAlign: 'center',
                }}
              >
                {/* Worker Avatar */}
                <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 12px' }}>
                  <img
                    src={displayWorkerPhoto}
                    alt={displayWorkerName}
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid #FFF1E5' }}
                  />
                </div>

                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: '#0B2F57', marginBottom: '2px' }}>
                  {displayWorkerName}
                </h3>
                <p style={{ color: '#667085', fontSize: '0.85rem', marginBottom: '8px' }}>
                  {displayCategory}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', marginBottom: '18px' }}>
                  <Star size={15} fill="#FF851B" color="#FF851B" />
                  <span>4.8</span>
                  <span style={{ color: '#667085', fontWeight: 400 }}>(32 reviews)</span>
                </div>

                {/* Primary Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  <button
                    onClick={() => setShowBookingForm(true)}
                    style={{
                      width: '100%',
                      backgroundColor: '#FF851B',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '11px',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#E07413')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FF851B')}
                  >
                    Book Now
                  </button>

                  <button
                    onClick={() => alert(`Connect with ${displayWorkerName} via RozgaarSetu Instant Calling Desk (+91-22-ROZGAAR)`)}
                    style={{
                      width: '100%',
                      backgroundColor: '#FFFFFF',
                      color: '#123F73',
                      border: '1px solid #123F73',
                      borderRadius: '8px',
                      padding: '10px',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <MessageSquare size={16} /> Chat
                  </button>
                </div>

                {/* Verification Checklist */}
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.825rem', color: '#475467' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={14} color="#FF851B" />
                    <span>Response Time: <strong>Within 1 hour</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={14} color="#059669" />
                    <span>Email verified</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={14} color="#059669" />
                    <span>Phone verified</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={14} color="#123F73" />
                    <span>Location: Andheri, Mumbai</span>
                  </div>
                </div>
              </div>

              {/* Direct Booking Schedule Card */}
              <div
                id="booking-form-section"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: '#0B2F57', marginBottom: '14px' }}>
                  Schedule Appointment
                </h3>

                {errorMessage && (
                  <div style={{ backgroundColor: '#FEF2F2', color: '#DC2626', padding: '10px 12px', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={14} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, color: '#475467', marginBottom: '4px' }}>
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.85rem' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, color: '#475467', marginBottom: '4px' }}>
                      Preferred Time Window *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10:00 AM - 12:00 PM"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.85rem' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, color: '#475467', marginBottom: '4px' }}>
                      Mumbai Locality *
                    </label>
                    <select
                      value={localityId}
                      onChange={(e) => setLocalityId(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.85rem' }}
                    >
                      <option value="">Select Mumbai Locality</option>
                      {allLocalities.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name} ({loc.region})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, color: '#475467', marginBottom: '4px' }}>
                      Service Address *
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Flat/House no., Building, Street, Landmark"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.85rem', resize: 'none' }}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={bookingMutation.isPending}
                    style={{
                      width: '100%',
                      backgroundColor: '#123F73',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: bookingMutation.isPending ? 'not-allowed' : 'pointer',
                      marginTop: '6px',
                    }}
                  >
                    {bookingMutation.isPending ? 'Confirming...' : 'Confirm Booking'}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
