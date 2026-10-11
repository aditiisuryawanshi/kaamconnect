import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Search, Filter, Clock, Users, ArrowRight } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { Gig, Locality } from '../../types';
import { EmptyState } from '../../components/ui/EmptyState';

export const GigsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const localityParam = searchParams.get('locality') || '';
  const keywordParam = searchParams.get('keyword') || '';
  const sortParam = searchParams.get('sort') || 'newest';

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
    queryKey: ['gigs-discovery', selectedLocality, keywordParam, sortBy, minPay],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedLocality) params.set('locality', selectedLocality);
      if (keywordParam) params.set('keyword', keywordParam);
      if (minPay) params.set('min_pay', minPay);
      if (sortBy) params.set('sort', sortBy);
      params.set('limit', '12');

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
    setSearchParams(params);
  };

  const handleReset = () => {
    setKeyword('');
    setSelectedLocality('');
    setMinPay('');
    setSortBy('newest');
    setSearchParams({});
  };

  const gigs = gigData?.data || [];

  return (
    <div className="container" style={{ padding: '40px 16px 80px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="editorial-title" style={{ fontSize: '2.4rem', marginBottom: '8px' }}>
          Temporary Gigs & Shift Work in Mumbai
        </h1>
        <p style={{ color: 'var(--color-secondary-text)', fontSize: '1rem' }}>
          Find flexible short-term opportunities, event assistance, warehouse shifts, and daily payout work across Mumbai region.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'start' }}>
        {/* Filters */}
        <div className="card" style={{ padding: '24px', position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} /> Shift Filters
            </h3>
            <button onClick={handleReset} style={{ fontSize: '0.8rem', color: 'var(--color-action-orange)', fontWeight: 600 }}>
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
                <Search size={14} color="var(--color-secondary-text)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
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
              <p style={{ fontSize: '0.875rem', color: 'var(--color-secondary-text)', marginBottom: '20px' }}>
                Showing <strong>{gigs.length}</strong> active gig opportunities
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {gigs.map((gig) => (
                  <div
                    key={gig.id}
                    className="card"
                    style={{
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <span className="badge badge-neutral">
                          <MapPin size={12} color="var(--color-action-orange)" /> {gig.locality_name || 'Mumbai'}
                        </span>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-green)' }}>
                            ₹{gig.pay_amount}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginLeft: '4px' }}>
                            / {gig.pay_unit}
                          </span>
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.35, marginBottom: '8px' }}>
                        <Link to={`/gigs/${gig.id}`}>{gig.title}</Link>
                      </h3>

                      <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', lineHeight: 1.5, marginBottom: '16px' }}>
                        {gig.description.slice(0, 110)}...
                      </p>

                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        fontSize: '0.8rem',
                        backgroundColor: '#FAF8F3',
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '16px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={14} color="var(--color-primary-green)" />
                          <span>Date: <strong>{gig.shift_date}</strong> ({gig.start_time} - {gig.end_time})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Users size={14} color="var(--color-action-orange)" />
                          <span>Openings: <strong>{gig.openings} positions available</strong></span>
                        </div>
                      </div>

                      {/* Skills */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                        {gig.required_skills?.map((s, idx) => (
                          <span key={idx} style={{ fontSize: '0.725rem', backgroundColor: '#EDEAE1', padding: '3px 8px', borderRadius: '4px', color: 'var(--color-dark-ink)' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
                        Posted by {gig.employer_name || 'Employer'}
                      </span>
                      <Link to={`/gigs/${gig.id}`} className="btn btn-primary btn-sm">
                        View & Apply
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
