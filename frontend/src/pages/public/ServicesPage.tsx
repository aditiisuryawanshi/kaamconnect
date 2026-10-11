import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Wrench, Filter, Star, Clock, Bookmark } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { ServiceListing, ServiceCategory, Locality } from '../../types';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../features/auth/AuthContext';

export const ServicesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

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
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

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
    queryKey: ['services', selectedCategory, selectedLocality, keywordParam, sortBy, minPrice, maxPrice, pageParam],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory) params.set('category', selectedCategory);
      if (selectedLocality) params.set('locality', selectedLocality);
      if (keywordParam) params.set('keyword', keywordParam);
      if (minPrice) params.set('min_price', minPrice);
      if (maxPrice) params.set('max_price', maxPrice);
      if (sortBy) params.set('sort', sortBy);
      params.set('page', pageParam.toString());
      params.set('limit', '12');

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
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setSearchParams({});
  };

  const services = serviceData?.data || [];
  const pagination = serviceData?.pagination;

  return (
    <div className="container" style={{ padding: '40px 16px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 className="editorial-title" style={{ fontSize: '2.4rem', marginBottom: '8px' }}>
          Explore Services in Mumbai
        </h1>
        <p style={{ color: 'var(--color-secondary-text)', fontSize: '1rem' }}>
          Connect with trusted local technicians, cleaners, electricians, and home service providers.
        </p>
      </div>

      {/* Main Filter + Results Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'start' }}>
        {/* Filter Panel (Desktop & Tablet) */}
        <div className="card" style={{ padding: '24px', position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} /> Filters
            </h3>
            <button
              onClick={handleResetFilters}
              style={{ fontSize: '0.8rem', color: 'var(--color-action-orange)', fontWeight: 600 }}
            >
              Reset All
            </button>
          </div>

          <form onSubmit={handleApplyFilters} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Keyword Search */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Search Keyword</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. Electrician, AC Repair..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '34px' }}
                />
                <Search size={14} color="var(--color-secondary-text)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Mumbai Locality Filter */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Mumbai Locality</label>
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

            {/* Service Category */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Service Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-select"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Price Range (₹)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="form-input"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* Sort Order */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
              >
                <option value="newest">Recently Published</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              Apply Filters
            </button>
          </form>
        </div>

        {/* Results Area */}
        <div style={{ gridColumn: 'span 2' }}>
          {isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="card" style={{ padding: '20px', height: '260px' }}>
                  <div className="skeleton" style={{ width: '60%', height: '24px', marginBottom: '12px' }} />
                  <div className="skeleton" style={{ width: '40%', height: '16px', marginBottom: '24px' }} />
                  <div className="skeleton" style={{ width: '100%', height: '60px', marginBottom: '16px' }} />
                  <div className="skeleton" style={{ width: '50%', height: '28px' }} />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="card" style={{ padding: '36px', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-error)', marginBottom: '16px' }}>Could not load services from the server.</p>
              <button onClick={() => refetch()} className="btn btn-outline btn-sm">Try Again</button>
            </div>
          ) : services.length === 0 ? (
            <EmptyState
              icon={Wrench}
              title="No services match your filters"
              description="Try adjusting your keyword, locality, or category to find active service providers in Mumbai."
              actionText="Reset Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-secondary-text)' }}>
                  Showing <strong>{services.length}</strong> {services.length === 1 ? 'service' : 'services'} available
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="card"
                    style={{
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative'
                    }}
                  >
                    <div>
                      {/* Worker badge & Category */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <span className="badge badge-green">{service.category_name || 'Service'}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--color-secondary-text)' }}>
                          <Clock size={14} /> Lead: {service.booking_lead_time_hours}h
                        </div>
                      </div>

                      {/* Title */}
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.35, marginBottom: '10px' }}>
                        <Link to={`/services/${service.id}`} style={{ color: 'var(--color-dark-ink)' }}>
                          {service.title}
                        </Link>
                      </h3>

                      {/* Description */}
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', lineHeight: 1.5, marginBottom: '16px' }}>
                        {service.description.slice(0, 110)}...
                      </p>

                      {/* Provider Info */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        backgroundColor: '#FAF8F3',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '16px'
                      }}>
                        <div style={{
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-primary-green)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}>
                          {service.worker_name?.charAt(0) || 'W'}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                            <Link to={`/providers/${service.worker_profile_id || service.worker_id}`}>
                              {service.worker_name || 'Service Provider'}
                            </Link>
                          </div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--color-secondary-text)' }}>
                            {service.worker_headline || 'Skilled Professional'}
                          </div>
                        </div>
                      </div>

                      {/* Areas */}
                      {service.service_areas && service.service_areas.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginBottom: '16px', flexWrap: 'wrap' }}>
                          <MapPin size={13} color="var(--color-action-orange)" />
                          <span>Areas: {service.service_areas.map((a) => a.name).join(', ')}</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Pricing & Action */}
                    <div style={{
                      borderTop: '1px solid var(--color-border)',
                      paddingTop: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-secondary-text)', fontWeight: 600 }}>
                          Starting from
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-green)' }}>
                          ₹{service.pricing.amount} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-secondary-text)' }}>/ {service.pricing.unit}</span>
                        </div>
                      </div>

                      <Link to={`/services/${service.id}`} className="btn btn-primary btn-sm">
                        Request Booking
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
