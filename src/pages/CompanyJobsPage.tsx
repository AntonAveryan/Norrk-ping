import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import type { Job, JobCategory, EmploymentType, ExperienceLevel, WorkArrangement, CompanyProfile } from '../types';
import { CompanyNav } from '../components/navigation/CompanyNav';
import { useAuth } from '../features/auth/AuthContext';
import { useJobs } from '../features/jobs/JobsContext';
import { useToast } from '../hooks/useToast';
import { ConfirmDialog } from '../components/feedback/ConfirmDialog';
import { relativeDate } from '../lib/dates';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 8,
  border: '1px solid var(--border-neutral)', background: 'var(--color-bg-secondary)',
  color: 'var(--color-text-primary)', fontSize: '0.9rem', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)',
  marginBottom: 6, display: 'block',
};

interface FormState {
  title: string;
  description: string;
  category: JobCategory;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  workArrangement: WorkArrangement;
  industry: string;
  city: string;
  deadline: string;
  salary: string;
  applicationUrl: string;
}

const defaultForm: FormState = {
  title: '', description: '', category: 'internship',
  employmentType: 'internship', experienceLevel: 'student',
  workArrangement: 'on-site', industry: '', city: 'Norrköping',
  deadline: '', salary: '', applicationUrl: '',
};

export function CompanyJobsPage() {
  const { currentUser } = useAuth();
  const { jobs, addJob, updateJob, deleteJob } = useJobs();
  const { addToast } = useToast();

  const profile = currentUser?.profile as CompanyProfile;
  const company = profile?.company;

  const companyJobs = jobs.filter(j => j.companyId === company?.id && !j.isDemo);

  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [cityError, setCityError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function openCreate() {
    setEditingJob(null);
    setForm(defaultForm);
    setCityError('');
    setShowForm(true);
  }

  function openEdit(job: Job) {
    setEditingJob(job);
    setForm({
      title: job.title, description: job.description,
      category: job.category, employmentType: job.employmentType,
      experienceLevel: job.experienceLevel, workArrangement: job.workArrangement,
      industry: job.industry, city: job.city,
      deadline: job.deadline ?? '', salary: job.salary ?? '',
      applicationUrl: job.applicationUrl ?? '',
    });
    setCityError('');
    setShowForm(true);
  }

  function handleSave() {
    if (form.city.trim().toLowerCase() !== 'norrköping') {
      setCityError('Location must be in Norrköping.');
      return;
    }
    const now = new Date().toISOString();
    if (editingJob) {
      updateJob({ ...editingJob, ...form, updatedAt: now });
      addToast('Job updated', 'success');
    } else {
      const newJob: Job = {
        id: `job-${Date.now()}`,
        companyId: company?.id ?? '',
        companyName: company?.name ?? '',
        responsibilities: [],
        requirements: [],
        skills: [],
        coordinates: undefined,
        address: '',
        datePublished: now,
        status: 'draft',
        source: 'company',
        isDemo: false,
        createdAt: now,
        updatedAt: now,
        ...form,
        deadline: form.deadline || undefined,
        salary: form.salary || undefined,
        applicationUrl: form.applicationUrl || undefined,
      };
      addJob(newJob);
      addToast('Job created as draft', 'success');
    }
    setShowForm(false);
  }

  function togglePublish(job: Job) {
    const newStatus = job.status === 'published' ? 'draft' : 'published';
    updateJob({ ...job, status: newStatus, updatedAt: new Date().toISOString() });
    addToast(newStatus === 'published' ? 'Job published' : 'Job unpublished', 'success');
  }

  function handleDelete() {
    if (deleteId) {
      deleteJob(deleteId);
      addToast('Job deleted', 'success');
      setDeleteId(null);
    }
  }

  const statusColor = (status: string) => {
    if (status === 'published') return { bg: 'rgba(38,134,107,0.1)', color: 'var(--color-success)' };
    if (status === 'draft') return { bg: 'rgba(185,128,45,0.1)', color: 'var(--color-warning)' };
    return { bg: 'var(--color-bg-secondary)', color: 'var(--color-text-muted)' };
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-main)' }}>
      <CompanyNav />
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: 6 }}>
              Job offers
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              {companyJobs.length} listing{companyJobs.length !== 1 ? 's' : ''} · Norrköping only
            </p>
          </div>
          <button onClick={openCreate} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, background: 'var(--color-accent-blue)', color: '#fff', fontWeight: 700, fontSize: '0.88rem', border: 'none', cursor: 'pointer' }}>
            <Plus size={16} /> Create job offer
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', borderRadius: 10, background: 'rgba(79,121,232,0.07)', border: '1px solid rgba(79,121,232,0.2)', marginBottom: 24 }}>
          <AlertCircle size={16} color="var(--color-accent-blue)" style={{ marginTop: 2, flexShrink: 0 }} />
          <p style={{ fontSize: '0.82rem', color: 'var(--color-accent-blue)', lineHeight: 1.5 }}>
            All job offers must be based in Norrköping. Location is validated before publishing.
          </p>
        </div>

        {companyJobs.length === 0 ? (
          <div style={{ padding: '56px 24px', textAlign: 'center', background: 'var(--color-bg-secondary)', borderRadius: 16, border: '1px dashed var(--border-neutral)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>💼</div>
            <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: 8 }}>No job offers yet</div>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: 18 }}>Create your first listing to connect with students.</p>
            <button onClick={openCreate} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 10, background: 'var(--color-accent-blue)', color: '#fff', fontWeight: 700, fontSize: '0.88rem', border: 'none', cursor: 'pointer' }}>
              <Plus size={16} /> Create job offer
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {companyJobs.map(job => {
              const sc = statusColor(job.status);
              return (
                <div key={job.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'var(--surface-elevated)', border: '1px solid var(--border-neutral)', borderRadius: 14, boxShadow: 'var(--shadow-1)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)', marginBottom: 4 }}>{job.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{job.category} · {job.workArrangement} · {relativeDate(job.createdAt)}</div>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: sc.bg, color: sc.color, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                    {job.status}
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => togglePublish(job)} title={job.status === 'published' ? 'Unpublish' : 'Publish'} style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid var(--border-neutral)', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}>
                      {job.status === 'published' ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button onClick={() => openEdit(job)} title="Edit" style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid var(--border-neutral)', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}>
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setDeleteId(job.id)} title="Delete" style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid var(--border-neutral)', background: 'transparent', cursor: 'pointer', color: 'var(--color-error)', display: 'flex', alignItems: 'center' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'var(--surface-elevated)', borderRadius: 18, padding: 32, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-3)' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 24 }}>
              {editingJob ? 'Edit job offer' : 'New job offer'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Job title *</label>
                <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Software Developer Intern" />
              </div>
              <div>
                <label style={labelStyle}>Description *</label>
                <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the role..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select style={inputStyle} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as JobCategory }))}>
                    {(['student-job','internship','graduate','part-time','thesis','research','full-time'] as JobCategory[]).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Employment type</label>
                  <select style={inputStyle} value={form.employmentType} onChange={e => setForm(f => ({ ...f, employmentType: e.target.value as EmploymentType }))}>
                    {(['part-time','full-time','internship','thesis','contract'] as EmploymentType[]).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Experience level</label>
                  <select style={inputStyle} value={form.experienceLevel} onChange={e => setForm(f => ({ ...f, experienceLevel: e.target.value as ExperienceLevel }))}>
                    {(['no-experience','student','junior','mid','senior'] as ExperienceLevel[]).map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Work arrangement</label>
                  <select style={inputStyle} value={form.workArrangement} onChange={e => setForm(f => ({ ...f, workArrangement: e.target.value as WorkArrangement }))}>
                    {(['on-site','hybrid','remote'] as WorkArrangement[]).map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Industry *</label>
                <input style={inputStyle} value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} placeholder="e.g. Technology" />
              </div>
              <div>
                <label style={labelStyle}>City *</label>
                <input style={{ ...inputStyle, borderColor: cityError ? 'var(--color-error)' : undefined }} value={form.city} onChange={e => { setForm(f => ({ ...f, city: e.target.value })); setCityError(''); }} placeholder="Norrköping" />
                {cityError && <p style={{ fontSize: '0.78rem', color: 'var(--color-error)', marginTop: 4 }}>{cityError}</p>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Deadline</label>
                  <input type="date" style={inputStyle} value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Salary / compensation</label>
                  <input style={inputStyle} value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} placeholder="e.g. 150 SEK/h" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Application URL</label>
                <input style={inputStyle} value={form.applicationUrl} onChange={e => setForm(f => ({ ...f, applicationUrl: e.target.value }))} placeholder="https://..." />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 28 }}>
              <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border-neutral)', background: 'transparent', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleSave} style={{ padding: '10px 20px', borderRadius: 10, background: 'var(--color-accent-blue)', color: '#fff', fontWeight: 700, fontSize: '0.88rem', border: 'none', cursor: 'pointer' }}>
                {editingJob ? 'Save changes' : 'Create (draft)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <ConfirmDialog
          title="Delete job offer"
          message="This listing will be permanently removed. This cannot be undone."
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          danger
        />
      )}
    </div>
  );
}
