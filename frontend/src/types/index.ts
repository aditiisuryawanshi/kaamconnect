export type UserRole = 'worker' | 'customer' | 'employer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roles: UserRole[];
  preferred_language: string;
  account_status?: string;
  has_worker_profile?: boolean;
  has_employer_profile?: boolean;
  worker_profile_completion?: number;
}

export interface Locality {
  id: string;
  name: string;
  slug: string;
  region: string;
  city: string;
  active: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
  sort_order: number;
  active: boolean;
}

export interface ServicePricing {
  amount: number;
  currency: string;
  unit: 'hour' | 'task' | 'visit' | 'day';
  minimum_charge?: number;
  additional_notes?: string;
}

export interface ImageMetadata {
  image_url: string;
  alt_text: string;
  source: string;
  license: string;
  license_url: string;
  image_type: 'profile_portrait' | 'work_photograph' | 'employer_logo';
  fallback_local?: string;
}

export interface ServiceListing {
  id: string;
  worker_id: string;
  worker_name?: string;
  worker_photo_url?: string;
  worker_photo_alt_text?: string;
  worker_headline?: string;
  worker_profile_id?: string;
  worker_is_demo?: boolean;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  title: string;
  description: string;
  pricing: ServicePricing;
  service_area_ids: string[];
  service_areas?: Array<{ id: string; name: string }>;
  available_days: string[];
  time_slots: string[];
  booking_lead_time_hours: number;
  image_urls: string[];
  image_metadata?: ImageMetadata[];
  photo_alt_text?: string;
  is_demo?: boolean;
  status: 'draft' | 'published' | 'paused' | 'archived';
  published_at?: string;
  created_at: string;
}

export type BookingStatus = 'requested' | 'confirmed' | 'declined' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  booking_reference: string;
  customer_id: string;
  customer_name?: string;
  customer_phone?: string;
  worker_id: string;
  worker_name?: string;
  worker_phone?: string;
  worker_photo_url?: string;
  worker_headline?: string;
  service_listing_id: string;
  service_title_snapshot: string;
  pricing_snapshot: {
    base_amount: number;
    currency: string;
    unit: string;
    estimated_hours?: number;
    estimated_total: number;
  };
  scheduled_date: string;
  scheduled_time_slot: string;
  service_locality_id: string;
  locality_name?: string;
  service_address_private?: string;
  customer_instructions?: string;
  status: BookingStatus;
  status_history: Array<{
    status: BookingStatus;
    timestamp: string;
    notes?: string;
  }>;
  cancellation_reason?: string;
  created_at: string;
}

export interface Gig {
  id: string;
  employer_id: string;
  employer_name?: string;
  employer_type?: 'individual' | 'business';
  employer_logo_url?: string;
  employer_logo_alt_text?: string;
  employer_is_demo?: boolean;
  title: string;
  category_id: string;
  category_name?: string;
  description: string;
  responsibilities: string[];
  required_skills: string[];
  work_locality_id: string;
  locality_name?: string;
  work_address_private?: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  is_overnight: boolean;
  duration_hours: number;
  openings: number;
  initial_openings?: number;
  pay_amount: number;
  currency: string;
  pay_unit: 'hour' | 'shift' | 'day';
  payment_conditions?: string;
  experience_requirements?: string;
  application_deadline?: string;
  image_url?: string;
  image_metadata?: ImageMetadata;
  photo_alt_text?: string;
  is_demo?: boolean;
  status: 'draft' | 'published' | 'closed';
  published_at?: string;
  created_at: string;
  applications_count?: number;
  is_owner?: boolean;
  has_applied?: boolean;
  user_application_status?: string;
}

export interface Job {
  id: string;
  employer_id: string;
  employer_name?: string;
  employer_type?: 'individual' | 'business';
  employer_logo_url?: string;
  employer_logo_alt_text?: string;
  employer_is_demo?: boolean;
  employer_description?: string;
  image_url?: string;
  image_metadata?: ImageMetadata;
  photo_alt_text?: string;
  is_demo?: boolean;
  title: string;
  category_id?: string;
  description: string;
  employment_type: 'full_time' | 'part_time' | 'contract';
  responsibilities: string[];
  required_skills: string[];
  preferred_skills: string[];
  experience_requirements: string;
  salary_min: number;
  salary_max: number;
  currency: string;
  pay_period: 'month' | 'year' | 'week' | 'day';
  benefits: string[];
  work_locality_id: string;
  locality_name?: string;
  schedule: string;
  application_deadline?: string;
  status: 'draft' | 'published' | 'closed';
  published_at?: string;
  created_at: string;
  applications_count?: number;
  is_owner?: boolean;
  has_applied?: boolean;
  user_application_status?: string;
}

export type ApplicationStatus = 'applied' | 'under_review' | 'shortlisted' | 'selected' | 'rejected' | 'withdrawn';

export interface Application {
  id: string;
  worker_id: string;
  listing_type: 'gig' | 'job';
  listing_id: string;
  listing_title?: string;
  listing_status?: string;
  locality_name?: string;
  pay_display?: string;
  employer_id: string;
  employer_name?: string;
  employer_logo_url?: string;
  profile_snapshot: {
    name: string;
    phone?: string;
    headline: string;
    bio: string;
    skills: string[];
    experience_years: number;
    profile_photo_url?: string;
  };
  cover_note?: string;
  status: ApplicationStatus;
  status_history: Array<{
    status: ApplicationStatus;
    timestamp: string;
    notes?: string;
  }>;
  employer_notes?: string;
  applied_at: string;
  withdrawn_at?: string;
}

export interface WorkerProfile {
  id: string;
  user_id: string;
  name?: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  headline: string;
  bio: string;
  profile_photo_url?: string;
  photo_alt_text?: string;
  photo_source?: string;
  photo_license?: string;
  is_demo?: boolean;
  preferred_locality_ids: string[];
  preferred_localities?: Array<{ id: string; name: string }>;
  work_preferences: string[];
  skills: string[];
  experience_years: number;
  available_weekdays: string[];
  preferred_shifts: string[];
  profile_visibility: 'public' | 'private';
  completion_percentage: number;
  listings?: ServiceListing[];
  reviews?: any[];
  average_rating?: number;
  review_count?: number;
}

export interface EmployerProfile {
  id: string;
  owner_user_id: string;
  name: string;
  employer_type: 'individual' | 'business';
  description: string;
  logo_url?: string;
  contact_phone?: string;
  contact_email?: string;
  website?: string;
  locality_id?: string;
  locality_name?: string;
  address?: string;
  verification_status: string;
  account_status: string;
}

export interface NotificationItem {
  id: string;
  recipient_user_id: string;
  event_type: string;
  title: string;
  message: string;
  resource_type?: string;
  resource_id?: string;
  read_at?: string;
  created_at: string;
}
