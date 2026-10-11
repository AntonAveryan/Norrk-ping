import React, { useEffect, useRef } from 'react';
import { type Event, type EventCategory } from '../../types';

// Leaflet CSS must be loaded globally
const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

const categoryColors: Record<EventCategory, string> = {
  music: '#E27E72',
  culture: '#8C7ADB',
  career: '#4F79E8',
  sports: '#26866B',
  food: '#D9A45B',
  workshop: '#3C9E96',
  social: '#6D7480',
  outdoor: '#26866B',
};

interface Props {
  events: Event[];
  selectedEventId: string | null;
  onSelectEvent: (id: string) => void;
}

export function EventMap({ events, selectedEventId, onSelectEvent }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const [mapError, setMapError] = React.useState(false);

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }

    async function initMap() {
      try {
        const L = await import('leaflet');
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current, {
          center: [58.5893, 16.1770],
          zoom: 13,
          zoomControl: false,
        });

        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

      } catch (err) {
        setMapError(true);
      }
    }

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = {};
      }
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m: any) => m.remove());
    markersRef.current = {};

    import('leaflet').then(L => {
      events.forEach(event => {
        if (!event.coordinates) return;
        const color = categoryColors[event.category] || '#4F79E8';
        const isSelected = event.id === selectedEventId;

        const icon = L.divIcon({
          html: `<div style="width:${isSelected ? 18 : 14}px;height:${isSelected ? 18 : 14}px;border-radius:50%;background:${color};border:${isSelected ? 3 : 2}px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);transition:all 0.2s;"></div>`,
          className: '',
          iconSize: [isSelected ? 18 : 14, isSelected ? 18 : 14],
          iconAnchor: [isSelected ? 9 : 7, isSelected ? 9 : 7],
        });

        const marker = L.marker([event.coordinates!.lat, event.coordinates!.lng], { icon })
          .addTo(mapInstanceRef.current)
          .on('click', () => onSelectEvent(event.id));

        const catLabels: Record<string, string> = {
          music: 'Music', culture: 'Culture', career: 'Career',
          sports: 'Sports', food: 'Food & Drink', workshop: 'Workshop',
          social: 'Social', outdoor: 'Outdoor',
        };

        marker.bindPopup(`
          <div style="font-family:-apple-system,sans-serif;padding:2px;min-width:180px;">
            <div style="font-weight:700;font-size:0.88rem;margin-bottom:4px;color:#20242B;">${event.title}</div>
            <div style="font-size:0.76rem;color:#6D7480;margin-bottom:4px;">${event.venue}</div>
            <div style="display:inline-block;font-size:0.68rem;font-weight:700;padding:2px 8px;background:${color}22;color:${color};border-radius:999px;">${catLabels[event.category] || event.category}</div>
          </div>
        `, { maxWidth: 200, closeButton: true });

        markersRef.current[event.id] = marker;
      });
    });
  }, [events, selectedEventId, onSelectEvent]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedEventId) return;

    const event = events.find(e => e.id === selectedEventId);
    if (event?.coordinates) {
      import('leaflet').then(() => {
        map.panTo([event.coordinates!.lat, event.coordinates!.lng], { animate: true, duration: 0.5 });
        const marker = markersRef.current[selectedEventId];
        if (marker) {
          marker.openPopup();
        }
      });
    }
  }, [selectedEventId, events]);

  if (mapError) {
    return (
      <div style={{
        width: '100%', height: '100%',
        background: 'var(--color-bg-secondary)',
        borderRadius: 'var(--radius-xl)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 14, padding: 24, border: '1px solid var(--border-neutral)',
      }}>
        <div style={{ fontSize: '2rem' }}>🗺️</div>
        <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)', textAlign: 'center' }}>Map unavailable</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', textAlign: 'center', maxWidth: 240 }}>
          The interactive map could not load. Events are listed on the right.
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border-neutral)', boxShadow: 'var(--shadow-2)' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      {/* Map legend */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16, zIndex: 1000,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
        borderRadius: 12, padding: '10px 14px',
        border: '1px solid rgba(255,255,255,0.7)',
        boxShadow: '0 4px 16px rgba(20,30,45,0.1)',
      }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Categories</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px' }}>
          {[
            { color: '#E27E72', label: 'Music' },
            { color: '#8C7ADB', label: 'Culture' },
            { color: '#4F79E8', label: 'Career' },
            { color: '#26866B', label: 'Sports' },
            { color: '#D9A45B', label: 'Food' },
            { color: '#3C9E96', label: 'Workshop' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Attribution notice */}
      <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 999, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '3px 8px' }}>
        <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Live map — OpenStreetMap</span>
      </div>
    </div>
  );
}
