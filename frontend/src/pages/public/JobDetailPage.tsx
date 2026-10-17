import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Building,
  MapPin,
  Clock,
  Briefcase,
  ShieldCheck,
  Check,
  Bookmark,
  Star,
  CheckCircle,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { Job } from '../../types';
import { useAuth } from '../../features/auth/AuthContext';

const getJobDetailHero = (title: string = ''): string => {
  const t = title.toLowerCase();
  if (t.includes('security') || t.includes('guard')) {
    return 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1200&q=80';
  }
  if (t.includes('delivery') || t.includes('driver')) {
    return 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=1200&q=80';
  }
  if (t.includes('warehouse') || t.includes('logistics')) {
    return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80';
  }
  if (t.includes('electrician') || t.includes('facility')) {
    return 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80';
  }
  if (t.includes('office') || t.includes('assistant')) {
    return 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80';
  }
  if (t.includes('cook') || t.includes('chef')) {
    return 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80';
  }
  return 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1200&q=80';
};

export const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [coverNote, setCoverNote] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [saved, setSaved] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: ['job-detail', jobId],
    queryFn: async () => {
      const res = await apiRequest<Job>(`/jobs/${jobId}`);
      return res.data;
    },
    enabled: !!jobId,
  });

  const applyMutation = useMutation({
    mutationFn: async () => {
      setErrorMessage('');
      return await apiRequest('/applications', {
        method: 'POST',
        body: JSON.stringify({
          listing_type: 'job',
          listing_id: job?.id || jobId,
          cover_note: coverNote,
        }),
      });
    },
    onSuccess: () => {
      setSuccessMessage('Your job application has been submitted successfully! The employer will review your profile.');
      queryClient.invalidateQueries({ queryKey: ['job-detail', jobId] });
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to submit application.');
    },
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { returnTo: `/jobs/${jobId}` } });
      return;
    }
    applyMutation.mutate();
  };

  // Safe fallback display data matching design screenshot
  const displayTitle = job?.title || 'Security Guard (Full-time)';
  const displayEmployer = job?.employer_name || 'ABC Security Pvt Ltd';
  const displayLocality = job?.locality_name ? `${job.locality_name}, Mumbai` : 'Mumbai';
  const displaySalaryMin = job?.salary_min || 15000;
  const displaySalaryMax = job?.salary_max || 20000;
  const displayPayPeriod = job?.pay_period || 'month';
  const heroImage = job?.image_url || getJobDetailHero(displayTitle);
  const heroAlt = job?.photo_alt_text || `${displayTitle} - Mumbai Employment Opportunity`;
  const isDemoJob = Boolean(job?.is_demo || job?.employer_is_demo);

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '85vh', padding: '24px 0 64px' }}>
      <div className="container" style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 20px' }}>
        {/* Top Header / Breadcrumb */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#667085' }}>
          <Link to="/" style={{ color: '#123F73', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/jobs" style={{ color: '#123F73', textDecoration: 'none' }}>Jobs</Link>
          <span>/</span>
          <span style={{ color: '#0B2F57', fontWeight: 600 }}>{displayTitle}</span>
        </div>

        {/* 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '28px', alignItems: 'start' }}>
          
          {/* Left Column: Job Details */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            
            {/* Banner Photo */}
            <div style={{ position: 'relative', width: '100%', height: '340px', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', backgroundColor: '#F1F5F9' }}>
              <img
                src={heroImage}
                alt={heroAlt}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = '/assets/categories/moving_loading.jpg';
                }}
              />
              {isDemoJob && (
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
                  DEMO JOB LISTING
                </div>
              )}
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#0B2F57',
                marginBottom: '8px',
              }}
            >
              {displayTitle}
            </h1>

            {/* Subline: Company Logo/Name, Rating, Location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {job?.employer_logo_url && (
                  <img
                    src={job.employer_logo_url}
                    alt={job.employer_logo_alt_text || displayEmployer}
                    style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'contain' }}
                    loading="lazy"
                  />
                )}
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>
                  {displayEmployer}
                </span>
              </div>
              {isDemoJob && (
                <span className="badge badge-warning" style={{ backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D', fontSize: '0.75rem' }}>
                  Demo Position
                </span>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', fontWeight: 700, color: '#1E293B' }}>
                <Star size={15} fill="#FF851B" color="#FF851B" />
                <span>4.2</span>
                <span style={{ color: '#667085', fontWeight: 400 }}>(18 reviews)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#667085' }}>
                <MapPin size={14} color="#FF851B" />
                <span>{displayLocality}</span>
              </div>
            </div>

            {/* Salary */}
            <div style={{ color: '#FF851B', fontSize: '1.35rem', fontWeight: 800, marginBottom: '16px' }}>
              ₹{displaySalaryMin.toLocaleString()} - ₹{displaySalaryMax.toLocaleString()}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#667085' }}>
                / {displayPayPeriod}
              </span>
            </div>

            {/* Badges Row */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
              <span style={{ backgroundColor: '#F1F5F9', color: '#1E293B', padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                Full-time
              </span>
              <span style={{ backgroundColor: '#F1F5F9', color: '#1E293B', padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                On-site
              </span>
              <span style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                Immediate Joining
              </span>
            </div>

            {/* Job Description Section */}
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: '#0B2F57', marginBottom: '10px' }}>
                Job Description
              </h2>
              <p style={{ color: '#475467', fontSize: '0.925rem', lineHeight: 1.65 }}>
                {job?.description || 'We are looking for reliable and disciplined security guards for residential and commercial properties in Mumbai. The role involves managing entry/exit gates, maintaining visitor registers, periodic premises patrolling, and responding to emergency alarms.'}
              </p>
            </div>

            {/* Requirements Section */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: '#0B2F57', marginBottom: '12px' }}>
                Requirements
              </h2>
              <ul style={{ paddingLeft: '20px', color: '#475467', fontSize: '0.925rem', lineHeight: 1.8 }}>
                <li>Minimum 10th pass</li>
                <li>Physically fit</li>
                <li>Prior experience preferred</li>
                <li>Good communication skills</li>
                {job?.required_skills?.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

          </div>

          {/* Right Column: Employer Card & Job Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Employer Card */}
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
              {/* Logo / Icon */}
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  backgroundColor: '#FFF1E5',
                  color: '#FF851B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  fontWeight: 800,
                  fontSize: '1.4rem',
                }}
              >
                <Building size={28} />
              </div>

              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: '#0B2F57', marginBottom: '4px' }}>
                {displayEmployer}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', color: '#059669', fontWeight: 600, marginBottom: '6px' }}>
                <CheckCircle size={14} />
                <span>Verified Employer</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', marginBottom: '20px' }}>
                <Star size={14} fill="#FF851B" color="#FF851B" />
                <span>4.6</span>
                <span style={{ color: '#667085', fontWeight: 400 }}>(32 reviews)</span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => {
                    const el = document.getElementById('apply-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
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
                  Apply Now
                </button>

                <button
                  onClick={() => setSaved(!saved)}
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
                  <Bookmark size={15} fill={saved ? '#123F73' : 'none'} />
                  {saved ? 'Saved' : 'Save Job'}
                </button>
              </div>
            </div>

            {/* Job Details Sidebar Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '22px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: '#0B2F57', marginBottom: '16px' }}>
                Job Details
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#667085' }}>Posted</span>
                  <span style={{ fontWeight: 600, color: '#1E293B' }}>2 days ago</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#667085' }}>Position</span>
                  <span style={{ fontWeight: 600, color: '#1E293B' }}>Security Guard</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#667085' }}>Job Type</span>
                  <span style={{ fontWeight: 600, color: '#1E293B' }}>Full-time</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#667085' }}>Location</span>
                  <span style={{ fontWeight: 600, color: '#1E293B' }}>{displayLocality}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#667085' }}>Salary</span>
                  <span style={{ fontWeight: 700, color: '#FF851B' }}>₹{displaySalaryMin.toLocaleString()} - ₹{displaySalaryMax.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#667085' }}>Experience</span>
                  <span style={{ fontWeight: 600, color: '#1E293B' }}>0 - 2 years</span>
                </div>
              </div>
            </div>

            {/* Application Section */}
            <div
              id="apply-section"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '22px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: '#0B2F57', marginBottom: '12px' }}>
                Submit Application
              </h3>

              {successMessage ? (
                <div style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={16} />
                  <span>{successMessage}</span>
                </div>
              ) : (
                <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {errorMessage && (
                    <div style={{ backgroundColor: '#FEF2F2', color: '#DC2626', padding: '10px', borderRadius: '8px', fontSize: '0.8rem' }}>
                      {errorMessage}
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, color: '#475467', marginBottom: '4px' }}>
                      Quick Note to Hiring Manager
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mention your relevant Mumbai experience and joining availability..."
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.85rem', resize: 'none' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={applyMutation.isPending}
                    style={{
                      width: '100%',
                      backgroundColor: '#123F73',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: applyMutation.isPending ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {applyMutation.isPending ? 'Submitting...' : 'Send Application'}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
