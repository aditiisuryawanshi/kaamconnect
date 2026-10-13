import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Layers,
  AlertTriangle,
  MessageSquare,
  Settings,
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

export const AdminLayout: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Manage Users', path: '/admin/users', icon: <Users size={18} /> },
    { label: 'Manage Listings', path: '/services', icon: <Layers size={18} /> },
    { label: 'Reports', path: '/admin/reports', icon: <AlertTriangle size={18} /> },
    { label: 'Messages', path: '/admin/messages', icon: <MessageSquare size={18} /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings size={18} /> },
  ];

  return (
    <DashboardLayout role="admin" title="Admin Dashboard" navItems={navItems}>
      <Outlet />
    </DashboardLayout>
  );
};
