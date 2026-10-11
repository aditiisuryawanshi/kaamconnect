import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Wrench, MapPin, Clock, Pause, Play, Check, AlertCircle, X } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { ServiceListing, ServiceCategory, Locality } from '../../types';
import { EmptyState } from '../../components/ui/EmptyState';

export const WorkerServicesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [priceAmount, setPriceAmount] = useState(350);
  const [priceUnit, setPriceUnit] = useState<'visit' | 'hour' | 'task' | 'day'>('visit');
  const [minCharge, setMinCharge] = useState(350);
  const [priceNotes, setPriceNotes] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [leadTime, setLeadTime] = useState(2);

  // Fetch worker's services
  const { data: myServices = [], isLoading, refetch } = useQuery({
    queryKey: ['my-services'],
    queryFn: async () => {
      const res = await apiRequest<ServiceListing[]>('/services/my');
      return res.data;
    },
  });

  // Fetch categories & localities
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiRequest<ServiceCategory[]>('/meta/categories');
      if (res.data.length > 0 && !categoryId) setCategoryId(res.data[0].id);
      return res.data;
    },
  });

  const { data: localities = [] } = useQuery({
    queryKey: ['localities'],
    queryFn: async () => {
      const res = await apiRequest<Locality[]>('/meta/localities');
      return res.data;
    },
  });

  const toggleArea = (id: string) => {
    setSelectedAreas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Create Service Mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      setErrorMessage('');
      const payload = {
        title,
        category_id: categoryId,
        description,
        pricing: {
          amount: priceAmount,
          currency: 'INR',
          unit: priceUnit,
          minimum_charge: minCharge,
          additional_notes: priceNotes,
        },
        service_area_ids: selectedAreas,
        booking_lead_time_hours: leadTime,
        publish_now: true,
      };
      return await apiRequest('/services', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-services'] });
      setModalOpen(false);
      setTitle('');
      setDescription('');
      setSelectedAreas([]);
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to create service listing.');
    },
  });

  // Toggle status mutations
  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/services/${id}/publish`, { method: 'POST' });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-services'] }),
  });

  const pauseMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/services/${id}/pause`, { method: 'POST' });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-services'] }),
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      setErrorMessage('Please select a service category.');
      return;
    }
    if (selectedAreas.length === 0) {
      setErrorMessage('Please select at least one Mumbai locality.');
      return;
    }
    createMutation.mutate();
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h2 className="editorial-title" style={{ fontSize: '1.8rem', marginBottom: '6px' }}>
            My Service Offerings
          </h2>
          <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem' }}>
            Manage the direct household and commercial services you offer across Mumbai.
          </p>
        </div>

        <button onClick={() => setModalOpen(true)} className="btn btn-primary">
          <Plus size={18} /> Offer New Service
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2].map((n) => (
            <div key={n} className="card skeleton" style={{ height: '140px' }} />
          ))}
        </div>
      ) : myServices.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="You haven't created any service listings yet"
          description="Create your first listing to start receiving direct booking requests from Mumbai households."
          actionText="Offer New Service"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {myServices.map((service) => (
            <div
              key={service.id}
              className="card"
              style={{ padding: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}
            >
              <div style={{ flex: '1 1 320px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className={`badge ${service.status === 'published' ? 'badge-green' : 'badge-neutral'}`}>
                    {service.status.toUpperCase()}
                  </span>
                  <span className="badge badge-neutral">{service.category_name}</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
                  {service.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', lineHeight: 1.5, marginBottom: '10px' }}>
                  {service.description.slice(0, 140)}...
                </p>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-green)' }}>
                  ₹{service.pricing.amount} <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>/ {service.pricing.unit}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {service.status === 'published' ? (
                  <button
                    onClick={() => pauseMutation.mutate(service.id)}
                    className="btn btn-outline btn-sm"
                    disabled={pauseMutation.isPending}
                  >
                    <Pause size={14} /> Pause Listing
                  </button>
                ) : (
                  <button
                    onClick={() => publishMutation.mutate(service.id)}
                    className="btn btn-primary btn-sm"
                    disabled={publishMutation.isPending}
                  >
                    <Play size={14} /> Publish Listing
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE SERVICE MODAL */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 300,
          padding: '16px'
        }}>
          <div className="card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="editorial-title" style={{ fontSize: '1.4rem' }}>Offer New Service</h3>
              <button onClick={() => setModalOpen(false)} style={{ color: 'var(--color-secondary-text)' }}>
                <X size={20} />
              </button>
            </div>

            {errorMessage && (
              <div style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrical Wiring & Switchboard Repair"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="form-select"
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe what is included in this service, equipment carried, etc..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    min={50}
                    value={priceAmount}
                    onChange={(e) => setPriceAmount(parseFloat(e.target.value) || 0)}
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Unit *</label>
                  <select
                    value={priceUnit}
                    onChange={(e) => setPriceUnit(e.target.value as any)}
                    className="form-select"
                  >
                    <option value="visit">Per Visit / Inspection</option>
                    <option value="task">Per Task / Job</option>
                    <option value="hour">Per Hour</option>
                    <option value="day">Per Day</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Select Serviceable Localities ({selectedAreas.length} selected) *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '130px', overflowY: 'auto', padding: '6px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  {localities.map((loc) => {
                    const isSelected = selectedAreas.includes(loc.id);
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => toggleArea(loc.id)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: isSelected ? 'var(--color-primary-green)' : '#F0EDE5',
                          color: isSelected ? '#fff' : 'var(--color-dark-ink)',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {loc.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Publishing...' : 'Publish Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
