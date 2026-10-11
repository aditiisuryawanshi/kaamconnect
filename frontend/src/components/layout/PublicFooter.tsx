import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, MapPin } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--color-deep-green)',
      color: '#B3C8BA',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-action-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#fff'
              }}>
                K
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                Kaam<span style={{ color: 'var(--color-saffron-orange)' }}>Connect</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Mumbai’s dedicated workforce and services marketplace. Connecting skilled workers, households, and employers with transparency and respect.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#E5EFE8' }}>
              <MapPin size={16} color="var(--color-saffron-orange)" />
              <span>HQ: Andheri East, Mumbai 400069</span>
            </div>
          </div>

          {/* Discover Services */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '18px' }}>Marketplace</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
              <li><Link to="/services" style={{ color: '#B3C8BA' }}>Household & Skilled Services</Link></li>
              <li><Link to="/gigs" style={{ color: '#B3C8BA' }}>Shift Gigs & Short-Term Work</Link></li>
              <li><Link to="/jobs" style={{ color: '#B3C8BA' }}>Long-Term Job Openings</Link></li>
              <li><Link to="/services?category=home-cleaning" style={{ color: '#B3C8BA' }}>Home Cleaning Experts</Link></li>
              <li><Link to="/services?category=electrical-work" style={{ color: '#B3C8BA' }}>Electricians in Mumbai</Link></li>
            </ul>
          </div>

          {/* Mumbai Localities */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '18px' }}>Mumbai Regions</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '0.8rem' }}>
              {['Andheri', 'Bandra', 'Borivali', 'Dadar', 'Goregaon', 'Kurla', 'Powai', 'Malad', 'Thane', 'Navi Mumbai'].map((loc) => (
                <Link
                  key={loc}
                  to={`/services?keyword=${loc}`}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    color: '#D4E2D8'
                  }}
                >
                  {loc}
                </Link>
              ))}
            </div>
          </div>

          {/* Trust & Safety */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '18px' }}>Trust & Legal</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
              <li><Link to="/terms" style={{ color: '#B3C8BA' }}>Terms of Service</Link></li>
              <li><Link to="/privacy" style={{ color: '#B3C8BA' }}>Privacy Policy</Link></li>
              <li><Link to="/help" style={{ color: '#B3C8BA' }}>Help & Support Center</Link></li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E5EFE8' }}>
                <ShieldCheck size={16} color="var(--color-saffron-orange)" />
                <span>Zero Advance Commission</span>
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
            © {new Date().getFullYear()} KaamConnect Technologies Pvt Ltd. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Built with pride for Mumbai’s working communities <Heart size={14} color="var(--color-action-orange)" fill="var(--color-action-orange)" />
          </div>
        </div>
      </div>
    </footer>
  );
};
