import React, { useState, useEffect } from 'react';

const AdminAPIKeys = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKey, setNewKey] = useState({
    name: '',
    permissions: ['read'],
    rate_limit: 1000
  });
  const [generatedKey, setGeneratedKey] = useState('');

  // Mock data
  const mockAPIKeys = [
    {
      id: '1',
      name: 'Production Integration',
      key: 'pk_live_********************************************************abc123',
      permissions: ['read', 'scan'],
      rate_limit: 1000,
      status: 'active',
      created: '2024-01-01T10:00:00Z',
      last_used: '2024-01-15T14:30:00Z',
      usage: { requests: 12450, limit: 50000 }
    },
    {
      id: '2',
      name: 'Development Testing',
      key: 'pk_test_********************************************************def456',
      permissions: ['read', 'scan', 'history'],
      rate_limit: 500,
      status: 'active',
      created: '2024-01-05T15:30:00Z',
      last_used: '2024-01-14T09:15:00Z',
      usage: { requests: 2340, limit: 10000 }
    },
    {
      id: '3',
      name: 'Monitoring Service',
      key: 'pk_monitor_********************************************************ghi789',
      permissions: ['read'],
      rate_limit: 2000,
      status: 'revoked',
      created: '2023-12-20T08:45:00Z',
      last_used: '2024-01-10T16:20:00Z',
      usage: { requests: 8760, limit: 30000 }
    }
  ];

  useEffect(() => {
    setApiKeys(mockAPIKeys);
  }, []);

  const handleCreateKey = (e) => {
    e.preventDefault();
    const key = `pk_${newKey.name.toLowerCase().replace(/\s+/g, '_')}_${Math.random().toString(36).substr(2, 32)}`;
    const newAPIKey = {
      id: Date.now().toString(),
      ...newKey,
      key: `${key.substring(0, 15)}********************************************************${key.substring(key.length - 6)}`,
      fullKey: key,
      status: 'active',
      created: new Date().toISOString(),
      last_used: null,
      usage: { requests: 0, limit: newKey.rate_limit * 30 } // Monthly limit
    };
    setApiKeys(prev => [...prev, newAPIKey]);
    setGeneratedKey(key);
    setNewKey({ name: '', permissions: ['read'], rate_limit: 1000 });
  };

  const handleRevokeKey = (keyId) => {
    if (window.confirm('Are you sure you want to revoke this API key?')) {
      setApiKeys(prev => prev.map(key => 
        key.id === keyId ? { ...key, status: 'revoked' } : key
      ));
    }
  };

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key.fullKey || key.key);
    // In a real app, you'd show a toast notification
  };

  const handleRegenerateKey = (keyId) => {
    if (window.confirm('Are you sure you want to regenerate this API key? The old key will be invalidated.')) {
      const newKey = `pk_${Math.random().toString(36).substr(2, 32)}`;
      setApiKeys(prev => prev.map(key => 
        key.id === keyId 
          ? { 
              ...key, 
              key: `${newKey.substring(0, 15)}********************************************************${newKey.substring(newKey.length - 6)}`,
              fullKey: newKey,
              created: new Date().toISOString(),
              last_used: null,
              usage: { ...key.usage, requests: 0 }
            }
          : key
      ));
    }
  };

  const permissionOptions = [
    { value: 'read', label: 'Read (View scans, history)' },
    { value: 'scan', label: 'Scan (Perform URL analysis)' },
    { value: 'history', label: 'History (Access scan history)' },
    { value: 'admin', label: 'Admin (Full access)' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">API Key Management</h1>
          <p className="text-slate-400 mt-2">Manage API keys for programmatic access to the platform</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Create API Key</span>
        </button>
      </div>

      {/* Generated Key Modal */}
      {generatedKey && (
        <div className="bg-green-900/20 border border-green-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-200 mb-2">API Key Generated Successfully</h3>
              <p className="text-green-300 text-sm">Make sure to copy your API key now. You won't be able to see it again!</p>
            </div>
            <button
              onClick={() => setGeneratedKey('')}
              className="text-green-400 hover:text-green-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-4 p-3 bg-slate-900 rounded-lg flex items-center justify-between">
            <code className="text-green-200 font-mono text-sm break-all">{generatedKey}</code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedKey);
                // Show toast notification
              }}
              className="ml-3 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {/* API Keys Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">API Keys ({apiKeys.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-750">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Key</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Rate Limit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Last Used</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {apiKeys.map((apiKey) => (
                <tr key={apiKey.id} className="hover:bg-slate-750/50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{apiKey.name}</div>
                    <div className="text-xs text-slate-400">
                      Created {new Date(apiKey.created).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <code className="text-sm text-slate-300 font-mono">{apiKey.key}</code>
                      <button
                        onClick={() => handleCopyKey(apiKey)}
                        className="ml-2 p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {apiKey.permissions.map((perm) => (
                        <span key={perm} className="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {apiKey.rate_limit}/hour
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      apiKey.status === 'active'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {apiKey.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-white">
                        {apiKey.usage.requests.toLocaleString()}
                      </div>
                      <div className="w-24 bg-slate-700 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min(100, (apiKey.usage.requests / apiKey.usage.limit) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        of {apiKey.usage.limit.toLocaleString()} limit
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {apiKey.last_used 
                      ? new Date(apiKey.last_used).toLocaleString()
                      : 'Never'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => handleCopyKey(apiKey)}
                        className="text-blue-400 hover:text-blue-300 text-left"
                      >
                        Copy Key
                      </button>
                      <button
                        onClick={() => handleRegenerateKey(apiKey.id)}
                        className="text-yellow-400 hover:text-yellow-300 text-left"
                      >
                        Regenerate
                      </button>
                      {apiKey.status === 'active' ? (
                        <button
                          onClick={() => handleRevokeKey(apiKey.id)}
                          className="text-red-400 hover:text-red-300 text-left"
                        >
                          Revoke
                        </button>
                      ) : (
                        <button className="text-slate-500 cursor-not-allowed text-left">
                          Revoked
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create API Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowCreateModal(false)}>
              <div className="absolute inset-0 bg-black bg-opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-slate-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-700">
              <div className="px-6 py-4 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white">Create New API Key</h3>
              </div>
              
              <form onSubmit={handleCreateKey} className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Key Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newKey.name}
                    onChange={(e) => setNewKey(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a descriptive name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Permissions
                  </label>
                  <div className="space-y-2">
                    {permissionOptions.map((option) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`perm-${option.value}`}
                          checked={newKey.permissions.includes(option.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewKey(prev => ({
                                ...prev,
                                permissions: [...prev.permissions, option.value]
                              }));
                            } else {
                              setNewKey(prev => ({
                                ...prev,
                                permissions: prev.permissions.filter(p => p !== option.value)
                              }));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded"
                        />
                        <label htmlFor={`perm-${option.value}`} className="ml-2 block text-sm text-slate-300">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Rate Limit (requests/hour)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={newKey.rate_limit}
                    onChange={(e) => setNewKey(prev => ({ ...prev, rate_limit: parseInt(e.target.value) }))}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
                  >
                    Generate Key
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAPIKeys;