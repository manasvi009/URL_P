import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopbar from '../components/admin/AdminTopbar';
import AdminOverview from '../components/admin/AdminOverview';
import AdminScans from '../components/admin/AdminScans';
import AdminReports from '../components/admin/AdminReports';
import AdminUsers from '../components/admin/AdminUsers';
import AdminModels from '../components/admin/AdminModels';
import AdminRules from '../components/admin/AdminRules';
import AdminAlerts from '../components/admin/AdminAlerts';
import AdminAPIKeys from '../components/admin/AdminAPIKeys';
import AdminSettings from '../components/admin/AdminSettings';

const AdminPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Get user info from localStorage or API
    const token = localStorage.getItem('token');
    if (token) {
      // For now, we'll check if the user is the admin
      // In a real implementation, this would come from the backend
      const email = localStorage.getItem('user_email');
      setUser({
        id: 'admin-1',
        email: email || 'admin@cybershield.com',
        username: 'Admin User',
        role: email === 'admin@cybershield.com' ? 'admin' : 'user'
      });
    }
  }, []);

  // Check if user has admin role
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        currentPath={location.pathname}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          user={user}
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/overview" replace />} />
            <Route path="/overview" element={<AdminOverview />} />
            <Route path="/scans" element={<AdminScans />} />
            <Route path="/reports" element={<AdminReports />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/models" element={<AdminModels />} />
            <Route path="/rules" element={<AdminRules />} />
            <Route path="/alerts" element={<AdminAlerts />} />
            <Route path="/api-keys" element={<AdminAPIKeys />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;