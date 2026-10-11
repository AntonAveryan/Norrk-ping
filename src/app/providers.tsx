import { type ReactNode } from 'react';
import { AuthProvider } from '../features/auth/AuthContext';
import { JobsProvider } from '../features/jobs/JobsContext';
import { EventsProvider } from '../features/events/EventsContext';
import { ToastProvider } from '../hooks/useToast';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <JobsProvider>
          <EventsProvider>
            {children}
          </EventsProvider>
        </JobsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
