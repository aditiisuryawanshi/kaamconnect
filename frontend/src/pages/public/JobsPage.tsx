import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { Briefcase, MapPin, Search, Filter, Building, ArrowRight } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { Job, Locality } from '../../types';
import { EmptyState } from '../../components/ui/EmptyState';

export const JobsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const localityParam = searchParams.get('locality') || '';
  const keywordParam = searchParams.get('keyword') || '';
  const empTypeParam = searchParams.get('employment_type') || '';
  const sortParam = searchParams.get('sort') || 'newest';

  const [keyword, setKeyword] = useState(keywordParam);
  const [selectedLocality, setSelectedLocality] = useState(localityParam);
  const [employmentType, setEmploymentType] = useState(empTypeParam);
  const [sortBy, setSortBy] = useState(sortParam);

  const { data: localities = [] } = useQuery({
    queryKey: ['localities'],
    queryFn: async () => {
      const res = await apiRequest<Locality[]>('/meta/localities');
      return res.data;
    },
  });

  const { data: jobData, isLoading, isError, refetch } = useQuery({
    queryKey: ['jobs-discovery', selectedLocality, keywordParam, employmentType, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedLocality) params.set('locality', selectedLocality);
      if (keywordParam) params.set('keyword', keywordParam);
      if (employmentType) params.set('employment_type', employmentType);
      if (sortBy) params.set('sort', sortBy);
      params.set('limit', '12');

      const res = await apiRequest<Job[]>(`/jobs?${params.toString()}`);
      return res;
    },
  });

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedLocality) params.set('locality', selectedLocality);
    if (keyword) params.set('keyword', keyword);
    if (employmentType) params.set('employment_type', employmentType);
    if (sortBy) params.set('sort', sortBy);
    setSearchParams(params);
  };

  const handleReset = () => {
    setKeyword('');
    setSelectedLocality('');
    setEmploymentType('');
    setSortBy('newest');
    setSearchParams({});
  };

  const jobs = jobData?.data || [];

  return (
    <div className="container" style={{ padding: '40px 16px 80px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="editorial-title" style={{ fontSize: '2.4rem', marginBottom: '8px' }}>
          Long-Term Jobs in Mumbai
        </h1>
        <p style={{ color: 'var(--color-secondary-text)', fontSize: '1rem' }}>
          Secure permanent positions with transparent monthly salaries, PF, ESIC, and career growth.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'start' }}>
        {/* Filters */}
        <div className="card" style={{ padding: '24px', position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} /> Job Filters
            </h3>
            <button onClick={handleReset} style={{ fontSize: '0.8rem', color: 'var(--color-action-orange)', fontWeight: 600 }}>
              Reset
            </button>
          </div>

          <form onSubmit={handleApplyFilters} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Job Title / Skills</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. Electrician, Logistics..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '34px' }}
                />
                <Search size={14} color="var(--color-secondary-text)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Locality</label>
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
              <label className="form-label">Employment Type</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="form-select"
              >
                <option value="">All Types</option>
                <option value="full_time">Full-Time Permanent</option>
                <option value="part_time">Part-Time</option>
                <option value="contract">Fixed Contract</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sort Order</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
              >
                <option value="newest">Recently Posted</option>
                <option value="salary_desc">Highest Salary First</option>
                <option value="salary_asc">Lowest Salary First</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '6px' }}>
              Filter Jobs
            </button>
          </form>
        </div>

        {/* Results */}
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
              <p style={{ color: 'var(--color-error)', marginBottom: '16px' }}>Error loading job listings.</p>
              <button onClick={() => refetch()} className="btn btn-outline btn-sm">Retry</button>
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No jobs match your criteria"
              description="Check back shortly or reset your search parameters to explore full-time vacancies."
              actionText="Reset Filters"
              onAction={handleReset}
            />
          ) : (
            <>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-secondary-text)', marginBottom: '20px' }}>
                Showing <strong>{jobs.length}</strong> permanent positions
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {jobs.map((job) => (
                  <div
                    key={job.id}
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
                        <span className="badge badge-green">
                          {job.employment_type.replace('_', ' ').toUpperCase()}
                        </span>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary-green)' }}>
                            ₹{job.salary_min.toLocaleString()} - ₹{job.salary_max.toLocaleString()}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginLeft: '4px' }}>
                            / {job.pay_period}
                          </span>
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.35, marginBottom: '6px' }}>
                        <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                      </h3>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: 'var(--color-secondary-text)', marginBottom: '12px' }}>
                        <Building size={14} /> <span>{job.employer_name || 'Employer'}</span>
                        <span>•</span>
                        <MapPin size={14} color="var(--color-action-orange)" /> <span>{job.locality_name || 'Mumbai'}</span>
                      </div>

                      <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', lineHeight: 1.5, marginBottom: '16px' }}>
                        {job.description.slice(0, 110)}...
                      </p>

                      {/* Benefits chips */}
                      {job.benefits && job.benefits.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                          {job.benefits.slice(0, 3).map((b, idx) => (
                            <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.725rem' }}>
                              ✓ {b}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
                        Schedule: {job.schedule}
                      </span>
                      <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm">
                        View Details
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
