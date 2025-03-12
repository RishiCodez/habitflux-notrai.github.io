
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import PomodoroPage from './pages/PomodoroPage';
import PlannerPage from './pages/PlannerPage';
import AssistantPage from './pages/AssistantPage';
import SettingsPage from './pages/SettingsPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from 'sonner';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes - redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected routes - regular users and Google sign-in only */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/tasks" element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          } />
          <Route path="/planner" element={
            <ProtectedRoute>
              <PlannerPage />
            </ProtectedRoute>
          } />
          <Route path="/assistant" element={
            <ProtectedRoute>
              <AssistantPage />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          
          {/* Routes accessible to guests */}
          <Route path="/pomodoro" element={
            <ProtectedRoute guestAllowed={true}>
              <PomodoroPage />
            </ProtectedRoute>
          } />
          
          {/* Direct access to shared lists via URL path (/:listId) */}
          <Route path="/:listId" element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          } />
          
          {/* Fallback routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <Toaster />
        <SonnerToaster position="top-right" closeButton richColors />
      </AuthProvider>
    </Router>
  );
};

export default App;
