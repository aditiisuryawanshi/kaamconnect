import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Briefcase, Award, Shield, Star, Wrench, Flag, Check } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { WorkerProfile } from '../../types';

export const ProviderProfilePage: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const { data: provider, isLoading, isError } = useQuery({
    queryKey: ['provider-public', providerId],
    queryFn: async () => {
      const res = await apiRequest<WorkerProfile>(`/workers/providers/${providerId}`);
      return res.data;
    },
    enabled: !!providerId,
  });

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/reports', {
        method: 'POST',
        body: JSON.stringify({
          target_type: 'profile',
          target_id: providerId,
          reason: reportReason,
          description: reportDescription,
        }),
      });
      setReportSubmitted(true);
    } catch {
      alert('Failed to submit report. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '60px 20px', maxWidth: 800 }}>
        <div className="skeleton" style={{ width: 90, height: 90, borderRadius: '50%', marginBottom: 20 }} />
        <div className="skeleton" style={{ width: '50%', height: 32, marginBottom: 12 }} />
        <div className="skeleton" style={{ width: '80%', height: 100 }} />
      </div>
    );
  }

  if (isError || !provider) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 12, color: 'var(--color-brand-deep)' }}>Provider Profile Unavailable</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20 }}>
          This provider profile does not exist or has been made private.
        </p>
        <Link to="/services" className="btn btn-primary">Discover Other Providers</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 16px 80px', maxWidth: 960 }}>
      {/* Top Header Card */}
      <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {provider.profile_photo_url ? (
              <div style={{ position: 'relative' }}>
                <img
                  src={provider.profile_photo_url}
                  alt={provider.photo_alt_text || `${provider.user_name} - Professional Portrait`}
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #FFF1E5',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  loading="lazy"
                />
                {provider.is_demo && (
                  <span style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    border: '1px solid #FCD34D',
                    whiteSpace: 'nowrap'
                  }}>
                    DEMO
                  </span>
                )}
              </div>
            ) : (
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'var(--color-brand-primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '2rem',
                boxShadow: 'var(--shadow-card)'
              }}>
                {provider.user_name?.charAt(0) || 'P'}
              </div>
            )}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h1 className="brand-title" style={{ fontSize: '1.85rem', marginBottom: 0 }}>
                  {provider.user_name}
                </h1>
                {provider.is_demo && (
                  <span className="badge badge-warning" style={{ backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D', fontSize: '0.75rem' }}>
                    Demo Profile
                  </span>
                )}
              </div>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                {provider.headline || 'Service Professional'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.85rem', color: 'var(--color-text-secondary)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Award size={16} color="var(--color-action-primary)" /> {provider.experience_years} Years Experience
                </span>
                {provider.is_demo ? (
                  <span className="badge" style={{ backgroundColor: '#F1F5F9', color: '#475467', border: '1px solid #CBD5E1' }}>
                    Fictional Demonstration Profile
                  </span>
                ) : (
                  <span className="badge badge-navy">
                    <Shield size={12} /> Verified on RozgaarSetu
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setReportModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-text-secondary)',
              fontSize: '0.8rem',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)'
            }}
          >
            <Flag size={14} /> Report Profile
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' }}>
        {/* Left Column: Bio & Skills */}
        <div>
          <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px', color: 'var(--color-brand-deep)' }}>About Professional</h3>
            <p style={{ fontSize: '0.925rem', lineHeight: 1.6, color: 'var(--color-text-ink)', whiteSpace: 'pre-line' }}>
              {provider.bio || 'Experienced local technician dedicated to quality household services in Mumbai.'}
            </p>
          </div>

          {/* Skills */}
          {provider.skills && provider.skills.length > 0 && (
            <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px', color: 'var(--color-brand-deep)' }}>Expertise & Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {provider.skills.map((skill, idx) => (
                  <span key={idx} className="badge badge-neutral" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Localities */}
          {provider.preferred_localities && provider.preferred_localities.length > 0 && (
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px', color: 'var(--color-brand-deep)' }}>Service Areas</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {provider.preferred_localities.map((loc) => (
                  <span key={loc.id} className="badge badge-navy" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                    <MapPin size={13} color="var(--color-action-primary)" /> {loc.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Published Service Listings */}
        <div>
          <h3 className="brand-title" style={{ fontSize: '1.35rem', marginBottom: '16px' }}>
            Service Offerings ({provider.listings?.length || 0})
          </h3>

          {!provider.listings || provider.listings.length === 0 ? (
            <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              No active public service listings at this time.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {provider.listings.map((srv) => (
                <div key={srv.id} className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                      <Link to={`/services/${srv.id}`} style={{ color: 'var(--color-brand-deep)' }}>{srv.title}</Link>
                    </h4>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
                      ₹{srv.pricing.amount} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>/ {srv.pricing.unit}</span>
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                    {srv.description.slice(0, 120)}...
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      Lead time: {srv.booking_lead_time_hours}h
                    </span>
                    <Link to={`/services/${srv.id}`} className="btn btn-primary btn-sm">
                      Request Slot
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 300,
          padding: 16
        }}>
          <div className="card" style={{ maxWidth: 480, width: '100%', padding: 28 }}>
            {reportSubmitted ? (
              <div style={{ textAlign: 'center' }}>
                <Check size={40} color="var(--color-success)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: 8, color: 'var(--color-brand-deep)' }}>Report Submitted</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
                  Thank you for keeping RozgaarSetu safe. Our Mumbai moderation team will inspect this profile.
                </p>
                <button onClick={() => { setReportModalOpen(false); setReportSubmitted(false); }} className="btn btn-primary btn-sm">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 12, color: 'var(--color-brand-deep)' }}>Report Provider Profile</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 16 }}>
                  Please share why this profile violates platform safety or accuracy policies.
                </p>
                <div className="form-group">
                  <label className="form-label">Reason</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Inaccurate information, improper conduct"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Details</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide specific details..."
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    className="form-textarea"
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
                  <button type="button" onClick={() => setReportModalOpen(false)} className="btn btn-outline btn-sm">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-danger btn-sm">
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
