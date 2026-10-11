import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { MapPin, Clock, ShieldCheck, Check, Calendar, AlertCircle } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { ServiceListing, Locality } from '../../types';
import { useAuth } from '../../features/auth/AuthContext';

export const ServiceDetailPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form state
  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [localityId, setLocalityId] = useState('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch service listing details
  const { data: service, isLoading, isError } = useQuery({
    queryKey: ['service-detail', serviceId],
    queryFn: async () => {
      const res = await apiRequest<ServiceListing>(`/services/${serviceId}`);
      if (res.data.service_areas && res.data.service_areas.length > 0 && !localityId) {
        setLocalityId(res.data.service_areas[0].id);
      }
      return res.data;
    },
    enabled: !!serviceId,
  });

  // Booking submission mutation
  const bookingMutation = useMutation({
    mutationFn: async () => {
      setErrorMessage('');
      const payload = {
        service_listing_id: serviceId,
        scheduled_date: scheduledDate,
        scheduled_time_slot: timeSlot,
        service_locality_id: localityId,
        service_address: address,
        customer_instructions: instructions,
        estimated_hours: estimatedHours,
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
    if (!localityId) {
      setErrorMessage('Please select a service locality.');
      return;
    }
    if (!address || address.length < 10) {
      setErrorMessage('Please provide a complete service address (at least 10 characters).');
      return;
    }
    bookingMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '60px 20px', maxWidth: 900 }}>
        <div className="skeleton" style={{ width: '70%', height: '36px', marginBottom: '20px' }} />
        <div className="skeleton" style={{ width: '40%', height: '24px', marginBottom: '40px' }} />
        <div className="skeleton" style={{ width: '100%', height: '200px' }} />
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Service Not Found</h2>
        <p style={{ color: 'var(--color-secondary-text)', marginBottom: '20px' }}>
          This service may have been paused, archived, or is temporarily unavailable.
        </p>
        <Link to="/services" className="btn btn-primary">Browse All Services</Link>
      </div>
    );
  }

  const baseRate = service.pricing.amount;
  const isHourly = service.pricing.unit === 'hour';
  const totalEstimate = isHourly ? baseRate * estimatedHours : baseRate;

  return (
    <div className="container" style={{ padding: '40px 16px 80px', maxWidth: 1100 }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', marginBottom: '20px' }}>
        <Link to="/services">Services</Link> / <Link to={`/services?category=${service.category_slug}`}>{service.category_name}</Link> / <span>{service.title}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
        {/* Left Column: Details & Provider */}
        <div>
          <span className="badge badge-green" style={{ marginBottom: '12px' }}>{service.category_name}</span>
          <h1 className="editorial-title" style={{ fontSize: '2.2rem', lineHeight: 1.25, marginBottom: '16px' }}>
            {service.title}
          </h1>

          {/* Provider Card */}
          <div className="card" style={{ padding: '20px', marginBottom: '28px', backgroundColor: '#FAF8F3' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-green)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem'
                }}>
                  {service.worker_name?.charAt(0) || 'P'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    {service.worker_name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
                    {service.worker_headline || 'Professional Technician'}
                  </p>
                </div>
              </div>
              <Link to={`/providers/${service.worker_profile_id || service.worker_id}`} className="btn btn-outline btn-sm">
                View Full Profile
              </Link>
            </div>
          </div>

          {/* Service Description */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>Service Details</h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--color-dark-ink)', whiteSpace: 'pre-line' }}>
              {service.description}
            </p>
          </div>

          {/* Service Areas */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>Serviceable Mumbai Areas</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {service.service_areas?.map((area) => (
                <span key={area.id} className="badge badge-neutral" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  <MapPin size={13} color="var(--color-action-orange)" /> {area.name}
                </span>
              ))}
            </div>
          </div>

          {/* Lead time & transparency guarantee */}
          <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--color-primary-green)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <ShieldCheck size={20} color="var(--color-primary-green)" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>KaamConnect Service Promise</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', lineHeight: 1.5 }}>
              Minimum lead time: <strong>{service.booking_lead_time_hours} hours</strong>. No prepayment is taken on KaamConnect. You pay the professional directly via Cash or UPI only once the work is performed to your satisfaction.
            </p>
          </div>
        </div>

        {/* Right Column: Booking Request Form */}
        <div>
          <div className="card" style={{ padding: '32px', boxShadow: 'var(--shadow-card)', position: 'sticky', top: '90px' }}>
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-secondary-text)', fontWeight: 700 }}>
                Estimated Service Fee
              </span>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-primary-green)' }}>
                ₹{service.pricing.amount} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-secondary-text)' }}>/ {service.pricing.unit}</span>
              </div>
              {service.pricing.additional_notes && (
                <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
                  {service.pricing.additional_notes}
                </p>
              )}
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '18px' }}>
              Request a Slot
            </h3>

            {errorMessage && (
              <div style={{
                backgroundColor: 'var(--color-error-bg)',
                color: 'var(--color-error)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Requested Date */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Preferred Date *</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              {/* Time Slot */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Preferred Time Window *</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="form-select"
                >
                  <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM (Morning)</option>
                  <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM (Noon)</option>
                  <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Afternoon)</option>
                  <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM (Evening)</option>
                </select>
              </div>

              {/* Locality */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Service Locality *</label>
                <select
                  value={localityId}
                  onChange={(e) => setLocalityId(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Select Mumbai Locality</option>
                  {service.service_areas?.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Flat / House & Building Address *</label>
                <textarea
                  placeholder="e.g. Flat 402, Building A, Hiranandani Gardens, Powai"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-textarea"
                  rows={2}
                  required
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary-text)' }}>
                  🔒 Kept private. Only disclosed to provider once they confirm.
                </span>
              </div>

              {/* Customer Notes */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Issue Details / Instructions (Optional)</label>
                <textarea
                  placeholder="e.g. Fan switch is sparking; please carry testing tool."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="form-textarea"
                  rows={2}
                />
              </div>

              {/* Price Calculation Summary */}
              <div style={{
                backgroundColor: 'var(--color-warm-cream)',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                marginTop: '6px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>Estimated Total:</span>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-primary-green)' }}>
                    ₹{totalEstimate}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
                  Payable to {service.worker_name} upon job completion.
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '8px' }}
                disabled={bookingMutation.isPending}
              >
                {bookingMutation.isPending ? 'Sending Request...' : 'Send Booking Request'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
