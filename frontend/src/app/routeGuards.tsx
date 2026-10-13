import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="skeleton" style={{ width: 120, height: 120, borderRadius: '50%', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Loading RozgaarSetu session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user, activeRole, addRole, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasRole = user.roles.some((r) => allowedRoles.includes(r));

  if (!hasRole && !user.roles.includes('admin')) {
    // If user doesn't have the required role, prompt to enable it
    const targetRole = allowedRoles[0];
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center', maxWidth: 540 }}>
        <div className="card" style={{ padding: '40px 24px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 12, color: 'var(--color-brand-deep)', fontFamily: 'var(--font-display)' }}>
            Switch to {targetRole.charAt(0).toUpperCase() + targetRole.slice(1)} Mode
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24, fontSize: '0.925rem' }}>
            Your account currently has roles: <strong>{user.roles.join(', ')}</strong>. To access this workspace, enable {targetRole} mode on your RozgaarSetu profile.
          </p>
          <button
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: 12 }}
            onClick={() => addRole(targetRole)}
          >
            Activate {targetRole.charAt(0).toUpperCase() + targetRole.slice(1)} Workspace
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
