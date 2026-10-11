import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || location.state?.returnTo;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      if (from) {
        navigate(from, { replace: true });
      } else {
        // Navigate to appropriate role dashboard or homepage
        navigate('/worker/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, roleRoute: string) => {
    setEmail(demoEmail);
    setPassword('DemoPassword123');
    login({ email: demoEmail, password: 'DemoPassword123' })
      .then(() => navigate(roleRoute))
      .catch((err) => setError(err.message));
  };

  return (
    <div className="container" style={{ padding: '60px 16px', maxWidth: 480 }}>
      <div className="card" style={{ padding: '36px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: 'var(--color-primary-green)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.25rem',
            margin: '0 auto 12px'
          }}>
            K
          </div>
          <h2 className="editorial-title" style={{ fontSize: '1.75rem', marginBottom: '6px' }}>
            Welcome to KaamConnect
          </h2>
          <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem' }}>
            Sign in to access your services, bookings, and opportunities
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'var(--color-error-bg)',
            color: 'var(--color-error)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '34px' }}
              />
              <Mail size={16} color="var(--color-secondary-text)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--color-action-orange)' }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '34px' }}
              />
              <Lock size={16} color="var(--color-secondary-text)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Accounts */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-secondary-text)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px' }}>
            <Sparkles size={14} color="var(--color-action-orange)" /> Quick One-Click Demo Logins
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('worker@demo.kaamconnect.in', '/worker/dashboard')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem', justifyContent: 'flex-start' }}
            >
              ⚡ Worker Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('customer@demo.kaamconnect.in', '/customer/dashboard')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem', justifyContent: 'flex-start' }}
            >
              ⚡ Customer Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('employer@demo.kaamconnect.in', '/employer/dashboard')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem', justifyContent: 'flex-start' }}
            >
              ⚡ Employer Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@demo.kaamconnect.in', '/admin/dashboard')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem', justifyContent: 'flex-start', color: 'var(--color-error)' }}
            >
              ⚡ Admin Demo
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: 'var(--color-secondary-text)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--color-action-orange)', fontWeight: 600 }}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};
