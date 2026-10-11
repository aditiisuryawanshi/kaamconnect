import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Search, Shield, Ban, CheckCircle, AlertCircle } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { User } from '../../types';

export const AdminUsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState('');
  const [keyword, setKeyword] = useState('');

  const { data: userData, isLoading } = useQuery({
    queryKey: ['admin-users', roleFilter, keyword],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (roleFilter) params.set('role', roleFilter);
      if (keyword) params.set('keyword', keyword);
      const res = await apiRequest<User[]>(`/admin/users?${params.toString()}`);
      return res;
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: string }) =>
      apiRequest(`/admin/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const users = userData?.data || [];

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 className="editorial-title" style={{ fontSize: '1.8rem', marginBottom: '6px' }}>
          User Accounts Administration
        </h2>
        <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem' }}>
          Inspect user registrations, role memberships, and moderate account active states.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <input
            type="text"
            placeholder="Search by user name or email..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '34px' }}
          />
          <Search size={14} color="var(--color-secondary-text)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <div style={{ width: '180px' }}>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="form-select"
          >
            <option value="">All Roles</option>
            <option value="worker">Worker</option>
            <option value="customer">Customer</option>
            <option value="employer">Employer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF8F3', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Name</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Email</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Roles</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                    {u.name}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-secondary-text)' }}>
                    {u.email}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {u.roles?.map((r) => (
                        <span key={r} className="badge badge-neutral" style={{ textTransform: 'capitalize', fontSize: '0.7rem' }}>
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge ${u.account_status === 'suspended' ? 'badge-error' : 'badge-green'}`}>
                      {u.account_status || 'active'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {u.account_status === 'suspended' ? (
                      <button
                        onClick={() => statusMutation.mutate({ userId: u.id, status: 'active' })}
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--color-success)' }}
                      >
                        Restore Account
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to suspend account ${u.email}?`)) {
                            statusMutation.mutate({ userId: u.id, status: 'suspended' });
                          }
                        }}
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--color-error)' }}
                      >
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
