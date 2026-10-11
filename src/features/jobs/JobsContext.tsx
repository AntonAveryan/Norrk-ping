import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Job } from '../../types';
import { DEMO_JOBS } from '../../data/jobs';
import { storage, STORAGE_KEYS } from '../../lib/storage';

interface JobsContextType {
  jobs: Job[];
  savedJobIds: string[];
  addJob: (job: Job) => void;
  updateJob: (job: Job) => void;
  deleteJob: (id: string) => void;
  toggleSaveJob: (id: string) => void;
  isJobSaved: (id: string) => boolean;
}

const JobsContext = createContext<JobsContextType | null>(null);

export function JobsProvider({ children }: { children: ReactNode }) {
  const [companyJobs, setCompanyJobs] = useState<Job[]>(() =>
    storage.get<Job[]>(STORAGE_KEYS.companyJobs, [])
  );
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() =>
    storage.get<string[]>(STORAGE_KEYS.savedJobs, [])
  );

  const allJobs = [...DEMO_JOBS, ...companyJobs];

  useEffect(() => { storage.set(STORAGE_KEYS.companyJobs, companyJobs); }, [companyJobs]);
  useEffect(() => { storage.set(STORAGE_KEYS.savedJobs, savedJobIds); }, [savedJobIds]);

  const addJob = (job: Job) => setCompanyJobs(prev => [...prev, job]);
  const updateJob = (job: Job) => {
    const isDemo = DEMO_JOBS.some(j => j.id === job.id);
    if (isDemo) return;
    setCompanyJobs(prev => prev.map(j => j.id === job.id ? job : j));
  };
  const deleteJob = (id: string) => {
    setCompanyJobs(prev => prev.filter(j => j.id !== id));
  };
  const toggleSaveJob = (id: string) => {
    setSavedJobIds(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };
  const isJobSaved = (id: string) => savedJobIds.includes(id);

  return (
    <JobsContext.Provider value={{ jobs: allJobs, savedJobIds, addJob, updateJob, deleteJob, toggleSaveJob, isJobSaved }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error('useJobs must be used within JobsProvider');
  return ctx;
}
