import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, User, LogOut, ChevronDown, Menu, X, Shield, Briefcase, Calendar, Wrench, Globe } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { useLanguage, Language } from '../../features/i18n/LanguageContext';
import { UserRole } from '../../types';

export const PublicNavbar: React.FC = () => {
  const { user, activeRole, setActiveRole, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const handleRoleSwitch = (role: UserRole) => {
    setActiveRole(role);
    setUserDropdownOpen(false);
    navigate(`/${role}/dashboard`);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setLangDropdownOpen(false);
  };

  return (
    <header style={{
      backgroundColor: '#FFFFFF',
      color: 'var(--color-text-ink)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 4px rgba(18, 63, 115, 0.08)',
      borderBottom: '1px solid var(--color-border)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* RozgaarSetu Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img 
            src="/logo.png" 
            alt="RozgaarSetu — A Bridge to Employment" 
            style={{
              height: '42px',
              width: 'auto',
              maxHeight: '42px',
              objectFit: 'contain'
            }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ 
              fontSize: '1.25rem', 
              fontWeight: 800, 
              letterSpacing: '-0.02em', 
              lineHeight: 1.1,
              color: 'var(--color-brand-primary)',
              fontFamily: 'var(--font-display)'
            }}>
              Rozgaar<span style={{ color: 'var(--color-action-primary)' }}>Setu</span>
            </span>
            <span style={{ 
              fontSize: '0.68rem', 
              letterSpacing: '0.04em', 
              color: 'var(--color-text-secondary)',
              fontWeight: 500
            }}>
              {t('taglinePrimary')}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '24px' }} className="desktop-nav">
          <Link to="/" style={{ 
            fontSize: '0.9rem', 
            fontWeight: 600, 
            color: 'var(--color-brand-primary)', 
            position: 'relative',
            paddingBottom: '4px',
            borderBottom: '2px solid var(--color-action-primary)'
          }}>
            {t('navHome')}
          </Link>
          <Link to="/services" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-ink)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            {t('navServices')}
          </Link>
          <Link to="/gigs" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-ink)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            {t('navGigs')}
          </Link>
          <Link to="/jobs" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-ink)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            {t('navJobs')}
          </Link>
          <Link to="/worker/dashboard" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-ink)' }}>
            {t('navForWorkers')}
          </Link>
          <Link to="/employer/dashboard" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-ink)' }}>
            {t('navForEmployers')}
          </Link>
        </nav>

        {/* Controls: Language + Mumbai Locality + Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Language Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: '#FFFFFF',
                padding: '6px 10px',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-ink)',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: '1px solid var(--color-border)',
                cursor: 'pointer'
              }}
              title="Select Language / भाषा निवडा / भाषा चुनें"
              aria-label="Language selector"
            >
              <Globe size={14} color="var(--color-action-primary)" />
              <span>{language === 'en' ? 'ENG' : language === 'hi' ? 'हिंदी' : 'मराठी'}</span>
              <ChevronDown size={12} color="var(--color-text-secondary)" />
            </button>

            {langDropdownOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '115%',
                width: '130px',
                backgroundColor: 'var(--color-surface-white)',
                color: 'var(--color-text-ink)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
                zIndex: 200
              }}>
                <button
                  onClick={() => handleLanguageChange('en')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '0.825rem',
                    fontWeight: language === 'en' ? 700 : 500,
                    color: language === 'en' ? 'var(--color-brand-primary)' : 'var(--color-text-ink)',
                    backgroundColor: language === 'en' ? 'var(--color-surface-tint)' : 'transparent'
                  }}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChange('hi')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '0.825rem',
                    fontWeight: language === 'hi' ? 700 : 500,
                    color: language === 'hi' ? 'var(--color-brand-primary)' : 'var(--color-text-ink)',
                    backgroundColor: language === 'hi' ? 'var(--color-surface-tint)' : 'transparent'
                  }}
                >
                  हिन्दी (Hindi)
                </button>
                <button
                  onClick={() => handleLanguageChange('mr')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '0.825rem',
                    fontWeight: language === 'mr' ? 700 : 500,
                    color: language === 'mr' ? 'var(--color-brand-primary)' : 'var(--color-text-ink)',
                    backgroundColor: language === 'mr' ? 'var(--color-surface-tint)' : 'transparent'
                  }}
                >
                  मराठी (Marathi)
                </button>
              </div>
            )}
          </div>

          {/* Mumbai Locality Badge (Matching Screenshot: 📍 Mumbai ▾) */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.85rem',
              color: '#1E293B',
              cursor: 'pointer',
              fontWeight: 500,
            }} 
            className="locality-badge"
          >
            <MapPin size={14} color="#FF851B" />
            <span>Mumbai</span>
            <ChevronDown size={14} color="#64748B" />
          </div>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--color-bg-primary)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--color-text-ink)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-action-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--color-surface-white)'
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
                  top: '115%',
                  width: '240px',
                  backgroundColor: 'var(--color-surface-white)',
                  color: 'var(--color-text-ink)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden',
                  zIndex: 200
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-tint)' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-brand-primary)' }}>{user.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{user.email}</p>
                    <span className="badge badge-navy" style={{ marginTop: '6px' }}>
                      {activeRole.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ padding: '8px 0' }}>
                    <div style={{ padding: '4px 16px', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 700 }}>
                      Switch Workspace
                    </div>
                    {user.roles.includes('worker') && (
                      <button
                        onClick={() => handleRoleSwitch('worker')}
                        style={{ width: '100%', padding: '8px 16px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}
                      >
                        <Wrench size={15} color="var(--color-brand-primary)" /> Worker Workspace
                      </button>
                    )}
                    {user.roles.includes('customer') && (
                      <button
                        onClick={() => handleRoleSwitch('customer')}
                        style={{ width: '100%', padding: '8px 16px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}
                      >
                        <User size={15} color="var(--color-brand-primary)" /> Customer Dashboard
                      </button>
                    )}
                    {user.roles.includes('employer') && (
                      <button
                        onClick={() => handleRoleSwitch('employer')}
                        style={{ width: '100%', padding: '8px 16px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}
                      >
                        <Briefcase size={15} color="var(--color-brand-primary)" /> Employer Hub
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
                      <LogOut size={15} /> {t('navLogout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link 
                to="/login" 
                style={{ 
                  color: '#1E293B', 
                  fontSize: '0.875rem', 
                  fontWeight: 600, 
                  textDecoration: 'none',
                  padding: '7px 18px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  transition: 'all 0.15s ease'
                }}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                style={{ 
                  backgroundColor: '#FF851B', 
                  color: '#FFFFFF', 
                  padding: '7px 20px', 
                  borderRadius: '8px', 
                  fontWeight: 700, 
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  boxShadow: '0 1px 3px rgba(255, 133, 27, 0.3)',
                  display: 'inline-block'
                }}
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: 'var(--color-brand-primary)', display: 'block', background: 'none', border: 'none', cursor: 'pointer' }}
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
          backgroundColor: 'var(--color-brand-primary)',
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ color: '#EBF0F7', fontSize: '0.95rem', padding: '8px 0' }}>
              {t('navHome')}
            </Link>
            <Link to="/services" onClick={() => setMobileMenuOpen(false)} style={{ color: '#EBF0F7', fontSize: '0.95rem', padding: '8px 0' }}>
              {t('navServices')}
            </Link>
            <Link to="/gigs" onClick={() => setMobileMenuOpen(false)} style={{ color: '#EBF0F7', fontSize: '0.95rem', padding: '8px 0' }}>
              {t('navGigs')}
            </Link>
            <Link to="/jobs" onClick={() => setMobileMenuOpen(false)} style={{ color: '#EBF0F7', fontSize: '0.95rem', padding: '8px 0' }}>
              {t('navJobs')}
            </Link>
            <Link to="/worker/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ color: '#EBF0F7', fontSize: '0.95rem', padding: '8px 0' }}>
              {t('navForWorkers')}
            </Link>
            <Link to="/employer/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ color: '#EBF0F7', fontSize: '0.95rem', padding: '8px 0' }}>
              {t('navForEmployers')}
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
