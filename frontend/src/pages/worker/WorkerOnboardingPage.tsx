import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Check, ArrowRight, ArrowLeft, Wrench, Calendar, Briefcase, MapPin, Sparkles } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { Locality, ServiceCategory } from '../../types';
import { useAuth } from '../../features/auth/AuthContext';

export const WorkerOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [selectedLocalities, setSelectedLocalities] = useState<string[]>([]);
  const [workPreferences, setWorkPreferences] = useState<string[]>(['services', 'gigs']);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [experienceYears, setExperienceYears] = useState(2);
  const [weekdays, setWeekdays] = useState<string[]>(['mon', 'tue', 'wed', 'thu', 'fri', 'sat']);
  const [preferredShifts, setPreferredShifts] = useState<string[]>(['morning', 'afternoon']);

  // Fetch localities
  const { data: localities = [] } = useQuery({
    queryKey: ['localities'],
    queryFn: async () => {
      const res = await apiRequest<Locality[]>('/meta/localities');
      return res.data;
    },
  });

  const toggleLocality = (id: string) => {
    setSelectedLocalities((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const togglePreference = (pref: string) => {
    setWorkPreferences((prev) =>
      prev.includes(pref) ? (prev.length > 1 ? prev.filter((x) => x !== pref) : prev) : [...prev, pref]
    );
  };

  const toggleWeekday = (day: string) => {
    setWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (s: string) => {
    setSkills(skills.filter((x) => x !== s));
  };

  const onboardingMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/workers/onboarding', {
        method: 'POST',
        body: JSON.stringify({
          headline: headline.trim() || 'Skilled Professional',
          bio: bio.trim() || 'Experienced worker ready to provide reliable services.',
          preferred_locality_ids: selectedLocalities,
          work_preferences: workPreferences,
          skills: skills.length > 0 ? skills : ['General Maintenance'],
          experience_years: experienceYears,
          available_weekdays: weekdays,
          preferred_shifts: preferredShifts,
        }),
      });
    },
    onSuccess: async () => {
      await refreshUser();
      navigate('/worker/dashboard');
    },
  });

  const totalSteps = 4;

  return (
    <div className="container" style={{ padding: '40px 16px 80px', maxWidth: 680 }}>
      {/* Progress Bar */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% Completed</span>
        </div>
        <div style={{ height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              backgroundColor: 'var(--color-primary-green)',
              width: `${(currentStep / totalSteps) * 100}%`,
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      <div className="card" style={{ padding: '36px 32px' }}>
        {/* STEP 1: Basic Role & Localities */}
        {currentStep === 1 && (
          <div>
            <h2 className="editorial-title" style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
              Where do you prefer to work in Mumbai?
            </h2>
            <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Select the Mumbai localities you can easily commute to for services or shifts.
            </p>

            <div className="form-group">
              <label className="form-label">Professional Headline</label>
              <input
                type="text"
                placeholder="e.g. Certified Electrician & Appliance Technician"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="form-input"
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ marginBottom: '10px', display: 'block' }}>
                Preferred Localities ({selectedLocalities.length} selected)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {localities.map((loc) => {
                  const isSelected = selectedLocalities.includes(loc.id);
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => toggleLocality(loc.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        border: `1px solid ${isSelected ? 'var(--color-primary-green)' : 'var(--color-border)'}`,
                        backgroundColor: isSelected ? 'var(--color-pale-green)' : 'var(--color-white)',
                        color: isSelected ? 'var(--color-deep-green)' : 'var(--color-dark-ink)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <MapPin size={13} color={isSelected ? 'var(--color-primary-green)' : 'var(--color-secondary-text)'} />
                      {loc.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Work Preferences */}
        {currentStep === 2 && (
          <div>
            <h2 className="editorial-title" style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
              What type of work are you looking for?
            </h2>
            <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem', marginBottom: '24px' }}>
              You can select multiple options. RozgaarSetu will customize your dashboard accordingly.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              {[
                {
                  id: 'services',
                  title: 'Offer Household & Skilled Services',
                  desc: 'Receive direct task or hourly service booking requests from households and local clients.',
                  icon: <Wrench size={22} color="var(--color-primary-green)" />
                },
                {
                  id: 'gigs',
                  title: 'Temporary Gigs & Shift Work',
                  desc: 'Find daily or multi-day paid shifts in logistics, retail, hospitality, and event setups.',
                  icon: <Calendar size={22} color="var(--color-action-orange)" />
                },
                {
                  id: 'jobs',
                  title: 'Permanent Long-Term Employment',
                  desc: 'Apply for permanent full-time jobs with monthly payroll, PF, and employee benefits.',
                  icon: <Briefcase size={22} color="var(--color-warning)" />
                },
              ].map((item) => {
                const isSelected = workPreferences.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => togglePreference(item.id)}
                    style={{
                      padding: '18px',
                      borderRadius: 'var(--radius-lg)',
                      border: `2px solid ${isSelected ? 'var(--color-primary-green)' : 'var(--color-border)'}`,
                      backgroundColor: isSelected ? 'var(--color-pale-green)' : 'var(--color-white)',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div style={{ marginTop: 2 }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>{item.title}</h4>
                      <p style={{ fontSize: '0.825rem', color: 'var(--color-secondary-text)', lineHeight: 1.4 }}>{item.desc}</p>
                    </div>
                    {isSelected && (
                      <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: 'var(--color-primary-green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Skills & Bio */}
        {currentStep === 3 && (
          <div>
            <h2 className="editorial-title" style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
              Your Skills & Experience
            </h2>
            <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Showcase your expertise so employers and households can discover you.
            </p>

            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <input
                type="number"
                min={0}
                max={50}
                value={experienceYears}
                onChange={(e) => setExperienceYears(parseFloat(e.target.value) || 0)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Add Your Skills (Press Enter after each skill)</label>
              <input
                type="text"
                placeholder="e.g. MCB Repairs, Inverter Setup, Deep Cleaning..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                className="form-input"
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                {skills.map((s) => (
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

            <div className="form-group">
              <label className="form-label">Short Profile Bio</label>
              <textarea
                rows={3}
                placeholder="Describe your background, reliability, and past work across Mumbai..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="form-textarea"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Availability & Review */}
        {currentStep === 4 && (
          <div>
            <h2 className="editorial-title" style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
              Schedule & Final Review
            </h2>
            <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Select which days of the week you are available for work in Mumbai.
            </p>

            <div style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Available Days</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((d) => {
                  const isChecked = weekdays.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleWeekday(d)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        backgroundColor: isChecked ? 'var(--color-primary-green)' : '#EDEAE1',
                        color: isChecked ? '#fff' : 'var(--color-dark-ink)',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Review Summary Card */}
            <div className="card" style={{ padding: '20px', backgroundColor: '#FAF8F3', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>Profile Summary</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', marginBottom: '4px' }}>
                <strong>Headline:</strong> {headline || 'Service Professional'}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', marginBottom: '4px' }}>
                <strong>Experience:</strong> {experienceYears} years
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
                <strong>Localities:</strong> {selectedLocalities.length} selected
              </p>
            </div>
          </div>
        )}

        {/* Step Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px', borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="btn btn-outline"
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="btn btn-primary"
            >
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onboardingMutation.mutate()}
              className="btn btn-primary"
              disabled={onboardingMutation.isPending}
            >
              {onboardingMutation.isPending ? 'Saving Profile...' : 'Complete Onboarding'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
