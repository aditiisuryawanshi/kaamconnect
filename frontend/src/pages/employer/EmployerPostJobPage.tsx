import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Briefcase, Building, MapPin, AlertCircle, Plus, X } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { Locality } from '../../types';

export const EmployerPostJobPage: React.FC = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [employmentType, setEmploymentType] = useState<'full_time' | 'part_time' | 'contract'>('full_time');
  const [description, setDescription] = useState('');
  const [experienceRequirements, setExperienceRequirements] = useState('1-3 years in relevant field');
  const [salaryMin, setSalaryMin] = useState(20000);
  const [salaryMax, setSalaryMax] = useState(28000);
  const [payPeriod, setPayPeriod] = useState<'month' | 'year' | 'week' | 'day'>('month');
  const [workLocalityId, setWorkLocalityId] = useState('');
  const [schedule, setSchedule] = useState('Monday to Saturday, 9:30 AM to 6:30 PM');
  const [skillInput, setSkillInput] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['Attention to detail', 'Local Mumbai knowledge']);
  const [benefits, setBenefits] = useState<string[]>(['PF & ESIC Coverage', 'Annual Bonus']);

  const { data: localities = [] } = useQuery({
    queryKey: ['localities'],
    queryFn: async () => {
      const res = await apiRequest<Locality[]>('/meta/localities');
      if (res.data.length > 0 && !workLocalityId) setWorkLocalityId(res.data[0].id);
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

  const toggleBenefit = (b: string) => {
    setBenefits((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  };

  const createJobMutation = useMutation({
    mutationFn: async () => {
      setErrorMessage('');
      const payload = {
        title: title.trim(),
        description: description.trim(),
        employment_type: employmentType,
        responsibilities: ['Execute assigned operational duties', 'Maintain safety and punctuality', 'Coordinate with shift supervisor'],
        required_skills: requiredSkills.length > 0 ? requiredSkills : ['Basic skills'],
        preferred_skills: [],
        experience_requirements: experienceRequirements.trim(),
        salary_min: salaryMin,
        salary_max: salaryMax,
        currency: 'INR',
        pay_period: payPeriod,
        benefits,
        work_locality_id: workLocalityId,
        schedule: schedule.trim(),
        publish_now: true,
      };
      return await apiRequest('/jobs', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (data) => {
      navigate(`/jobs/${data.data.id}`);
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to post job vacancy.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || title.length < 5) {
      setErrorMessage('Please provide a descriptive job title.');
      return;
    }
    if (!description || description.length < 30) {
      setErrorMessage('Please provide a detailed job description (at least 30 characters).');
      return;
    }
    if (!workLocalityId) {
      setErrorMessage('Please select a worksite locality.');
      return;
    }
    createJobMutation.mutate();
  };

  return (
    <div style={{ maxWidth: 840, margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 className="editorial-title" style={{ fontSize: '1.8rem', marginBottom: '6px' }}>
          Post a Permanent Job Vacancy
        </h2>
        <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem' }}>
          Recruit full-time technicians, operators, logistics associates, and skilled workers in Mumbai.
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
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Job Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Electrician & Facility Technician"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Employment Type *</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as any)}
                className="form-select"
              >
                <option value="full_time">Full-Time Permanent</option>
                <option value="part_time">Part-Time</option>
                <option value="contract">Fixed Contract</option>
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
            <label className="form-label">Job Description *</label>
            <textarea
              required
              rows={4}
              placeholder="Outline the day-to-day work, team structure, career advancement, and prerequisites..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Experience Requirements *</label>
              <input
                type="text"
                required
                placeholder="e.g. 2-4 years in commercial facilities"
                value={experienceRequirements}
                onChange={(e) => setExperienceRequirements(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Work Schedule *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mon-Sat, 9:30 AM to 6:30 PM"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Salary Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', backgroundColor: '#FAF8F3', padding: '18px', borderRadius: 'var(--radius-md)' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Salary Min (₹) *</label>
              <input
                type="number"
                required
                min={1000}
                value={salaryMin}
                onChange={(e) => setSalaryMin(parseFloat(e.target.value) || 0)}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Salary Max (₹) *</label>
              <input
                type="number"
                required
                min={salaryMin}
                value={salaryMax}
                onChange={(e) => setSalaryMax(parseFloat(e.target.value) || 0)}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Pay Period *</label>
              <select
                value={payPeriod}
                onChange={(e) => setPayPeriod(e.target.value as any)}
                className="form-select"
              >
                <option value="month">Per Month</option>
                <option value="year">Per Year</option>
                <option value="week">Per Week</option>
                <option value="day">Per Day</option>
              </select>
            </div>
          </div>

          {/* Benefits Checkbox Pills */}
          <div>
            <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Benefits & Perks</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['PF & ESIC Coverage', 'Health Insurance', 'Annual Bonus', 'Paid Leave', 'Overtime Allowance', 'Subsidized Meals'].map((b) => {
                const isChecked = benefits.includes(b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleBenefit(b)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      border: `1px solid ${isChecked ? 'var(--color-primary-green)' : 'var(--color-border)'}`,
                      backgroundColor: isChecked ? 'var(--color-pale-green)' : 'var(--color-white)',
                      color: isChecked ? 'var(--color-deep-green)' : 'var(--color-secondary-text)',
                      cursor: 'pointer'
                    }}
                  >
                    {isChecked ? '✓ ' : '+ '} {b}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Required Skills */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Required Skills (Press Enter to add)</label>
            <input
              type="text"
              placeholder="e.g. ITI Certification, Wiring, Circuit Testing..."
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
            disabled={createJobMutation.isPending}
          >
            {createJobMutation.isPending ? 'Publishing Vacancy...' : 'Publish Long-Term Job'}
          </button>
        </form>
      </div>
    </div>
  );
};
