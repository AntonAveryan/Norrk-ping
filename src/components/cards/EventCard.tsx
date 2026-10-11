import { MapPin, Clock, Bookmark, BookmarkCheck, Tag } from 'lucide-react';
import { type Event, type EventCategory } from '../../types';
import { formatDateShort, formatTime } from '../../lib/dates';

const categoryColors: Record<EventCategory, string> = {
  music: 'var(--cat-music)',
  culture: 'var(--cat-culture)',
  career: 'var(--cat-career)',
  sports: 'var(--cat-sports)',
  food: 'var(--cat-food)',
  workshop: 'var(--cat-workshop)',
  social: '#6D7480',
  outdoor: 'var(--cat-sports)',
};

const categoryLabels: Record<EventCategory, string> = {
  music: 'Music', culture: 'Culture', career: 'Career',
  sports: 'Sports', food: 'Food & Drink', workshop: 'Workshop',
  social: 'Social', outdoor: 'Outdoor',
};

const fallbackGradients: Record<EventCategory, string> = {
  music: 'linear-gradient(135deg, #E27E72 0%, #c0534a 100%)',
  culture: 'linear-gradient(135deg, #8C7ADB 0%, #6B5EC5 100%)',
  career: 'linear-gradient(135deg, #4F79E8 0%, #315FC9 100%)',
  sports: 'linear-gradient(135deg, #26866B 0%, #1d6453 100%)',
  food: 'linear-gradient(135deg, #D9A45B 0%, #bf8535 100%)',
  workshop: 'linear-gradient(135deg, #3C9E96 0%, #2c7870 100%)',
  social: 'linear-gradient(135deg, #9299A3 0%, #6D7480 100%)',
  outdoor: 'linear-gradient(135deg, #4a9e6b 0%, #2d7a52 100%)',
};

interface Props {
  event: Event;
  saved?: boolean;
  onToggleSave?: () => void;
  onSelect?: () => void;
  selected?: boolean;
}

export function EventCard({ event, saved, onToggleSave, onSelect, selected }: Props) {
  return (
    <div
      onClick={onSelect}
      style={{
        background: selected ? 'rgba(79,121,232,0.05)' : 'var(--surface-elevated)',
        border: `1px solid ${selected ? 'rgba(79,121,232,0.2)' : 'var(--border-neutral)'}`,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'all var(--transition-base)',
        boxShadow: selected ? '0 4px 20px rgba(79,121,232,0.1)' : 'var(--shadow-1)',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.boxShadow = 'var(--shadow-2)'; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.boxShadow = 'var(--shadow-1)'; }}
    >
      <div style={{
        height: 110,
        background: event.coverImage ? `url(${event.coverImage}) center/cover` : fallbackGradients[event.category],
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: '0.72rem', fontWeight: 700, padding: '3px 9px',
            background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)',
            color: '#fff', borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            <Tag size={10} />
            {categoryLabels[event.category]}
          </span>
        </div>
        <div style={{ position: 'absolute', top: 8, right: 8 }}>
          {event.isFree ? (
            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 9px', background: 'rgba(38,134,107,0.85)', color: '#fff', borderRadius: 999 }}>Free</span>
          ) : (
            <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '3px 9px', background: 'rgba(0,0,0,0.4)', color: '#fff', borderRadius: 999 }}>{event.priceLabel || `${event.price} SEK`}</span>
          )}
        </div>
        {onToggleSave && (
          <button onClick={e => { e.stopPropagation(); onToggleSave(); }} style={{
            position: 'absolute', bottom: 8, right: 8,
            background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: 6,
            cursor: 'pointer', color: saved ? '#FBBF24' : '#fff', display: 'flex', alignItems: 'center',
          }}>
            {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          </button>
        )}
      </div>

      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)', marginBottom: 6, lineHeight: 1.3 }}>
          {event.title}
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
            <Clock size={12} color={categoryColors[event.category]} />
            {formatDateShort(event.startDateTime)} · {formatTime(event.startDateTime)}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
          <MapPin size={11} /> {event.venue}
        </div>
        {event.isDemo && <span className="demo-badge" style={{ marginTop: 8, display: 'inline-flex' }}>Demo</span>}
      </div>
    </div>
  );
}
