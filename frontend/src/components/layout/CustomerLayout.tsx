import React from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Wrench, Clock, Bookmark, User, Settings } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

export const CustomerLayout: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/customer/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Discover Services', path: '/services', icon: <Wrench size={18} /> },
    { label: 'My Bookings', path: '/customer/bookings', icon: <Clock size={18} /> },
    { label: 'Saved Providers', path: '/customer/saved-providers', icon: <Bookmark size={18} /> },
    { label: 'Profile', path: '/customer/profile', icon: <User size={18} /> },
    { label: 'Settings', path: '/customer/settings', icon: <Settings size={18} /> },
  ];

  return (
    <DashboardLayout role="customer" title="Customer Dashboard" navItems={navItems}>
      <Outlet />
    </DashboardLayout>
  );
};
