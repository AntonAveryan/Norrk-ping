import type { Job, Event, JobFilters, EventFilters } from '../types';

export function filterJobs(jobs: Job[], filters: JobFilters): Job[] {
  return jobs.filter(job => {
    if (job.status !== 'published') return false;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      const searchable = [
        job.title, job.companyName, job.description,
        ...job.skills, ...job.requirements,
        job.city, job.employmentType, job.industry,
      ].join(' ').toLowerCase();
      if (!searchable.includes(q)) return false;
    }

    if (filters.categories.length > 0 && !filters.categories.includes(job.category)) return false;
    if (filters.employmentTypes.length > 0 && !filters.employmentTypes.includes(job.employmentType)) return false;
    if (filters.experienceLevels.length > 0 && !filters.experienceLevels.includes(job.experienceLevel)) return false;
    if (filters.workArrangements.length > 0 && !filters.workArrangements.includes(job.workArrangement)) return false;
    if (filters.industries.length > 0 && !filters.industries.includes(job.industry)) return false;

    if (filters.showStudentFriendly) {
      const studentFriendly: string[] = ['student-job', 'internship', 'part-time', 'thesis', 'research'];
      if (!studentFriendly.includes(job.category)) return false;
    }

    if (filters.showThesisProjects && job.category !== 'thesis') return false;

    if (filters.datePosted !== 'any') {
      const published = new Date(job.datePublished);
      const now = new Date();
      const diffDays = (now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24);
      if (filters.datePosted === 'today' && diffDays > 1) return false;
      if (filters.datePosted === 'week' && diffDays > 7) return false;
      if (filters.datePosted === 'month' && diffDays > 30) return false;
    }

    return true;
  });
}

export function filterEvents(events: Event[], filters: EventFilters): Event[] {
  return events.filter(event => {
    if (event.status !== 'published') return false;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      const searchable = [event.title, event.description, event.venue, event.organizer, event.city].join(' ').toLowerCase();
      if (!searchable.includes(q)) return false;
    }

    if (filters.categories.length > 0 && !filters.categories.includes(event.category)) return false;
    if (filters.isFree && !event.isFree) return false;
    if (filters.indoor !== null) {
      if (filters.indoor === true && !event.indoor) return false;
      if (filters.indoor === false && event.indoor) return false;
    }

    if (filters.dateFrom) {
      if (new Date(event.startDateTime) < new Date(filters.dateFrom)) return false;
    }
    if (filters.dateTo) {
      if (new Date(event.startDateTime) > new Date(filters.dateTo)) return false;
    }

    return true;
  });
}

export const DEFAULT_JOB_FILTERS: JobFilters = {
  search: '',
  categories: [],
  employmentTypes: [],
  experienceLevels: [],
  workArrangements: [],
  industries: [],
  showStudentFriendly: false,
  showThesisProjects: false,
  datePosted: 'any',
};

export const DEFAULT_EVENT_FILTERS: EventFilters = {
  search: '',
  categories: [],
  isFree: false,
  indoor: null,
};
