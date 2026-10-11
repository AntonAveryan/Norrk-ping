import type { DemoUser, StudentProfile, CompanyProfile } from '../types';
import { DEMO_COMPANIES } from './companies';

const demoStudentProfile: StudentProfile = {
  id: 'student-001',
  displayName: 'Alex Lindqvist',
  programme: 'Master of Science in Interaction and Design',
  university: 'Linköping University, Campus Norrköping',
  studyYear: 2,
  interests: ['Design', 'Technology', 'Sustainability', 'Music', 'Cycling'],
  skills: ['Figma', 'UX Research', 'React', 'TypeScript', 'Swedish (B1)'],
  careerInterests: ['UX/UI Design', 'Product Design', 'Front-end Development'],
  preferredJobTypes: ['internship', 'student-job', 'graduate'],
  savedJobs: [],
  savedEvents: [],
  avatarInitials: 'AL',
  isDemo: true,
};

const demoCompanyProfile: CompanyProfile = {
  id: 'company-user-001',
  companyId: 'comp-005',
  contactName: 'Sara Bergström',
  contactEmail: 'sara@kopparhuset-demo.se',
  company: DEMO_COMPANIES.find(c => c.id === 'comp-005')!,
  isDemo: true,
};

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'user-student-001',
    role: 'student',
    email: 'alex@student-demo.se',
    displayName: 'Alex Lindqvist',
    profile: demoStudentProfile,
  },
  {
    id: 'user-company-001',
    role: 'company',
    email: 'sara@kopparhuset-demo.se',
    displayName: 'Sara Bergström',
    profile: demoCompanyProfile,
  },
];

export const getDemoUserByRole = (role: 'student' | 'company'): DemoUser =>
  DEMO_USERS.find(u => u.role === role)!;
