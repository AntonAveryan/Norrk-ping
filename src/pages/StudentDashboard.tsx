import { Link } from 'react-router-dom';
import { Briefcase, Calendar, HelpCircle, BookmarkCheck, ArrowRight, MapPin, Clock, Zap } from 'lucide-react';
import { StudentNav } from '../components/navigation/StudentNav';
import { useAuth } from '../features/auth/AuthContext';
import { useJobs } from '../features/jobs/JobsContext';
import { useEvents } from '../features/events/EventsContext';
import { formatDateShort, formatTime } from '../lib/dates';
import type { StudentProfile } from '../types';

const categoryColors: Record<string, string> = {
  music: '#E27E72', culture: '#8C7ADB', career: '#4F79E8',
  sports: '#26866B', food: '#D9A45B', workshop: '#3C9E96',
  social: '#6D7480', outdoor: '#26866B',
};

const catLabels: Record<string, string> = {
  'student-job': 'Student Job', internship: 'Internship', graduate: 'Graduate',
  'part-time': 'Part-time', thesis: 'Thesis', research: 'Research', 'full-time': 'Full-time',
};

export function StudentDashboard() {
  const { currentUser } = useAuth();
  const { jobs, savedJobIds, isJobSaved } = useJobs();
  const { events, savedEventIds } = useEvents();

  const profile = currentUser?.profile as StudentProfile;
  const publishedJobs = jobs.filter(j => j.status === 'published').slice(0, 4);
  const upcomingEvents = events.filter(e => e.status === 'published').slice(0, 3);
  const savedJobs = jobs.filter(j => isJobSaved(j.id));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-main)' }}>
      <StudentNav />

      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        {/* Welcome header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{greeting}</div>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 10 }}>
                Your Norrköping.<br />Your next move.
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', maxWidth: 480 }}>
                Everything happening around your studies, career, and city life — {profile?.displayName || 'welcome back'}.
              </p>
            </div>
            <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-neutral)', borderRadius: 'var(--radius-xl)', padding: '20px 24px', minWidth: 220, boxShadow: 'var(--shadow-1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 999, background: 'var(--color-accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                  {profile?.avatarInitials || 'AL'}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{profile?.displayName}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>{profile?.programme?.split(' ').slice(0, 4).join(' ')}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-accent-blue)' }}>{savedJobIds.length}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Saved jobs</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-accent-teal)' }}>{savedEventIds.length}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Saved events</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 40 }}>
          {[
            { to: '/student/jobs', icon: Briefcase, label: 'Find jobs', sub: `${jobs.filter(j => j.status === 'published').length} opportunities`, color: 'var(--color-accent-blue)' },
            { to: '/student/events', icon: Calendar, label: 'Events & parties', sub: `${events.filter(e => e.status === 'published').length} upcoming`, color: 'var(--color-accent-teal)' },
            { to: '/student/help', icon: HelpCircle, label: 'City guide', sub: 'Housing, transport & more', color: 'var(--color-accent-violet)' },
            { to: '/student/jobs/information', icon: Zap, label: 'Career resources', sub: 'CV, interviews & tips', color: 'var(--color-accent-amber)' },
          ].map(item => (
            <Link key={item.to} to={item.to} style={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border-neutral)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px 20px',
              textDecoration: 'none',
              display: 'block',
              boxShadow: 'var(--shadow-1)',
              transition: 'all var(--transition-base)',
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

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          {/* Recommended jobs */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Recommended for you</h2>
              <Link to="/student/jobs" style={{ fontSize: '0.82rem', color: 'var(--color-accent-blue)', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View all <ArrowRight size={14} /></Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {publishedJobs.map(job => {
                const initials = job.companyName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                return (
                  <Link key={job.id} to="/student/jobs" style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px',
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--border-neutral)',
                    borderRadius: 'var(--radius-lg)',
                    textDecoration: 'none',
                    boxShadow: 'var(--shadow-1)',
                    transition: 'all var(--transition-base)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-2)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-1)'}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--color-accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.76rem', fontWeight: 700, color: '#fff', flexShrink: 0, opacity: 0.85 }}>{initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-text-primary)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>{job.companyName}</div>
                    </div>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(79,121,232,0.1)', color: 'var(--color-accent-blue)', borderRadius: 999, fontWeight: 600, flexShrink: 0 }}>
                      {catLabels[job.category]}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Upcoming events */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Upcoming events</h2>
              <Link to="/student/events" style={{ fontSize: '0.82rem', color: 'var(--color-accent-teal)', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View all <ArrowRight size={14} /></Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {upcomingEvents.map(event => (
                <Link key={event.id} to="/student/events" style={{
                  display: 'flex', gap: 14, padding: '14px 16px',
                  background: 'var(--surface-elevated)',
                  border: '1px solid var(--border-neutral)',
                  borderRadius: 'var(--radius-lg)',
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow-1)',
                  transition: 'all var(--transition-base)',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-2)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-1)'}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${categoryColors[event.category]}dd, ${categoryColors[event.category]}88)`, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-text-primary)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Clock size={11} /> {formatDateShort(event.startDateTime)} · {formatTime(event.startDateTime)}
                    </div>
                  </div>
                  {event.isFree && (
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(38,134,107,0.1)', color: 'var(--color-success)', borderRadius: 999, fontWeight: 600, flexShrink: 0, height: 'fit-content', marginTop: 2 }}>Free</span>
                  )}
                </Link>
              ))}
            </div>
          </section>

          {/* Saved jobs */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Saved jobs</h2>
              <Link to="/student/jobs" style={{ fontSize: '0.82rem', color: 'var(--color-accent-blue)', fontWeight: 500, textDecoration: 'none' }}>Manage</Link>
            </div>
            {savedJobs.length === 0 ? (
              <div style={{ padding: '24px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px dashed var(--border-neutral)' }}>
                <BookmarkCheck size={28} color="var(--color-text-muted)" style={{ margin: '0 auto 10px' }} />
                <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>No saved jobs yet.</div>
                <Link to="/student/jobs" style={{ fontSize: '0.82rem', color: 'var(--color-accent-blue)', fontWeight: 500 }}>Browse opportunities</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {savedJobs.slice(0, 3).map(job => (
                  <div key={job.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--surface-elevated)', border: '1px solid var(--border-neutral)', borderRadius: 'var(--radius-md)' }}>
                    <BookmarkCheck size={16} color="var(--color-accent-blue)" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: '0.86rem', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>{job.companyName}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* City discovery */}
          <section>
            <div style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Discover Norrköping</h2>
            </div>
            <div style={{
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              position: 'relative',
              height: 200,
              background: 'linear-gradient(135deg, #315FC9 0%, #3C9E96 100%)',
            }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=60)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.35 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,14,22,0.1), rgba(8,14,22,0.7))' }} />
              <div style={{ position: 'relative', zIndex: 1, padding: '20px 24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <MapPin size={14} color="rgba(255,255,255,0.7)" />
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Norrköping, Sweden</span>
                </div>
                <h3 style={{ fontWeight: 600, fontSize: '1.1rem', color: '#fff', marginBottom: 12, lineHeight: 1.3 }}>City guide & help centre</h3>
                <Link to="/student/help" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontWeight: 600, fontSize: '0.82rem', textDecoration: 'none', width: 'fit-content' }}>
                  Explore the guide <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
