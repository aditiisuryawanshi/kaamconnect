import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  Clock,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { useLanguage } from '../../features/i18n/LanguageContext';
import { Locality, ServiceListing, Job } from '../../types';

// The 9 exact photographic categories from the uploaded reference image
const POPULAR_CATEGORIES = [
  {
    id: 'home-cleaning',
    title: 'Home Cleaning',
    slug: 'cleaning',
    img: '/assets/categories/home_cleaning.jpg',
  },
  {
    id: 'plumbing',
    title: 'Plumbing',
    slug: 'plumbing',
    img: '/assets/categories/plumbing.jpg',
  },
  {
    id: 'electrical',
    title: 'Electrical',
    slug: 'electrical',
    img: '/assets/categories/electrical.jpg',
  },
  {
    id: 'appliance-repair',
    title: 'Appliance Repair',
    slug: 'appliance-repair',
    img: '/assets/categories/appliance_repair.jpg',
  },
  {
    id: 'cooking-home-help',
    title: 'Cooking & Home Help',
    slug: 'cooking',
    img: '/assets/categories/cooking_home_help.jpg',
  },
  {
    id: 'beauty-wellness',
    title: 'Beauty & Wellness',
    slug: 'beauty',
    img: '/assets/categories/beauty_wellness.jpg',
  },
  {
    id: 'carpentry',
    title: 'Carpentry',
    slug: 'carpentry',
    img: '/assets/categories/carpentry.jpg',
  },
  {
    id: 'painting',
    title: 'Painting',
    slug: 'painting',
    img: '/assets/categories/painting.jpg',
  },
  {
    id: 'moving-loading',
    title: 'Moving & Loading',
    slug: 'moving',
    img: '/assets/categories/moving_loading.jpg',
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Search state
  const [searchTab, setSearchTab] = useState<'service' | 'job'>('service');
  const [keyword, setKeyword] = useState('');
  const [localityId, setLocalityId] = useState('');

  // Fetch localities for dropdown
  const { data: localities = [] } = useQuery({
    queryKey: ['localities'],
    queryFn: async () => {
      const res = await apiRequest<Locality[]>('/meta/localities');
      return res.data;
    },
  });

  // Fetch featured services for lower section
  const { data: services = [] } = useQuery({
    queryKey: ['featured-services'],
    queryFn: async () => {
      const res = await apiRequest<ServiceListing[]>('/services?limit=4');
      return res.data;
    },
  });

  // Fetch featured jobs for lower section
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

    const targetRoute = searchTab === 'service' ? '/services' : '/jobs';
    navigate(`${targetRoute}?${params.toString()}`);
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      
      {/* 1. EXACT HERO BANNER MATCHING UPLOADED REFERENCE IMAGE */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          backgroundColor: '#0B2F57',
          overflow: 'hidden',
        }}
      >
        {/* Full-width composite hero backdrop */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1440px',
            margin: '0 auto',
            minHeight: '440px',
            aspectRatio: '1024 / 384',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            backgroundImage: "url('/assets/landing_hero.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            padding: '40px 36px 32px',
          }}
          className="landing-hero-container"
        >
          {/* Interactive Floating Search Card Overlaid Exactly on the Mockup's Search Position */}
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              position: 'relative',
              zIndex: 10,
            }}
            className="landing-search-card"
          >
            {/* Search Tabs */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '-1px' }}>
              <button
                type="button"
                onClick={() => setSearchTab('service')}
                style={{
                  backgroundColor: searchTab === 'service' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.85)',
                  color: searchTab === 'service' ? '#0B2F57' : '#64748B',
                  fontWeight: searchTab === 'service' ? 700 : 600,
                  fontSize: '0.875rem',
                  padding: '9px 22px',
                  borderRadius: '10px 10px 0 0',
                  border: 'none',
                  borderBottom: searchTab === 'service' ? '3px solid #FF851B' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: searchTab === 'service' ? '0 -2px 6px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                Find a Service
              </button>
              <button
                type="button"
                onClick={() => setSearchTab('job')}
                style={{
                  backgroundColor: searchTab === 'job' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.85)',
                  color: searchTab === 'job' ? '#0B2F57' : '#64748B',
                  fontWeight: searchTab === 'job' ? 700 : 600,
                  fontSize: '0.875rem',
                  padding: '9px 22px',
                  borderRadius: '10px 10px 0 0',
                  border: 'none',
                  borderBottom: searchTab === 'job' ? '3px solid #FF851B' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: searchTab === 'job' ? '0 -2px 6px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                Find a Job
              </button>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSearch}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: searchTab === 'service' ? '0 12px 12px 12px' : '12px',
                padding: '8px 10px',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.18)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                border: '1px solid #E2E8F0',
              }}
            >
              {/* Keyword Input */}
              <div
                style={{
                  flex: '1.2 1 180px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                }}
              >
                <Search size={16} color="#0B2F57" />
                <input
                  type="text"
                  placeholder={searchTab === 'service' ? 'What do you need?' : 'What job are you looking for?'}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.875rem',
                    color: '#1E293B',
                    backgroundColor: 'transparent',
                  }}
                />
              </div>

              {/* Separator */}
              <div
                style={{
                  width: '1px',
                  height: '24px',
                  backgroundColor: '#E2E8F0',
                }}
                className="search-divider"
              />

              {/* Locality Selector */}
              <div
                style={{
                  flex: '1 1 170px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                }}
              >
                <MapPin size={16} color="#0B2F57" />
                <select
                  value={localityId}
                  onChange={(e) => setLocalityId(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.875rem',
                    color: localityId ? '#1E293B' : '#64748B',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Select locality in Mumbai</option>
                  <option value="Andheri">Andheri</option>
                  <option value="Bandra">Bandra</option>
                  <option value="Borivali">Borivali</option>
                  <option value="Dadar">Dadar</option>
                  <option value="Powai">Powai</option>
                  <option value="Thane">Thane</option>
                  <option value="Navi Mumbai">Navi Mumbai</option>
                  {localities.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Solid Orange Search Button */}
              <button
                type="submit"
                style={{
                  backgroundColor: '#FF851B',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  padding: '10px 28px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                  flexShrink: 0,
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#E07413')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FF851B')}
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. POPULAR SERVICES IN MUMBAI SECTION - BIGGER & CRYSTAL CLEAR PICTURES */}
      <section style={{ padding: '44px 0 56px', backgroundColor: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 20px' }}>
          
          {/* Header Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#0B2F57',
                  letterSpacing: '-0.01em',
                  marginBottom: '4px',
                }}
              >
                Popular Services in Mumbai
              </h2>
              <p style={{ color: '#667085', fontSize: '0.9rem' }}>
                Book trusted, background-checked trade professionals across Mumbai with zero middleman fee
              </p>
            </div>

            <Link
              to="/services"
              style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#123F73',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                transition: 'all 0.15s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#123F73';
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.borderColor = '#123F73';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = '#123F73';
                e.currentTarget.style.borderColor = '#CBD5E1';
              }}
            >
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* 9 Category Tiles Grid - Bigger, Crisp, High-Definition */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(9, 1fr)',
              gap: '14px',
            }}
            className="categories-grid"
          >
            {POPULAR_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/services?category=${cat.slug}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  backgroundColor: '#FFFFFF',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  transition: 'transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = '#FF851B';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)';
                }}
              >
                {/* Large Clear Picture (125px height, crystal clear) */}
                <div style={{ width: '100%', height: '125px', overflow: 'hidden', backgroundColor: '#F1F5F9' }}>
                  <img
                    src={cat.img}
                    alt={cat.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.25s ease',
                    }}
                    loading="lazy"
                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </div>

                {/* Title */}
                <div
                  style={{
                    padding: '10px 6px',
                    textAlign: 'center',
                    minHeight: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      color: '#0B2F57',
                      lineHeight: 1.25,
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {cat.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED MUMBAI SERVICE PROFESSIONALS (Connected to Backend Database) */}
      <section style={{ padding: '40px 0 54px', backgroundColor: '#F8FAFC' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#0B2F57',
                  marginBottom: '4px',
                }}
              >
                Featured Technicians in Mumbai
              </h2>
              <p style={{ color: '#667085', fontSize: '0.875rem' }}>
                Verified background checks, transparent hourly rates, zero booking fee
              </p>
            </div>
            <Link
              to="/services"
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#123F73',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>Explore All</span>
              <ChevronRight size={15} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: '20px',
            }}
          >
            {services.map((srv) => (
              <div
                key={srv.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#123F73', backgroundColor: '#EFF6FF', padding: '2px 8px', borderRadius: '4px' }}>
                      {srv.category_name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.8rem', fontWeight: 700, color: '#1E293B' }}>
                      <Star size={13} fill="#FF851B" color="#FF851B" />
                      <span>4.8</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#0B2F57', marginBottom: '4px' }}>
                    <Link to={`/services/${srv.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {srv.title}
                    </Link>
                  </h3>

                  <p style={{ fontSize: '0.8rem', color: '#667085', marginBottom: '8px' }}>
                    Provider: <strong>{srv.worker_name}</strong>
                  </p>

                  <div style={{ color: '#FF851B', fontWeight: 800, fontSize: '1rem' }}>
                    ₹{srv.pricing.amount} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#667085' }}>/ {srv.pricing.unit}</span>
                  </div>
                </div>

                <Link
                  to={`/services/${srv.id}`}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'center',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #123F73',
                    color: '#123F73',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#123F73';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#123F73';
                  }}
                >
                  View Details & Book
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CAREER & FULL-TIME OPPORTUNITIES (Connected to Backend Database) */}
      <section style={{ padding: '40px 0 60px', backgroundColor: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#0B2F57',
                  marginBottom: '4px',
                }}
              >
                Long-Term Career Jobs in Mumbai
              </h2>
              <p style={{ color: '#667085', fontSize: '0.875rem' }}>
                Permanent roles with monthly salaries, PF benefits, and verified employers
              </p>
            </div>
            <Link
              to="/jobs"
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#123F73',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>View All Jobs</span>
              <ChevronRight size={15} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
            }}
          >
            {jobs.map((job) => (
              <div
                key={job.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '4px' }}>
                      {job.employment_type?.replace('_', ' ').toUpperCase()}
                    </span>
                    <span style={{ color: '#FF851B', fontWeight: 800, fontSize: '0.95rem' }}>
                      ₹{job.salary_min?.toLocaleString()} - ₹{job.salary_max?.toLocaleString()} / mo
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B2F57', marginBottom: '4px' }}>
                    <Link to={`/jobs/${job.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {job.title}
                    </Link>
                  </h3>

                  <p style={{ fontSize: '0.825rem', color: '#667085', marginBottom: '6px' }}>
                    {job.employer_name || 'Verified Mumbai Enterprise'}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.775rem', color: '#94A3B8' }}>
                    <MapPin size={12} color="#FF851B" />
                    <span>{job.locality_name || 'Mumbai'}</span>
                  </div>
                </div>

                <Link
                  to={`/jobs/${job.id}`}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'center',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #123F73',
                    color: '#123F73',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#123F73';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#123F73';
                  }}
                >
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsive Style Tweaks */}
      <style>{`
        @media (max-width: 1024px) {
          .categories-grid {
            grid-template-columns: repeat(5, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .landing-hero-container {
            min-height: 380px !important;
            padding: 24px 16px 20px !important;
          }
          .categories-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .search-divider {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .categories-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </div>
  );
};
