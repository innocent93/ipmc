import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider, useAdmin } from './context/AdminAuth';
import AdminLayout from './components/Layout';
import AdminLogin from './pages/AdminLogin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import BlogManager from './pages/BlogManager';
import ServiceManager from './pages/ServiceManager';
import TeamManager from './pages/TeamManager';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import Sessions from './pages/Sessions';
import Toast from './components/UI/Toast';
import { useToast } from './hooks/useToast';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAdmin();
  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
}

function AdminRoutes() {
  const { toasts, addToast, removeToast } = useToast();
  return (
    <AdminLayout>
      <Toast toasts={toasts} removeToast={removeToast} />
      <Routes>
        <Route path="/" element={<Dashboard addToast={addToast} />} />
        <Route path="/blog" element={<BlogManager addToast={addToast} />} />
        <Route path="/services" element={<ServiceManager addToast={addToast} />} />
        <Route path="/team" element={<TeamManager addToast={addToast} />} />
        <Route path="/messages" element={<Messages addToast={addToast} />} />
        <Route path="/settings" element={<Settings addToast={addToast} />} />
        <Route path="/sessions" element={<Sessions addToast={addToast} />} />
      </Routes>
    </AdminLayout>
  );
}

function App() {
  return (
    <Router>
      <AdminProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/reset-password/:token" element={<ResetPassword />} />
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminRoutes />
            </ProtectedRoute>
          } />
          {/* Anything else \u2014 unknown path \u2014 back to the login gate rather
              than a blank screen */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AdminProvider>
    </Router>
  );
}

export default App;
