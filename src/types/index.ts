// Core entity types for Norrköping platform

export type Role = 'student' | 'company';

export type JobCategory =
  | 'student-job'
  | 'internship'
  | 'graduate'
  | 'part-time'
  | 'thesis'
  | 'research'
  | 'full-time';

export type EmploymentType = 'part-time' | 'full-time' | 'internship' | 'thesis' | 'contract';

export type ExperienceLevel = 'no-experience' | 'student' | 'junior' | 'mid' | 'senior';

export type WorkArrangement = 'on-site' | 'hybrid' | 'remote';

export type JobStatus = 'draft' | 'published' | 'archived';

export type EventCategory =
  | 'music'
  | 'culture'
  | 'career'
  | 'sports'
  | 'food'
  | 'workshop'
  | 'social'
  | 'outdoor';

export type EventStatus = 'draft' | 'published' | 'cancelled';

export interface Job {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  category: JobCategory;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  workArrangement: WorkArrangement;
  industry: string;
  city: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  datePublished: string;
  deadline?: string;
  salary?: string;
  applicationUrl?: string;
  applicationInstructions?: string;
  status: JobStatus;
  source: 'company' | 'demo' | 'imported';
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  startDateTime: string;
  endDateTime?: string;
  venue: string;
  address: string;
  city: string;
  coordinates?: { lat: number; lng: number };
  organizer: string;
  organizerType: 'student' | 'company' | 'municipality' | 'cultural' | 'demo';
  price: number;
  isFree: boolean;
  priceLabel?: string;
  registrationUrl?: string;
  coverImage?: string;
  indoor: boolean;
  status: EventStatus;
  isDemo: boolean;
  source: 'student' | 'company' | 'demo';
  creatorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  initials: string;
  description: string;
  industry: string;
  website?: string;
  contactEmail?: string;
  city: string;
  address?: string;
  size?: string;
  careersUrl?: string;
  linkedIn?: string;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  id: string;
  displayName: string;
  programme: string;
  university: string;
  studyYear: number;
  interests: string[];
  skills: string[];
  careerInterests: string[];
  preferredJobTypes: JobCategory[];
  savedJobs: string[];
  savedEvents: string[];
  avatarInitials: string;
  isDemo: boolean;
}

export interface CompanyProfile {
  id: string;
  companyId: string;
  contactName: string;
  contactEmail: string;
  company: Company;
  isDemo: boolean;
}

export interface DemoUser {
  id: string;
  role: Role;
  email: string;
  displayName: string;
  profile: StudentProfile | CompanyProfile;
}

export interface HelpArticle {
  id: string;
  category: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  isOfficial: boolean;
}

export interface JobFilters {
  search: string;
  categories: JobCategory[];
  employmentTypes: EmploymentType[];
  experienceLevels: ExperienceLevel[];
  workArrangements: WorkArrangement[];
  industries: string[];
  showStudentFriendly: boolean;
  showThesisProjects: boolean;
  datePosted: 'any' | 'today' | 'week' | 'month';
}

export interface EventFilters {
  search: string;
  categories: EventCategory[];
  isFree: boolean;
  indoor: boolean | null;
  dateFrom?: string;
  dateTo?: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface AppState {
  currentUser: DemoUser | null;
  jobs: Job[];
  events: Event[];
  companies: Company[];
}
