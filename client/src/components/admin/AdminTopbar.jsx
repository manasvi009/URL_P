import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminTopbar = ({ sidebarOpen, setSidebarOpen, user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('30d');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const dateRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
  ];

  const notifications = [
    {
      id: 1,
      title: 'High-risk scan detected',
      message: 'Phishing URL with risk score 0.95+ detected',
      time: '2 minutes ago',
      severity: 'high'
    },
    {
      id: 2,
      title: 'New user registered',
      message: 'New user account created',
      time: '1 hour ago',
      severity: 'medium'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="bg-slate-900 border-b border-slate-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Mobile menu button and search */}
        <div className="flex items-center space-x-4">
          <button
            className="lg:hidden text-slate-400 hover:text-white focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Search URL / domain / user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Right side - Date range, notifications, profile */}
        <div className="flex items-center space-x-4">
          {/* Date range selector */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-600 rounded-xl shadow-lg shadow-slate-900/50 z-50">
                <div className="p-4 border-b border-slate-700">
                  <h3 className="text-lg font-semibold text-white">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      <p>No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div key={notification.id} className="p-4 border-b border-slate-700 last:border-b-0 hover:bg-slate-750">
                        <div className="flex items-start">
                          <div className={`flex-shrink-0 mt-1 w-3 h-3 rounded-full ${
                            notification.severity === 'high' ? 'bg-red-500' :
                            notification.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}></div>
                          <div className="ml-3 flex-1">
                            <h4 className="text-sm font-medium text-white">{notification.title}</h4>
                            <p className="text-sm text-slate-300 mt-1">{notification.message}</p>
                            <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 border-t border-slate-700 text-center">
                  <button className="text-sm text-blue-400 hover:text-blue-300">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-800 transition-all duration-200"
              onClick={() => setShowProfile(!showProfile)}
            >
              <div className="bg-gradient-to-r from-blue-500 to-violet-600 rounded-full p-1">
                <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-sm font-bold text-slate-900">
                    {user?.username?.charAt(0) || 'A'}
                  </span>
                </div>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">{user?.username || 'Admin User'}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role || 'admin'}</p>
              </div>
            </button>

            {/* Profile dropdown menu */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-600 rounded-xl shadow-lg shadow-slate-900/50 z-50">
                <div className="p-4 border-b border-slate-700">
                  <div className="text-sm text-slate-300">
                    Signed in as<br/>
                    <span className="font-medium text-white">{user?.email || 'admin@example.com'}</span>
                  </div>
                </div>
                <div className="py-1">
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                    onClick={() => {
                      navigate('/settings');
                      setShowProfile(false);
                    }}
                  >
                    Profile Settings
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                    onClick={() => {
                      setShowProfile(false);
                    }}
                  >
                    System Health
                  </button>
                  <div className="border-t border-slate-700 my-1"></div>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300"
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside handler */}
      {(showNotifications || showProfile) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminTopbar;