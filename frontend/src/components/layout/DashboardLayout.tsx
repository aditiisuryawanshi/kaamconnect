import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  Calendar,
  Briefcase,
  FileText,
  Bookmark,
  User,
  Settings,
  Shield,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { UserRole } from '../../types';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  role: UserRole;
  title: string;
  navItems: NavItem[];
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role, title, navItems, children }) => {
  const { user, activeRole, setActiveRole, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleRoleSwitch = (newRole: UserRole) => {
    setActiveRole(newRole);
    navigate(`/${newRole}/dashboard`);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8F6F0' }}>
      {/* Sidebar Desktop */}
      <aside
        style={{
          width: '260px',
          backgroundColor: 'var(--color-primary-green)',
          color: 'var(--color-white)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 90,
        }}
        className="sidebar-desktop"
      >
        {/* Brand */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-action-orange)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
              color: '#fff'
            }}>
              K
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                Kaam<span style={{ color: 'var(--color-saffron-orange)' }}>Connect</span>
              </div>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#B3C8BA', letterSpacing: '0.06em' }}>
                {title}
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--color-white)' : '#C4D6C9',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card & Role Switcher */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-action-orange)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.9rem'
            }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#B3C8BA' }}>
                {user?.roles?.join(', ')}
              </div>
            </div>
          </div>

          {/* Quick Role Switch Buttons */}
          {user && user.roles.length > 1 && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#B3C8BA', marginBottom: '4px', fontWeight: 700 }}>
                Switch Workspace
              </div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {user.roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleSwitch(r)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.7rem',
                      borderRadius: '4px',
                      backgroundColor: r === role ? 'var(--color-action-orange)' : 'rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontWeight: 600
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => { logout(); navigate('/'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              color: '#FCA5A5',
              fontSize: '0.8rem',
              padding: '6px 0',
              fontWeight: 500
            }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header style={{
          height: '64px',
          backgroundColor: 'var(--color-white)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 80
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'none' }}
              className="mobile-sidebar-toggle"
              aria-label="Toggle menu"
            >
              <Menu size={22} color="var(--color-primary-green)" />
            </button>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark-ink)' }}>
              {title}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', fontWeight: 500 }}>
              ← Public Marketplace
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '24px' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 899px) {
          .sidebar-desktop { display: none !important; }
          .mobile-sidebar-toggle { display: block !important; }
        }
      `}</style>
    </div>
  );
};
