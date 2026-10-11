import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Shield, Users, Wrench, Calendar, Briefcase, Clock, AlertTriangle, Activity } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';

export const AdminDashboardPage: React.FC = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['admin-dashboard-metrics'],
    queryFn: async () => {
      const res = await apiRequest('/admin/dashboard');
      return res.data;
    },
  });

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 className="editorial-title" style={{ fontSize: '1.8rem', marginBottom: '6px' }}>
          Platform Administration & Safety Oversight
        </h2>
        <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem' }}>
          Operational monitoring, trust moderation, and audit logs for KaamConnect Mumbai.
        </p>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-secondary-text)', textTransform: 'uppercase' }}>Total Users</span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '4px' }}>
            {metrics?.total_users || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
            {metrics?.workers_count || 0} workers • {metrics?.employers_count || 0} employers
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-secondary-text)', textTransform: 'uppercase' }}>Active Services</span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-primary-green)', marginTop: '4px' }}>
            {metrics?.services_count || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
            Published listings
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-secondary-text)', textTransform: 'uppercase' }}>Active Gigs & Jobs</span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-action-orange)', marginTop: '4px' }}>
            {(metrics?.gigs_count || 0) + (metrics?.jobs_count || 0)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
            {metrics?.gigs_count || 0} gigs • {metrics?.jobs_count || 0} jobs
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-secondary-text)', textTransform: 'uppercase' }}>Active Bookings</span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-primary-green)', marginTop: '4px' }}>
            {metrics?.active_bookings || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
            Requested / In progress
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-secondary-text)', textTransform: 'uppercase' }}>Open Reports</span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: (metrics?.pending_reports || 0) > 0 ? 'var(--color-error)' : 'var(--color-primary-green)', marginTop: '4px' }}>
            {metrics?.pending_reports || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
            Awaiting moderation
          </div>
        </div>
      </div>

      {/* Moderation Shortcuts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        <Link to="/admin/reports" className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Review Safety Reports</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)' }}>
              Inspect and resolve user or listing reports
            </p>
          </div>
        </Link>

        <Link to="/admin/users" className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: 'var(--color-pale-green)', color: 'var(--color-primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Manage Platform Users</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)' }}>
              Inspect accounts, roles, and status
            </p>
          </div>
        </Link>
      </div>

      {/* Audit Logs Table */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} /> Recent Administrative Audit Trail
        </h3>

        {metrics?.recent_audit_logs?.length === 0 ? (
          <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.85rem' }}>No administrative audit events recorded yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF8F3', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Action</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Admin User</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Target</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {metrics?.recent_audit_logs?.map((log: any) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                      <span className="badge badge-neutral">{log.action}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>{log.actor_name}</td>
                    <td style={{ padding: '12px 14px' }}>{log.target_type}: {log.target_id.slice(-6)}</td>
                    <td style={{ padding: '12px 14px', color: 'var(--color-secondary-text)' }}>
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
