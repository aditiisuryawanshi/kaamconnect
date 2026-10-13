import React from 'react';
import { createBrowserRouter, Navigate, Link } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../components/layout/PublicLayout';
import { WorkerLayout } from '../components/layout/WorkerLayout';
import { CustomerLayout } from '../components/layout/CustomerLayout';
import { EmployerLayout } from '../components/layout/EmployerLayout';
import { AdminLayout } from '../components/layout/AdminLayout';

// Guards
import { ProtectedRoute, RoleGuard } from './routeGuards';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { ServicesPage } from '../pages/public/ServicesPage';
import { ServiceDetailPage } from '../pages/public/ServiceDetailPage';
import { ProviderProfilePage } from '../pages/public/ProviderProfilePage';
import { GigsPage } from '../pages/public/GigsPage';
import { GigDetailPage } from '../pages/public/GigDetailPage';
import { JobsPage } from '../pages/public/JobsPage';
import { JobDetailPage } from '../pages/public/JobDetailPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';

// Worker Pages
import { WorkerOnboardingPage } from '../pages/worker/WorkerOnboardingPage';
import { WorkerDashboardPage } from '../pages/worker/WorkerDashboardPage';
import { WorkerServicesPage } from '../pages/worker/WorkerServicesPage';
import { WorkerBookingsPage } from '../pages/worker/WorkerBookingsPage';
import { WorkerApplicationsPage } from '../pages/worker/WorkerApplicationsPage';

// Customer Pages
import { CustomerDashboardPage } from '../pages/customer/CustomerDashboardPage';
import { CustomerBookingsPage } from '../pages/customer/CustomerBookingsPage';

// Employer Pages
import { EmployerDashboardPage } from '../pages/employer/EmployerDashboardPage';
import { EmployerListingsPage } from '../pages/employer/EmployerListingsPage';
import { EmployerPostGigPage } from '../pages/employer/EmployerPostGigPage';
import { EmployerPostJobPage } from '../pages/employer/EmployerPostJobPage';
import { EmployerApplicantsPage } from '../pages/employer/EmployerApplicantsPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage';

export const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'services/:serviceId', element: <ServiceDetailPage /> },
      { path: 'providers/:providerId', element: <ProviderProfilePage /> },
      { path: 'gigs', element: <GigsPage /> },
      { path: 'gigs/:gigId', element: <GigDetailPage /> },
      { path: 'jobs', element: <JobsPage /> },
      { path: 'jobs/:jobId', element: <JobDetailPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'help', element: <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}><h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-brand-deep)' }}>RozgaarSetu Mumbai Support Desk</h2><p style={{ marginTop: 12, color: 'var(--color-text-secondary)' }}>Dedicated worker and customer support: support@rozgaarsetu.in | +91-22-ROZGAAR</p></div> },
      { path: 'privacy', element: <div className="container" style={{ padding: '60px 20px', maxWidth: 700 }}><h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-brand-deep)' }}>Privacy Policy</h2><p style={{ marginTop: 12, lineHeight: 1.6, color: 'var(--color-text-ink)' }}>RozgaarSetu treats customer addresses and worker personal identification data with utmost confidentiality, following India IT Data Protection directives.</p></div> },
      { path: 'terms', element: <div className="container" style={{ padding: '60px 20px', maxWidth: 700 }}><h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-brand-deep)' }}>Terms of Service</h2><p style={{ marginTop: 12, lineHeight: 1.6, color: 'var(--color-text-ink)' }}>RozgaarSetu is an open workforce marketplace facilitating direct connections between Mumbai region workers, households, and verified employers.</p></div> },
    ],
  },

  // Worker Routes
  {
    path: '/worker',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['worker']}>
          <WorkerLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <WorkerDashboardPage /> },
      { path: 'onboarding', element: <WorkerOnboardingPage /> },
      { path: 'services', element: <WorkerServicesPage /> },
      { path: 'bookings', element: <WorkerBookingsPage /> },
      { path: 'applications', element: <WorkerApplicationsPage /> },
      { path: 'saved', element: <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 12 }}><h3>Saved Items</h3><p style={{ color: '#64748B', marginTop: 8 }}>Your bookmarked opportunities</p></div> },
      { path: 'profile', element: <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 12 }}><h3>Worker Profile</h3><p style={{ color: '#64748B', marginTop: 8 }}>Update your skills and availability</p><Link to="/worker/onboarding" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Edit Complete Profile</Link></div> },
      { path: 'messages', element: <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 12 }}><h3>Direct Messaging</h3><p style={{ color: '#64748B', marginTop: 8 }}>Customer chat and booking communications desk.</p></div> },
      { path: 'earnings', element: <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 12 }}><h3>Worker Earnings & Payouts</h3><p style={{ color: '#64748B', marginTop: 8 }}>RozgaarSetu charges 0% commission. All cash and direct UPI payments received from customers are 100% yours.</p></div> },
      { path: 'settings', element: <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 12 }}><h3>Worker Settings</h3><p style={{ color: '#64748B', marginTop: 8 }}>Notification and account preferences</p></div> },
      { index: true, element: <Navigate to="/worker/dashboard" replace /> },
    ],
  },

  // Customer Routes
  {
    path: '/customer',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['customer']}>
          <CustomerLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <CustomerDashboardPage /> },
      { path: 'bookings', element: <CustomerBookingsPage /> },
      { path: 'saved-providers', element: <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 12 }}><h3>Saved Providers</h3><p style={{ color: '#64748B', marginTop: 8 }}>Your favorite Mumbai technicians</p></div> },
      { path: 'profile', element: <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 12 }}><h3>Customer Profile</h3><p style={{ color: '#64748B', marginTop: 8 }}>Manage your contact details and default Mumbai localities</p></div> },
      { path: 'messages', element: <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 12 }}><h3>Technician Messages</h3><p style={{ color: '#64748B', marginTop: 8 }}>Direct coordination with your booked Mumbai service providers.</p></div> },
      { path: 'payments', element: <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 12 }}><h3>Payment History</h3><p style={{ color: '#64748B', marginTop: 8 }}>Invoices and UPI/cash payment receipts for completed household services.</p></div> },
      { path: 'settings', element: <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 12 }}><h3>Account Settings</h3><p style={{ color: '#64748B', marginTop: 8 }}>Password and notification settings</p></div> },
      { index: true, element: <Navigate to="/customer/dashboard" replace /> },
    ],
  },

  // Employer Routes
  {
    path: '/employer',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['employer']}>
          <EmployerLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <EmployerDashboardPage /> },
      { path: 'listings', element: <EmployerListingsPage /> },
      { path: 'gigs/new', element: <EmployerPostGigPage /> },
      { path: 'jobs/new', element: <EmployerPostJobPage /> },
      { path: 'applicants', element: <EmployerApplicantsPage /> },
      { path: 'company', element: <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 12 }}><h3>Company Profile</h3><p style={{ color: '#64748B', marginTop: 8 }}>Organization details and verification badge status</p></div> },
      { path: 'messages', element: <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 12 }}><h3>Candidate Inquiries</h3><p style={{ color: '#64748B', marginTop: 8 }}>Direct candidate chat and interview scheduling desk.</p></div> },
      { path: 'settings', element: <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 12 }}><h3>Employer Settings</h3><p style={{ color: '#64748B', marginTop: 8 }}>Hiring contact information and notification rules</p></div> },
      { index: true, element: <Navigate to="/employer/dashboard" replace /> },
    ],
  },

  // Admin Routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['admin']}>
          <AdminLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'reports', element: <AdminReportsPage /> },
      { path: 'audit-logs', element: <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 12 }}><h3>Platform Audit Logs</h3><p style={{ color: '#64748B', marginTop: 8 }}>Immutable system history</p></div> },
      { path: 'messages', element: <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 12 }}><h3>System Broadcasts</h3><p style={{ color: '#64748B', marginTop: 8 }}>Platform safety alerts and SMS notification logs.</p></div> },
      { path: 'settings', element: <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 12 }}><h3>Platform Settings</h3><p style={{ color: '#64748B', marginTop: 8 }}>Global configurations</p></div> },
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
    ],
  },
]);
