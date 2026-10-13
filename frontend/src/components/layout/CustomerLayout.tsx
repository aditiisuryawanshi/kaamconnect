import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Clock,
  Briefcase,
  MessageSquare,
  CreditCard,
  Settings,
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

export const CustomerLayout: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/customer/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Find Services', path: '/services', icon: <Search size={18} /> },
    { label: 'My Bookings', path: '/customer/bookings', icon: <Clock size={18} /> },
    { label: 'My Jobs', path: '/jobs', icon: <Briefcase size={18} /> },
    { label: 'Messages', path: '/customer/messages', icon: <MessageSquare size={18} /> },
    { label: 'Payments', path: '/customer/payments', icon: <CreditCard size={18} /> },
    { label: 'Settings', path: '/customer/settings', icon: <Settings size={18} /> },
  ];

  return (
    <DashboardLayout role="customer" title="Customer Dashboard" navItems={navItems}>
      <Outlet />
    </DashboardLayout>
  );
};
