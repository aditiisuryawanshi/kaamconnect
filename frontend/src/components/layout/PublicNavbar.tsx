import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, User, LogOut, ChevronDown, Menu, X, Shield, Briefcase, Calendar, Wrench } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { UserRole } from '../../types';

export const PublicNavbar: React.FC = () => {
  const { user, activeRole, setActiveRole, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleRoleSwitch = (role: UserRole) => {
    setActiveRole(role);
    setUserDropdownOpen(false);
    navigate(`/${role}/dashboard`);
  };

  return (
    <header style={{
      backgroundColor: 'var(--color-primary-green)',
      color: 'var(--color-white)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Brand Logo & Wordmark */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: 'var(--color-action-orange)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.25rem',
            color: 'var(--color-white)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            K
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Kaam<span style={{ color: 'var(--color-saffron-orange)' }}>Connect</span>
            </span>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#B3C8BA' }}>
              Mumbai Region
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '24px' }} className="desktop-nav">
          <Link to="/services" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#E5EFE8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wrench size={16} /> Find Services
          </Link>
          <Link to="/gigs" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#E5EFE8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} /> Find Gigs
          </Link>
          <Link to="/jobs" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#E5EFE8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Briefcase size={16} /> Find Jobs
          </Link>
          <Link to="/employer/dashboard" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#E5EFE8' }}>
            For Employers
          </Link>
        </nav>

        {/* Auth / Account Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mumbai Locality Badge */}
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            color: '#E5EFE8'
          }} className="locality-badge">
            <MapPin size={14} color="var(--color-saffron-orange)" />
            <span>Mumbai Metropolitan Region</span>
          </div>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--color-white)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-action-orange)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem'
                }}>
                  {user.name.charAt(0)}
                </div>
                <span>{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </button>

              {userDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  width: '230px',
                  backgroundColor: 'var(--color-white)',
                  color: 'var(--color-dark-ink)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-dropdown)',
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden',
                  zIndex: 200
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', backgroundColor: '#FAF8F3' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>{user.email}</p>
                  </div>

                  <div style={{ padding: '8px 0' }}>
                    <div style={{ padding: '4px 16px', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-secondary-text)', fontWeight: 700 }}>
                      Switch Workspace
                    </div>
                    {user.roles.includes('worker') && (
                      <button
                        onClick={() => handleRoleSwitch('worker')}
                        style={{ width: '100%', padding: '8px 16px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}
                      >
                        <Wrench size={15} /> Worker Workspace
                      </button>
                    )}
                    {user.roles.includes('customer') && (
                      <button
                        onClick={() => handleRoleSwitch('customer')}
                        style={{ width: '100%', padding: '8px 16px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}
                      >
                        <User size={15} /> Customer Dashboard
                      </button>
                    )}
                    {user.roles.includes('employer') && (
                      <button
                        onClick={() => handleRoleSwitch('employer')}
                        style={{ width: '100%', padding: '8px 16px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}
                      >
                        <Briefcase size={15} /> Employer Hub
                      </button>
                    )}
                    {user.roles.includes('admin') && (
                      <button
                        onClick={() => handleRoleSwitch('admin')}
                        style={{ width: '100%', padding: '8px 16px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-error)' }}
                      >
                        <Shield size={15} /> Admin Console
                      </button>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid var(--color-border)', padding: '6px 0' }}>
                    <button
                      onClick={() => { setUserDropdownOpen(false); logout(); navigate('/'); }}
                      style={{ width: '100%', padding: '8px 16px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-error)' }}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-outline" style={{ color: 'var(--color-white)', borderColor: 'rgba(255,255,255,0.3)', padding: '6px 14px' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '6px 16px' }}>
                Join KaamConnect
              </Link>
            </div>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: 'var(--color-white)', display: 'block' }}
            className="mobile-toggle"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--color-deep-green)',
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/services" onClick={() => setMobileMenuOpen(false)} style={{ color: '#E5EFE8', fontSize: '0.95rem', padding: '8px 0' }}>
              Find Services
            </Link>
            <Link to="/gigs" onClick={() => setMobileMenuOpen(false)} style={{ color: '#E5EFE8', fontSize: '0.95rem', padding: '8px 0' }}>
              Find Gigs
            </Link>
            <Link to="/jobs" onClick={() => setMobileMenuOpen(false)} style={{ color: '#E5EFE8', fontSize: '0.95rem', padding: '8px 0' }}>
              Find Jobs
            </Link>
            <Link to="/employer/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ color: '#E5EFE8', fontSize: '0.95rem', padding: '8px 0' }}>
              For Employers
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .locality-badge { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};
