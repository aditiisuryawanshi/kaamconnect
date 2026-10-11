import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, FileText, CheckCircle, XCircle, Star, Phone, AlertCircle, MessageSquare } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { Application } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';

export const EmployerApplicantsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [notesModalAppId, setNotesModalAppId] = useState<string | null>(null);
  const [employerNotes, setEmployerNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { data: applicantData, isLoading } = useQuery({
    queryKey: ['employer-applicants', typeFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (typeFilter) params.set('type', typeFilter);
      if (statusFilter) params.set('status', statusFilter);
      const res = await apiRequest<Application[]>(`/applications/employer?${params.toString()}`);
      return res;
    },
  });

  const shortlistMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      apiRequest(`/applications/${id}/shortlist`, {
        method: 'POST',
        body: JSON.stringify({ employer_notes: notes }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-applicants'] });
      setNotesModalAppId(null);
    },
    onError: (err: any) => setErrorMessage(err.message),
  });

  const selectMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      apiRequest(`/applications/${id}/select`, {
        method: 'POST',
        body: JSON.stringify({ employer_notes: notes }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-applicants'] });
      setNotesModalAppId(null);
    },
    onError: (err: any) => setErrorMessage(err.message),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      apiRequest(`/applications/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ employer_notes: notes }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-applicants'] });
      setNotesModalAppId(null);
    },
    onError: (err: any) => setErrorMessage(err.message),
  });

  const applicants = applicantData?.data || [];

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 className="editorial-title" style={{ fontSize: '1.8rem', marginBottom: '6px' }}>
          Applicant Recruitment Pipeline
        </h2>
        <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem' }}>
          Review candidate profiles, add internal assessment notes, and advance candidates through recruitment stages.
        </p>
      </div>

      {errorMessage && (
        <div style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '6px' }}>
        {[
          { label: 'All Candidates', value: '' },
          { label: 'Awaiting Review', value: 'applied' },
          { label: 'Shortlisted', value: 'shortlisted' },
          { label: 'Selected / Hired', value: 'selected' },
          { label: 'Rejected', value: 'rejected' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: '1px solid var(--color-border)',
              backgroundColor: statusFilter === tab.value ? 'var(--color-primary-green)' : 'var(--color-white)',
              color: statusFilter === tab.value ? '#fff' : 'var(--color-dark-ink)',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="card skeleton" style={{ height: '160px' }} />
          ))}
        </div>
      ) : applicants.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No applicants found in this category"
          description="Candidates who apply for your active gigs or jobs will appear here for review."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {applicants.map((app) => (
            <div key={app.id} className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-green)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.15rem'
                  }}>
                    {app.profile_snapshot?.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                        {app.profile_snapshot?.name}
                      </h3>
                      <StatusBadge status={app.status} type="application" />
                      <span className="badge badge-neutral" style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                        {app.listing_type}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', marginBottom: '4px' }}>
                      {app.profile_snapshot?.headline || 'Technician'} • {app.profile_snapshot?.experience_years} Years Experience
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-dark-ink)' }}>
                      Applying for: <strong>{app.listing_title}</strong>
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
                    Phone: <strong>{app.profile_snapshot?.phone || 'Disclosed to employer'}</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
                    Applied on {new Date(app.applied_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Skills */}
              {app.profile_snapshot?.skills && app.profile_snapshot.skills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                  {app.profile_snapshot.skills.map((s, idx) => (
                    <span key={idx} style={{ fontSize: '0.75rem', backgroundColor: '#F0EDE5', padding: '3px 8px', borderRadius: '4px' }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Cover Note */}
              {app.cover_note && (
                <div style={{ backgroundColor: '#FAF8F3', padding: '12px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '14px' }}>
                  <strong>Candidate Note:</strong> "{app.cover_note}"
                </div>
              )}

              {/* Internal Employer Notes (if set) */}
              {app.employer_notes && (
                <div style={{ backgroundColor: 'var(--color-pale-green)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.825rem', marginBottom: '14px' }}>
                  <strong>Internal Notes (Private):</strong> {app.employer_notes}
                </div>
              )}

              {/* Recruitment Pipeline Actions */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '14px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => {
                    setNotesModalAppId(app.id);
                    setEmployerNotes(app.employer_notes || '');
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--color-secondary-text)' }}
                >
                  <MessageSquare size={14} /> Add Internal Notes
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {app.status !== 'rejected' && app.status !== 'selected' && (
                    <button
                      onClick={() => rejectMutation.mutate({ id: app.id, notes: 'Not selected at this stage' })}
                      className="btn btn-outline btn-sm"
                      style={{ color: 'var(--color-error)' }}
                    >
                      Reject
                    </button>
                  )}

                  {app.status !== 'shortlisted' && app.status !== 'selected' && (
                    <button
                      onClick={() => shortlistMutation.mutate({ id: app.id, notes: 'Shortlisted for review' })}
                      className="btn btn-outline btn-sm"
                    >
                      <Star size={14} /> Shortlist
                    </button>
                  )}

                  {app.status !== 'selected' && (
                    <button
                      onClick={() => selectMutation.mutate({ id: app.id, notes: 'Candidate selected for shift/role' })}
                      className="btn btn-primary btn-sm"
                    >
                      <CheckCircle size={14} /> Select / Hire
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Internal Notes Modal */}
      {notesModalAppId && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 300,
          padding: '16px'
        }}>
          <div className="card" style={{ maxWidth: 440, width: '100%', padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Add Private Employer Note</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', marginBottom: '14px' }}>
              These notes are visible strictly to authorized members of your organization and will never be shared with the candidate.
            </p>
            <div className="form-group">
              <textarea
                rows={3}
                placeholder="e.g. Good communication during phone screen; confirmed punctuality..."
                value={employerNotes}
                onChange={(e) => setEmployerNotes(e.target.value)}
                className="form-textarea"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
              <button onClick={() => setNotesModalAppId(null)} className="btn btn-outline btn-sm">
                Cancel
              </button>
              <button
                onClick={() => shortlistMutation.mutate({ id: notesModalAppId, notes: employerNotes })}
                className="btn btn-primary btn-sm"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
