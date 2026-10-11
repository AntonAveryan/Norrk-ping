import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import type { Event, EventCategory, CompanyProfile } from '../types';
import { CompanyNav } from '../components/navigation/CompanyNav';
import { useAuth } from '../features/auth/AuthContext';
import { useEvents } from '../features/events/EventsContext';
import { useToast } from '../hooks/useToast';
import { ConfirmDialog } from '../components/feedback/ConfirmDialog';
import { formatDate } from '../lib/dates';

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
  category: EventCategory;
  startDateTime: string;
  endDateTime: string;
  venue: string;
  address: string;
  price: string;
  indoor: boolean;
  registrationUrl: string;
}

const defaultForm: FormState = {
  title: '', description: '', category: 'career',
  startDateTime: '', endDateTime: '', venue: '',
  address: '', price: '0', indoor: true, registrationUrl: '',
};

export function CompanyEventsPage() {
  const { currentUser } = useAuth();
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const { addToast } = useToast();

  const profile = currentUser?.profile as CompanyProfile;

  const companyEvents = events.filter(e => e.source === 'company' && e.creatorId === currentUser?.id);

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function openCreate() {
    setEditingEvent(null);
    setForm(defaultForm);
    setShowForm(true);
  }

  function openEdit(event: Event) {
    setEditingEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      category: event.category,
      startDateTime: event.startDateTime,
      endDateTime: event.endDateTime ?? '',
      venue: event.venue,
      address: event.address,
      price: String(event.price),
      indoor: event.indoor,
      registrationUrl: event.registrationUrl ?? '',
    });
    setShowForm(true);
  }

  function handleSave() {
    const priceNum = parseFloat(form.price) || 0;
    const now = new Date().toISOString();
    if (editingEvent) {
      updateEvent({
        ...editingEvent,
        ...form,
        price: priceNum,
        isFree: priceNum === 0,
        endDateTime: form.endDateTime || undefined,
        registrationUrl: form.registrationUrl || undefined,
        updatedAt: now,
      });
      addToast('Event updated', 'success');
    } else {
      const newEvent: Event = {
        id: `evt-${Date.now()}`,
        city: 'Norrköping',
        organizer: profile?.company?.name ?? '',
        organizerType: 'company',
        title: form.title,
        description: form.description,
        category: form.category,
        startDateTime: form.startDateTime,
        endDateTime: form.endDateTime || undefined,
        venue: form.venue,
        address: form.address,
        price: priceNum,
        priceLabel: priceNum === 0 ? 'Free' : `${priceNum} SEK`,
        isFree: priceNum === 0,
        indoor: form.indoor,
        registrationUrl: form.registrationUrl || undefined,
        status: 'draft',
        isDemo: false,
        source: 'company',
        creatorId: currentUser?.id,
        createdAt: now,
        updatedAt: now,
      };
      addEvent(newEvent);
      addToast('Event created as draft', 'success');
    }
    setShowForm(false);
  }

  function togglePublish(event: Event) {
    const newStatus = event.status === 'published' ? 'draft' : 'published';
    updateEvent({ ...event, status: newStatus, updatedAt: new Date().toISOString() });
    addToast(newStatus === 'published' ? 'Event published' : 'Event unpublished', 'success');
  }

  function handleDelete() {
    if (deleteId) {
      deleteEvent(deleteId);
      addToast('Event deleted', 'success');
      setDeleteId(null);
    }
  }

  const statusColor = (status: string) => {
    if (status === 'published') return { bg: 'rgba(38,134,107,0.1)', color: 'var(--color-success)' };
    if (status === 'draft') return { bg: 'rgba(185,128,45,0.1)', color: 'var(--color-warning)' };
    return { bg: 'var(--color-bg-secondary)', color: 'var(--color-text-muted)' };
  };

  const CATEGORIES: EventCategory[] = ['music','culture','career','sports','food','workshop','social','outdoor'];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-main)' }}>
      <CompanyNav />
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: 6 }}>
              Events
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              {companyEvents.length} event{companyEvents.length !== 1 ? 's' : ''} · Norrköping only
            </p>
          </div>
          <button onClick={openCreate} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, background: 'var(--color-accent-teal)', color: '#fff', fontWeight: 700, fontSize: '0.88rem', border: 'none', cursor: 'pointer' }}>
            <Plus size={16} /> Create event
          </button>
        </div>

        {companyEvents.length === 0 ? (
          <div style={{ padding: '56px 24px', textAlign: 'center', background: 'var(--color-bg-secondary)', borderRadius: 16, border: '1px dashed var(--border-neutral)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>📅</div>
            <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: 8 }}>No events yet</div>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: 18 }}>Host an event to engage with Norrköping's student community.</p>
            <button onClick={openCreate} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 10, background: 'var(--color-accent-teal)', color: '#fff', fontWeight: 700, fontSize: '0.88rem', border: 'none', cursor: 'pointer' }}>
              <Plus size={16} /> Create event
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {companyEvents.map(event => {
              const sc = statusColor(event.status);
              return (
                <div key={event.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'var(--surface-elevated)', border: '1px solid var(--border-neutral)', borderRadius: 14, boxShadow: 'var(--shadow-1)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)', marginBottom: 4 }}>{event.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{event.category} · {formatDate(event.startDateTime)} · {event.venue}</div>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: sc.bg, color: sc.color, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                    {event.status}
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => togglePublish(event)} title={event.status === 'published' ? 'Unpublish' : 'Publish'} style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid var(--border-neutral)', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}>
                      {event.status === 'published' ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button onClick={() => openEdit(event)} title="Edit" style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid var(--border-neutral)', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}>
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setDeleteId(event.id)} title="Delete" style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid var(--border-neutral)', background: 'transparent', cursor: 'pointer', color: 'var(--color-error)', display: 'flex', alignItems: 'center' }}>
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
              {editingEvent ? 'Edit event' : 'New event'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Event title *</label>
                <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Career Breakfast" />
              </div>
              <div>
                <label style={labelStyle}>Description *</label>
                <textarea style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What's happening..." />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select style={inputStyle} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as EventCategory }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Start date & time *</label>
                  <input type="datetime-local" style={inputStyle} value={form.startDateTime} onChange={e => setForm(f => ({ ...f, startDateTime: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>End date & time</label>
                  <input type="datetime-local" style={inputStyle} value={form.endDateTime} onChange={e => setForm(f => ({ ...f, endDateTime: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Venue *</label>
                <input style={inputStyle} value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} placeholder="e.g. Kopparhuset" />
              </div>
              <div>
                <label style={labelStyle}>Address</label>
                <input style={inputStyle} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Street address" />
              </div>
              <div>
                <label style={labelStyle}>City</label>
                <input style={{ ...inputStyle, background: 'var(--color-bg-main)', color: 'var(--color-text-muted)', cursor: 'not-allowed' }} value="Norrköping" readOnly />
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4 }}>Location is fixed to Norrköping.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Price (SEK, 0 = free)</label>
                  <input type="number" min="0" style={inputStyle} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 22 }}>
                  <input type="checkbox" id="indoor" checked={form.indoor} onChange={e => setForm(f => ({ ...f, indoor: e.target.checked }))} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  <label htmlFor="indoor" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer' }}>Indoor event</label>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Registration URL</label>
                <input style={inputStyle} value={form.registrationUrl} onChange={e => setForm(f => ({ ...f, registrationUrl: e.target.value }))} placeholder="https://..." />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 28 }}>
              <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border-neutral)', background: 'transparent', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleSave} style={{ padding: '10px 20px', borderRadius: 10, background: 'var(--color-accent-teal)', color: '#fff', fontWeight: 700, fontSize: '0.88rem', border: 'none', cursor: 'pointer' }}>
                {editingEvent ? 'Save changes' : 'Create (draft)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <ConfirmDialog
          title="Delete event"
          message="This event will be permanently removed."
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          danger
        />
      )}
    </div>
  );
}
