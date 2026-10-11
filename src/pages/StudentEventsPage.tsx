import { useState, useMemo, useEffect, useRef } from 'react';
import { MapPin, Calendar, X, Plus, Bookmark, BookmarkCheck, Info, Search } from 'lucide-react';
import { StudentNav } from '../components/navigation/StudentNav';
import { useEvents } from '../features/events/EventsContext';
import { useToast } from '../hooks/useToast';
import { formatDateShort, formatTime, formatEventDate } from '../lib/dates';
import type { Event, EventCategory } from '../types';

/* Leaflet loaded lazily to avoid SSR issues */
let L: typeof import('leaflet') | null = null;

const categoryColors: Record<string, string> = {
  music: '#E27E72', culture: '#8C7ADB', career: '#4F79E8',
  sports: '#26866B', food: '#D9A45B', workshop: '#3C9E96',
  social: '#6D7480', outdoor: '#3C9E96',
};
const CATEGORY_LABELS: Record<string, string> = {
  music: 'Music', culture: 'Culture', career: 'Career', sports: 'Sports',
  food: 'Food & Drink', workshop: 'Workshop', social: 'Social', outdoor: 'Outdoor',
};
const ALL_CATEGORIES: EventCategory[] = ['music', 'culture', 'career', 'sports', 'food', 'workshop', 'social', 'outdoor'];

interface EventFormState {
  title: string;
  description: string;
  category: EventCategory;
  venue: string;
  address: string;
  city: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  isFree: boolean;
  price: string;
  maxAttendees: string;
  lat: string;
  lng: string;
}

const emptyForm = (): EventFormState => ({
  title: '', description: '', category: 'social', venue: '', address: '', city: 'Norrköping',
  startDate: '', startTime: '18:00', endDate: '', endTime: '21:00',
  isFree: true, price: '', maxAttendees: '',
  lat: '58.5877', lng: '16.1924',
});

function createMarkerIcon(color: string, selected: boolean) {
  if (!L) return undefined;
  const size = selected ? 32 : 24;
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;background:${color};border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);transform:rotate(-45deg);transition:all 200ms;"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

export function StudentEventsPage() {
  const { events, addEvent, updateEvent, deleteEvent, toggleSaveEvent, isEventSaved } = useEvents();
  const { addToast } = useToast();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<EventCategory | 'all'>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [form, setForm] = useState<EventFormState>(emptyForm());
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<import('leaflet').Map | null>(null);
  const markersRef = useRef<Map<string, import('leaflet').Marker>>(new Map());

  const filtered = useMemo(() => {
    return events.filter(e => {
      if (e.status !== 'published') return false;
      const matchQuery = !query ||
        e.title.toLowerCase().includes(query.toLowerCase()) ||
        e.venue?.toLowerCase().includes(query.toLowerCase()) ||
        e.category.toLowerCase().includes(query.toLowerCase());
      const matchCat = activeCategory === 'all' || e.category === activeCategory;
      return matchQuery && matchCat;
    });
  }, [events, query, activeCategory]);

  // Load Leaflet
  useEffect(() => {
    if (typeof window === 'undefined') return;
    import('leaflet').then(leaflet => {
      L = leaflet.default || leaflet;
      // Fix default icon issue with bundlers
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      setLeafletLoaded(true);
    }).catch(() => {});
  }, []);

  // Initialize map
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || mapInstance.current || !L) return;
    const map = L.map(mapRef.current, {
      center: [58.5877, 16.1924],
      zoom: 13,
      zoomControl: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);
    mapInstance.current = map;
  }, [leafletLoaded]);

  // Sync markers
  useEffect(() => {
    if (!mapInstance.current || !L) return;
    const map = mapInstance.current;

    // Remove old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current.clear();

    filtered.forEach(event => {
      if (!event.coordinates || !L) return;
      const color = categoryColors[event.category] || '#888';
      const isSelected = selectedEvent?.id === event.id;
      const icon = createMarkerIcon(color, isSelected);
      if (!icon) return;
      const marker = L.marker([event.coordinates.lat, event.coordinates.lng], { icon });
      marker.addTo(map);
      marker.on('click', () => setSelectedEvent(event));
      markersRef.current.set(event.id, marker);
    });
  }, [filtered, selectedEvent, leafletLoaded]);

  // Pan map to selected event
  useEffect(() => {
    if (!selectedEvent?.coordinates || !mapInstance.current) return;
    mapInstance.current.panTo([selectedEvent.coordinates.lat, selectedEvent.coordinates.lng], { animate: true, duration: 0.4 });
  }, [selectedEvent]);

  const handleCreateOrUpdate = () => {
    if (!form.title.trim()) { addToast('Event title is required.', 'error'); return; }
    if (!form.startDate) { addToast('Start date is required.', 'error'); return; }
    if (!form.venue.trim()) { addToast('Venue name is required.', 'error'); return; }
    if (form.city.toLowerCase() !== 'norrköping' && form.city.toLowerCase() !== 'norrkoping') {
      addToast('Events must be located in Norrköping.', 'error'); return;
    }

    const startDateTime = new Date(`${form.startDate}T${form.startTime}`).toISOString();
    const endDateTime = form.endDate ? new Date(`${form.endDate}T${form.endTime}`).toISOString() : undefined;

    const now = new Date().toISOString();
    const priceVal = form.isFree ? 0 : (parseFloat(form.price) || 0);

    const base = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      venue: form.venue.trim(),
      address: form.address.trim(),
      city: 'Norrköping',
      startDateTime,
      endDateTime,
      isFree: form.isFree,
      price: priceVal,
      coordinates: { lat: parseFloat(form.lat) || 58.5877, lng: parseFloat(form.lng) || 16.1924 },
      isDemo: false,
      status: 'published' as const,
      source: 'student' as const,
      organizer: 'Alex Lindqvist',
      organizerType: 'student' as const,
      indoor: true,
    };

    if (editingEvent) {
      updateEvent({ ...editingEvent, ...base, updatedAt: now });
      addToast('Event updated successfully.', 'success');
    } else {
      addEvent({ ...base, id: `evt-${Date.now()}`, createdAt: now, updatedAt: now });
      addToast('Event created and published.', 'success');
    }
    setShowForm(false);
    setEditingEvent(null);
    setForm(emptyForm());
  };

  const handleEdit = (event: Event) => {
    const d = new Date(event.startDateTime);
    setForm({
      title: event.title, description: event.description || '',
      category: event.category, venue: event.venue || '', address: event.address || '',
      city: event.city, startDate: d.toISOString().slice(0, 10),
      startTime: d.toTimeString().slice(0, 5),
      endDate: event.endDateTime ? new Date(event.endDateTime).toISOString().slice(0, 10) : '',
      endTime: event.endDateTime ? new Date(event.endDateTime).toTimeString().slice(0, 5) : '21:00',
      isFree: event.isFree ?? true, price: event.price?.toString() || '',
      maxAttendees: '',
      lat: event.coordinates?.lat?.toString() || '58.5877',
      lng: event.coordinates?.lng?.toString() || '16.1924',
    });
    setEditingEvent(event);
    setShowForm(true);
    setSelectedEvent(null);
  };

  const handleDelete = (event: Event) => {
    if (!confirm(`Delete "${event.title}"?`)) return;
    deleteEvent(event.id);
    if (selectedEvent?.id === event.id) setSelectedEvent(null);
    addToast('Event deleted.', 'info');
  };

  const handleSave = (event: Event) => {
    const wasSaved = isEventSaved(event.id);
    toggleSaveEvent(event.id);
    addToast(wasSaved ? 'Event removed from saved.' : 'Event saved!', wasSaved ? 'info' : 'success');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-main)' }}>
      <StudentNav />

      {/* Leaflet CSS */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

      <div style={{ display: 'flex', height: 'calc(100vh - 60px)', position: 'relative' }}>
        {/* Left panel: list */}
        <div style={{
          width: 380, flexShrink: 0,
          display: 'flex', flexDirection: 'column',
          background: 'var(--color-bg-main)',
          borderRight: '1px solid var(--border-neutral)',
          overflowY: 'auto',
        }}>
          {/* Panel header */}
          <div style={{ padding: '20px 18px 14px', borderBottom: '1px solid var(--border-neutral)', position: 'sticky', top: 0, background: 'var(--color-bg-main)', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h1 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>Events in Norrköping</h1>
              <button onClick={() => { setShowForm(true); setEditingEvent(null); setForm(emptyForm()); }} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', borderRadius: 'var(--radius-md)',
                background: 'var(--color-accent-teal)', color: '#fff',
                border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
                fontFamily: 'var(--font-stack)',
              }}>
                <Plus size={14} /> Add event
              </button>
            </div>
            <div style={{ position: 'relative', marginBottom: 10 }}>
              <Search size={14} color="var(--color-text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search events..."
                style={{ width: '100%', padding: '7px 10px 7px 30px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-neutral)', background: 'var(--surface-elevated)', fontSize: '0.86rem', color: 'var(--color-text-primary)', fontFamily: 'var(--font-stack)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button onClick={() => setActiveCategory('all')} style={chipStyle(activeCategory === 'all', '#4F79E8')}>All</button>
              {ALL_CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={chipStyle(activeCategory === cat, categoryColors[cat])}>
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Event list */}
          <div style={{ flex: 1, padding: '10px 14px' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <div style={{ fontSize: '1.4rem', marginBottom: 8 }}>📅</div>
                <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>No events found</div>
                <button onClick={() => { setQuery(''); setActiveCategory('all'); }} style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--color-accent-teal)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-stack)' }}>Clear filters</button>
              </div>
            ) : filtered.map(event => {
              const isSelected = selectedEvent?.id === event.id;
              const isSaved = isEventSaved(event.id);
              return (
                <div key={event.id}
                  onClick={() => setSelectedEvent(isSelected ? null : event)}
                  style={{
                    padding: '13px 14px', marginBottom: 8, borderRadius: 'var(--radius-lg)',
                    background: isSelected ? 'rgba(60,158,150,0.07)' : 'var(--surface-elevated)',
                    border: `1px solid ${isSelected ? 'rgba(60,158,150,0.28)' : 'var(--border-neutral)'}`,
                    cursor: 'pointer', transition: 'all var(--transition-base)',
                    boxShadow: isSelected ? 'var(--shadow-2)' : 'var(--shadow-1)',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${categoryColors[event.category]}cc, ${categoryColors[event.category]}66)`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                      {event.coverImage ? <img src={event.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} /> : null}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-text-primary)', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.76rem', color: 'var(--color-text-muted)', marginBottom: 2 }}>
                        <Calendar size={11} /> {formatDateShort(event.startDateTime)} · {formatTime(event.startDateTime)}
                      </div>
                      {event.venue && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                          <MapPin size={11} /> {event.venue}
                        </div>
                      )}
                    </div>
                    <button onClick={e => { e.stopPropagation(); handleSave(event); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: isSaved ? 'var(--color-accent-teal)' : 'var(--color-text-muted)', flexShrink: 0, marginTop: -2 }}>
                      {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                  </div>
                  {event.isFree !== undefined && (
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {event.isFree ? (
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(38,134,107,0.1)', color: 'var(--color-success)', borderRadius: 'var(--radius-pill)', fontWeight: 600 }}>Free</span>
                      ) : (
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(217,164,91,0.12)', color: 'var(--color-accent-amber)', borderRadius: 'var(--radius-pill)', fontWeight: 600 }}>{event.price ? `${event.price} SEK` : 'Paid'}</span>
                      )}
                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: `${categoryColors[event.category]}18`, color: categoryColors[event.category], borderRadius: 'var(--radius-pill)', fontWeight: 600 }}>{CATEGORY_LABELS[event.category]}</span>
                      {event.isDemo && <span className="demo-badge">DEMO</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Map */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          {!leafletLoaded && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-secondary)', zIndex: 5 }}>
              <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <MapPin size={28} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                <div style={{ fontSize: '0.88rem' }}>Loading map…</div>
              </div>
            </div>
          )}

          {/* Event detail overlay */}
          {selectedEvent && (
            <div style={{
              position: 'absolute', bottom: 20, right: 20, width: 320, zIndex: 900,
              background: 'var(--surface-elevated)', borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-neutral)', boxShadow: '0 16px 48px rgba(20,30,45,0.16)',
              overflow: 'hidden',
            }}>
              {/* Color stripe */}
              <div style={{ height: 5, background: `linear-gradient(90deg, ${categoryColors[selectedEvent.category]}, ${categoryColors[selectedEvent.category]}99)` }} />
              <div style={{ padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-primary)', marginBottom: 3 }}>{selectedEvent.title}</div>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: `${categoryColors[selectedEvent.category]}18`, color: categoryColors[selectedEvent.category], borderRadius: 'var(--radius-pill)', fontWeight: 600 }}>{CATEGORY_LABELS[selectedEvent.category]}</span>
                  </div>
                  <button onClick={() => setSelectedEvent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-text-muted)', marginTop: -4, marginRight: -4 }}>
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                    <Calendar size={13} color="var(--color-accent-teal)" />
                    {formatEventDate(selectedEvent.startDateTime, selectedEvent.endDateTime)}
                  </div>
                  {selectedEvent.venue && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                      <MapPin size={13} color="var(--color-accent-teal)" />
                      {selectedEvent.venue}{selectedEvent.address ? `, ${selectedEvent.address}` : ''}
                    </div>
                  )}
                </div>

                {selectedEvent.description && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {selectedEvent.description}
                  </p>
                )}

                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleSave(selectedEvent)} style={{
                    flex: 1, padding: '8px', borderRadius: 'var(--radius-md)',
                    background: isEventSaved(selectedEvent.id) ? 'rgba(60,158,150,0.1)' : 'var(--color-bg-secondary)',
                    border: `1px solid ${isEventSaved(selectedEvent.id) ? 'rgba(60,158,150,0.3)' : 'var(--border-neutral)'}`,
                    color: isEventSaved(selectedEvent.id) ? 'var(--color-accent-teal)' : 'var(--color-text-secondary)',
                    cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', fontFamily: 'var(--font-stack)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                    {isEventSaved(selectedEvent.id) ? <><BookmarkCheck size={14} /> Saved</> : <><Bookmark size={14} /> Save</>}
                  </button>
                  {selectedEvent.source === 'student' && (
                    <>
                      <button onClick={() => handleEdit(selectedEvent)} style={{ flex: 1, padding: '8px', borderRadius: 'var(--radius-md)', background: 'rgba(79,121,232,0.1)', border: '1px solid rgba(79,121,232,0.2)', color: 'var(--color-accent-blue)', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', fontFamily: 'var(--font-stack)' }}>Edit</button>
                      <button onClick={() => handleDelete(selectedEvent)} style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(226,126,114,0.1)', border: '1px solid rgba(226,126,114,0.2)', color: 'var(--color-accent-coral)', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', fontFamily: 'var(--font-stack)' }}>Delete</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit form modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,16,24,0.5)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{
            width: '100%', maxWidth: 540, maxHeight: '90vh',
            background: 'var(--surface-elevated)', borderRadius: 'var(--radius-2xl)',
            boxShadow: '0 24px 64px rgba(10,16,24,0.28)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}
            className="animate-modal-in">
            <div style={{ padding: '22px 26px 16px', borderBottom: '1px solid var(--border-neutral)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>
                {editingEvent ? 'Edit event' : 'Create a new event'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditingEvent(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 26px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(79,121,232,0.07)', border: '1px solid rgba(79,121,232,0.13)' }}>
                  <Info size={13} color="var(--color-accent-blue)" />
                  <span style={{ fontSize: '0.76rem', color: 'var(--color-accent-blue)' }}>Events must be in Norrköping. This is a demo — data is stored locally.</span>
                </div>

                <label style={labelStyle}>
                  <span style={labelTextStyle}>Event title *</span>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Student Summer Barbecue" style={formInputStyle} />
                </label>

                <label style={labelStyle}>
                  <span style={labelTextStyle}>Category</span>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as EventCategory }))} style={formInputStyle}>
                    {ALL_CATEGORIES.map(cat => <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>)}
                  </select>
                </label>

                <label style={labelStyle}>
                  <span style={labelTextStyle}>Description</span>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="What will happen at this event?" style={{ ...formInputStyle, resize: 'vertical', lineHeight: 1.6 }} />
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <label style={labelStyle}>
                    <span style={labelTextStyle}>Start date *</span>
                    <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} style={formInputStyle} />
                  </label>
                  <label style={labelStyle}>
                    <span style={labelTextStyle}>Start time</span>
                    <input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} style={formInputStyle} />
                  </label>
                  <label style={labelStyle}>
                    <span style={labelTextStyle}>End date</span>
                    <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} style={formInputStyle} />
                  </label>
                  <label style={labelStyle}>
                    <span style={labelTextStyle}>End time</span>
                    <input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} style={formInputStyle} />
                  </label>
                </div>

                <label style={labelStyle}>
                  <span style={labelTextStyle}>Venue name *</span>
                  <input value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} placeholder="e.g. Kollektivet Campus Hub" style={formInputStyle} />
                </label>

                <label style={labelStyle}>
                  <span style={labelTextStyle}>Address</span>
                  <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Street address" style={formInputStyle} />
                </label>

                <label style={labelStyle}>
                  <span style={labelTextStyle}>City *</span>
                  <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} style={formInputStyle} />
                </label>

                <div>
                  <div style={labelTextStyle as React.CSSProperties}>Admission</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                    <button type="button" onClick={() => setForm(f => ({ ...f, isFree: true }))} style={{ ...toggleBtnStyle(form.isFree, '#26866B') }}>Free</button>
                    <button type="button" onClick={() => setForm(f => ({ ...f, isFree: false }))} style={{ ...toggleBtnStyle(!form.isFree, '#D9A45B') }}>Paid</button>
                  </div>
                  {!form.isFree && (
                    <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="Price in SEK" type="number" min="0" style={{ ...formInputStyle, marginTop: 8 }} />
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <label style={labelStyle}>
                    <span style={labelTextStyle}>Map latitude</span>
                    <input value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))} style={formInputStyle} />
                  </label>
                  <label style={labelStyle}>
                    <span style={labelTextStyle}>Map longitude</span>
                    <input value={form.lng} onChange={e => setForm(f => ({ ...f, lng: e.target.value }))} style={formInputStyle} />
                  </label>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 26px 22px', borderTop: '1px solid var(--border-neutral)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowForm(false); setEditingEvent(null); }} style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-neutral)', background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', fontFamily: 'var(--font-stack)' }}>Cancel</button>
              <button onClick={handleCreateOrUpdate} style={{ padding: '10px 22px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--color-accent-teal)', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem', fontFamily: 'var(--font-stack)' }}>
                {editingEvent ? 'Save changes' : 'Create event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 5 };
const labelTextStyle = { fontSize: '0.76rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '0.07em' };
const formInputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px',
  borderRadius: 'var(--radius-md)', border: '1px solid var(--border-neutral)',
  background: 'var(--color-bg-main)', color: 'var(--color-text-primary)',
  fontSize: '0.9rem', fontFamily: 'var(--font-stack)', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 150ms',
};
const chipStyle = (active: boolean, color: string): React.CSSProperties => ({
  padding: '4px 10px', borderRadius: 'var(--radius-pill)', fontSize: '0.74rem',
  border: `1px solid ${active ? color : 'var(--border-neutral)'}`,
  background: active ? `${color}18` : 'var(--surface-elevated)',
  color: active ? color : 'var(--color-text-muted)',
  fontWeight: active ? 600 : 400, cursor: 'pointer', fontFamily: 'var(--font-stack)',
  transition: 'all 150ms',
});
const toggleBtnStyle = (active: boolean, color: string): React.CSSProperties => ({
  padding: '7px 18px', borderRadius: 'var(--radius-md)',
  border: `1px solid ${active ? color : 'var(--border-neutral)'}`,
  background: active ? `${color}18` : 'var(--color-bg-secondary)',
  color: active ? color : 'var(--color-text-muted)',
  fontWeight: active ? 600 : 400, cursor: 'pointer', fontFamily: 'var(--font-stack)',
  fontSize: '0.86rem', transition: 'all 150ms',
});
