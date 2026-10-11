import React from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Wrench, Calendar, Briefcase, FileText, Bookmark, User, Clock, Settings } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

export const WorkerLayout: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/worker/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Find Gigs', path: '/gigs', icon: <Calendar size={18} /> },
    { label: 'Find Jobs', path: '/jobs', icon: <Briefcase size={18} /> },
    { label: 'My Services', path: '/worker/services', icon: <Wrench size={18} /> },
    { label: 'Bookings', path: '/worker/bookings', icon: <Clock size={18} /> },
    { label: 'My Applications', path: '/worker/applications', icon: <FileText size={18} /> },
    { label: 'Saved', path: '/worker/saved', icon: <Bookmark size={18} /> },
    { label: 'My Profile', path: '/worker/profile', icon: <User size={18} /> },
    { label: 'Settings', path: '/worker/settings', icon: <Settings size={18} /> },
  ];

  return (
    <DashboardLayout role="worker" title="Worker Workspace" navItems={navItems}>
      <Outlet />
    </DashboardLayout>
  );
};
