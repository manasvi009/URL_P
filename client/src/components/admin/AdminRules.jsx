import React, { useState, useEffect } from 'react';

const AdminRules = () => {
  const [activeTab, setActiveTab] = useState('blacklist');
  const [blacklist, setBlacklist] = useState([]);
  const [whitelist, setWhitelist] = useState([]);
  const [customRules, setCustomRules] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRule, setNewRule] = useState({
    type: 'domain',
    pattern: '',
    enabled: true,
    description: ''
  });

  // Mock data
  const mockBlacklist = [
    { id: '1', pattern: 'suspicious-bank-login.com', type: 'domain', enabled: true, added: '2024-01-10' },
    { id: '2', pattern: '*.phishing-site.net', type: 'wildcard', enabled: true, added: '2024-01-08' },
    { id: '3', pattern: '192.168.1.100', type: 'ip', enabled: false, added: '2024-01-05' }
  ];

  const mockWhitelist = [
    { id: '1', pattern: 'google.com', type: 'domain', enabled: true, added: '2024-01-01' },
    { id: '2', pattern: 'microsoft.com', type: 'domain', enabled: true, added: '2024-01-02' },
    { id: '3', pattern: 'github.com', type: 'domain', enabled: true, added: '2024-01-03' }
  ];

  const mockCustomRules = [
    { 
      id: '1', 
      name: 'Suspicious Keywords',
      description: 'Block URLs containing known phishing keywords',
      type: 'content',
      pattern: 'verify|confirm|secure|account|login|signin',
      enabled: true,
      added: '2024-01-05'
    },
    {
      id: '2',
      name: 'Short Domain Age',
      description: 'Flag domains registered less than 30 days ago',
      type: 'metadata',
      pattern: 'domain_age < 30',
      enabled: true,
      added: '2024-01-07'
    }
  ];

  useEffect(() => {
    setBlacklist(mockBlacklist);
    setWhitelist(mockWhitelist);
    setCustomRules(mockCustomRules);
  }, []);

  const handleAddRule = (e) => {
    e.preventDefault();
    const rule = {
      id: Date.now().toString(),
      ...newRule,
      added: new Date().toISOString().split('T')[0]
    };

    if (activeTab === 'blacklist') {
      setBlacklist(prev => [...prev, rule]);
    } else if (activeTab === 'whitelist') {
      setWhitelist(prev => [...prev, rule]);
    } else {
      setCustomRules(prev => [...prev, rule]);
    }

    setShowAddModal(false);
    setNewRule({ type: 'domain', pattern: '', enabled: true, description: '' });
  };

  const handleToggleRule = (id, list) => {
    const updateList = (items) => 
      items.map(item => 
        item.id === id ? { ...item, enabled: !item.enabled } : item
      );

    switch (list) {
      case 'blacklist': setBlacklist(prev => updateList(prev)); break;
      case 'whitelist': setWhitelist(prev => updateList(prev)); break;
      case 'custom': setCustomRules(prev => updateList(prev)); break;
    }
  };

  const handleDeleteRule = (id, list) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      switch (list) {
        case 'blacklist': setBlacklist(prev => prev.filter(item => item.id !== id)); break;
        case 'whitelist': setWhitelist(prev => prev.filter(item => item.id !== id)); break;
        case 'custom': setCustomRules(prev => prev.filter(item => item.id !== id)); break;
      }
    }
  };

  const getRulesList = () => {
    switch (activeTab) {
      case 'blacklist': return blacklist;
      case 'whitelist': return whitelist;
      case 'custom': return customRules;
      default: return [];
    }
  };

  const getCurrentList = () => {
    switch (activeTab) {
      case 'blacklist': return 'blacklist';
      case 'whitelist': return 'whitelist';
      case 'custom': return 'custom';
      default: return 'blacklist';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Rules Management</h1>
          <p className="text-slate-400 mt-2">Manage blacklist, whitelist, and custom detection rules</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Rule</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl">
        <div className="border-b border-slate-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'blacklist', label: 'Blacklist', count: blacklist.length },
              { id: 'whitelist', label: 'Whitelist', count: whitelist.length },
              { id: 'custom', label: 'Custom Rules', count: customRules.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 relative ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Rules Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-750">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Pattern</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Added</th>
                  {activeTab === 'custom' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Description</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {getRulesList().length === 0 ? (
                  <tr>
                    <td colSpan={activeTab === 'custom' ? 6 : 5} className="px-6 py-12 text-center text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>No rules configured</p>
                    </td>
                  </tr>
                ) : (
                  getRulesList().map((rule) => (
                    <tr key={rule.id} className="hover:bg-slate-750/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white font-mono">{rule.pattern}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          {rule.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          rule.enabled 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {rule.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {rule.added}
                      </td>
                      {activeTab === 'custom' && (
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {rule.description}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleToggleRule(rule.id, getCurrentList())}
                            className={`${
                              rule.enabled 
                                ? 'text-red-400 hover:text-red-300' 
                                : 'text-green-400 hover:text-green-300'
                            }`}
                          >
                            {rule.enabled ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => handleDeleteRule(rule.id, getCurrentList())}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowAddModal(false)}>
              <div className="absolute inset-0 bg-black bg-opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-slate-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-700">
              <div className="px-6 py-4 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white">Add New Rule</h3>
              </div>
              
              <form onSubmit={handleAddRule} className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Rule Type
                  </label>
                  <select
                    value={newRule.type}
                    onChange={(e) => setNewRule(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="domain">Domain</option>
                    <option value="wildcard">Wildcard Pattern</option>
                    <option value="ip">IP Address</option>
                    <option value="content">Content Pattern</option>
                    <option value="metadata">Metadata Rule</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Pattern
                  </label>
                  <input
                    type="text"
                    required
                    value={newRule.pattern}
                    onChange={(e) => setNewRule(prev => ({ ...prev, pattern: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter pattern..."
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    {newRule.type === 'domain' && 'Example: suspicious-site.com'}
                    {newRule.type === 'wildcard' && 'Example: *.phishing-domain.net'}
                    {newRule.type === 'ip' && 'Example: 192.168.1.100'}
                    {newRule.type === 'content' && 'Example: verify|confirm|secure'}
                    {newRule.type === 'metadata' && 'Example: domain_age < 30'}
                  </p>
                </div>
                
                {activeTab === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newRule.description}
                      onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      placeholder="Describe what this rule does..."
                    />
                  </div>
                )}
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={newRule.enabled}
                    onChange={(e) => setNewRule(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded"
                  />
                  <label htmlFor="enabled" className="ml-2 block text-sm text-slate-300">
                    Enable rule immediately
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
                  >
                    Add Rule
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

export default AdminRules;