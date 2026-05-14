import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import Applications from './pages/Applications';
import Internships from './pages/Internships';
import InternshipDetail from './pages/InternshipDetail';
import CreateInternship from './pages/CreateInternship';
import ManagePostings from './pages/ManagePostings';
import InternshipApplicants from './pages/InternshipApplicants';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/homepage" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected App Routes */}
          <Route path="/app" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="internships" element={<Internships />} />
            <Route path="internship/:id" element={<InternshipDetail />} />
            <Route path="create-internship" element={<CreateInternship />} />
            <Route path="manage-postings" element={<ManagePostings />} />
            <Route path="internship/:id/applicants" element={<InternshipApplicants />} />
            <Route path="applications" element={<Applications />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
