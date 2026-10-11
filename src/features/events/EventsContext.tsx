import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Event } from '../../types';
import { DEMO_EVENTS } from '../../data/events';
import { storage, STORAGE_KEYS } from '../../lib/storage';

interface EventsContextType {
  events: Event[];
  savedEventIds: string[];
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  toggleSaveEvent: (id: string) => void;
  isEventSaved: (id: string) => boolean;
}

const EventsContext = createContext<EventsContextType | null>(null);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [extraEvents, setExtraEvents] = useState<Event[]>(() =>
    storage.get<Event[]>(STORAGE_KEYS.studentEvents, [])
  );
  const [savedEventIds, setSavedEventIds] = useState<string[]>(() =>
    storage.get<string[]>(STORAGE_KEYS.savedEvents, [])
  );

  const allEvents = [...DEMO_EVENTS, ...extraEvents];

  useEffect(() => { storage.set(STORAGE_KEYS.studentEvents, extraEvents); }, [extraEvents]);
  useEffect(() => { storage.set(STORAGE_KEYS.savedEvents, savedEventIds); }, [savedEventIds]);

  const addEvent = (event: Event) => setExtraEvents(prev => [...prev, event]);
  const updateEvent = (event: Event) => {
    const isDemo = DEMO_EVENTS.some(e => e.id === event.id);
    if (isDemo) return;
    setExtraEvents(prev => prev.map(e => e.id === event.id ? event : e));
  };
  const deleteEvent = (id: string) => {
    setExtraEvents(prev => prev.filter(e => e.id !== id));
  };
  const toggleSaveEvent = (id: string) => {
    setSavedEventIds(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };
  const isEventSaved = (id: string) => savedEventIds.includes(id);

  return (
    <EventsContext.Provider value={{ events: allEvents, savedEventIds, addEvent, updateEvent, deleteEvent, toggleSaveEvent, isEventSaved }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error('useEvents must be used within EventsProvider');
  return ctx;
}
