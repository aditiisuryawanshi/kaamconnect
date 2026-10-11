import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, Briefcase, Plus, Users, MapPin, XCircle } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { Gig, Job } from '../../types';
import { EmptyState } from '../../components/ui/EmptyState';

export const EmployerListingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'gigs' | 'jobs'>('gigs');

  const { data: myGigs = [], isLoading: gigsLoading } = useQuery({
    queryKey: ['my-gigs'],
    queryFn: async () => {
      const res = await apiRequest<Gig[]>('/gigs/my');
      return res.data;
    },
  });

  const { data: myJobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: async () => {
      const res = await apiRequest<Job[]>('/jobs/my');
      return res.data;
    },
  });

  const closeGigMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/gigs/${id}/close`, { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-gigs'] }),
  });

  const closeJobMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/jobs/${id}/close`, { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-jobs'] }),
  });

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h2 className="editorial-title" style={{ fontSize: '1.8rem', marginBottom: '6px' }}>
            My Postings & Openings
          </h2>
          <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem' }}>
            Inspect all active and closed shift gigs and job vacancies.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/employer/gigs/new" className="btn btn-primary btn-sm">
            <Plus size={16} /> New Gig
          </Link>
          <Link to="/employer/jobs/new" className="btn btn-outline btn-sm">
            <Plus size={16} /> New Job
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('gigs')}
          style={{
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem',
            fontWeight: 700,
            border: 'none',
            backgroundColor: activeTab === 'gigs' ? 'var(--color-primary-green)' : 'var(--color-white)',
            color: activeTab === 'gigs' ? '#fff' : 'var(--color-dark-ink)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          Shift Gigs ({myGigs.length})
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          style={{
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem',
            fontWeight: 700,
            border: 'none',
            backgroundColor: activeTab === 'jobs' ? 'var(--color-primary-green)' : 'var(--color-white)',
            color: activeTab === 'jobs' ? '#fff' : 'var(--color-dark-ink)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          Long-Term Jobs ({myJobs.length})
        </button>
      </div>

      {activeTab === 'gigs' ? (
        gigsLoading ? (
          <div className="card skeleton" style={{ height: '140px' }} />
        ) : myGigs.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No gigs posted yet"
            description="Create your first shift gig to hire workers in Mumbai."
            actionText="Post a Gig"
            actionPath="/employer/gigs/new"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {myGigs.map((g) => (
              <div key={g.id} className="card" style={{ padding: '22px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className={`badge ${g.status === 'published' ? 'badge-green' : 'badge-neutral'}`}>
                      {g.status.toUpperCase()}
                    </span>
                    <span className="badge badge-neutral"><MapPin size={12} /> {g.locality_name}</span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
                    <Link to={`/gigs/${g.id}`}>{g.title}</Link>
                  </h3>
                  <div style={{ fontSize: '0.825rem', color: 'var(--color-secondary-text)', display: 'flex', gap: '12px' }}>
                    <span>Date: {g.shift_date}</span>
                    <span>•</span>
                    <span>Pay: ₹{g.pay_amount} / {g.pay_unit}</span>
                    <span>•</span>
                    <span>Openings: <strong>{g.openings} left</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Link to="/employer/applicants" className="btn btn-outline btn-sm">
                    <Users size={14} /> Applicants ({g.applications_count || 0})
                  </Link>
                  {g.status === 'published' && (
                    <button
                      onClick={() => closeGigMutation.mutate(g.id)}
                      className="btn btn-outline btn-sm"
                      style={{ color: 'var(--color-error)' }}
                    >
                      Close Gig
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : jobsLoading ? (
        <div className="card skeleton" style={{ height: '140px' }} />
      ) : myJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs posted yet"
          description="Create your first permanent job vacancy to receive applications."
          actionText="Post a Job"
          actionPath="/employer/jobs/new"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {myJobs.map((j) => (
            <div key={j.id} className="card" style={{ padding: '22px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className={`badge ${j.status === 'published' ? 'badge-green' : 'badge-neutral'}`}>
                    {j.status.toUpperCase()}
                  </span>
                  <span className="badge badge-neutral">{j.employment_type.replace('_', ' ').toUpperCase()}</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
                  <Link to={`/jobs/${j.id}`}>{j.title}</Link>
                </h3>
                <div style={{ fontSize: '0.825rem', color: 'var(--color-secondary-text)', display: 'flex', gap: '12px' }}>
                  <span>Location: {j.locality_name}</span>
                  <span>•</span>
                  <span>Salary: ₹{j.salary_min} - ₹{j.salary_max} / {j.pay_period}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link to="/employer/applicants" className="btn btn-outline btn-sm">
                  <Users size={14} /> Applicants ({j.applications_count || 0})
                </Link>
                {j.status === 'published' && (
                  <button
                    onClick={() => closeJobMutation.mutate(j.id)}
                    className="btn btn-outline btn-sm"
                    style={{ color: 'var(--color-error)' }}
                  >
                    Close Job
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
