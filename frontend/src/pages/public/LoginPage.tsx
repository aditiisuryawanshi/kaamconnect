import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, Phone, AlertCircle, Eye, EyeOff, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { useLanguage } from '../../features/i18n/LanguageContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || location.state?.returnTo;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email: identifier, password });
      if (from) {
        navigate(from, { replace: true });
      } else {
        // Automatically routed via AuthContext role switch
        navigate('/worker/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, roleRoute: string) => {
    setError('');
    setIdentifier(demoEmail);
    setPassword('DemoPassword123');
    login({ email: demoEmail, password: 'DemoPassword123' })
      .then(() => navigate(roleRoute))
      .catch((err) => {
        // Fallback to legacy domain if database hasn't been re-seeded yet
        if (demoEmail.includes('rozgaarsetu.in')) {
          const legacyEmail = demoEmail.replace('rozgaarsetu.in', 'kaamconnect.in');
          setIdentifier(legacyEmail);
          login({ email: legacyEmail, password: 'DemoPassword123' })
            .then(() => navigate(roleRoute))
            .catch((innerErr) => setError(innerErr.message));
        } else {
          setError(err.message);
        }
      });
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      position: 'relative',
      backgroundImage: 'linear-gradient(rgba(11, 47, 87, 0.4), rgba(11, 47, 87, 0.65)), url("https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1920&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center 30%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '30px 16px 0',
      overflow: 'hidden'
    }}>
      {/* Top Header Logo in Center */}
      <div style={{ textAlign: 'center', zIndex: 10, marginBottom: '20px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img 
            src="/logo.png" 
            alt="RozgaarSetu" 
            style={{ height: '48px', width: 'auto', backgroundColor: '#fff', padding: '4px 10px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} 
          />
        </Link>
        <div style={{ color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 600, marginTop: '6px', letterSpacing: '0.04em' }}>
          A Bridge to Employment
        </div>
      </div>

      {/* Main Content Area with Flanking Workers and Centered Card */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 5,
        flex: 1
      }}>
        {/* Left Flanking Worker (Male Delivery/Mover with Box) */}
        <div style={{
          display: 'none',
          position: 'absolute',
          left: '20px',
          bottom: 0,
          width: '260px',
          height: '420px',
          zIndex: 4,
          borderRadius: '16px 16px 0 0',
          overflow: 'hidden',
          boxShadow: '0 -10px 25px rgba(0,0,0,0.25)'
        }} className="flanking-worker-left">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80"
            alt="Delivery & Logistics Professional"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px',
            background: 'linear-gradient(to top, rgba(11,47,87,0.95), transparent)',
            color: '#FFFFFF'
          }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Logistics & Delivery</div>
            <div style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>MMR Shift Gigs</div>
          </div>
        </div>

        {/* Center Floating Sign In Card (Matching Screenshot) */}
        <div style={{
          width: '100%',
          maxWidth: '430px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '36px 32px',
          boxShadow: '0 20px 45px rgba(0,0,0,0.35)',
          marginBottom: '40px',
          zIndex: 6,
          position: 'relative'
        }}>
          {/* Card Icon */}
          <div style={{ textAlign: 'center', marginBottom: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              margin: '0 auto',
              borderRadius: '50%',
              backgroundColor: 'var(--color-action-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img src="/logo.png" alt="Bridge Icon" style={{ height: '24px', width: 'auto' }} />
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <h2 style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: 'var(--color-brand-deep)',
              marginBottom: '4px',
              fontFamily: 'var(--font-display)'
            }}>
              Welcome Back
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
              Sign in to continue to RozgaarSetu
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: 'var(--color-error-bg)',
              color: 'var(--color-error)',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '0.825rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid #FECACA'
            }}>
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Email or Phone Input */}
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#A0AEC0" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                required
                placeholder="Email or Phone Number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 40px',
                  borderRadius: '6px',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Password Input */}
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#A0AEC0" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 40px 11px 40px',
                  borderRadius: '6px',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#718096',
                  cursor: 'pointer'
                }}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--color-action-primary)' }}
                />
                Remember me
              </label>
              <Link to="/forgot-password" style={{ color: 'var(--color-brand-light)', fontWeight: 600, textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button (Solid Orange) */}
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: 'var(--color-action-primary)',
                color: '#FFFFFF',
                padding: '12px',
                borderRadius: '6px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 3px 8px rgba(255,133,27,0.3)',
                marginTop: '4px'
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* OR Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '18px 0 14px',
            color: '#A0AEC0',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
            <span style={{ padding: '0 10px' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={() => handleQuickLogin('customer@demo.rozgaarsetu.in', '/customer/dashboard')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              color: 'var(--color-text-ink)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Create Account Link */}
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            New to RozgaarSetu?{' '}
            <Link to="/register" style={{ color: 'var(--color-brand-light)', fontWeight: 700, textDecoration: 'none' }}>
              Create an account
            </Link>
          </div>

          {/* Quick Demo Logins for Fast Access */}
          <div style={{ marginTop: '18px', paddingTop: '12px', borderTop: '1px solid #EDF2F7' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.7rem', color: '#A0AEC0', fontWeight: 700, textTransform: 'uppercase' }}>
                Instant Demo Access
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('worker@demo.rozgaarsetu.in', '/worker/dashboard')}
                style={{ padding: '6px 4px', fontSize: '0.725rem', backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
              >
                Worker
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('customer@demo.rozgaarsetu.in', '/customer/dashboard')}
                style={{ padding: '6px 4px', fontSize: '0.725rem', backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('employer@demo.rozgaarsetu.in', '/employer/dashboard')}
                style={{ padding: '6px 4px', fontSize: '0.725rem', backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
              >
                Employer
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@demo.rozgaarsetu.in', '/admin/dashboard')}
                style={{ padding: '6px 4px', fontSize: '0.725rem', backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, color: 'var(--color-error)' }}
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Right Flanking Worker (Female Cleaning Specialist with Apron) */}
        <div style={{
          display: 'none',
          position: 'absolute',
          right: '20px',
          bottom: 0,
          width: '260px',
          height: '420px',
          zIndex: 4,
          borderRadius: '16px 16px 0 0',
          overflow: 'hidden',
          boxShadow: '0 -10px 25px rgba(0,0,0,0.25)'
        }} className="flanking-worker-right">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80"
            alt="Deep Cleaning Professional"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px',
            background: 'linear-gradient(to top, rgba(11,47,87,0.95), transparent)',
            color: '#FFFFFF'
          }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Home & Deep Cleaning</div>
            <div style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>Verified Mumbai Specialist</div>
          </div>
        </div>
      </div>

      {/* Bottom Navy Wave Ribbon (Matching Screenshot) */}
      <div style={{
        width: '100%',
        backgroundColor: 'var(--color-brand-deep)',
        color: '#FFFFFF',
        textAlign: 'center',
        padding: '12px 16px',
        fontSize: '0.85rem',
        fontWeight: 600,
        letterSpacing: '0.05em',
        borderTop: '3px solid var(--color-action-primary)',
        zIndex: 10
      }}>
        A Bridge to Employment
      </div>

      <style>{`
        @media (min-width: 992px) {
          .flanking-worker-left, .flanking-worker-right {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};
