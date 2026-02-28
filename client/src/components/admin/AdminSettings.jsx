import React, { useState, useEffect } from 'react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    system: {
      mongo_status: 'connected',
      mongo_version: '6.0.0',
      llm_enabled: true,
      llm_provider: 'openai',
      default_threshold: 0.5
    },
    cors: {
      allowed_origins: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
      ]
    },
    security: {
      jwt_expiration: 1800,
      max_login_attempts: 5,
      rate_limit_enabled: true,
      rate_limit_requests: 100
    }
  });

  const [newOrigin, setNewOrigin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      // In a real implementation: await api.put('/admin/settings', settings);
      setTimeout(() => {
        setLoading(false);
        // Show success message
      }, 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setLoading(false);
    }
  };

  const handleAddOrigin = () => {
    if (newOrigin && !settings.cors.allowed_origins.includes(newOrigin)) {
      setSettings(prev => ({
        ...prev,
        cors: {
          ...prev.cors,
          allowed_origins: [...prev.cors.allowed_origins, newOrigin]
        }
      }));
      setNewOrigin('');
    }
  };

  const handleRemoveOrigin = (origin) => {
    setSettings(prev => ({
      ...prev,
      cors: {
        ...prev.cors,
        allowed_origins: prev.cors.allowed_origins.filter(o => o !== origin)
      }
    }));
  };

  const handleTestConnection = async () => {
    try {
      // In a real implementation: await api.get('/admin/test-connection');
      setSettings(prev => ({
        ...prev,
        system: {
          ...prev.system,
          mongo_status: 'connected'
        }
      }));
    } catch (error) {
      setSettings(prev => ({
        ...prev,
        system: {
          ...prev.system,
          mongo_status: 'disconnected'
        }
      }));
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `phishingai-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">System Settings</h1>
          <p className="text-slate-400 mt-2">Configure platform settings and system preferences</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportSettings}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export</span>
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-750/30 rounded-lg">
              <div>
                <p className="text-sm text-slate-300">MongoDB Connection</p>
                <p className="text-sm text-slate-500">Database service</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  settings.system.mongo_status === 'connected'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {settings.system.mongo_status}
                </span>
                <button
                  onClick={handleTestConnection}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-3 bg-slate-750/30 rounded-lg">
              <p className="text-sm text-slate-300">MongoDB Version</p>
              <p className="text-white font-mono">{settings.system.mongo_version}</p>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-750/30 rounded-lg">
              <div>
                <p className="text-sm text-slate-300">LLM Service</p>
                <p className="text-sm text-slate-500">AI explanations</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  settings.system.llm_enabled
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {settings.system.llm_enabled ? 'enabled' : 'disabled'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.system.llm_enabled}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      system: { ...prev.system, llm_enabled: e.target.checked }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            
            <div className="p-3 bg-slate-750/30 rounded-lg">
              <p className="text-sm text-slate-300">LLM Provider</p>
              <p className="text-white">{settings.system.llm_provider}</p>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Security Configuration</h2>
          
          <div className="space-y-4">
            <div className="p-3 bg-slate-750/30 rounded-lg">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Default Risk Threshold
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.system.default_threshold}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    system: { ...prev.system, default_threshold: parseFloat(e.target.value) }
                  }))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-white font-mono min-w-[50px]">
                  {settings.system.default_threshold.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                URLs with risk scores above this threshold will be flagged as phishing
              </p>
            </div>
            
            <div className="p-3 bg-slate-750/30 rounded-lg">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                JWT Expiration (seconds)
              </label>
              <input
                type="number"
                value={settings.security.jwt_expiration}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, jwt_expiration: parseInt(e.target.value) }
                }))}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="p-3 bg-slate-750/30 rounded-lg">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                value={settings.security.max_login_attempts}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, max_login_attempts: parseInt(e.target.value) }
                }))}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CORS Settings */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">CORS Configuration</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Allowed Origins
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newOrigin}
              onChange={(e) => setNewOrigin(e.target.value)}
              className="flex-1 bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
            <button
              onClick={handleAddOrigin}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
            >
              Add
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          {settings.cors.allowed_origins.map((origin, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-750/30 rounded-lg">
              <span className="text-white font-mono">{origin}</span>
              <button
                onClick={() => handleRemoveOrigin(origin)}
                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Rate Limiting */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Rate Limiting</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-750/30 rounded-lg">
            <div>
              <p className="text-sm text-slate-300">Rate Limiting</p>
              <p className="text-sm text-slate-500">Control API request limits</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.rate_limit_enabled}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, rate_limit_enabled: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {settings.security.rate_limit_enabled && (
            <div className="p-3 bg-slate-750/30 rounded-lg">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Requests per Hour
              </label>
              <input
                type="number"
                value={settings.security.rate_limit_requests}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, rate_limit_requests: parseInt(e.target.value) }
                }))}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;