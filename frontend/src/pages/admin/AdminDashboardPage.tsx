import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Users,
  Wrench,
  Briefcase,
  AlertTriangle,
  FileText,
  UserCheck,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { apiRequest } from '../../services/apiClient';

export const AdminDashboardPage: React.FC = () => {
  const { data: metrics } = useQuery({
    queryKey: ['admin-dashboard-metrics'],
    queryFn: async () => {
      const res = await apiRequest('/admin/dashboard');
      return res.data;
    },
  });

  const stats = [
    {
      label: 'Total Users',
      value: metrics?.total_users || 523,
      icon: <Users size={20} color="#2563EB" />,
      bg: '#EFF6FF',
    },
    {
      label: 'Services',
      value: metrics?.services_count || 138,
      icon: <Wrench size={20} color="#059669" />,
      bg: '#ECFDF5',
    },
    {
      label: 'Jobs',
      value: metrics?.jobs_count || 96,
      icon: <Briefcase size={20} color="#FF851B" />,
      bg: '#FFF7ED',
    },
    {
      label: 'Pending Reports',
      value: metrics?.pending_reports || 45,
      icon: <AlertTriangle size={20} color="#DC2626" />,
      bg: '#FEF2F2',
      badge: '45',
    },
  ];

  const recentActivity = [
    {
      id: 'act-1',
      title: 'New service listed',
      detail: 'Home Cleaning - Andheri',
      time: '2 mins ago',
      icon: <FileText size={18} color="#2563EB" />,
      bg: '#EFF6FF',
    },
    {
      id: 'act-2',
      title: 'New job posted',
      detail: 'Security Guard - Navi Mumbai',
      time: '10 mins ago',
      icon: <Briefcase size={18} color="#FF851B" />,
      bg: '#FFF7ED',
    },
    {
      id: 'act-3',
      title: 'New user registered',
      detail: 'Mayur Rohit (Worker)',
      time: '25 mins ago',
      icon: <UserCheck size={18} color="#059669" />,
      bg: '#ECFDF5',
    },
    {
      id: 'act-4',
      title: 'Booking created',
      detail: 'Plumbing Service - Bandra',
      time: '40 mins ago',
      icon: <Calendar size={18} color="#7C3AED" />,
      bg: '#F5F3FF',
    },
  ];

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '26px' }}>
      
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
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0B2F57', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{s.value}</span>
                {s.badge && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      padding: '2px 8px',
                      borderRadius: '999px',
                    }}
                  >
                    {s.badge}
                  </span>
                )}
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

      {/* Recent Activity Section */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          padding: '22px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#0B2F57',
            }}
          >
            Recent Activity
          </h2>
          <Link
            to="/admin/reports"
            style={{
              fontSize: '0.85rem',
              color: '#FF851B',
              fontWeight: 600,
              textDecoration: 'none',
            }}
            onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            View All Activity
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {recentActivity.map((act) => (
            <div
              key={act.id}
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
              {/* Icon + Activity Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: act.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {act.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#0B2F57', marginBottom: '2px' }}>
                    {act.title}
                  </h3>
                  <div style={{ fontSize: '0.825rem', color: '#667085' }}>
                    {act.detail}
                  </div>
                </div>
              </div>

              {/* Timestamp */}
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>
                {act.time}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
