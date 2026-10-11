import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Wrench,
  Calendar,
  Briefcase,
  Search,
  MapPin,
  CheckCircle,
  ArrowRight,
  Shield,
  Star,
  Users,
  Clock
} from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { Locality, ServiceCategory, ServiceListing, Gig, Job } from '../../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Search state
  const [searchType, setSearchType] = useState<'services' | 'gigs' | 'jobs'>('services');
  const [keyword, setKeyword] = useState('');
  const [localityId, setLocalityId] = useState('');

  // Fetch localities
  const { data: localities = [] } = useQuery({
    queryKey: ['localities'],
    queryFn: async () => {
      const res = await apiRequest<Locality[]>('/meta/localities');
      return res.data;
    },
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiRequest<ServiceCategory[]>('/meta/categories');
      return res.data;
    },
  });

  // Fetch featured services
  const { data: services = [] } = useQuery({
    queryKey: ['featured-services'],
    queryFn: async () => {
      const res = await apiRequest<ServiceListing[]>('/services?limit=3');
      return res.data;
    },
  });

  // Fetch featured gigs
  const { data: gigs = [] } = useQuery({
    queryKey: ['featured-gigs'],
    queryFn: async () => {
      const res = await apiRequest<Gig[]>('/gigs?limit=3');
      return res.data;
    },
  });

  // Fetch featured jobs
  const { data: jobs = [] } = useQuery({
    queryKey: ['featured-jobs'],
    queryFn: async () => {
      const res = await apiRequest<Job[]>('/jobs?limit=3');
      return res.data;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (localityId) params.set('locality', localityId);

    navigate(`/${searchType}?${params.toString()}`);
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section style={{
        backgroundColor: 'var(--color-warm-cream)',
        padding: '60px 0 80px',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center'
          }}>
            {/* Left Hero Copy */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--color-pale-green)',
                color: 'var(--color-deep-green)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.825rem',
                fontWeight: 600,
                marginBottom: '20px',
                border: '1px solid #C4DEC9'
              }}>
                <MapPin size={14} color="var(--color-action-orange)" />
                Dedicated Workforce Platform for Mumbai Region
              </div>

              <h1 className="editorial-title" style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
                lineHeight: 1.15,
                marginBottom: '20px'
              }}>
                Real People. Real Work. A Stronger Mumbai.
              </h1>

              <p style={{
                fontSize: '1.125rem',
                color: 'var(--color-secondary-text)',
                lineHeight: 1.6,
                marginBottom: '36px',
                maxWidth: '540px'
              }}>
                Find trusted household services, flexible short-term shift gigs, and long-term career opportunities — all in one unified Mumbai marketplace.
              </p>

              {/* 3 DISTINCT MARKETPLACE ENTRY PILLS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginBottom: '32px' }}>
                <Link
                  to="/services"
                  className="card"
                  style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '8px',
                    borderLeft: '4px solid var(--color-primary-green)'
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'var(--color-pale-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-green)' }}>
                    <Wrench size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-dark-ink)' }}>Book a Service</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>Electricians, cleaners, cooks</p>
                  </div>
                </Link>

                <Link
                  to="/gigs"
                  className="card"
                  style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '8px',
                    borderLeft: '4px solid var(--color-action-orange)'
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#FEF0E6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-action-orange)' }}>
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-dark-ink)' }}>Find Shift Gigs</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>Events, warehouse, daily pay</p>
                  </div>
                </Link>

                <Link
                  to="/jobs"
                  className="card"
                  style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '8px',
                    borderLeft: '4px solid var(--color-saffron-orange)'
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'var(--color-warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-warning)' }}>
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-dark-ink)' }}>Find Long-Term Jobs</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>Full-time salary with benefits</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div style={{ position: 'relative' }}>
              <div className="card" style={{ overflow: 'hidden', padding: '10px' }}>
                <img
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
                  alt="Indian electrician and technician at work"
                  style={{ width: '100%', height: '380px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                />
                <div style={{
                  padding: '16px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#FAF8F3',
                  borderRadius: 'var(--radius-md)',
                  marginTop: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'var(--color-primary-green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      R
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>Ramesh Shinde</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>Licensed Electrician • Andheri & Powai</div>
                    </div>
                  </div>
                  <span className="badge badge-green">Available Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FUNCTIONAL SEARCH SECTION */}
      <section style={{ transform: 'translateY(-30px)', zIndex: 10, position: 'relative' }}>
        <div className="container">
          <div className="card" style={{ padding: '24px', boxShadow: 'var(--shadow-dropdown)' }}>
            {/* Search Type Selector Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              {[
                { type: 'services', label: 'Services (Task / Hourly)', icon: <Wrench size={16} /> },
                { type: 'gigs', label: 'Shift Gigs (Daily / Short-Term)', icon: <Calendar size={16} /> },
                { type: 'jobs', label: 'Long-Term Jobs (Full-Time)', icon: <Briefcase size={16} /> },
              ].map((tab) => (
                <button
                  key={tab.type}
                  type="button"
                  onClick={() => setSearchType(tab.type as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    backgroundColor: searchType === tab.type ? 'var(--color-primary-green)' : 'transparent',
                    color: searchType === tab.type ? 'var(--color-white)' : 'var(--color-secondary-text)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Search Form Inputs */}
            <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) 140px', gap: '14px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder={
                    searchType === 'services'
                      ? 'Service name (e.g. Electrician, Cleaning)...'
                      : searchType === 'gigs'
                      ? 'Gig role (e.g. Event Helper, Warehouse)...'
                      : 'Job title or skills (e.g. Technician, Retail)...'
                  }
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                />
                <Search size={16} color="var(--color-secondary-text)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>

              <div>
                <select
                  value={localityId}
                  onChange={(e) => setLocalityId(e.target.value)}
                  className="form-select"
                >
                  <option value="">All Mumbai Localities</option>
                  {localities.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.name} ({loc.region})</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>
                <Search size={16} /> Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 3. SERVICE CATEGORIES TILES */}
      <section style={{ padding: '40px 0 60px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
            <div>
              <h2 className="editorial-title" style={{ fontSize: '1.85rem' }}>Popular Service Categories</h2>
              <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem' }}>Verified local professionals ready for home & commercial needs</p>
            </div>
            <Link to="/services" style={{ color: 'var(--color-action-orange)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
              Browse all <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px'
          }}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/services?category=${cat.slug}`}
                className="card"
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ height: '140px', overflow: 'hidden' }}>
                  <img
                    src={cat.image_url || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80'}
                    alt={cat.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  />
                </div>
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>{cat.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', lineHeight: 1.4 }}>{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW KAAMCONNECT WORKS */}
      <section style={{ backgroundColor: 'var(--color-white)', padding: '60px 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 40px' }}>
            <h2 className="editorial-title" style={{ fontSize: '2rem', marginBottom: 12 }}>
              How KaamConnect Works
            </h2>
            <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.95rem' }}>
              Built specifically for Mumbai’s distinct marketplace dynamics — separating direct services, short gigs, and long-term hiring.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {/* For Customers */}
            <div className="card" style={{ padding: '28px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: 'var(--color-pale-green)', color: 'var(--color-primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Wrench size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 10 }}>For Customers & Homes</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: 'var(--color-secondary-text)' }}>
                <li style={{ display: 'flex', gap: 8 }}><CheckCircle size={16} color="var(--color-primary-green)" /> Browse verified neighborhood professionals</li>
                <li style={{ display: 'flex', gap: 8 }}><CheckCircle size={16} color="var(--color-primary-green)" /> Transparent rates with zero hidden platform markups</li>
                <li style={{ display: 'flex', gap: 8 }}><CheckCircle size={16} color="var(--color-primary-green)" /> Direct scheduling with instant confirmation tracking</li>
              </ul>
            </div>

            {/* For Workers */}
            <div className="card" style={{ padding: '28px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: '#FEF0E6', color: 'var(--color-action-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Users size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 10 }}>For Workers & Technicians</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: 'var(--color-secondary-text)' }}>
                <li style={{ display: 'flex', gap: 8 }}><CheckCircle size={16} color="var(--color-action-orange)" /> Create service listings and receive direct local bookings</li>
                <li style={{ display: 'flex', gap: 8 }}><CheckCircle size={16} color="var(--color-action-orange)" /> Apply for high-paying shift gigs with guaranteed payouts</li>
                <li style={{ display: 'flex', gap: 8 }}><CheckCircle size={16} color="var(--color-action-orange)" /> Find full-time permanent jobs with PF and ESIC benefits</li>
              </ul>
            </div>

            {/* For Employers */}
            <div className="card" style={{ padding: '28px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Briefcase size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 10 }}>For Employers & Businesses</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: 'var(--color-secondary-text)' }}>
                <li style={{ display: 'flex', gap: 8 }}><CheckCircle size={16} color="var(--color-warning)" /> Post shift requirements and hire warehouse or event staff fast</li>
                <li style={{ display: 'flex', gap: 8 }}><CheckCircle size={16} color="var(--color-warning)" /> Post permanent vacancies with organized applicant pipeline</li>
                <li style={{ display: 'flex', gap: 8 }}><CheckCircle size={16} color="var(--color-warning)" /> Shortlist, interview, and recruit without agency middlemen</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DATABASE-BACKED FEATURED OPPORTUNITIES */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          {/* Recent Gigs */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <span className="badge badge-orange" style={{ marginBottom: 6 }}>Urgent Shifts</span>
                <h3 className="editorial-title" style={{ fontSize: '1.6rem' }}>Recent Temporary Gigs in Mumbai</h3>
              </div>
              <Link to="/gigs" style={{ color: 'var(--color-action-orange)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                View all gigs <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {gigs.map((gig) => (
                <div key={gig.id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <span className="badge badge-neutral"><MapPin size={12} /> {gig.locality_name || 'Mumbai'}</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary-green)' }}>
                        ₹{gig.pay_amount} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-secondary-text)' }}>/ {gig.pay_unit}</span>
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>{gig.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', lineHeight: 1.5, marginBottom: 14 }}>
                      {gig.description.slice(0, 110)}...
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
                      Shift: {gig.shift_date} • {gig.openings} openings
                    </span>
                    <Link to={`/gigs/${gig.id}`} className="btn btn-outline btn-sm">
                      Details & Apply
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Long-Term Jobs */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <span className="badge badge-green" style={{ marginBottom: 6 }}>Full-Time Careers</span>
                <h3 className="editorial-title" style={{ fontSize: '1.6rem' }}>Long-Term Opportunities</h3>
              </div>
              <Link to="/jobs" style={{ color: 'var(--color-primary-green)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                View all jobs <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {jobs.map((job) => (
                <div key={job.id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <span className="badge badge-neutral"><MapPin size={12} /> {job.locality_name || 'Mumbai'}</span>
                      <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-primary-green)' }}>
                        ₹{job.salary_min} - ₹{job.salary_max} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-secondary-text)' }}>/ {job.pay_period}</span>
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>{job.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', lineHeight: 1.5, marginBottom: 14 }}>
                      {job.description.slice(0, 110)}...
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
                      {job.employment_type.replace('_', ' ').toUpperCase()} • {job.schedule}
                    </span>
                    <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm">
                      View Vacancy
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
