import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle, ShieldAlert, Check, X } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { EmptyState } from '../../components/ui/EmptyState';

export const AdminReportsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('pending');
  const [resolvingReportId, setResolvingReportId] = useState<string | null>(null);
  const [resolutionType, setResolutionType] = useState('action_taken');
  const [resolutionNotes, setResolutionNotes] = useState('Reviewed by moderation team and required steps taken.');

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['admin-reports', statusFilter],
    queryFn: async () => {
      const res = await apiRequest<any[]>(`/admin/reports?status=${statusFilter}`);
      return res;
    },
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, resolution, notes }: { id: string; resolution: string; notes: string }) =>
      apiRequest(`/admin/reports/${id}/resolve`, {
        method: 'POST',
        body: JSON.stringify({ resolution, resolution_notes: notes }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      setResolvingReportId(null);
    },
  });

  const reports = reportData?.data || [];

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 className="editorial-title" style={{ fontSize: '1.8rem', marginBottom: '6px' }}>
          Moderation & Trust Reports
        </h2>
        <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem' }}>
          Handle user reports regarding safety, content quality, and platform policy adherence.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          onClick={() => setStatusFilter('pending')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 700,
            backgroundColor: statusFilter === 'pending' ? 'var(--color-primary-green)' : 'var(--color-white)',
            color: statusFilter === 'pending' ? '#fff' : 'var(--color-dark-ink)',
            border: '1px solid var(--color-border)',
            cursor: 'pointer'
          }}
        >
          Pending Review
        </button>
        <button
          onClick={() => setStatusFilter('resolved')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 700,
            backgroundColor: statusFilter === 'resolved' ? 'var(--color-primary-green)' : 'var(--color-white)',
            color: statusFilter === 'resolved' ? '#fff' : 'var(--color-dark-ink)',
            border: '1px solid var(--color-border)',
            cursor: 'pointer'
          }}
        >
          Resolved Reports
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2].map((n) => (
            <div key={n} className="card skeleton" style={{ height: '140px' }} />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No reports in this queue"
          description="Platform reports filed by users will appear here."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reports.map((rep) => (
            <div key={rep.id} className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge badge-error">{rep.reason}</span>
                    <span className="badge badge-neutral">Target: {rep.target_type}</span>
                    <span className={`badge ${rep.status === 'resolved' ? 'badge-green' : 'badge-warning'}`}>
                      {rep.status}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                    Reported by: {rep.reporter_name || 'User'}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)' }}>
                    Target ID: {rep.target_id} • Filed on {new Date(rep.created_at).toLocaleString()}
                  </div>
                </div>

                {rep.status === 'pending' && (
                  <button
                    onClick={() => setResolvingReportId(rep.id)}
                    className="btn btn-primary btn-sm"
                  >
                    Moderate & Resolve
                  </button>
                )}
              </div>

              <div style={{ backgroundColor: '#FAF8F3', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', marginBottom: '12px' }}>
                <strong>Description:</strong> "{rep.description}"
              </div>

              {rep.resolution && (
                <div style={{ fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: 600 }}>
                  ✓ Resolution: {rep.resolution} ({rep.resolution_notes})
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Resolve Modal */}
      {resolvingReportId && (
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
          <div className="card" style={{ maxWidth: 460, width: '100%', padding: 28 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 12 }}>Resolve Safety Report</h3>
            <div className="form-group">
              <label className="form-label">Moderation Decision</label>
              <select
                value={resolutionType}
                onChange={(e) => setResolutionType(e.target.value)}
                className="form-select"
              >
                <option value="action_taken">Action Taken (Warning issued)</option>
                <option value="content_removed">Content Removed (Archive listing)</option>
                <option value="user_suspended">Suspend Offending Account</option>
                <option value="dismissed">Dismiss (No violation found)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Resolution Notes</label>
              <textarea
                rows={3}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="form-textarea"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <button onClick={() => setResolvingReportId(null)} className="btn btn-outline btn-sm">
                Cancel
              </button>
              <button
                onClick={() => resolveMutation.mutate({ id: resolvingReportId, resolution: resolutionType, notes: resolutionNotes })}
                className="btn btn-primary btn-sm"
                disabled={resolveMutation.isPending}
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
