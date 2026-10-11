import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Briefcase, Building, MapPin, Check, ShieldCheck, AlertCircle } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { Job } from '../../types';
import { useAuth } from '../../features/auth/AuthContext';
import { StatusBadge } from '../../components/ui/StatusBadge';

export const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [coverNote, setCoverNote] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { data: job, isLoading, isError } = useQuery({
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
          listing_id: jobId,
          cover_note: coverNote,
        }),
      });
    },
    onSuccess: () => {
      setSuccessMessage('Job application submitted successfully! The hiring manager has been notified.');
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

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '60px 20px', maxWidth: 900 }}>
        <div className="skeleton" style={{ width: '60%', height: 36, marginBottom: 20 }} />
        <div className="skeleton" style={{ width: '100%', height: 200 }} />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 12 }}>Job Vacancy Not Found</h2>
        <p style={{ color: 'var(--color-secondary-text)', marginBottom: 20 }}>
          This job vacancy may have expired or been fulfilled.
        </p>
        <Link to="/jobs" className="btn btn-primary">Browse Open Jobs</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 16px 80px', maxWidth: 1040 }}>
      <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', marginBottom: '20px' }}>
        <Link to="/jobs">Jobs</Link> / <span>{job.title}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
        {/* Left Column: Details */}
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <span className="badge badge-green">{job.employment_type.replace('_', ' ').toUpperCase()}</span>
            <span className="badge badge-neutral"><MapPin size={12} /> {job.locality_name}</span>
          </div>

          <h1 className="editorial-title" style={{ fontSize: '2.2rem', lineHeight: 1.25, marginBottom: '16px' }}>
            {job.title}
          </h1>

          {/* Employer Card */}
          <div className="card" style={{ padding: '20px', backgroundColor: '#FAF8F3', marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '8px',
                backgroundColor: 'var(--color-primary-green)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Building size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{job.employer_name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
                  {job.employer_description || 'Hiring Enterprise in Mumbai Region'}
                </p>
              </div>
            </div>
          </div>

          {/* Key Facts */}
          <div className="card" style={{ padding: '24px', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px' }}>Job Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', textTransform: 'uppercase' }}>Monthly Salary</span>
                <p style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-primary-green)' }}>
                  ₹{job.salary_min.toLocaleString()} - ₹{job.salary_max.toLocaleString()}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', textTransform: 'uppercase' }}>Schedule</span>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{job.schedule}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', textTransform: 'uppercase' }}>Experience Required</span>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{job.experience_requirements}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', textTransform: 'uppercase' }}>Location</span>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{job.locality_name}, Mumbai</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>Role Description</h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--color-dark-ink)', whiteSpace: 'pre-line' }}>
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px' }}>Responsibilities</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {job.responsibilities.map((r, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '10px', fontSize: '0.9rem' }}>
                    <Check size={16} color="var(--color-primary-green)" style={{ flexShrink: 0, marginTop: 3 }} />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px' }}>Required Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
              {job.required_skills?.map((s, idx) => (
                <span key={idx} className="badge badge-green" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  {s}
                </span>
              ))}
            </div>

            {job.preferred_skills && job.preferred_skills.length > 0 && (
              <>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-secondary-text)', marginBottom: '8px' }}>Preferred Skills</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {job.preferred_skills.map((s, idx) => (
                    <span key={idx} className="badge badge-neutral" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="card" style={{ padding: '24px', backgroundColor: '#FAF8F3' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Benefits & Perks</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                {job.benefits.map((b, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                    <Check size={16} color="var(--color-action-orange)" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Apply Form */}
        <div>
          <div className="card" style={{ padding: '32px', boxShadow: 'var(--shadow-card)', position: 'sticky', top: '90px' }}>
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-secondary-text)', fontWeight: 700 }}>
                Compensation
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary-green)' }}>
                ₹{job.salary_min.toLocaleString()} - ₹{job.salary_max.toLocaleString()}
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-secondary-text)' }}> / {job.pay_period}</span>
              </div>
            </div>

            {job.is_owner ? (
              <div style={{ backgroundColor: '#FAF8F3', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '12px' }}>
                  This is your job posting ({job.applications_count || 0} applicants).
                </p>
                <Link to="/employer/applicants" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                  Review Candidates
                </Link>
              </div>
            ) : job.has_applied ? (
              <div style={{ backgroundColor: 'var(--color-pale-green)', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <Check size={32} color="var(--color-success)" style={{ margin: '0 auto 8px' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>Application Sent</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', marginBottom: '14px' }}>
                  Current Status:
                </p>
                <StatusBadge status={job.user_application_status || 'applied'} type="application" />
                <div style={{ marginTop: '16px' }}>
                  <Link to="/worker/applications" className="btn btn-outline btn-sm">
                    Track Application
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px' }}>
                  Apply for this Vacancy
                </h3>

                {successMessage && (
                  <div style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '16px' }}>
                    {successMessage}
                  </div>
                )}

                {errorMessage && (
                  <div style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={16} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Cover Note / Experience Summary</label>
                    <textarea
                      placeholder="Briefly highlight your relevant experience and why you are interested in this position..."
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      className="form-textarea"
                      rows={4}
                    />
                  </div>

                  <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
                    Your profile experience, skills, and contact information will be shared directly with {job.employer_name}.
                  </p>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    disabled={applyMutation.isPending}
                  >
                    {applyMutation.isPending ? 'Submitting Application...' : 'Submit Application'}
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
