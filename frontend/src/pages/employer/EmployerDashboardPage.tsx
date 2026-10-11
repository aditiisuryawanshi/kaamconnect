import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, Briefcase, Users, Plus, CheckCircle, Clock, ArrowRight, Building } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAuth } from '../../features/auth/AuthContext';

export const EmployerDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['employer-dashboard'],
    queryFn: async () => {
      const res = await apiRequest('/employer/dashboard');
      return res.data;
    },
  });

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto' }}>
      {/* Top Banner */}
      <div className="card" style={{ padding: '28px', marginBottom: '28px', backgroundColor: 'var(--color-primary-green)', color: '#fff' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px' }}>
              Employer Operations Hub
            </h2>
            <p style={{ color: '#D4E2D8', fontSize: '0.9rem' }}>
              Manage recruitment pipelines, post shift gigs, and review candidates across Mumbai.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/employer/gigs/new" className="btn btn-primary btn-sm">
              <Plus size={16} /> Post a Gig
            </Link>
            <Link to="/employer/jobs/new" className="btn btn-outline btn-sm" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
              <Plus size={16} /> Post a Job
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#FEF0E6', color: 'var(--color-action-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={18} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-secondary-text)', textTransform: 'uppercase' }}>
              Active Gigs
            </span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-dark-ink)' }}>
            {dashboard?.active_gigs_count || 0}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>Shift opportunities open</p>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'var(--color-pale-green)', color: 'var(--color-primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={18} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-secondary-text)', textTransform: 'uppercase' }}>
              Active Jobs
            </span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-dark-ink)' }}>
            {dashboard?.active_jobs_count || 0}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>Full-time vacancies</p>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-secondary-text)', textTransform: 'uppercase' }}>
              Pending Review
            </span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-action-orange)' }}>
            {dashboard?.pending_applicants_count || 0}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>Awaiting initial review</p>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#EDEAE1', color: 'var(--color-dark-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={18} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-secondary-text)', textTransform: 'uppercase' }}>
              Shortlisted
            </span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary-green)' }}>
            {dashboard?.shortlisted_applicants_count || 0}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>Candidates shortlisted</p>
        </div>
      </div>

      {/* Recent Applications Awaiting Review */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            Recent Applicants
          </h3>
          <Link to="/employer/applicants" style={{ fontSize: '0.85rem', color: 'var(--color-action-orange)', fontWeight: 600 }}>
            Manage All Applicants
          </Link>
        </div>

        {dashboard?.recent_applications?.length === 0 ? (
          <div className="card" style={{ padding: '28px', textAlign: 'center', color: 'var(--color-secondary-text)' }}>
            No candidate applications yet. Post a gig or job vacancy to start receiving applicants.
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FAF8F3', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>Applicant</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>Listing Title</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard?.recent_applications?.map((app: any) => (
                    <tr key={app.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700 }}>{app.worker_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>{app.worker_headline}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                        {app.listing_title} ({app.listing_type})
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <StatusBadge status={app.status} type="application" />
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <Link to="/employer/applicants" className="btn btn-outline btn-sm">
                          Review
                        </Link>
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
