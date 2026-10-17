import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { Job, Locality } from '../../types';
import { EmptyState } from '../../components/ui/EmptyState';

// High-quality photographic avatars representing trades/roles in Mumbai
const getJobPhoto = (title: string): string => {
  const t = title.toLowerCase();
  if (t.includes('delivery') || t.includes('courier') || t.includes('driver')) {
    return 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=300&q=80';
  }
  if (t.includes('security') || t.includes('guard')) {
    return 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=300&q=80';
  }
  if (t.includes('warehouse') || t.includes('helper') || t.includes('dispatch') || t.includes('logistics')) {
    return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=300&q=80';
  }
  if (t.includes('electrician') || t.includes('electrical') || t.includes('technician') || t.includes('facility')) {
    return 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80';
  }
  if (t.includes('office') || t.includes('assistant') || t.includes('admin') || t.includes('clerk')) {
    return 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80';
  }
  if (t.includes('cook') || t.includes('chef') || t.includes('kitchen')) {
    return 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=300&q=80';
  }
  if (t.includes('plumb') || t.includes('sanitation')) {
    return 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=300&q=80';
  }
  if (t.includes('housekeep') || t.includes('cleaner') || t.includes('hygiene')) {
    return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=300&q=80';
  }
  if (t.includes('appliance') || t.includes('hvac') || t.includes('refrigeration')) {
    return 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=300&q=80';
  }
  if (t.includes('salon') || t.includes('beauty') || t.includes('stylist') || t.includes('makeup')) {
    return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80';
  }
  return 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=300&q=80';
};

export const JobsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const localityParam = searchParams.get('locality') || '';
  const keywordParam = searchParams.get('keyword') || '';
  const roleParam = searchParams.get('role') || '';
  const salaryParam = searchParams.get('salary') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const limit = 12;

  const [keyword, setKeyword] = useState(keywordParam);
  const [selectedRole, setSelectedRole] = useState(roleParam);
  const [selectedLocality, setSelectedLocality] = useState(localityParam);
  const [selectedSalary, setSelectedSalary] = useState(salaryParam);

  // Fetch Mumbai localities
  const { data: localities = [] } = useQuery({
    queryKey: ['localities'],
    queryFn: async () => {
      const res = await apiRequest<Locality[]>('/meta/localities');
      return res.data;
    },
  });

  // Fetch job roles
  const { data: jobRoles = [] } = useQuery({
    queryKey: ['job-roles'],
    queryFn: async () => {
      const res = await apiRequest<Array<{ slug: string; name: string }>>('/meta/job-roles');
      return res.data;
    },
  });

  // Fetch paginated jobs from backend API
  const { data: jobData, isLoading } = useQuery({
    queryKey: ['jobs-discovery', localityParam, roleParam, keywordParam, salaryParam, pageParam],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (localityParam) params.set('locality', localityParam);
      if (roleParam) params.set('role', roleParam);
      if (keywordParam) params.set('keyword', keywordParam);
      if (salaryParam) params.set('min_salary', salaryParam);
      params.set('page', pageParam.toString());
      params.set('limit', limit.toString());

      const res = await apiRequest<Job[]>(`/jobs?${params.toString()}`);
      return res;
    },
  });

  const jobs = jobData?.data || [];
  const pagination = jobData?.pagination || { total: 0, page: 1, limit, pages: 1 };
  const totalPages = pagination.pages || Math.ceil((pagination.total || 0) / limit) || 1;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (selectedRole) params.set('role', selectedRole);
    if (selectedLocality) params.set('locality', selectedLocality);
    if (selectedSalary) params.set('salary', selectedSalary);
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
    setSelectedRole('');
    setSelectedLocality('');
    setSelectedSalary('');
    setSearchParams({});
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '85vh', padding: '32px 0 64px' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.875rem',
              fontWeight: 800,
              color: '#0B2F57',
              marginBottom: '6px',
            }}
          >
            Jobs in Mumbai
          </h1>
          <p style={{ color: '#667085', fontSize: '0.95rem' }}>
            Find full-time and verified long-term employment opportunities across Mumbai neighbourhoods.
          </p>
        </div>

        {/* Filter Bar */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#FFFFFF',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            marginBottom: '24px',
          }}
        >
          {/* Search Input */}
          <div style={{ flex: '2 1 240px', position: 'relative' }}>
            <Search
              size={18}
              color="#94A3B8"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search jobs by title or skills..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 38px',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#1E293B',
                backgroundColor: '#F8FAFC',
                outline: 'none',
              }}
            />
          </div>

          {/* Role Dropdown */}
          <div style={{ flex: '1 1 180px' }}>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#334155',
                backgroundColor: '#F8FAFC',
                cursor: 'pointer',
              }}
            >
              <option value="">All Job Roles</option>
              {jobRoles.length > 0 ? (
                jobRoles.map((r) => (
                  <option key={r.slug} value={r.slug}>
                    {r.name}
                  </option>
                ))
              ) : (
                <>
                  <option value="delivery-executive">Delivery Executive</option>
                  <option value="security-guard">Security Guard</option>
                  <option value="warehouse-associate">Warehouse Associate</option>
                  <option value="facility-electrician">Electrician & Technician</option>
                  <option value="office-assistant">Office Assistant</option>
                  <option value="cook-home-chef">Cook / Home Chef</option>
                  <option value="commercial-plumber">Plumber</option>
                  <option value="housekeeping-supervisor">Housekeeping Supervisor</option>
                  <option value="appliance-technician">Appliance Technician</option>
                  <option value="beautician-stylist">Salon Beautician</option>
                </>
              )}
            </select>
          </div>

          {/* Location Dropdown */}
          <div style={{ flex: '1 1 180px' }}>
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#334155',
                backgroundColor: '#F8FAFC',
                cursor: 'pointer',
              }}
            >
              <option value="">All Mumbai Localities</option>
              {localities.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.region})
                </option>
              ))}
            </select>
          </div>

          {/* Salary Range Dropdown */}
          <div style={{ flex: '1 1 160px' }}>
            <select
              value={selectedSalary}
              onChange={(e) => setSelectedSalary(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#334155',
                backgroundColor: '#F8FAFC',
                cursor: 'pointer',
              }}
            >
              <option value="">Any Salary</option>
              <option value="15000">₹15,000+ / mo</option>
              <option value="20000">₹20,000+ / mo</option>
              <option value="25000">₹25,000+ / mo</option>
              <option value="30000">₹30,000+ / mo</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              padding: '9px 20px',
              backgroundColor: '#123F73',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.9rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Filter
          </button>
        </form>

        {/* Results Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <p style={{ fontSize: '0.875rem', color: '#667085', margin: 0 }}>
            Showing <strong>{jobs.length}</strong> {pagination.total ? `of ${pagination.total}` : ''} verified jobs in Mumbai
          </p>
          {(keyword || selectedRole || selectedLocality || selectedSalary) && (
            <button
              onClick={handleReset}
              style={{ fontSize: '0.825rem', color: '#FF851B', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Card Grid */}
        {isLoading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '20px',
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #E2E8F0',
                  height: '170px',
                  animation: 'pulse 1.5s infinite',
                }}
              />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No jobs match your selected criteria"
            description="Try selecting a different locality or resetting your filters to explore available Mumbai opportunities."
            actionText="Reset All Filters"
            onAction={handleReset}
          />
        ) : (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '20px',
                marginBottom: '36px',
              }}
            >
              {jobs.map((job) => {
                const photoUrl = job.image_url || getJobPhoto(job.title);
                return (
                  <div
                    key={job.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      padding: '16px 18px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '14px',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    {/* Top Section: Avatar + Details */}
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}>
                        <img
                          src={photoUrl}
                          alt={job.photo_alt_text || job.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '10px',
                            objectFit: 'cover',
                          }}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = '/assets/categories/moving_loading.jpg';
                          }}
                        />
                        {Boolean(job.is_demo || job.employer_is_demo) && (
                          <span style={{
                            position: 'absolute',
                            bottom: '-4px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: 'rgba(15, 23, 42, 0.85)',
                            color: '#FDE68A',
                            fontSize: '0.55rem',
                            fontWeight: 800,
                            padding: '1px 5px',
                            borderRadius: '4px',
                            letterSpacing: '0.4px',
                            whiteSpace: 'nowrap'
                          }}>
                            DEMO
                          </span>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '0.98rem',
                            fontWeight: 700,
                            color: '#0B2F57',
                            marginBottom: '3px',
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          <Link to={`/jobs/${job.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {job.title}
                          </Link>
                        </h3>
                        <div
                          style={{
                            fontSize: '0.825rem',
                            color: '#667085',
                            marginBottom: '3px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          {job.employer_logo_url && (
                            <img
                              src={job.employer_logo_url}
                              alt={job.employer_logo_alt_text || job.employer_name || 'Employer'}
                              style={{ width: '16px', height: '16px', borderRadius: '3px', objectFit: 'contain' }}
                              loading="lazy"
                            />
                          )}
                          <span>{job.employer_name || 'Verified Mumbai Enterprise'}</span>
                        </div>
                        <div
                          style={{
                            fontSize: '0.775rem',
                            color: '#94A3B8',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginBottom: '6px',
                          }}
                        >
                          <MapPin size={12} color="#FF851B" />
                          <span>{job.locality_name ? `${job.locality_name}, Mumbai` : 'Mumbai'}</span>
                        </div>
                        <div
                          style={{
                            color: '#FF851B',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                          }}
                        >
                          ₹{job.salary_min?.toLocaleString()} - ₹{job.salary_max?.toLocaleString()}{' '}
                          <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#667085' }}>
                            / {job.pay_period}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action: Apply Now */}
                    <Link
                      to={`/jobs/${job.id}`}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'center',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: '1px solid #123F73',
                        color: '#123F73',
                        fontWeight: 600,
                        fontSize: '0.85rem',
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
                      View & Apply
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '20px',
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
                        border: isActive ? '1px solid #123F73' : '1px solid #E2E8F0',
                        backgroundColor: isActive ? '#123F73' : '#FFFFFF',
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
  );
};
