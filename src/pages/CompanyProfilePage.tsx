import { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import type { CompanyProfile } from '../types';
import { CompanyNav } from '../components/navigation/CompanyNav';
import { useAuth } from '../features/auth/AuthContext';
import { useToast } from '../hooks/useToast';
import { storage, STORAGE_KEYS } from '../lib/storage';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 8,
  border: '1px solid var(--border-neutral)', background: 'var(--color-bg-secondary)',
  color: 'var(--color-text-primary)', fontSize: '0.9rem', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)',
  marginBottom: 6, display: 'block',
};

export function CompanyProfilePage() {
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const profile = currentUser?.profile as CompanyProfile;
  const company = profile?.company;

  const [name, setName] = useState(company?.name ?? '');
  const [industry, setIndustry] = useState(company?.industry ?? '');
  const [description, setDescription] = useState(company?.description ?? '');
  const [website, setWebsite] = useState(company?.website ?? '');
  const [contactEmail, setContactEmail] = useState(profile?.contactEmail ?? '');
  const [linkedIn, setLinkedIn] = useState(company?.linkedIn ?? '');
  const [size, setSize] = useState(company?.size ?? '');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    if (!profile || !company) return;
    const updatedProfile: CompanyProfile = {
      ...profile,
      contactEmail,
      company: {
        ...company,
        name,
        industry,
        description,
        website,
        linkedIn,
        size,
        updatedAt: new Date().toISOString(),
      },
    };
    storage.set(STORAGE_KEYS.companyProfile, updatedProfile);
    addToast('Profile updated', 'success');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (!profile || !company) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg-main)' }}>
        <CompanyNav />
        <div className="container" style={{ paddingTop: 60, textAlign: 'center', color: 'var(--color-text-muted)' }}>
          No company profile found.
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-main)' }}>
      <CompanyNav />
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 640 }}>

        <h1 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: 28 }}>
          Company profile
        </h1>

        {/* Demo notice */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', borderRadius: 10, background: 'rgba(185,128,45,0.08)', border: '1px solid rgba(185,128,45,0.25)', marginBottom: 28 }}>
          <AlertCircle size={16} color="var(--color-warning)" style={{ marginTop: 2, flexShrink: 0 }} />
          <p style={{ fontSize: '0.82rem', color: 'var(--color-warning)', lineHeight: 1.5 }}>
            Changes are saved locally in your browser and not transmitted anywhere.
          </p>
        </div>

        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 32 }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: 'var(--color-accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {company.initials}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>{company.name}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>{company.industry} · {company.city}</div>
          </div>
        </div>

        {/* Form */}
        <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-neutral)', borderRadius: 18, padding: 28, boxShadow: 'var(--shadow-1)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            <div>
              <label style={labelStyle}>Company name</label>
              <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div>
              <label style={labelStyle}>Industry</label>
              <input style={inputStyle} value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g. Technology" />
            </div>

            <div>
              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} value={description} onChange={e => setDescription(e.target.value)} placeholder="What does your company do?" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Website</label>
                <input style={inputStyle} value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <label style={labelStyle}>Contact email</label>
                <input type="email" style={inputStyle} value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="jobs@company.com" />
              </div>
            </div>

            <div>
              <label style={labelStyle}>City</label>
              <input style={{ ...inputStyle, background: 'var(--color-bg-main)', color: 'var(--color-text-muted)', cursor: 'not-allowed' }} value="Norrköping" readOnly />
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4 }}>Location is fixed to Norrköping.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>LinkedIn URL</label>
                <input style={inputStyle} value={linkedIn} onChange={e => setLinkedIn(e.target.value)} placeholder="https://linkedin.com/company/..." />
              </div>
              <div>
                <label style={labelStyle}>Company size</label>
                <input style={inputStyle} value={size} onChange={e => setSize(e.target.value)} placeholder="e.g. 10–50 employees" />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
              {saved && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--color-success)', fontWeight: 600 }}>
                  <CheckCircle size={15} /> Saved
                </span>
              )}
              <button onClick={handleSave} style={{ padding: '10px 24px', borderRadius: 10, background: 'var(--color-accent-blue)', color: '#fff', fontWeight: 700, fontSize: '0.88rem', border: 'none', cursor: 'pointer' }}>
                Save profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
