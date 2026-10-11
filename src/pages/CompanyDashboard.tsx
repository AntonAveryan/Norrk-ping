import { Link } from 'react-router-dom';
import { Briefcase, Calendar, Eye, Plus, MapPin, ArrowRight, Building2 } from 'lucide-react';
import { CompanyNav } from '../components/navigation/CompanyNav';
import { useAuth } from '../features/auth/AuthContext';
import { useJobs } from '../features/jobs/JobsContext';
import { useEvents } from '../features/events/EventsContext';
import type { CompanyProfile } from '../types';
import { relativeDate } from '../lib/dates';

const catLabels: Record<string, string> = {
  'student-job': 'Student Job', internship: 'Internship', graduate: 'Graduate',
  'part-time': 'Part-time', thesis: 'Thesis', research: 'Research', 'full-time': 'Full-time',
};
const catColors: Record<string, string> = {
  music: '#E27E72', culture: '#8C7ADB', career: '#4F79E8',
  sports: '#26866B', food: '#D9A45B', workshop: '#3C9E96', social: '#6D7480', outdoor: '#3C9E96',
};

export function CompanyDashboard() {
  const { currentUser } = useAuth();
  const { jobs } = useJobs();
  const { events } = useEvents();

  const profile = currentUser?.profile as CompanyProfile;
  const company = profile?.company;
  const companyId = company?.id || 'comp-005';

  const myJobs = jobs.filter(j => j.companyId === companyId);
  const myPublishedJobs = myJobs.filter(j => j.status === 'published');
  const myDraftJobs = myJobs.filter(j => j.status === 'draft');

  const myEvents = events.filter(e => e.source === 'company' && (e as unknown as { companyId?: string }).companyId === companyId);
  const myPublishedEvents = myEvents.filter(e => e.status === 'published');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-main)' }}>
      <CompanyNav />

      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{greeting}</div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 10 }}>
                {company?.name || 'Your company'}.<br />Reach Norrköping students.
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', maxWidth: 480 }}>
                Post opportunities, host events, and connect with talent at Linköping University and Campus Norrköping.
              </p>
            </div>

            {/* Company card */}
            <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-neutral)', borderRadius: 'var(--radius-xl)', padding: '20px 24px', minWidth: 220, boxShadow: 'var(--shadow-1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--color-accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
                  {(company?.name || 'K').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{company?.name || 'Kopparhuset Tech'}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>{company?.industry || 'Technology'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-accent-blue)' }}>{myPublishedJobs.length}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Active jobs</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-accent-teal)' }}>{myPublishedEvents.length}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Active events</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>{myDraftJobs.length}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Drafts</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Norrköping-only notice */}
        <div style={{ marginBottom: 32, padding: '14px 18px', borderRadius: 'var(--radius-lg)', background: 'rgba(60,158,150,0.07)', border: '1px solid rgba(60,158,150,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <MapPin size={15} color="var(--color-accent-teal)" />
          <span style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)' }}>This platform is for <strong>Norrköping-based opportunities only</strong>. All jobs and events must be located in or accessible from Norrköping.</span>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 40 }}>
          {[
            { to: '/company/jobs', icon: Plus, label: 'Post a job', sub: 'Reach Norrköping students', color: 'var(--color-accent-blue)' },
            { to: '/company/events', icon: Calendar, label: 'Create an event', sub: 'Workshops, open days & more', color: 'var(--color-accent-teal)' },
            { to: '/company/jobs', icon: Eye, label: 'Manage postings', sub: `${myJobs.length} total listings`, color: 'var(--color-accent-violet)' },
            { to: '/company/profile', icon: Building2, label: 'Company profile', sub: 'Keep your info up-to-date', color: 'var(--color-accent-amber)' },
          ].map(item => (
            <Link key={item.to + item.label} to={item.to} style={{
              background: 'var(--surface-elevated)', border: '1px solid var(--border-neutral)', borderRadius: 'var(--radius-lg)',
              padding: '18px 20px', textDecoration: 'none', display: 'block',
              boxShadow: 'var(--shadow-1)', transition: 'all var(--transition-base)',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-1)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <item.icon size={20} color={item.color} />
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>{item.sub}</div>
            </Link>
          ))}
        </div>

        {/* Two column */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          {/* My jobs */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Your job listings</h2>
              <Link to="/company/jobs" style={{ fontSize: '0.82rem', color: 'var(--color-accent-blue)', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>Manage <ArrowRight size={14} /></Link>
            </div>
            {myJobs.length === 0 ? (
              <div style={{ padding: '24px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px dashed var(--border-neutral)' }}>
                <Briefcase size={28} color="var(--color-text-muted)" style={{ margin: '0 auto 10px' }} />
                <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: 10 }}>No job listings yet.</div>
                <Link to="/company/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-blue)', color: '#fff', fontWeight: 600, fontSize: '0.82rem', textDecoration: 'none' }}>
                  <Plus size={14} /> Post first job
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {myJobs.slice(0, 5).map(job => (
                  <div key={job.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--surface-elevated)', border: '1px solid var(--border-neutral)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-1)' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</div>
                      <div style={{ fontSize: '0.77rem', color: 'var(--color-text-muted)' }}>{catLabels[job.category]}</div>
                    </div>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 'var(--radius-pill)', fontWeight: 600, background: job.status === 'published' ? 'rgba(38,134,107,0.1)' : 'rgba(109,116,128,0.1)', color: job.status === 'published' ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                      {job.status === 'published' ? 'Live' : 'Draft'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* My events */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Your events</h2>
              <Link to="/company/events" style={{ fontSize: '0.82rem', color: 'var(--color-accent-teal)', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>Manage <ArrowRight size={14} /></Link>
            </div>
            {myEvents.length === 0 ? (
              <div style={{ padding: '24px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px dashed var(--border-neutral)' }}>
                <Calendar size={28} color="var(--color-text-muted)" style={{ margin: '0 auto 10px' }} />
                <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: 10 }}>No events yet.</div>
                <Link to="/company/events" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-teal)', color: '#fff', fontWeight: 600, fontSize: '0.82rem', textDecoration: 'none' }}>
                  <Plus size={14} /> Create first event
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {myEvents.slice(0, 5).map(event => (
                  <div key={event.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--surface-elevated)', border: '1px solid var(--border-neutral)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-1)' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: catColors[event.category] || '#888', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.title}</div>
                      <div style={{ fontSize: '0.77rem', color: 'var(--color-text-muted)' }}>{relativeDate(event.startDateTime)}</div>
                    </div>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 'var(--radius-pill)', fontWeight: 600, background: event.status === 'published' ? 'rgba(38,134,107,0.1)' : 'rgba(109,116,128,0.1)', color: event.status === 'published' ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                      {event.status === 'published' ? 'Live' : 'Draft'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
