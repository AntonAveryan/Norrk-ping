// LocalStorage persistence with versioning and graceful degradation

const STORAGE_VERSION = 'v1';
const PREFIX = `nkpg_${STORAGE_VERSION}_`;

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // Storage unavailable — silent degradation
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {
      // ignore
    }
  },

  clearAll(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(PREFIX)) keysToRemove.push(key);
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch {
      // ignore
    }
  },
};

export const STORAGE_KEYS = {
  currentUser: 'current_user',
  studentProfile: 'student_profile',
  companyProfile: 'company_profile',
  savedJobs: 'saved_jobs',
  savedEvents: 'saved_events',
  companyJobs: 'company_jobs',
  companyEvents: 'company_events',
  studentEvents: 'student_events',
  language: 'language',
} as const;
