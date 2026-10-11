import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, BookmarkCheck, User, Save } from 'lucide-react';
import { StudentNav } from '../components/navigation/StudentNav';
import { useAuth } from '../features/auth/AuthContext';
import { useJobs } from '../features/jobs/JobsContext';
import { useEvents } from '../features/events/EventsContext';
import { useToast } from '../hooks/useToast';
import { storage, STORAGE_KEYS } from '../lib/storage';
import type { JobCategory } from '../types';
import { formatDateShort, formatTime } from '../lib/dates';

type ProfileForm = {
  displayName: string;
  email: string;
  linkedIn: string;
  programme: string;
  university: string;
  studyYear: string;
  skills: string[];
  interests: string[];
  careerInterests: string;
  preferredJobTypes: JobCategory[];
};

const PROGRAMMES = [
  'MSc Interaction & Design', 'MSc Computer Science', 'BSc Mechanical Engineering',
  'MSc Industrial Engineering & Management', 'BSc Media Technology',
  'MSc Cognitive Science', 'BSc Information Technology', 'Other',
];
const UNIVERSITIES = ['Linköping University', 'Other'];
const STUDY_YEARS = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'PhD'];
const JOB_TYPES: JobCategory[] = ['student-job', 'internship', 'part-time', 'thesis', 'graduate', 'full-time', 'research'];
const JOB_TYPE_LABELS: Record<string, string> = {
  'student-job': 'Student job', internship: 'Internship', 'part-time': 'Part-time',
  thesis: 'Thesis', graduate: 'Graduate', 'full-time': 'Full-time', research: 'Research',
};
const categoryColors: Record<string, string> = {
  music: '#E27E72', culture: '#8C7ADB', career: '#4F79E8',
  sports: '#26866B', food: '#D9A45B', workshop: '#3C9E96',
  social: '#6D7480', outdoor: '#26866B',
};

export function StudentProfilePage() {
  const { currentUser } = useAuth();
  const { jobs, isJobSaved } = useJobs();
  const { events, isEventSaved } = useEvents();
  const { addToast } = useToast();

  const savedJobs = jobs.filter(j => isJobSaved(j.id));
  const savedEvents = events.filter(e => isEventSaved(e.id));

  const initial: ProfileForm = {
    displayName: 'Alex Lindqvist',
    email: currentUser?.email || 'alex@student-demo.se',
    linkedIn: '',
    programme: 'MSc Interaction & Design',
    university: 'Linköping University',
    studyYear: 'Year 2',
    skills: ['UX Design', 'Figma', 'React', 'TypeScript', 'User Research'],
    interests: ['Design', 'Technology', 'Sustainability'],
    careerInterests: 'I am interested in human-centred design and working at the intersection of product and research.',
    preferredJobTypes: ['internship', 'thesis', 'student-job'],
  };

  const [form, setForm] = useState<ProfileForm>(() => {
    const saved = storage.get<ProfileForm>(STORAGE_KEYS.studentProfile, null as any);
    return saved || initial;
  });
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const saved = storage.get<ProfileForm>(STORAGE_KEYS.studentProfile, null as any);
    if (saved) setForm(saved);
  }, []);

  const handleSave = () => {
    setSaving(true);
    storage.set(STORAGE_KEYS.studentProfile, form);
    setTimeout(() => {
      setSaving(false);
      addToast('Profile saved successfully.', 'success');
    }, 400);
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills?.includes(s)) {
      setForm(f => ({ ...f, skills: [...(f.skills || []), s] }));
    }
    setSkillInput('');
  };
  const removeSkill = (s: string) => setForm(f => ({ ...f, skills: (f.skills || []).filter(x => x !== s) }));

  const addInterest = () => {
    const s = interestInput.trim();
    if (s && !form.interests?.includes(s)) {
      setForm(f => ({ ...f, interests: [...(f.interests || []), s] }));
    }
    setInterestInput('');
  };
  const removeInterest = (s: string) => setForm(f => ({ ...f, interests: (f.interests || []).filter(x => x !== s) }));

  const toggleJobType = (type: JobCategory) => {
    const current = form.preferredJobTypes || [];
    setForm(f => ({
      ...f,
      preferredJobTypes: current.includes(type) ? current.filter((t: JobCategory) => t !== type) : [...current, type],
    }));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-main)' }}>
      <StudentNav />

      <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 860 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent-blue)', marginBottom: 12 }}>YOUR PROFILE</div>
            <h1 className="text-page-heading" style={{ marginBottom: 8 }}>Profile settings.</h1>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)' }}>Edit your student profile and preferences. This is a demo — data is saved locally.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 22px', borderRadius: 'var(--radius-md)',
              background: 'var(--color-accent-blue)', color: '#fff',
              fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: saving ? 'default' : 'pointer',
              fontFamily: 'var(--font-stack)', opacity: saving ? 0.7 : 1, transition: 'opacity 200ms',
            }}
          >
            <Save size={15} /> {saving ? 'Saving…' : 'Save profile'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Basic info */}
          <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-neutral)', borderRadius: 'var(--radius-xl)', padding: 24, boxShadow: 'var(--shadow-1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <User size={16} color="var(--color-accent-blue)" />
              <h2 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-primary)' }}>Basic information</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Full name</span>
                <input value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                  style={inputStyle} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Email</span>
                <input value={form.email} disabled
                  style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>LinkedIn URL</span>
                <input value={form.linkedIn || ''} onChange={e => setForm(f => ({ ...f, linkedIn: e.target.value }))}
                  placeholder="linkedin.com/in/your-name"
                  style={inputStyle} />
              </label>
            </div>
          </div>

          {/* Academic info */}
          <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-neutral)', borderRadius: 'var(--radius-xl)', padding: 24, boxShadow: 'var(--shadow-1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <Briefcase size={16} color="var(--color-accent-teal)" />
              <h2 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-primary)' }}>Academic background</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Programme</span>
                <select value={form.programme || ''} onChange={e => setForm(f => ({ ...f, programme: e.target.value }))} style={selectStyle}>
                  {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>University</span>
                <select value={form.university || ''} onChange={e => setForm(f => ({ ...f, university: e.target.value }))} style={selectStyle}>
                  {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Study year</span>
                <select value={form.studyYear || ''} onChange={e => setForm(f => ({ ...f, studyYear: e.target.value }))} style={selectStyle}>
                  {STUDY_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </label>
            </div>
          </div>

          {/* Skills */}
          <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-neutral)', borderRadius: 'var(--radius-xl)', padding: 24, boxShadow: 'var(--shadow-1)' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: 18 }}>Skills</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {(form.skills || []).map(skill => (
                <span key={skill} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 'var(--radius-pill)', background: 'rgba(79,121,232,0.1)', border: '1px solid rgba(79,121,232,0.2)', fontSize: '0.82rem', color: 'var(--color-accent-blue)', fontWeight: 500 }}>
                  {skill}
                  <button onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', lineHeight: 1, fontSize: '1rem', opacity: 0.7 }}>×</button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSkill()}
                placeholder="Add a skill..." style={{ ...inputStyle, flex: 1 }} />
              <button onClick={addSkill} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-blue)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'var(--font-stack)' }}>Add</button>
            </div>
          </div>

          {/* Interests */}
          <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-neutral)', borderRadius: 'var(--radius-xl)', padding: 24, boxShadow: 'var(--shadow-1)' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: 18 }}>Interests</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {(form.interests || []).map(interest => (
                <span key={interest} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 'var(--radius-pill)', background: 'rgba(140,122,219,0.1)', border: '1px solid rgba(140,122,219,0.2)', fontSize: '0.82rem', color: 'var(--color-accent-violet)', fontWeight: 500 }}>
                  {interest}
                  <button onClick={() => removeInterest(interest)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', lineHeight: 1, fontSize: '1rem', opacity: 0.7 }}>×</button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={interestInput} onChange={e => setInterestInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addInterest()}
                placeholder="Add an interest..." style={{ ...inputStyle, flex: 1 }} />
              <button onClick={addInterest} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-violet)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'var(--font-stack)' }}>Add</button>
            </div>
          </div>

          {/* Career interests */}
          <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-neutral)', borderRadius: 'var(--radius-xl)', padding: 24, boxShadow: 'var(--shadow-1)', gridColumn: '1 / -1' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: 14 }}>Career interests</h2>
            <textarea
              value={form.careerInterests || ''}
              onChange={e => setForm(f => ({ ...f, careerInterests: e.target.value }))}
              rows={4}
              placeholder="Describe what you're looking for in your career..."
              style={{ ...inputStyle, resize: 'vertical', minHeight: 96, lineHeight: 1.6 }}
            />
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Preferred opportunity types</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {JOB_TYPES.map(type => {
                  const selected = (form.preferredJobTypes || []).includes(type);
                  return (
                    <button key={type} onClick={() => toggleJobType(type)} style={{
                      padding: '6px 14px', borderRadius: 'var(--radius-pill)',
                      border: `1px solid ${selected ? 'var(--color-accent-blue)' : 'var(--border-neutral)'}`,
                      background: selected ? 'rgba(79,121,232,0.1)' : 'var(--color-bg-secondary)',
                      color: selected ? 'var(--color-accent-blue)' : 'var(--color-text-secondary)',
                      fontWeight: selected ? 600 : 400,
                      fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-stack)',
                      transition: 'all var(--transition-base)',
                    }}>
                      {JOB_TYPE_LABELS[type]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Saved items */}
        <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Saved jobs */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Briefcase size={16} color="var(--color-accent-blue)" />
                <h2 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-primary)' }}>Saved jobs ({savedJobs.length})</h2>
              </div>
              <Link to="/student/jobs" style={{ fontSize: '0.8rem', color: 'var(--color-accent-blue)', textDecoration: 'none', fontWeight: 500 }}>Browse</Link>
            </div>
            {savedJobs.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-neutral)' }}>
                <BookmarkCheck size={24} color="var(--color-text-muted)" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>No saved jobs yet.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {savedJobs.map(job => (
                  <div key={job.id} style={{ padding: '12px 14px', background: 'var(--surface-elevated)', border: '1px solid var(--border-neutral)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-1)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--color-text-primary)', marginBottom: 2 }}>{job.title}</div>
                    <div style={{ fontSize: '0.77rem', color: 'var(--color-text-muted)' }}>{job.companyName} · {job.city}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Saved events */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={16} color="var(--color-accent-teal)" />
                <h2 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-primary)' }}>Saved events ({savedEvents.length})</h2>
              </div>
              <Link to="/student/events" style={{ fontSize: '0.8rem', color: 'var(--color-accent-teal)', textDecoration: 'none', fontWeight: 500 }}>Browse</Link>
            </div>
            {savedEvents.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-neutral)' }}>
                <Calendar size={24} color="var(--color-text-muted)" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>No saved events yet.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {savedEvents.map(event => (
                  <div key={event.id} style={{ padding: '12px 14px', background: 'var(--surface-elevated)', border: '1px solid var(--border-neutral)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: categoryColors[event.category] || '#888', flexShrink: 0 }} />
                      <div style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.title}</div>
                    </div>
                    <div style={{ fontSize: '0.77rem', color: 'var(--color-text-muted)', paddingLeft: 18 }}>
                      {formatDateShort(event.startDateTime)} · {formatTime(event.startDateTime)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Demo disclosure */}
        <div style={{ marginTop: 32, padding: '14px 18px', borderRadius: 'var(--radius-lg)', background: 'rgba(185,128,45,0.07)', border: '1px solid rgba(185,128,45,0.16)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="demo-badge">DEMO</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Profile data is stored in your browser's localStorage. No real account is created.</span>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px',
  borderRadius: 'var(--radius-md)', border: '1px solid var(--border-neutral)',
  background: 'var(--color-bg-main)', color: 'var(--color-text-primary)',
  fontSize: '0.9rem', fontFamily: 'var(--font-stack)',
  outline: 'none', boxSizing: 'border-box', transition: 'border-color 150ms',
};
const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none', cursor: 'pointer',
};
