import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { ServiceListing, ServiceCategory, Locality } from '../../types';
import { EmptyState } from '../../components/ui/EmptyState';
import { useLanguage } from '../../features/i18n/LanguageContext';

export const ServicesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();

  // Filters from query params
  const categoryParam = searchParams.get('category') || '';
  const localityParam = searchParams.get('locality') || '';
  const keywordParam = searchParams.get('keyword') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  // Local state for interactive filters
  const [keyword, setKeyword] = useState(keywordParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedLocality, setSelectedLocality] = useState(localityParam);
  const [sortBy, setSortBy] = useState(sortParam);

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

  // Sync state with URL params and metadata lists
  useEffect(() => {
    setKeyword(keywordParam);
  }, [keywordParam]);

  useEffect(() => {
    setSortBy(sortParam);
  }, [sortParam]);

  useEffect(() => {
    if (categoryParam) {
      const match = categories.find(
        (c) => c.slug.toLowerCase() === categoryParam.toLowerCase() ||
               c.id === categoryParam ||
               c.name.toLowerCase() === categoryParam.toLowerCase()
      );
      if (match) {
        setSelectedCategory(match.slug);
      } else {
        setSelectedCategory(categoryParam);
      }
    } else {
      setSelectedCategory('');
    }
  }, [categoryParam, categories]);

  useEffect(() => {
    if (localityParam) {
      const match = localities.find(
        (l) => l.id === localityParam ||
               l.slug?.toLowerCase() === localityParam.toLowerCase() ||
               l.name.toLowerCase() === localityParam.toLowerCase()
      );
      if (match) {
        setSelectedLocality(match.id);
      } else {
        setSelectedLocality(localityParam);
      }
    } else {
      setSelectedLocality('');
    }
  }, [localityParam, localities]);

  // Fetch services
  const { data: serviceData, isLoading, isError, refetch } = useQuery({
    queryKey: ['services', selectedCategory, selectedLocality, keywordParam, sortBy, pageParam],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory) params.set('category', selectedCategory);
      if (selectedLocality) params.set('locality', selectedLocality);
      if (keywordParam) params.set('keyword', keywordParam);
      if (sortBy) params.set('sort', sortBy);
      params.set('page', pageParam.toString());
      params.set('limit', '20');

      const res = await apiRequest<ServiceListing[]>(`/services?${params.toString()}`);
      return res;
    },
  });

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    const params = new URLSearchParams(searchParams);
    if (val) {
      params.set('category', val);
    } else {
      params.delete('category');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleLocalityChange = (val: string) => {
    setSelectedLocality(val);
    const params = new URLSearchParams(searchParams);
    if (val) {
      params.set('locality', val);
    } else {
      params.delete('locality');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSortChange = (val: string) => {
    setSortBy(val);
    const params = new URLSearchParams(searchParams);
    if (val && val !== 'newest') {
      params.set('sort', val);
    } else {
      params.delete('sort');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedLocality) params.set('locality', selectedLocality);
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (sortBy && sortBy !== 'newest') params.set('sort', sortBy);
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedCategory('');
    setSelectedLocality('');
    setSortBy('newest');
    setSearchParams({});
  };

  const activeLocalityObj = localities.find(
    (l) => l.id === selectedLocality ||
           l.slug?.toLowerCase() === selectedLocality.toLowerCase() ||
           l.name.toLowerCase() === selectedLocality.toLowerCase()
  );

  const services = serviceData?.data || [];
  const pagination = serviceData?.pagination || { total: 0, page: 1, limit: 20, pages: 1 };
  const totalPages = pagination.pages || Math.ceil((pagination.total || 0) / 20) || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container" style={{ padding: '36px 16px 80px', maxWidth: '1200px' }}>
      {/* Header (Matching Screenshot) */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: 'var(--color-brand-deep)',
          marginBottom: '4px',
          fontFamily: 'var(--font-display)'
        }}>
          Services in Mumbai
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Find trusted service providers near you.
        </p>
      </div>

      {/* Single-Line Top Filter Bar (Matching Screenshot) */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        padding: '14px 18px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
        marginBottom: '28px'
      }}>
        <form onSubmit={handleApplyFilters} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 100px',
          gap: '12px',
          alignItems: 'center'
        }}>
          {/* Keyword Search */}
          <div style={{ position: 'relative' }}>
            <Search size={15} color="#A0AEC0" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search services..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                fontSize: '0.875rem'
              }}
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                fontSize: '0.875rem',
                backgroundColor: '#FFFFFF'
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Locality Dropdown */}
          <div>
            <select
              value={selectedLocality}
              onChange={(e) => handleLocalityChange(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                fontSize: '0.875rem',
                backgroundColor: '#FFFFFF'
              }}
            >
              <option value="">All Localities</option>
              {localities.map((loc) => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                fontSize: '0.875rem',
                backgroundColor: '#FFFFFF'
              }}
            >
              <option value="newest">Sort by: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {/* Filter Submit Button */}
          <button
            type="submit"
            style={{
              backgroundColor: 'var(--color-brand-primary)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '9px 16px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Apply
          </button>
        </form>
      </div>

      {/* Service Cards Grid (Matching Screenshot) */}
      <div>
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="card" style={{ padding: '16px', height: '280px' }}>
                <div className="skeleton" style={{ width: '100%', height: '140px', marginBottom: '12px' }} />
                <div className="skeleton" style={{ width: '70%', height: '20px', marginBottom: '8px' }} />
                <div className="skeleton" style={{ width: '40%', height: '16px' }} />
              </div>
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            title="Unable to load services"
            description="We could not connect to the database. Please try again."
            actionText="Retry"
            onAction={() => refetch()}
          />
        ) : services.length === 0 ? (
          <EmptyState
            title={
              selectedCategory && selectedLocality
                ? "No services found for the selected category and location."
                : selectedCategory
                ? "No services found for the selected category."
                : selectedLocality
                ? "No services found for the selected location."
                : "No Services Found"
            }
            description={
              selectedCategory && selectedLocality
                ? "Try selecting a different category or location, or reset filters to browse all services."
                : "Try adjusting your search or filters to find available services."
            }
            actionText="Reset Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <>
            <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(215px, 1fr))',
            gap: '20px'
          }}>
            {services.map((service, idx) => {
              const defaultImages = [
                'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=500&q=80'
              ];
              const cardImage = (service.image_urls && service.image_urls[0]) || defaultImages[idx % defaultImages.length];
              const ratings = ['4.8', '4.9', '4.7', '4.6', '4.8'];
              const rating = ratings[idx % ratings.length];
              const categoryFallback = '/assets/categories/' + (service.category_slug || 'home_cleaning').replace(/-/g, '_') + '.jpg';
              const matchedArea = activeLocalityObj
                ? service.service_areas?.find(
                    (a) => a.id === activeLocalityObj.id ||
                           a.name.toLowerCase() === activeLocalityObj.name.toLowerCase()
                  )
                : (selectedLocality
                    ? service.service_areas?.find(
                        (a) => a.id === selectedLocality ||
                               a.name.toLowerCase() === selectedLocality.toLowerCase()
                      )
                    : null);
              const displayLocality = matchedArea?.name || service.service_areas?.[0]?.name || 'Mumbai';

              return (
                <div
                  key={service.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  {/* Photo with Overlay Badges */}
                  <div style={{ position: 'relative', height: '140px', overflow: 'hidden', backgroundColor: '#F1F5F9' }}>
                    <img
                      src={cardImage}
                      alt={service.photo_alt_text || service.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== categoryFallback) {
                          target.src = categoryFallback;
                        }
                      }}
                    />
                    {/* Worker Portrait & Demo Badge Overlay (Top Left) */}
                    <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {service.worker_photo_url && (
                        <img
                          src={service.worker_photo_url}
                          alt={service.worker_photo_alt_text || service.worker_name || 'Worker portrait'}
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid #FFFFFF',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.25)'
                          }}
                          loading="lazy"
                        />
                      )}
                      {(service.is_demo || service.worker_is_demo) && (
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

                    {/* Rating Badge Overlay at Bottom Right */}
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(0, 0, 0, 0.75)',
                      color: '#FFFFFF',
                      padding: '3px 7px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}>
                      <Star size={11} fill="#F59E0B" color="#F59E0B" /> {rating}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: 'var(--color-brand-deep)',
                        marginBottom: '4px',
                        lineHeight: 1.3
                      }}>
                        {service.title}
                      </h3>

                      {service.worker_name && (
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '6px', fontWeight: 500 }}>
                          By {service.worker_name}
                        </div>
                      )}

                      {/* Pricing */}
                      <div style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: 'var(--color-action-primary)',
                        marginBottom: '6px'
                      }}>
                        ₹{service.pricing.amount} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#718096' }}>/ {service.pricing.unit}</span>
                      </div>

                      {/* Locality */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        color: '#718096',
                        marginBottom: '14px'
                      }}>
                        <MapPin size={12} color="var(--color-action-primary)" />
                        <span>{displayLocality}, Mumbai</span>
                      </div>
                    </div>

                    {/* View Details Button (Matching Screenshot) */}
                    <Link
                      to={`/services/${service.id}`}
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        padding: '7px 0',
                        borderRadius: '6px',
                        border: '1px solid var(--color-brand-primary)',
                        color: 'var(--color-brand-primary)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'block'
                      }}
                    >
                      View Details
                    </Link>
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
  );
};
