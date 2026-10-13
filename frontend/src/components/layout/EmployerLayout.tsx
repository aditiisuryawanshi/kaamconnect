import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  Users,
  Building,
  MessageSquare,
  Settings,
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

export const EmployerLayout: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/employer/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Post a Job', path: '/employer/jobs/new', icon: <PlusCircle size={18} /> },
    { label: 'My Jobs', path: '/employer/listings', icon: <Briefcase size={18} /> },
    { label: 'Applications', path: '/employer/applicants', icon: <Users size={18} /> },
    { label: 'Company Profile', path: '/employer/company', icon: <Building size={18} /> },
    { label: 'Messages', path: '/employer/messages', icon: <MessageSquare size={18} /> },
    { label: 'Settings', path: '/employer/settings', icon: <Settings size={18} /> },
  ];

  return (
    <DashboardLayout role="employer" title="Employer Dashboard" navItems={navItems}>
      <Outlet />
    </DashboardLayout>
  );
};
