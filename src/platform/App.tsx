import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './views/Login';
import Register from './views/Register';
import ForgotPassword from './views/ForgotPassword';
import ResetPassword from './views/ResetPassword';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminDashboard from './views/admin/AdminDashboard';
import AdminPatients from './views/admin/AdminPatients';
import AdminSchedule from './views/admin/AdminSchedule';
import AdminSettings from './views/admin/AdminSettings';
import AdminFinancial from './views/admin/AdminFinancial';
import PatientDetail from './views/admin/PatientDetail';
import PatientDashboard from './views/patient/PatientDashboard';
import AnamnesisForm from './views/patient/AnamnesisForm';
import PatientReports from './views/patient/PatientReports';
import PatientLibrary from './views/patient/PatientLibrary';
import PatientProfile from './views/patient/PatientProfile';
import PatientFinancial from './views/patient/PatientFinancial';
import { ToastProvider } from './context/ToastContext';
import { UserRole } from './types';

const AppRoutes: React.FC = () => {
  const { user, isLoading, recoveryMode } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (recoveryMode) {
    return (
      <Routes>
        <Route path="*" element={<ResetPassword />} />
      </Routes>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<DashboardLayout currentUser={user} />}>
        {/* Admin Routes */}
        {user.role === UserRole.ADMIN && (
          <>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/patients" element={<AdminPatients />} />
            <Route path="admin/patients/:id" element={<PatientDetail />} />
            <Route path="admin/schedule" element={<AdminSchedule />} />
            <Route path="admin/financial" element={<AdminFinancial />} />
            <Route path="admin/settings" element={<AdminSettings />} />
            <Route path="/" element={<Navigate to="/area-cliente/admin" replace />} />
          </>
        )}

        {/* Patient Routes */}
        {user.role === UserRole.PATIENT && (
          <>
            <Route path="patient" element={<PatientDashboard />} />
            <Route path="patient/anamnesis" element={<AnamnesisForm />} />
            <Route path="patient/reports" element={<PatientReports />} />
            <Route path="patient/library" element={<PatientLibrary />} />
            <Route path="patient/financial" element={<PatientFinancial />} />
            <Route path="patient/profile" element={<PatientProfile />} />
            <Route path="/" element={<Navigate to="/area-cliente/patient" replace />} />
          </>
        )}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/area-cliente" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;