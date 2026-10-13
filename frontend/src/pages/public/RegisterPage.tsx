import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, Phone, AlertCircle, Wrench, Home, Briefcase, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { useLanguage } from '../../features/i18n/LanguageContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useLanguage();

  const [role, setRole] = useState<'worker' | 'customer' | 'employer'>('worker');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // Role-specific helper state
  const [companyName, setCompanyName] = useState('');
  const [primarySkill, setPrimarySkill] = useState('Electrical Work');
  const [locality, setLocality] = useState('Andheri');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        name: role === 'employer' && companyName ? `${name} (${companyName})` : name,
        email,
        phone: phone || undefined,
        password,
        role,
      });

      // Route to role destination
      if (role === 'worker') {
        navigate('/worker/onboarding');
      } else if (role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Role details configuration
  const roleMeta = {
    worker: {
      title: 'Join as a Service Professional / Worker',
      subtitle: 'Get direct customer leads, apply for shifts, and find stable full-time careers across Mumbai.',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
      badge: 'Electricians, Plumbers, Cleaners, Technicians',
      highlights: ['Direct customer bookings with 0% advance cut', 'High-paying shift gigs with prompt payments', 'Verified professional digital profile']
    },
    customer: {
      title: 'Join as a Customer / Household',
      subtitle: 'Book trusted and background-verified technicians for all your home and office maintenance needs.',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      badge: 'Households, Societies & Small Offices',
      highlights: ['Transparent fixed visit and labor charges', 'Verified Mumbai local professionals', 'Real-time booking and progress tracking']
    },
    employer: {
      title: 'Join as an Employer / Business',
      subtitle: 'Recruit warehouse staff, event crew, facility technicians, and permanent tradespeople with ease.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      badge: 'Contractors, Warehouses, Event Managers, Facilities',
      highlights: ['Post urgent shift gigs with atomic capacity control', 'Permanent job postings with private candidate notes', 'Direct candidate shortlisting with zero recruitment fee']
    }
  };

  const currentMeta = roleMeta[role];

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F8FAFC',
      padding: '30px 16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1080px',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 15px 35px rgba(18, 63, 115, 0.08)',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))'
      }}>
        {/* Left Column: Vibrant Orange Showcase Banner with Worker Image */}
        <div style={{
          backgroundColor: 'var(--color-action-primary)',
          color: '#FFFFFF',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Top Construction Worker Photo */}
          <div style={{
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            marginBottom: '28px',
            height: '240px'
          }}>
            <img
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80"
              alt="Indian Skilled Construction Worker"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Bold White Text (Matching Screenshot) */}
          <div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '12px',
              color: '#FFFFFF',
              fontFamily: 'var(--font-display)'
            }}>
              Showcase Your Skills.<br />
              Find Better Opportunities.
            </h2>
            <p style={{
              fontSize: '0.95rem',
              color: '#FFF1E5',
              lineHeight: 1.5,
              marginBottom: '20px'
            }}>
              Join thousands of workers in Mumbai on RozgaarSetu.
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            color: '#FFFFFF',
            borderTop: '1px solid rgba(255,255,255,0.25)',
            paddingTop: '16px'
          }}>
            <ShieldCheck size={18} />
            <span>Direct payments • Zero advance fee • 100% verified work</span>
          </div>
        </div>

        {/* Right Column: 3-Step Registration Form */}
        <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column' }}>
          {/* Header with Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <img src="/logo.png" alt="RozgaarSetu" style={{ height: '32px', width: 'auto' }} />
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
                Rozgaar<span style={{ color: 'var(--color-action-primary)' }}>Setu</span>
              </span>
            </Link>
            <span style={{ fontSize: '0.75rem', color: '#718096' }}>A Bridge to Employment</span>
          </div>

          {/* 3-Step Progress Indicator (Matching Screenshot) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', zIndex: 2 }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-action-primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}>
                1
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-brand-deep)' }}>Account Details</span>
            </div>

            <div style={{ flex: 1, height: '2px', backgroundColor: '#E2E8F0', margin: '0 8px', marginBottom: '16px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', zIndex: 2 }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#E2E8F0',
                color: '#718096',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}>
                2
              </div>
              <span style={{ fontSize: '0.7rem', color: '#718096' }}>Role Specific Info</span>
            </div>

            <div style={{ flex: 1, height: '2px', backgroundColor: '#E2E8F0', margin: '0 8px', marginBottom: '16px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', zIndex: 2 }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#E2E8F0',
                color: '#718096',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}>
                3
              </div>
              <span style={{ fontSize: '0.7rem', color: '#718096' }}>Complete Profile</span>
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <h2 style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: 'var(--color-brand-deep)',
              marginBottom: '4px'
            }}>
              Create Your Account
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
              Join RozgaarSetu and unlock better opportunities.
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: 'var(--color-error-bg)',
              color: 'var(--color-error)',
              padding: '10px 12px',
              borderRadius: '6px',
              fontSize: '0.825rem',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid #FECACA'
            }}>
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Role Pills (Worker / Customer / Employer) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '6px' }}>
              {[
                { r: 'worker', label: 'Worker', icon: <Wrench size={14} /> },
                { r: 'customer', label: 'Customer', icon: <Home size={14} /> },
                { r: 'employer', label: 'Employer', icon: <Briefcase size={14} /> },
              ].map((item) => (
                <button
                  key={item.r}
                  type="button"
                  onClick={() => setRole(item.r as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${role === item.r ? 'var(--color-action-primary)' : '#E2E8F0'}`,
                    backgroundColor: role === item.r ? 'var(--color-action-bg)' : '#FFFFFF',
                    color: role === item.r ? 'var(--color-action-primary)' : 'var(--color-text-ink)',
                    fontWeight: 700,
                    fontSize: '0.825rem',
                    cursor: 'pointer'
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Form Fields: 2-Column Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {/* Full Name */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-ink)', display: 'block', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              {/* Phone Number with +91 */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-ink)', display: 'block', marginBottom: '4px' }}>
                  Phone Number *
                </label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    padding: '8px 8px',
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    borderRight: 'none',
                    borderRadius: '6px 0 0 6px',
                    fontSize: '0.8rem',
                    color: '#64748B',
                    fontWeight: 600
                  }}>
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '0 6px 6px 0',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-ink)', display: 'block', marginBottom: '4px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              {/* Primary Skills or Company */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-ink)', display: 'block', marginBottom: '4px' }}>
                  {role === 'employer' ? 'Company Name' : 'Primary Skills'}
                </label>
                {role === 'employer' ? (
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Logistics"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                ) : (
                  <select
                    value={primarySkill}
                    onChange={(e) => setPrimarySkill(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="Electrical Work">Electrical Work & Wiring</option>
                    <option value="Plumbing">Plumbing & Sanitary</option>
                    <option value="Home Cleaning">Home Deep Cleaning</option>
                    <option value="Appliance Repair">Appliance Repair</option>
                    <option value="Cooking Help">Home Cooking & Catering</option>
                    <option value="Beauty & Personal Care">Beauty & Wellness</option>
                    <option value="Moving & Loading">Moving & Loading</option>
                    <option value="Carpentry">Carpentry & Handyman</option>
                  </select>
                )}
              </div>

              {/* Experience */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-ink)', display: 'block', marginBottom: '4px' }}>
                  Experience
                </label>
                <select
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: '#FFFFFF' }}
                >
                  <option value="1">1 - 2 years</option>
                  <option value="3">3 - 5 years</option>
                  <option value="5">5+ years</option>
                </select>
              </div>

              {/* Current Location (Mumbai) */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-ink)', display: 'block', marginBottom: '4px' }}>
                  Current Location (Mumbai)
                </label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: '#FFFFFF' }}
                >
                  <option value="Andheri">Andheri</option>
                  <option value="Bandra">Bandra</option>
                  <option value="Borivali">Borivali</option>
                  <option value="Kurla">Kurla</option>
                  <option value="Powai">Powai</option>
                  <option value="Ghatkopar">Ghatkopar</option>
                  <option value="Dadar">Dadar</option>
                  <option value="Thane">Thane</option>
                  <option value="Navi Mumbai">Navi Mumbai</option>
                </select>
              </div>
            </div>

            {/* Preferred Work Type Checkboxes */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-ink)', display: 'block', marginBottom: '4px' }}>
                Preferred Work Type
              </label>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#4A5568' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: 'var(--color-action-primary)' }} /> On-demand
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: 'var(--color-action-primary)' }} /> Full-time
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ accentColor: 'var(--color-action-primary)' }} /> Part-time
                </label>
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-ink)', display: 'block', marginBottom: '4px' }}>
                Password (min 6 characters) *
              </label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            {/* Profile Photo Upload Box */}
            <div style={{
              border: '1px dashed #CBD5E1',
              borderRadius: '6px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#F8FAFC'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                backgroundColor: '#EDF2F7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#718096'
              }}>
                📷
              </div>
              <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-brand-primary)' }}>Upload Profile Photo</span> (JPG, PNG max 5MB)
              </div>
            </div>

            {/* Next / Submit Button (Matching Screenshot) */}
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
              {loading ? 'Processing...' : 'Next'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-action-primary)', fontWeight: 700, textDecoration: 'none' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
