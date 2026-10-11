import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

import { LandingPage } from '../pages/LandingPage';
import { AuthPage } from '../pages/AuthPage';
import { StudentDashboard } from '../pages/StudentDashboard';
import { StudentJobsPage } from '../pages/StudentJobsPage';
import { JobInformationPage } from '../pages/JobInformationPage';
import { StudentEventsPage } from '../pages/StudentEventsPage';
import { StudentHelpPage } from '../pages/StudentHelpPage';
import { StudentProfilePage } from '../pages/StudentProfilePage';
import { CompanyDashboard } from '../pages/CompanyDashboard';
import { CompanyJobsPage } from '../pages/CompanyJobsPage';
import { CompanyEventsPage } from '../pages/CompanyEventsPage';
import { CompanyProfilePage } from '../pages/CompanyProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';

function StudentGuard({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/auth?role=student" replace />;
  if (currentUser.role !== 'student') return <Navigate to="/company" replace />;
  return <>{children}</>;
}

function CompanyGuard({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/auth?role=company" replace />;
  if (currentUser.role !== 'company') return <Navigate to="/student" replace />;
  return <>{children}</>;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/student" element={<StudentGuard><StudentDashboard /></StudentGuard>} />
      <Route path="/student/jobs" element={<StudentGuard><StudentJobsPage /></StudentGuard>} />
      <Route path="/student/jobs/information" element={<StudentGuard><JobInformationPage /></StudentGuard>} />
      <Route path="/student/events" element={<StudentGuard><StudentEventsPage /></StudentGuard>} />
      <Route path="/student/help" element={<StudentGuard><StudentHelpPage /></StudentGuard>} />
      <Route path="/student/profile" element={<StudentGuard><StudentProfilePage /></StudentGuard>} />
      <Route path="/company" element={<CompanyGuard><CompanyDashboard /></CompanyGuard>} />
      <Route path="/company/jobs" element={<CompanyGuard><CompanyJobsPage /></CompanyGuard>} />
      <Route path="/company/events" element={<CompanyGuard><CompanyEventsPage /></CompanyGuard>} />
      <Route path="/company/profile" element={<CompanyGuard><CompanyProfilePage /></CompanyGuard>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
