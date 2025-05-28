import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import ParticipantManagement from './pages/ParticipantManagement';
import SoftwareList from './pages/software/SoftwareList';
import SoftwareForm from './pages/software/SoftwareForm';
import SoftwareDetail from './pages/software/SoftwareDetail';
import StandardManagement from './pages/StandardManagement';
import ParameterManagement from './pages/ParameterManagement';
import SubcategoryManagement from './pages/SubcategoryManagement';
import ClassificationManagement from './pages/ClassificationManagement';
import EvaluationManagement from './pages/EvaluationManagement';
import EvaluationProcess from './pages/EvaluationProcess';
import './App.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/users" element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          } />
          <Route path="/participants" element={
            <AdminRoute>
              <ParticipantManagement />
            </AdminRoute>
          } />
          <Route path="/software" element={
            <ProtectedRoute>
              <SoftwareList />
            </ProtectedRoute>
          } />
          <Route path="/software/new" element={
            <ProtectedRoute>
              <SoftwareForm />
            </ProtectedRoute>
          } />
          <Route path="/software/:id" element={
            <ProtectedRoute>
              <SoftwareDetail />
            </ProtectedRoute>
          } />
          <Route path="/software/:id/edit" element={
            <ProtectedRoute>
              <SoftwareForm />
            </ProtectedRoute>
          } />
          <Route path="/standards" element={
            <AdminRoute>
              <StandardManagement />
            </AdminRoute>
          } />
          <Route path="/standards/:standardId/parameters" element={
            <AdminRoute>
              <ParameterManagement />
            </AdminRoute>
          } />
          <Route path="/parameters/:parameterId/subcategories" element={
            <AdminRoute>
              <SubcategoryManagement />
            </AdminRoute>
          } />
          <Route path="/classifications" element={
            <AdminRoute>
              <ClassificationManagement />
            </AdminRoute>
          } />
          <Route path="/evaluations" element={
            <ProtectedRoute>
              <EvaluationManagement />
            </ProtectedRoute>
          } />
          <Route path="/evaluations/process/:softwareId/:standardId" element={
            <ProtectedRoute>
              <EvaluationProcess />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;