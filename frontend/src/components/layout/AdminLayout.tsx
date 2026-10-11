import React from 'react';
import { Outlet } from 'react-router-dom';
import { Shield, Users, AlertTriangle, Activity, Settings } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

export const AdminLayout: React.FC = () => {
  const navItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: <Shield size={18} /> },
    { label: 'Manage Users', path: '/admin/users', icon: <Users size={18} /> },
    { label: 'Moderation Reports', path: '/admin/reports', icon: <AlertTriangle size={18} /> },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: <Activity size={18} /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings size={18} /> },
  ];

  return (
    <DashboardLayout role="admin" title="Admin Operations Console" navItems={navItems}>
      <Outlet />
    </DashboardLayout>
  );
};
