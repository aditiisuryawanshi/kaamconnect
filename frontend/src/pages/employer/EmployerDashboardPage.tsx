import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Briefcase, Users, CheckCircle, Award } from 'lucide-react';
import { apiRequest } from '../../services/apiClient';
import { useAuth } from '../../features/auth/AuthContext';

export const EmployerDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const { data: dashboard } = useQuery({
    queryKey: ['employer-dashboard'],
    queryFn: async () => {
      const res = await apiRequest('/employer/dashboard');
      return res.data;
    },
  });

  const employerName = user?.name || 'Sharma Enterprises';

  const stats = [
    {
      label: 'Active Jobs',
      value: dashboard?.active_jobs_count || 5,
      icon: <Briefcase size={20} color="#2563EB" />,
      bg: '#EFF6FF',
    },
    {
      label: 'Applications',
      value: dashboard?.pending_applicants_count || 38,
      icon: <Users size={20} color="#7C3AED" />,
      bg: '#F5F3FF',
    },
    {
      label: 'Shortlisted',
      value: dashboard?.shortlisted_applicants_count || 12,
      icon: <CheckCircle size={20} color="#FF851B" />,
      bg: '#FFF7ED',
    },
    {
      label: 'Hired',
      value: 3,
      icon: <Award size={20} color="#059669" />,
      bg: '#ECFDF5',
    },
  ];

  const recentJobs = [
    {
      id: 'job-post-1',
      title: 'Delivery Executive',
      posted: 'Posted on 10 Oct',
      applications: '18 Applications',
      status: 'Active',
      photo: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=120&q=80',
    },
    {
      id: 'job-post-2',
      title: 'Warehouse Helper',
      posted: 'Posted on 8 Oct',
      applications: '24 Applications',
      status: 'Active',
      photo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=120&q=80',
    },
    {
      id: 'job-post-3',
      title: 'Security Guard',
      posted: 'Posted on 5 Oct',
      applications: '12 Applications',
      status: 'Closed',
      photo: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=120&q=80',
    },
  ];

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '26px' }}>
      
      {/* Top Header with Greeting & Post a New Job Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: '#123F73',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.25rem',
            }}
          >
            {employerName.charAt(0)}
          </div>
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.65rem',
                fontWeight: 800,
                color: '#0B2F57',
                marginBottom: '4px',
              }}
            >
              Welcome, {employerName}
            </h1>
            <p style={{ color: '#667085', fontSize: '0.9rem' }}>
              Manage your job postings and find the right talent.
            </p>
          </div>
        </div>

        <Link
          to="/employer/jobs/new"
          style={{
            backgroundColor: '#FF851B',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.9rem',
            padding: '10px 20px',
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background-color 0.15s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#E07413')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FF851B')}
        >
          <Plus size={16} /> Post a New Job
        </Link>
      </div>

      {/* 4 Metric Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        {stats.map((s, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.85rem', color: '#667085', fontWeight: 600, marginBottom: '4px' }}>
                {s.label}
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0B2F57' }}>
                {s.value}
              </div>
            </div>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: s.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Job Postings Section */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          padding: '22px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.15rem',
            fontWeight: 700,
            color: '#0B2F57',
            marginBottom: '16px',
          }}
        >
          Recent Job Postings
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentJobs.map((job) => (
            <div
              key={job.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: '10px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              {/* Photo + Job Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={job.photo}
                  alt={job.title}
                  style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0B2F57', marginBottom: '2px' }}>
                    {job.title}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#667085' }}>
                    {job.posted}
                  </div>
                </div>
              </div>

              {/* Applications Count + Status Pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontSize: '0.85rem', color: '#667085', fontWeight: 500 }}>
                  {job.applications}
                </span>

                <span
                  style={{
                    backgroundColor: job.status === 'Active' ? '#ECFDF5' : '#F1F5F9',
                    color: job.status === 'Active' ? '#059669' : '#64748B',
                    fontSize: '0.775rem',
                    fontWeight: 600,
                    padding: '4px 14px',
                    borderRadius: '999px',
                  }}
                >
                  {job.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
