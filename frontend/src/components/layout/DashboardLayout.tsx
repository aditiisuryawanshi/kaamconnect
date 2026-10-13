import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LogOut,
  Menu,
  X,
  Home,
  User as UserIcon,
  Bell
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { useLanguage } from '../../features/i18n/LanguageContext';
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
  const { user, setActiveRole, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleRoleSwitch = (newRole: UserRole) => {
    setActiveRole(newRole);
    navigate(`/${newRole}/dashboard`);
  };

  const navContent = (
    <>
      {/* Brand Header */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src="/logo.png" 
            alt="RozgaarSetu Logo" 
            style={{
              height: '38px',
              width: 'auto',
              objectFit: 'contain',
              backgroundColor: '#FFFFFF',
              borderRadius: '6px',
              padding: '2px 6px'
            }} 
          />
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)' }}>
              Rozgaar<span style={{ color: 'var(--color-action-primary)' }}>Setu</span>
            </div>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-action-bg)', letterSpacing: '0.06em', fontWeight: 600 }}>
              {title}
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--color-surface-white)' : '#CBD5E1',
                backgroundColor: isActive ? 'var(--color-action-primary)' : 'transparent',
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
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-action-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: '#fff'
          }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '0.725rem', color: '#94A3B8' }}>
              {user?.roles?.join(', ')}
            </div>
          </div>
        </div>

        {/* Quick Role Switch Buttons */}
        {user && user.roles.length > 1 && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '4px', fontWeight: 700 }}>
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
                    backgroundColor: r === role ? 'var(--color-action-primary)' : 'rgba(255,255,255,0.12)',
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
            fontSize: '0.825rem',
            padding: '6px 0',
            fontWeight: 600
          }}
        >
          <LogOut size={15} /> {t('navLogout')}
        </button>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Sidebar Desktop */}
      <aside
        style={{
          width: '260px',
          backgroundColor: 'var(--color-brand-deep)',
          color: 'var(--color-surface-white)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 90,
          boxShadow: 'var(--shadow-md)'
        }}
        className="sidebar-desktop"
      >
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          display: 'flex'
        }}>
          <div 
            onClick={() => setSidebarOpen(false)} 
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} 
          />
          <aside style={{
            position: 'relative',
            width: '280px',
            backgroundColor: 'var(--color-brand-deep)',
            color: 'var(--color-surface-white)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            zIndex: 1000
          }}>
            <button 
              onClick={() => setSidebarOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', color: '#fff' }}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
            {navContent}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header style={{
          height: '64px',
          backgroundColor: 'var(--color-surface-white)',
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
              style={{ display: 'none', color: 'var(--color-brand-primary)' }}
              className="mobile-sidebar-toggle"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-brand-deep)', fontFamily: 'var(--font-display)' }}>
              {title}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <Link 
              to="/" 
              style={{ 
                fontSize: '0.85rem', 
                color: '#667085', 
                fontWeight: 600, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                textDecoration: 'none'
              }}
            >
              <Home size={16} /> Home
            </Link>

            <button
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#667085',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Notifications"
            >
              <Bell size={18} />
              <span
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#FF851B',
                  border: '1.5px solid #FFFFFF',
                }}
              />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#123F73',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0B2F57' }}>
                {user?.name || 'User'}
              </span>
            </div>
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
