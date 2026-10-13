import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Wrench,
  FileText,
  Clock,
  Calendar,
  MessageSquare,
  DollarSign,
  Settings,
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

export const WorkerLayout: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/worker/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'My Profile', path: '/worker/profile', icon: <User size={18} /> },
    { label: 'My Services', path: '/worker/services', icon: <Wrench size={18} /> },
    { label: 'Job Applications', path: '/worker/applications', icon: <FileText size={18} /> },
    { label: 'Booking Requests', path: '/worker/bookings', icon: <Clock size={18} /> },
    { label: 'Availability', path: '/worker/onboarding', icon: <Calendar size={18} /> },
    { label: 'Messages', path: '/worker/messages', icon: <MessageSquare size={18} /> },
    { label: 'Earnings', path: '/worker/earnings', icon: <DollarSign size={18} /> },
    { label: 'Settings', path: '/worker/settings', icon: <Settings size={18} /> },
  ];

  return (
    <DashboardLayout role="worker" title="Worker Dashboard" navItems={navItems}>
      <Outlet />
    </DashboardLayout>
  );
};
