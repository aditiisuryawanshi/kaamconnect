import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, AlertCircle, Plus, X } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { Locality, ServiceCategory } from '../../types';

export const EmployerPostGigPage: React.FC = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [workLocalityId, setWorkLocalityId] = useState('');
  const [workAddress, setWorkAddress] = useState('');
  const [shiftDate, setShiftDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [isOvernight, setIsOvernight] = useState(false);
  const [durationHours, setDurationHours] = useState(8);
  const [openings, setOpenings] = useState(3);
  const [payAmount, setPayAmount] = useState(850);
  const [payUnit, setPayUnit] = useState<'shift' | 'hour' | 'day'>('shift');
  const [paymentConditions, setPaymentConditions] = useState('Direct bank/UPI transfer upon conclusion of shift.');
  const [skillInput, setSkillInput] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['Punctuality', 'Physical fitness']);

  // Fetch localities & categories
  const { data: localities = [] } = useQuery({
    queryKey: ['localities'],
    queryFn: async () => {
      const res = await apiRequest<Locality[]>('/meta/localities');
      if (res.data.length > 0 && !workLocalityId) setWorkLocalityId(res.data[0].id);
      return res.data;
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiRequest<ServiceCategory[]>('/meta/categories');
      if (res.data.length > 0 && !categoryId) setCategoryId(res.data[0].id);
      return res.data;
    },
  });

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!requiredSkills.includes(skillInput.trim())) {
        setRequiredSkills([...requiredSkills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (s: string) => {
    setRequiredSkills(requiredSkills.filter((x) => x !== s));
  };

  const createGigMutation = useMutation({
    mutationFn: async () => {
      setErrorMessage('');
      const payload = {
        title: title.trim(),
        category_id: categoryId,
        description: description.trim(),
        responsibilities: ['Assist team supervisor', 'Complete shift duties punctually'],
        required_skills: requiredSkills.length > 0 ? requiredSkills : ['General assistance'],
        work_locality_id: workLocalityId,
        work_address: workAddress.trim(),
        shift_date: shiftDate,
        start_time: startTime,
        end_time: endTime,
        is_overnight: isOvernight,
        duration_hours: durationHours,
        openings: openings,
        pay_amount: payAmount,
        currency: 'INR',
        pay_unit: payUnit,
        payment_conditions: paymentConditions.trim(),
        publish_now: true,
      };
      return await apiRequest('/gigs', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (data) => {
      navigate(`/gigs/${data.data.id}`);
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to post gig.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || title.length < 5) {
      setErrorMessage('Please provide a descriptive title (at least 5 characters).');
      return;
    }
    if (!categoryId) {
      setErrorMessage('Please choose a category.');
      return;
    }
    if (!workLocalityId) {
      setErrorMessage('Please choose a worksite locality.');
      return;
    }
    createGigMutation.mutate();
  };

  return (
    <div style={{ maxWidth: 840, margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 className="editorial-title" style={{ fontSize: '1.8rem', marginBottom: '6px' }}>
          Post a Shift Gig in Mumbai
        </h2>
        <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem' }}>
          Find temporary helpers, event crews, warehouse loaders, and retail shift staff quickly.
        </p>
      </div>

      <div className="card" style={{ padding: '36px 32px' }}>
        {errorMessage && (
          <div style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Gig Title */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Gig Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Exhibition Venue Helpers - BKC Complex"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
              <label className="form-label">Worksite Locality *</label>
              <select
                value={workLocalityId}
                onChange={(e) => setWorkLocalityId(e.target.value)}
                className="form-select"
                required
              >
                {localities.map((l) => (
                  <option key={l.id} value={l.id}>{l.name} ({l.region})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Exact Venue / Work Address (Private to accepted candidates)</label>
            <input
              type="text"
              placeholder="e.g. Hall 4, MMRDA Grounds, Bandra-Kurla Complex"
              value={workAddress}
              onChange={(e) => setWorkAddress(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Shift Description *</label>
            <textarea
              required
              rows={3}
              placeholder="Describe the duties, attire requirements, supervisor contact instructions, etc..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
            />
          </div>

          {/* Shift Schedule Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', backgroundColor: '#FAF8F3', padding: '18px', borderRadius: 'var(--radius-md)' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Shift Date *</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={shiftDate}
                onChange={(e) => setShiftDate(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Start Time *</label>
              <input
                type="text"
                required
                placeholder="09:00 AM"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">End Time *</label>
              <input
                type="text"
                required
                placeholder="05:00 PM"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Openings *</label>
              <input
                type="number"
                required
                min={1}
                max={100}
                value={openings}
                onChange={(e) => setOpenings(parseInt(e.target.value, 10) || 1)}
                className="form-input"
              />
            </div>
          </div>

          {/* Compensation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Compensation Amount (₹) *</label>
              <input
                type="number"
                required
                min={100}
                value={payAmount}
                onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Pay Unit *</label>
              <select
                value={payUnit}
                onChange={(e) => setPayUnit(e.target.value as any)}
                className="form-select"
              >
                <option value="shift">Per Shift</option>
                <option value="hour">Per Hour</option>
                <option value="day">Per Day</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Payment Conditions</label>
            <input
              type="text"
              placeholder="e.g. Daily UPI payout at shift completion"
              value={paymentConditions}
              onChange={(e) => setPaymentConditions(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Required Skills */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Required Skills (Press Enter to add)</label>
            <input
              type="text"
              placeholder="e.g. Heavy lifting, English speaking..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              className="form-input"
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
              {requiredSkills.map((s) => (
                <span
                  key={s}
                  className="badge badge-green"
                  style={{ padding: '6px 12px', fontSize: '0.85rem', cursor: 'pointer' }}
                  onClick={() => removeSkill(s)}
                >
                  {s} ✕
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={createGigMutation.isPending}
          >
            {createGigMutation.isPending ? 'Publishing Gig...' : 'Publish Shift Gig Now'}
          </button>
        </form>
      </div>
    </div>
  );
};
