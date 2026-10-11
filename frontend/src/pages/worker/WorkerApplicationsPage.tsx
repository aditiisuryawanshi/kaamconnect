import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, MapPin, Building, AlertCircle, ArrowRight } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { Application } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Link } from 'react-router-dom';

export const WorkerApplicationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [typeFilter, setTypeFilter] = useState('');

  const { data: appData, isLoading } = useQuery({
    queryKey: ['worker-applications', typeFilter],
    queryFn: async () => {
      const url = typeFilter
        ? `/applications/my?type=${typeFilter}`
        : '/applications/my';
      const res = await apiRequest<Application[]>(url);
      return res;
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/applications/${id}/withdraw`, { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['worker-applications'] }),
  });

  const applications = appData?.data || [];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 className="editorial-title" style={{ fontSize: '1.8rem', marginBottom: '6px' }}>
          My Applications
        </h2>
        <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem' }}>
          Track status updates and recruitment stages for all your submitted gigs and jobs.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[
          { label: 'All Opportunities', value: '' },
          { label: 'Shift Gigs', value: 'gig' },
          { label: 'Long-Term Jobs', value: 'job' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setTypeFilter(tab.value)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: '1px solid var(--color-border)',
              backgroundColor: typeFilter === tab.value ? 'var(--color-primary-green)' : 'var(--color-white)',
              color: typeFilter === tab.value ? '#fff' : 'var(--color-dark-ink)',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="card skeleton" style={{ height: '130px' }} />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applications found"
          description="You haven't submitted any applications for this filter yet."
          actionText="Browse Gigs"
          actionPath="/gigs"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {applications.map((app) => (
            <div key={app.id} className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="badge badge-neutral" style={{ textTransform: 'uppercase' }}>{app.listing_type}</span>
                    <StatusBadge status={app.status} type="application" />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
                    <Link to={app.listing_type === 'gig' ? `/gigs/${app.listing_id}` : `/jobs/${app.listing_id}`}>
                      {app.listing_title}
                    </Link>
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
                    <span>Employer: <strong>{app.employer_name}</strong></span>
                    <span>•</span>
                    <span>Applied on: {new Date(app.applied_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary-green)' }}>
                    {app.pay_display}
                  </div>
                </div>
              </div>

              {app.cover_note && (
                <div style={{ backgroundColor: '#FAF8F3', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--color-dark-ink)', marginBottom: '16px' }}>
                  <strong>Your Cover Note:</strong> "{app.cover_note}"
                </div>
              )}

              {/* Status explanation */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)' }}>
                  {app.status === 'selected'
                    ? '🎉 You have been selected! Employer will contact you directly.'
                    : app.status === 'shortlisted'
                    ? '⭐ You are on the candidate shortlist.'
                    : app.status === 'applied'
                    ? 'Awaiting employer initial review.'
                    : ''}
                </span>

                {['applied', 'under_review', 'shortlisted'].includes(app.status) && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to withdraw this application?')) {
                        withdrawMutation.mutate(app.id);
                      }
                    }}
                    className="btn btn-outline btn-sm"
                    style={{ color: 'var(--color-error)' }}
                    disabled={withdrawMutation.isPending}
                  >
                    Withdraw Application
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
