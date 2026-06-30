import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import JobsMarketplace from './pages/JobsMarketplace';
import CreateJob from './pages/CreateJob';
import MyJobs from './pages/MyJobs';
import EscrowTransactions from './pages/EscrowTransactions';
import TransactionHistory from './pages/TransactionHistory';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/jobs" 
            element={
              <ProtectedRoute>
                <JobsMarketplace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/jobs/create" 
            element={
              <ProtectedRoute>
                <CreateJob />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/jobs/my" 
            element={
              <ProtectedRoute>
                <MyJobs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/escrow" 
            element={
              <ProtectedRoute>
                <EscrowTransactions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <TransactionHistory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
