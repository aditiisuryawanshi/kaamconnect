import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, MapPin } from 'lucide-react';
import { useLanguage } from '../../features/i18n/LanguageContext';

export const PublicFooter: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer style={{
      backgroundColor: 'var(--color-brand-deep)',
      color: '#CBD5E1',
      padding: '60px 0 30px',
      borderTop: '1px solid rgba(255,255,255,0.08)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img 
                src="/logo.png" 
                alt="RozgaarSetu Logo" 
                style={{
                  height: '42px',
                  width: 'auto',
                  objectFit: 'contain',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '6px',
                  padding: '2px 6px'
                }} 
              />
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)' }}>
                Rozgaar<span style={{ color: 'var(--color-action-primary)' }}>Setu</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '14px', color: '#94A3B8' }}>
              {t('footerAbout')}
            </p>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-action-secondary)', marginBottom: '16px' }}>
              "{t('taglineSecondary')}" — {t('taglinePrimary')}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#E2E8F0' }}>
              <MapPin size={16} color="var(--color-action-primary)" />
              <span>HQ: Bandra-Kurla Complex (BKC) & Andheri, Mumbai</span>
            </div>
          </div>

          {/* Discover Services */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '18px', fontFamily: 'var(--font-display)' }}>
              Marketplace
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
              <li><Link to="/services" style={{ color: '#94A3B8' }}>{t('navServices')} (Electrician, Plumber, Cleaner)</Link></li>
              <li><Link to="/gigs" style={{ color: '#94A3B8' }}>{t('navGigs')} (Shifts, Events & Warehouses)</Link></li>
              <li><Link to="/jobs" style={{ color: '#94A3B8' }}>{t('navJobs')} (Full-Time & Long-Term Careers)</Link></li>
              <li><Link to="/services?category=home-cleaning" style={{ color: '#94A3B8' }}>Home Cleaning in Mumbai</Link></li>
              <li><Link to="/services?category=electrical-work" style={{ color: '#94A3B8' }}>Verified Electricians</Link></li>
            </ul>
          </div>

          {/* Mumbai Localities */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '18px', fontFamily: 'var(--font-display)' }}>
              Mumbai Regions
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '0.8rem' }}>
              {['Andheri', 'Bandra', 'Borivali', 'Dadar', 'Goregaon', 'Kurla', 'Powai', 'Malad', 'Thane', 'Navi Mumbai', 'Kandivali', 'Ghatkopar'].map((loc) => (
                <Link
                  key={loc}
                  to={`/services?keyword=${loc}`}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    color: '#E2E8F0'
                  }}
                >
                  {loc}
                </Link>
              ))}
            </div>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '18px', fontFamily: 'var(--font-display)' }}>
              Trust, Dignity & Safety
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
              <li><Link to="/help" style={{ color: '#94A3B8' }}>Help & Support Center</Link></li>
              <li><Link to="/privacy" style={{ color: '#94A3B8' }}>Privacy Policy</Link></li>
              <li><Link to="/terms" style={{ color: '#94A3B8' }}>Terms of Service</Link></li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E2E8F0', marginTop: '6px' }}>
                <ShieldCheck size={16} color="var(--color-action-primary)" />
                <span>Verified Worker Protection</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '0.8rem'
        }}>
          <div>
            {t('copyright')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Built with dignity for Mumbai’s workforce</span>
            <Heart size={14} color="var(--color-action-primary)" fill="var(--color-action-primary)" />
          </div>
        </div>
      </div>
    </footer>
  );
};
