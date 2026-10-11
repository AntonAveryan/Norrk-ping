import { useState, useMemo } from 'react';
import { X, MapPin, Clock, ExternalLink, Bookmark, BookmarkCheck, ChevronDown, ChevronUp, SlidersHorizontal, CheckCircle } from 'lucide-react';
import { StudentNav } from '../components/navigation/StudentNav';
import { JobCard } from '../components/cards/JobCard';
import { SearchInput } from '../components/inputs/SearchInput';
import { useJobs } from '../features/jobs/JobsContext';
import { useToast } from '../hooks/useToast';
import { filterJobs, DEFAULT_JOB_FILTERS } from '../lib/filtering';
import { formatDate, relativeDate } from '../lib/dates';
import type { Job, JobCategory, EmploymentType, WorkArrangement } from '../types';

const categories: { value: JobCategory; label: string }[] = [
  { value: 'student-job', label: 'Student Job' },
  { value: 'internship', label: 'Internship' },
  { value: 'graduate', label: 'Graduate' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'thesis', label: 'Thesis Project' },
  { value: 'research', label: 'Research' },
  { value: 'full-time', label: 'Full-time' },
];

const employmentTypes: { value: EmploymentType; label: string }[] = [
  { value: 'part-time', label: 'Part-time' },
  { value: 'full-time', label: 'Full-time' },
  { value: 'internship', label: 'Internship' },
  { value: 'thesis', label: 'Thesis' },
  { value: 'contract', label: 'Contract' },
];

const arrangements: { value: WorkArrangement; label: string }[] = [
  { value: 'on-site', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'remote', label: 'Remote' },
];

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(79,121,232,0.1)', border: '1px solid rgba(79,121,232,0.2)', borderRadius: 999, fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-accent-blue)' }}>
      {label}
      <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: 'var(--color-accent-blue)' }}><X size={12} /></button>
    </span>
  );
}

function JobDetailPanel({ job, onClose, onSave, isSaved }: { job: Job; onClose: () => void; onSave: () => void; isSaved: boolean }) {
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [applied, setApplied] = useState(false);
  const { addToast } = useToast();

  const handleApply = () => {
    if (job.applicationUrl) {
      window.open(job.applicationUrl, '_blank', 'noopener,noreferrer');
    } else {
      setShowApplyDialog(true);
    }
  };

  const handleDemoApply = () => {
    setApplied(true);
    setShowApplyDialog(false);
    addToast('Demo submission — no real application was sent.', 'info');
  };

  return (
    <div style={{
      background: 'var(--surface-elevated)',
      border: '1px solid var(--border-neutral)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      height: '100%',
      display: 'flex', flexDirection: 'column',
      boxShadow: 'var(--shadow-2)',
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid var(--border-divider)' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, color: 'var(--color-text-muted)' }}><X size={18} /></button>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--color-accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {job.companyName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.25, marginBottom: 4 }}>{job.title}</h2>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{job.companyName}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}><MapPin size={13} /> {job.city}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}><Clock size={13} /> Posted {relativeDate(job.datePublished)}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
          <span style={{ fontSize: '0.75rem', padding: '3px 10px', background: 'rgba(79,121,232,0.1)', color: 'var(--color-accent-blue)', borderRadius: 999, fontWeight: 600 }}>
            {job.employmentType}
          </span>
          <span style={{ fontSize: '0.75rem', padding: '3px 10px', background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)', borderRadius: 999 }}>
            {job.workArrangement}
          </span>
          <span style={{ fontSize: '0.75rem', padding: '3px 10px', background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)', borderRadius: 999 }}>
            {job.industry}
          </span>
          {job.isDemo && <span className="demo-badge">Demo</span>}
        </div>

        {job.salary && (
          <div style={{ fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: 600, marginBottom: 16 }}>
            {job.salary}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          {!applied ? (
            <button onClick={handleApply} style={{
              flex: 1, padding: '11px', borderRadius: 'var(--radius-md)',
              background: 'var(--color-accent-blue)', color: '#fff', fontWeight: 700, fontSize: '0.9rem',
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'var(--font-stack)',
            }}>
              {job.applicationUrl ? <><ExternalLink size={15} /> Apply</> : 'Apply for this role'}
            </button>
          ) : (
            <div style={{ flex: 1, padding: '11px', borderRadius: 'var(--radius-md)', background: 'rgba(38,134,107,0.1)', color: 'var(--color-success)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '1px solid rgba(38,134,107,0.2)' }}>
              <CheckCircle size={15} /> Demo submitted
            </div>
          )}
          <button onClick={onSave} style={{
            padding: '11px 14px', borderRadius: 'var(--radius-md)',
            background: isSaved ? 'rgba(79,121,232,0.1)' : 'var(--color-bg-secondary)',
            border: `1px solid ${isSaved ? 'rgba(79,121,232,0.25)' : 'var(--border-neutral)'}`,
            color: isSaved ? 'var(--color-accent-blue)' : 'var(--color-text-secondary)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.88rem',
            fontFamily: 'var(--font-stack)',
          }}>
            {isSaved ? <><BookmarkCheck size={16} /> Saved</> : <><Bookmark size={16} /> Save</>}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
        <div style={{ marginBottom: 22 }}>
          <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>About the role</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{job.description}</p>
        </div>

        {job.responsibilities.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Responsibilities</h3>
            <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {job.responsibilities.map((r, i) => <li key={i} style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{r}</li>)}
            </ul>
          </div>
        )}

        {job.requirements.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Requirements</h3>
            <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {job.requirements.map((r, i) => <li key={i} style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{r}</li>)}
            </ul>
          </div>
        )}

        {job.skills.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {job.skills.map(s => <span key={s} style={{ fontSize: '0.78rem', padding: '4px 12px', background: 'var(--color-bg-secondary)', borderRadius: 999, color: 'var(--color-text-secondary)', border: '1px solid var(--border-neutral)' }}>{s}</span>)}
            </div>
          </div>
        )}

        {job.deadline && (
          <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(185,128,45,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(185,128,45,0.2)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-warning)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>Application deadline</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>{formatDate(job.deadline)}</div>
          </div>
        )}

        {job.applicationInstructions && (
          <div style={{ padding: '14px 16px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-neutral)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>How to apply</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{job.applicationInstructions}</p>
          </div>
        )}
      </div>

      {/* Demo apply dialog */}
      {showApplyDialog && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, zIndex: 10 }}>
          <div style={{ textAlign: 'center', maxWidth: 320 }}>
            <div style={{ fontSize: '2rem', marginBottom: 14 }}>📋</div>
            <h3 style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-text-primary)', marginBottom: 10 }}>Demo application</h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
              In a production version, this would submit your application to <strong>{job.companyName}</strong>. In demo mode, this is a simulated action only.
            </p>
            {job.applicationInstructions && (
              <div style={{ padding: '12px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: '0.83rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 20, textAlign: 'left' }}>
                <strong>Real instructions:</strong> {job.applicationInstructions}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowApplyDialog(false)} style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-neutral)', background: 'transparent', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-stack)' }}>Cancel</button>
              <button onClick={handleDemoApply} style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-blue)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-stack)' }}>Submit demo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function StudentJobsPage() {
  const { jobs, toggleSaveJob, isJobSaved } = useJobs();
  const { addToast } = useToast();
  const [filters, setFilters] = useState(DEFAULT_JOB_FILTERS);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredJobs = useMemo(() => filterJobs(jobs, filters), [jobs, filters]);

  const activeFilterCount = filters.categories.length + filters.employmentTypes.length + filters.workArrangements.length + (filters.showStudentFriendly ? 1 : 0) + (filters.showThesisProjects ? 1 : 0);

  const handleSave = (jobId: string) => {
    const wasSaved = isJobSaved(jobId);
    toggleSaveJob(jobId);
    addToast(wasSaved ? 'Job removed from saved.' : 'Job saved.', 'success');
  };

  const clearFilters = () => setFilters(DEFAULT_JOB_FILTERS);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-main)' }}>
      <StudentNav />
      <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 className="text-page-heading" style={{ marginBottom: 8 }}>Find your next opportunity.</h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>Browse jobs, internships, and thesis projects in Norrköping.</p>
        </div>

        {/* Search bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
          <SearchInput
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            onClear={() => setFilters(f => ({ ...f, search: '' }))}
            placeholder="Search jobs, companies, skills…"
            style={{ flex: 1 }}
          />
          <button onClick={() => setShowFilters(!showFilters)} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 16px', borderRadius: 'var(--radius-md)',
            border: `1px solid ${activeFilterCount > 0 ? 'rgba(79,121,232,0.4)' : 'var(--border-neutral)'}`,
            background: activeFilterCount > 0 ? 'rgba(79,121,232,0.08)' : 'var(--surface-elevated)',
            color: activeFilterCount > 0 ? 'var(--color-accent-blue)' : 'var(--color-text-secondary)',
            cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
            fontFamily: 'var(--font-stack)',
          }}>
            <SlidersHorizontal size={16} />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            {showFilters ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'transparent', border: '1px solid var(--border-neutral)', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-stack)' }}>
              Clear all
            </button>
          )}
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-neutral)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Category</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {categories.map(cat => (
                    <label key={cat.value} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                      <input type="checkbox" checked={filters.categories.includes(cat.value)}
                        onChange={e => setFilters(f => ({ ...f, categories: e.target.checked ? [...f.categories, cat.value] : f.categories.filter(c => c !== cat.value) }))}
                        style={{ width: 14, height: 14, accentColor: 'var(--color-accent-blue)' }} />
                      {cat.label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Employment type</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {employmentTypes.map(et => (
                    <label key={et.value} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                      <input type="checkbox" checked={filters.employmentTypes.includes(et.value)}
                        onChange={e => setFilters(f => ({ ...f, employmentTypes: e.target.checked ? [...f.employmentTypes, et.value] : f.employmentTypes.filter(c => c !== et.value) }))}
                        style={{ width: 14, height: 14, accentColor: 'var(--color-accent-blue)' }} />
                      {et.label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Work arrangement</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {arrangements.map(arr => (
                    <label key={arr.value} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                      <input type="checkbox" checked={filters.workArrangements.includes(arr.value)}
                        onChange={e => setFilters(f => ({ ...f, workArrangements: e.target.checked ? [...f.workArrangements, arr.value] : f.workArrangements.filter(c => c !== arr.value) }))}
                        style={{ width: 14, height: 14, accentColor: 'var(--color-accent-blue)' }} />
                      {arr.label}
                    </label>
                  ))}
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginTop: 8 }}>
                    <input type="checkbox" checked={filters.showStudentFriendly}
                      onChange={e => setFilters(f => ({ ...f, showStudentFriendly: e.target.checked }))}
                      style={{ width: 14, height: 14, accentColor: 'var(--color-accent-blue)' }} />
                    Student-friendly only
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                    <input type="checkbox" checked={filters.showThesisProjects}
                      onChange={e => setFilters(f => ({ ...f, showThesisProjects: e.target.checked }))}
                      style={{ width: 14, height: 14, accentColor: 'var(--color-accent-blue)' }} />
                    Thesis projects only
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {filters.categories.map(c => <FilterChip key={c} label={categories.find(x => x.value === c)?.label || c} onRemove={() => setFilters(f => ({ ...f, categories: f.categories.filter(x => x !== c) }))} />)}
            {filters.employmentTypes.map(c => <FilterChip key={c} label={employmentTypes.find(x => x.value === c)?.label || c} onRemove={() => setFilters(f => ({ ...f, employmentTypes: f.employmentTypes.filter(x => x !== c) }))} />)}
            {filters.workArrangements.map(c => <FilterChip key={c} label={arrangements.find(x => x.value === c)?.label || c} onRemove={() => setFilters(f => ({ ...f, workArrangements: f.workArrangements.filter(x => x !== c) }))} />)}
            {filters.showStudentFriendly && <FilterChip label="Student-friendly" onRemove={() => setFilters(f => ({ ...f, showStudentFriendly: false }))} />}
            {filters.showThesisProjects && <FilterChip label="Thesis only" onRemove={() => setFilters(f => ({ ...f, showThesisProjects: false }))} />}
          </div>
        )}

        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: 16 }}>
          {filteredJobs.length} {filteredJobs.length === 1 ? 'opportunity' : 'opportunities'} found
        </div>

        {/* Jobs layout */}
        <div style={{ display: 'grid', gridTemplateColumns: selectedJob ? '1fr 1fr' : '1fr', gap: 20 }}>
          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: selectedJob ? '80vh' : 'unset', overflow: selectedJob ? 'auto' : 'visible' }}>
            {filteredJobs.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border-neutral)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>🔍</div>
                <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: 8 }}>No jobs match your filters</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: 16 }}>Try adjusting your search or clearing the filters.</div>
                <button onClick={clearFilters} style={{ padding: '8px 18px', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-blue)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'var(--font-stack)' }}>Clear filters</button>
              </div>
            ) : (
              filteredJobs.map(job => (
                <JobCard key={job.id} job={job} selected={selectedJob?.id === job.id} saved={isJobSaved(job.id)}
                  onSelect={() => setSelectedJob(job)} onToggleSave={() => handleSave(job.id)} />
              ))
            )}
          </div>

          {/* Detail panel */}
          {selectedJob && (
            <div style={{ position: 'sticky', top: 80, height: 'calc(100vh - 120px)' }}>
              <JobDetailPanel job={selectedJob} onClose={() => setSelectedJob(null)} onSave={() => handleSave(selectedJob.id)} isSaved={isJobSaved(selectedJob.id)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
