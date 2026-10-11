import React from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, FileText, Calendar, Briefcase, Users, Building, Settings } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

export const EmployerLayout: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/employer/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'My Listings', path: '/employer/listings', icon: <FileText size={18} /> },
    { label: 'Post a Gig', path: '/employer/gigs/new', icon: <Calendar size={18} /> },
    { label: 'Post a Job', path: '/employer/jobs/new', icon: <Briefcase size={18} /> },
    { label: 'Applicants', path: '/employer/applicants', icon: <Users size={18} /> },
    { label: 'Company Profile', path: '/employer/company', icon: <Building size={18} /> },
    { label: 'Settings', path: '/employer/settings', icon: <Settings size={18} /> },
  ];

  return (
    <DashboardLayout role="employer" title="Employer Workspace" navItems={navItems}>
      <Outlet />
    </DashboardLayout>
  );
};
