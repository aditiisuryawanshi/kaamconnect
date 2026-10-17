import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, Users, ShieldCheck, Check, AlertCircle, Building } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { Gig } from '../../types';
import { useAuth } from '../../features/auth/AuthContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useLanguage } from '../../features/i18n/LanguageContext';

export const GigDetailPage: React.FC = () => {
  const { gigId } = useParams<{ gigId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [coverNote, setCoverNote] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { data: gig, isLoading, isError } = useQuery({
    queryKey: ['gig-detail', gigId],
    queryFn: async () => {
      const res = await apiRequest<Gig>(`/gigs/${gigId}`);
      return res.data;
    },
    enabled: !!gigId,
  });

  const applyMutation = useMutation({
    mutationFn: async () => {
      setErrorMessage('');
      return await apiRequest('/applications', {
        method: 'POST',
        body: JSON.stringify({
          listing_type: 'gig',
          listing_id: gigId,
          cover_note: coverNote,
        }),
      });
    },
    onSuccess: () => {
      setSuccessMessage('Your application was submitted successfully! The employer will review your profile.');
      queryClient.invalidateQueries({ queryKey: ['gig-detail', gigId] });
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to submit application.');
    },
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { returnTo: `/gigs/${gigId}` } });
      return;
    }
    applyMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '60px 20px', maxWidth: 900 }}>
        <div className="skeleton" style={{ width: '60%', height: 36, marginBottom: 20 }} />
        <div className="skeleton" style={{ width: '100%', height: 200 }} />
      </div>
    );
  }

  if (isError || !gig) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 12, color: 'var(--color-brand-deep)' }}>Gig Not Found</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20 }}>
          This gig may have been closed, completed, or removed.
        </p>
        <Link to="/gigs" className="btn btn-primary">Browse Open Gigs</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 16px 80px', maxWidth: 1040 }}>
      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
        <Link to="/gigs" style={{ color: 'var(--color-brand-primary)' }}>Gigs</Link> / <span style={{ fontWeight: 600 }}>{gig.title}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
        {/* Left Column: Gig Details */}
        <div>
          {/* Work Photo Banner */}
          <div style={{ position: 'relative', width: '100%', height: '280px', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', backgroundColor: '#F1F5F9' }}>
            <img
              src={gig.image_url || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80'}
              alt={gig.photo_alt_text || `${gig.title} - Mumbai Shift Work`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/assets/categories/moving_loading.jpg';
              }}
            />
            {Boolean(gig.is_demo || gig.employer_is_demo) && (
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                color: '#FDE68A',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '6px',
                letterSpacing: '0.5px'
              }}>
                DEMO GIG LISTING
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
            <span className="badge badge-orange">Shift Gig</span>
            <span className="badge badge-neutral"><MapPin size={12} color="var(--color-action-primary)" /> {gig.locality_name}</span>
            {Boolean(gig.is_demo || gig.employer_is_demo) && (
              <span className="badge badge-warning" style={{ backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D' }}>
                Fictional Shift
              </span>
            )}
          </div>

          <h1 className="brand-title" style={{ fontSize: '2.2rem', lineHeight: 1.25, marginBottom: '16px' }}>
            {gig.title}
          </h1>

          {/* Employer Card */}
          <div className="card" style={{ padding: '18px', backgroundColor: 'var(--color-surface-tint)', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '14px', border: '1px solid #C7D9ED' }}>
            {gig.employer_logo_url ? (
              <img
                src={gig.employer_logo_url}
                alt={gig.employer_logo_alt_text || gig.employer_name || 'Employer Logo'}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '8px',
                  objectFit: 'contain',
                  backgroundColor: '#FFFFFF',
                  padding: '2px',
                  border: '1px solid #CBD5E1'
                }}
                loading="lazy"
              />
            ) : (
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '8px',
                backgroundColor: 'var(--color-brand-primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Building size={22} />
              </div>
            )}
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-brand-deep)' }}>{gig.employer_name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                {Boolean(gig.is_demo || gig.employer_is_demo) ? 'Transparent Demo Employer (Fictional Business)' : (gig.employer_type === 'business' ? 'Registered Enterprise Employer' : 'Direct Verified Employer')}
              </div>
            </div>
          </div>

          {/* Shift Schedule Card */}
          <div className="card" style={{ padding: '24px', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px', color: 'var(--color-brand-deep)' }}>Shift Details & Schedule</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Shift Date</span>
                <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{gig.shift_date}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Timings</span>
                <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{gig.start_time} - {gig.end_time}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Duration</span>
                <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{gig.duration_hours} Hours {gig.is_overnight && '(Overnight)'}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Openings</span>
                <p style={{ fontWeight: 700, fontSize: '0.95rem', color: gig.openings > 0 ? 'var(--color-action-primary)' : 'var(--color-error)' }}>
                  {gig.openings} positions available
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', color: 'var(--color-brand-deep)' }}>Role Overview</h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--color-text-ink)', whiteSpace: 'pre-line' }}>
              {gig.description}
            </p>
          </div>

          {/* Responsibilities */}
          {gig.responsibilities && gig.responsibilities.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px', color: 'var(--color-brand-deep)' }}>Key Responsibilities</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {gig.responsibilities.map((r, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '10px', fontSize: '0.9rem' }}>
                    <Check size={16} color="var(--color-brand-primary)" style={{ flexShrink: 0, marginTop: 3 }} />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Skills */}
          {gig.required_skills && (
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px', color: 'var(--color-brand-deep)' }}>Required Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {gig.required_skills.map((s, idx) => (
                  <span key={idx} className="badge badge-neutral" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Payment Conditions */}
          {gig.payment_conditions && (
            <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--color-action-primary)' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px', color: 'var(--color-brand-deep)' }}>Payment Terms & Conditions</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                {gig.payment_conditions}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Pay & Application Form */}
        <div>
          <div className="card" style={{ padding: '32px', boxShadow: 'var(--shadow-lg)', position: 'sticky', top: '90px' }}>
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 700 }}>
                Shift Compensation
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-action-primary)' }}>
                ₹{gig.pay_amount} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>/ {gig.pay_unit}</span>
              </div>
            </div>

            {gig.is_owner ? (
              <div style={{ backgroundColor: 'var(--color-surface-tint)', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid #C7D9ED' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '12px', color: 'var(--color-brand-deep)' }}>
                  This is your gig listing ({gig.applications_count || 0} applicants).
                </p>
                <Link to="/employer/applicants" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                  Manage Applicants
                </Link>
              </div>
            ) : gig.has_applied ? (
              <div style={{ backgroundColor: 'var(--color-surface-tint)', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid #C7D9ED' }}>
                <Check size={32} color="var(--color-brand-primary)" style={{ margin: '0 auto 8px' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px', color: 'var(--color-brand-deep)' }}>Application Submitted</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
                  Current Status:
                </p>
                <StatusBadge status={gig.user_application_status || 'applied'} type="application" />
                <div style={{ marginTop: '16px' }}>
                  <Link to="/worker/applications" className="btn btn-outline btn-sm">
                    View in My Applications
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px', color: 'var(--color-brand-deep)' }}>
                  Apply for this Shift
                </h3>

                {successMessage && (
                  <div style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '16px', border: '1px solid #A7F3D0' }}>
                    {successMessage}
                  </div>
                )}

                {errorMessage && (
                  <div style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #FECACA' }}>
                    <AlertCircle size={16} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Note to Employer (Optional)</label>
                    <textarea
                      placeholder="e.g. I am punctual, live in Andheri, and have 2 years event setup experience..."
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      className="form-textarea"
                      rows={3}
                    />
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    Your RozgaarSetu worker profile and verified skills will be attached automatically.
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', height: '42px' }}
                    disabled={applyMutation.isPending || gig.openings <= 0}
                  >
                    {applyMutation.isPending
                      ? 'Submitting...'
                      : gig.openings <= 0
                      ? 'No Openings Available'
                      : 'Submit Shift Application'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
