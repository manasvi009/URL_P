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
import api from '../api/api';
import AdminAuditLogs from '../components/admin/AdminAuditLogs';

const AdminPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    api.get('/me')
      .then((res) => {
        setUser(res.data);
        localStorage.setItem('user_role', res.data?.role || 'user');
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const canAccessAdmin = ['analyst', 'admin', 'super_admin'].includes(user?.role);
  const canManageModels = ['admin', 'super_admin'].includes(user?.role);

  if (!canAccessAdmin) {
    return <Navigate to="/admin/login" replace />;
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
            <Route path="/reports/:id" element={<AdminReports />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/models" element={canManageModels ? <AdminModels /> : <Navigate to="/admin/overview" replace />} />
            <Route path="/rules" element={<AdminRules />} />
            <Route path="/alerts" element={<AdminAlerts />} />
            <Route path="/api-keys" element={<AdminAPIKeys />} />
            <Route path="/settings" element={<AdminSettings />} />
            <Route path="/audit" element={<AdminAuditLogs />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
