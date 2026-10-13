import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Star } from 'lucide-react';
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

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedLocality) params.set('locality', selectedLocality);
    if (keyword) params.set('keyword', keyword);
    if (sortBy) params.set('sort', sortBy);
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

  const services = serviceData?.data || [];

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
              onChange={(e) => setSelectedCategory(e.target.value)}
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
              onChange={(e) => setSelectedLocality(e.target.value)}
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
              onChange={(e) => setSortBy(e.target.value)}
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
            title="No Services Found"
            description="Try adjusting your filters or selecting a different locality."
            actionText="Reset Filters"
            onAction={handleResetFilters}
          />
        ) : (
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
                  {/* Photo with Overlay Rating Badge */}
                  <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
                    <img
                      src={cardImage}
                      alt={service.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
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
                        marginBottom: '6px',
                        lineHeight: 1.3
                      }}>
                        {service.title}
                      </h3>

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
                        <span>{service.service_areas?.[0]?.name || 'Andheri'}, Mumbai</span>
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
        )}
      </div>
    </div>
  );
};
