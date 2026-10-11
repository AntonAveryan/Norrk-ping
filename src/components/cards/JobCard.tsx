import { Bookmark, BookmarkCheck, MapPin, Clock, Building2 } from 'lucide-react';
import { type Job } from '../../types';
import { relativeDate } from '../../lib/dates';

const categoryLabels: Record<string, string> = {
  'student-job': 'Student Job', internship: 'Internship', graduate: 'Graduate', 'part-time': 'Part-time',
  thesis: 'Thesis Project', research: 'Research', 'full-time': 'Full-time',
};

const arrangementLabels: Record<string, string> = {
  'on-site': 'On-site', hybrid: 'Hybrid', remote: 'Remote',
};

interface Props {
  job: Job;
  selected?: boolean;
  saved?: boolean;
  onSelect?: () => void;
  onToggleSave?: () => void;
  compact?: boolean;
}

export function JobCard({ job, selected, saved, onSelect, onToggleSave, compact }: Props) {
  const initials = job.companyName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      onClick={onSelect}
      style={{
        background: selected ? 'rgba(79,121,232,0.06)' : 'var(--surface-elevated)',
        border: `1px solid ${selected ? 'rgba(79,121,232,0.25)' : 'var(--border-neutral)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: compact ? '16px 18px' : '20px 22px',
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'all var(--transition-base)',
        boxShadow: selected ? '0 4px 20px rgba(79,121,232,0.1)' : 'var(--shadow-1)',
        position: 'relative',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.boxShadow = 'var(--shadow-2)'; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.boxShadow = 'var(--shadow-1)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, background: 'var(--color-accent-blue)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.85rem', fontWeight: 700, color: '#fff', flexShrink: 0,
          opacity: 0.88,
        }}>
          {initials}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.3, marginBottom: 3 }}>
              {job.title}
            </div>
            {onToggleSave && (
              <button onClick={e => { e.stopPropagation(); onToggleSave(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: saved ? 'var(--color-accent-blue)' : 'var(--color-text-muted)', borderRadius: 8, flexShrink: 0, marginTop: -2 }}>
                {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Building2 size={13} color="var(--color-text-muted)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{job.companyName}</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: compact ? 0 : 12 }}>
            <span style={{ fontSize: '0.75rem', padding: '3px 9px', background: 'rgba(79,121,232,0.1)', color: 'var(--color-accent-blue)', borderRadius: 999, fontWeight: 600 }}>
              {categoryLabels[job.category] || job.category}
            </span>
            <span style={{ fontSize: '0.75rem', padding: '3px 9px', background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)', borderRadius: 999 }}>
              {arrangementLabels[job.workArrangement]}
            </span>
            {job.isDemo && <span className="demo-badge">Demo</span>}
          </div>

          {!compact && (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                <MapPin size={12} /> {job.city}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                <Clock size={12} /> {relativeDate(job.datePublished)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
