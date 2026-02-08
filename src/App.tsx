import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './guards/ProtectedRoute';
import RoleGuard from './guards/RoleGuard';
import DashboardLayout from './components/DashboardLayout';

// Auth Pages
import Login from './pages/Login';
import VerifyOtp from './pages/VerifyOtp';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Dashboard Pages
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';

// Doctor Pages
import ViewPatients from './pages/ViewPatients';
import ViewPrescriptions from './pages/ViewPrescriptions';
import CreatePrescription from './pages/CreatePrescription';

// Configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                {/* Admin Routes */}
                <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Route>

                {/* Doctor Routes */}
                <Route element={<RoleGuard allowedRoles={['DOCTOR']} />}>
                  <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                  <Route path="/doctor/patients" element={<ViewPatients />} />
                  <Route path="/doctor/prescriptions" element={<ViewPrescriptions />} />
                  <Route path="/doctor/prescriptions/new" element={<CreatePrescription />} />
                </Route>

                {/* Patient Routes */}
                <Route element={<RoleGuard allowedRoles={['PATIENT']} />}>
                  <Route path="/patient/dashboard" element={<PatientDashboard />} />
                </Route>
              </Route>
            </Route>

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
