import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PWAInstallProvider } from './context/PWAInstallContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import JobsMarketplace from './pages/JobsMarketplace';
import CreateJob from './pages/CreateJob';
import MyJobs from './pages/MyJobs';
import MyApplications from './pages/MyApplications';
import EscrowTransactions from './pages/EscrowTransactions';
import TransactionHistory from './pages/TransactionHistory';
import Messages from './pages/Messages';
import ProtectedRoute from './components/ProtectedRoute';
import InstallPrompt from './components/InstallPrompt';
import { ROLES } from './constants/roles';

function App() {
  return (
    <AuthProvider>
      <PWAInstallProvider>
      {/* PWA install banner — shown when browser fires beforeinstallprompt */}
      <InstallPrompt />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.CLIENT, ROLES.FREELANCER]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute allowedRoles={[ROLES.FREELANCER]}>
                <JobsMarketplace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/create"
            element={
              <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
                <CreateJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/my"
            element={
              <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
                <MyJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/applied"
            element={
              <ProtectedRoute allowedRoles={[ROLES.FREELANCER]}>
                <MyApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/escrow"
            element={
              <ProtectedRoute allowedRoles={[ROLES.CLIENT, ROLES.FREELANCER]}>
                <EscrowTransactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute allowedRoles={[ROLES.CLIENT, ROLES.FREELANCER]}>
                <TransactionHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute allowedRoles={[ROLES.CLIENT, ROLES.FREELANCER]}>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole={ROLES.ADMIN}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      </PWAInstallProvider>
    </AuthProvider>
  );
}

export default App;
