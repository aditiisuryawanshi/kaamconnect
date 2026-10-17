import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Search, Filter, Clock, Users, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { Gig, Locality } from '../../types';
import { EmptyState } from '../../components/ui/EmptyState';
import { useLanguage } from '../../features/i18n/LanguageContext';

export const GigsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();

  const localityParam = searchParams.get('locality') || '';
  const keywordParam = searchParams.get('keyword') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const limit = 12;

  const [keyword, setKeyword] = useState(keywordParam);
  const [selectedLocality, setSelectedLocality] = useState(localityParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [minPay, setMinPay] = useState('');

  // Localities
  const { data: localities = [] } = useQuery({
    queryKey: ['localities'],
    queryFn: async () => {
      const res = await apiRequest<Locality[]>('/meta/localities');
      return res.data;
    },
  });

  // Gigs
  const { data: gigData, isLoading, isError, refetch } = useQuery({
    queryKey: ['gigs-discovery', selectedLocality, keywordParam, sortBy, minPay, pageParam],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedLocality) params.set('locality', selectedLocality);
      if (keywordParam) params.set('keyword', keywordParam);
      if (minPay) params.set('min_pay', minPay);
      if (sortBy) params.set('sort', sortBy);
      params.set('page', pageParam.toString());
      params.set('limit', limit.toString());

      const res = await apiRequest<Gig[]>(`/gigs?${params.toString()}`);
      return res;
    },
  });

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedLocality) params.set('locality', selectedLocality);
    if (keyword) params.set('keyword', keyword);
    if (sortBy) params.set('sort', sortBy);
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setKeyword('');
    setSelectedLocality('');
    setMinPay('');
    setSortBy('newest');
    setSearchParams({});
  };

  const gigs = gigData?.data || [];
  const pagination = gigData?.pagination || { total: 0, page: 1, limit, pages: 1 };
  const totalPages = pagination.pages || Math.ceil((pagination.total || 0) / limit) || 1;

  return (
    <div className="container" style={{ padding: '40px 16px 80px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="brand-title" style={{ fontSize: '2.4rem', marginBottom: '8px' }}>
          Temporary Gigs & Shift Work in Mumbai
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
          Find flexible short-term opportunities, event assistance, warehouse shifts, and daily payout work across the Mumbai region.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'start' }}>
        {/* Filters */}
        <div className="card" style={{ padding: '24px', position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-brand-deep)' }}>
              <Filter size={18} color="var(--color-brand-primary)" /> Shift Filters
            </h3>
            <button onClick={handleReset} style={{ fontSize: '0.8rem', color: 'var(--color-action-primary)', fontWeight: 600 }}>
              Reset
            </button>
          </div>

          <form onSubmit={handleApplyFilters} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Role or Skills</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. Event, Loading, Barcode..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '34px' }}
                />
                <Search size={14} color="var(--color-text-secondary)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Worksite Locality</label>
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="form-select"
              >
                <option value="">All Mumbai Localities</option>
                {localities.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name} ({loc.region})</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Minimum Pay (₹)</label>
              <input
                type="number"
                placeholder="e.g. 800"
                value={minPay}
                onChange={(e) => setMinPay(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sort Gigs</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
              >
                <option value="newest">Recently Posted</option>
                <option value="pay_desc">Highest Pay First</option>
                <option value="pay_asc">Lowest Pay First</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '6px' }}>
              Filter Gigs
            </button>
          </form>
        </div>

        {/* Gig Results */}
        <div style={{ gridColumn: 'span 2' }}>
          {isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {[1, 2, 3].map((n) => (
                <div key={n} className="card" style={{ padding: '24px', height: '240px' }}>
                  <div className="skeleton" style={{ width: '70%', height: '24px', marginBottom: '14px' }} />
                  <div className="skeleton" style={{ width: '40%', height: '18px', marginBottom: '24px' }} />
                  <div className="skeleton" style={{ width: '100%', height: '60px' }} />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="card" style={{ padding: '36px', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-error)', marginBottom: '16px' }}>Error loading gig listings.</p>
              <button onClick={() => refetch()} className="btn btn-outline btn-sm">Retry</button>
            </div>
          ) : gigs.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No open gigs match your criteria"
              description="Check back shortly or reset your filters. Employers regularly post urgent shift vacancies in Mumbai."
              actionText="Reset Filters"
              onAction={handleReset}
            />
          ) : (
            <>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
                Showing <strong>{gigs.length}</strong> active gig opportunities
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {gigs.map((gig) => {
                  const gigPhoto = gig.image_url || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80';
                  const gigAlt = gig.photo_alt_text || `${gig.title} - Mumbai Shift Work`;
                  const isDemoGig = Boolean(gig.is_demo || gig.employer_is_demo);

                  return (
                    <div
                      key={gig.id}
                      className="card"
                      style={{
                        padding: 0,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      {/* Work Photo Banner */}
                      <div style={{ position: 'relative', height: '140px', overflow: 'hidden', backgroundColor: '#F1F5F9' }}>
                        <img
                          src={gigPhoto}
                          alt={gigAlt}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = '/assets/categories/moving_loading.jpg';
                          }}
                        />
                        {/* Locality & Demo Badges (Top Left) */}
                        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span className="badge badge-neutral" style={{ backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)', color: '#0B2F57', fontWeight: 600 }}>
                            <MapPin size={12} color="var(--color-action-primary)" /> {gig.locality_name || 'Mumbai'}
                          </span>
                          {isDemoGig && (
                            <span style={{
                              backgroundColor: 'rgba(15, 23, 42, 0.8)',
                              color: '#FDE68A',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              letterSpacing: '0.5px'
                            }}>
                              DEMO
                            </span>
                          )}
                        </div>

                        {/* Shift Compensation Overlay (Bottom Right) */}
                        <div style={{
                          position: 'absolute',
                          bottom: '8px',
                          right: '8px',
                          backgroundColor: 'rgba(0, 0, 0, 0.75)',
                          color: '#FFFFFF',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontWeight: 800
                        }}>
                          ₹{gig.pay_amount} <span style={{ fontSize: '0.7rem', fontWeight: 500, color: '#CBD5E1' }}>/ {gig.pay_unit}</span>
                        </div>
                      </div>

                      {/* Card Content Body */}
                      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.35, marginBottom: '8px' }}>
                            <Link to={`/gigs/${gig.id}`} style={{ color: 'var(--color-brand-deep)' }}>{gig.title}</Link>
                          </h3>

                          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                            {gig.description.slice(0, 110)}...
                          </p>

                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            fontSize: '0.8rem',
                            backgroundColor: 'var(--color-surface-tint)',
                            padding: '12px',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '16px',
                            border: '1px solid #C7D9ED'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Clock size={14} color="var(--color-brand-primary)" />
                              <span>Date: <strong>{gig.shift_date}</strong> ({gig.start_time} - {gig.end_time})</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Users size={14} color="var(--color-action-primary)" />
                              <span>Openings: <strong style={{ color: gig.openings > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>{gig.openings} positions available</strong></span>
                            </div>
                          </div>

                          {/* Skills */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                            {gig.required_skills?.map((s, idx) => (
                              <span key={idx} style={{ fontSize: '0.725rem', backgroundColor: '#E2E8F0', padding: '3px 8px', borderRadius: '4px', color: 'var(--color-text-ink)' }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {gig.employer_logo_url ? (
                              <img
                                src={gig.employer_logo_url}
                                alt={gig.employer_logo_alt_text || gig.employer_name || 'Employer'}
                                style={{ width: '22px', height: '22px', borderRadius: '4px', objectFit: 'contain' }}
                                loading="lazy"
                              />
                            ) : null}
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                              {gig.employer_name || 'Verified Employer'}
                            </span>
                          </div>
                          <Link to={`/gigs/${gig.id}`} className="btn btn-primary btn-sm">
                            View & Apply
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '36px',
                  }}
                >
                  <button
                    onClick={() => handlePageChange(pageParam - 1)}
                    disabled={pageParam <= 1}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: pageParam <= 1 ? '#F1F5F9' : '#FFFFFF',
                      color: pageParam <= 1 ? '#94A3B8' : '#334155',
                      cursor: pageParam <= 1 ? 'not-allowed' : 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>

                  {Array.from({ length: Math.min(totalPages, 7) }, (_, idx) => {
                    let pNum = idx + 1;
                    if (totalPages > 7) {
                      if (pageParam > 4 && pageParam < totalPages - 2) {
                        pNum = pageParam - 3 + idx;
                      } else if (pageParam >= totalPages - 2) {
                        pNum = totalPages - 6 + idx;
                      }
                    }
                    const isActive = pNum === pageParam;
                    return (
                      <button
                        key={pNum}
                        onClick={() => handlePageChange(pNum)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          border: isActive ? '1px solid var(--color-brand-primary)' : '1px solid #E2E8F0',
                          backgroundColor: isActive ? 'var(--color-brand-primary)' : '#FFFFFF',
                          color: isActive ? '#FFFFFF' : '#334155',
                          fontWeight: isActive ? 700 : 500,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          minWidth: '38px',
                        }}
                      >
                        {pNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(pageParam + 1)}
                    disabled={pageParam >= totalPages}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: pageParam >= totalPages ? '#F1F5F9' : '#FFFFFF',
                      color: pageParam >= totalPages ? '#94A3B8' : '#334155',
                      cursor: pageParam >= totalPages ? 'not-allowed' : 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
