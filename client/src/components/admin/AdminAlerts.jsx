import React, { useState, useEffect } from 'react';

const AdminAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [alertRules, setAlertRules] = useState([]);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [activeTab, setActiveTab] = useState('alerts');
  const [newRule, setNewRule] = useState({
    name: '',
    type: 'phishing_rate',
    threshold: '',
    severity: 'medium',
    enabled: true
  });

  // Mock data
  const mockAlerts = [
    {
      id: '1',
      title: 'High Phishing Rate Detected',
      message: 'Phishing detection rate exceeded 15% in the last hour',
      severity: 'high',
      timestamp: '2024-01-15T14:30:00Z',
      acknowledged: false,
      source: 'System Monitor'
    },
    {
      id: '2',
      title: 'Suspicious Domain Pattern',
      message: 'Multiple scans detected for domain: suspicious-bank-login.com',
      severity: 'medium',
      timestamp: '2024-01-15T13:45:00Z',
      acknowledged: true,
      source: 'Blacklist Rule'
    },
    {
      id: '3',
      title: 'High Risk Score Alert',
      message: 'URL with risk score 0.95+ detected: extremely-suspicious-site.net',
      severity: 'high',
      timestamp: '2024-01-15T12:20:00Z',
      acknowledged: false,
      source: 'Risk Threshold'
    }
  ];

  const mockAlertRules = [
    {
      id: '1',
      name: 'High Phishing Rate',
      type: 'phishing_rate',
      threshold: '15%',
      severity: 'high',
      enabled: true,
      created: '2024-01-01'
    },
    {
      id: '2',
      name: 'Domain Frequency',
      type: 'domain_frequency',
      threshold: '10 per hour',
      severity: 'medium',
      enabled: true,
      created: '2024-01-02'
    },
    {
      id: '3',
      name: 'High Risk Score',
      type: 'risk_threshold',
      threshold: '0.90',
      severity: 'high',
      enabled: false,
      created: '2024-01-03'
    }
  ];

  useEffect(() => {
    setAlerts(mockAlerts);
    setAlertRules(mockAlertRules);
  }, []);

  const handleCreateRule = (e) => {
    e.preventDefault();
    const rule = {
      id: Date.now().toString(),
      ...newRule,
      created: new Date().toISOString().split('T')[0]
    };
    setAlertRules(prev => [...prev, rule]);
    setShowRuleModal(false);
    setNewRule({ name: '', type: 'phishing_rate', threshold: '', severity: 'medium', enabled: true });
  };

  const handleToggleRule = (ruleId) => {
    setAlertRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const handleDeleteRule = (ruleId) => {
    if (window.confirm('Are you sure you want to delete this alert rule?')) {
      setAlertRules(prev => prev.filter(rule => rule.id !== ruleId));
    }
  };

  const handleAcknowledge = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const handleDeleteAlert = (alertId) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    }
  };

  const severityColors = {
    high: 'bg-red-500/20 text-red-400 border border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    low: 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
  };

  const severityBadges = {
    high: 'bg-red-500/10 text-red-400',
    medium: 'bg-yellow-500/10 text-yellow-400',
    low: 'bg-blue-500/10 text-blue-400'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Alert Management</h1>
          <p className="text-slate-400 mt-2">Configure alerts and manage security notifications</p>
        </div>
        <button
          onClick={() => setShowRuleModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Create Alert Rule</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl">
        <div className="border-b border-slate-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'alerts', label: 'Active Alerts', count: alerts.filter(a => !a.acknowledged).length },
              { id: 'rules', label: 'Alert Rules', count: alertRules.length }
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
          {activeTab === 'alerts' ? (
            /* Alerts List */
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No active alerts</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-xl border-l-4 ${
                    alert.severity === 'high' ? 'border-red-500 bg-red-900/10' :
                    alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-900/10' :
                    'border-blue-500 bg-blue-900/10'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-white">{alert.title}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${severityColors[alert.severity]}`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          {!alert.acknowledged && (
                            <span className="px-2 py-1 text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full">
                              UNACKNOWLEDGED
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300 mb-3">{alert.message}</p>
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <span>Source: {alert.source}</span>
                          <span>•</span>
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {!alert.acknowledged && (
                          <button
                            onClick={() => handleAcknowledge(alert.id)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-all duration-200"
                          >
                            Acknowledge
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-all duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Alert Rules */
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-750">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Rule Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Threshold</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Severity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {alertRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-slate-750/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{rule.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          {rule.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {rule.threshold}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${severityBadges[rule.severity]}`}>
                          {rule.severity}
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
                        {rule.created}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleToggleRule(rule.id)}
                            className={`${
                              rule.enabled 
                                ? 'text-red-400 hover:text-red-300' 
                                : 'text-green-400 hover:text-green-300'
                            }`}
                          >
                            {rule.enabled ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => handleDeleteRule(rule.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Rule Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowRuleModal(false)}>
              <div className="absolute inset-0 bg-black bg-opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-slate-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-700">
              <div className="px-6 py-4 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white">Create Alert Rule</h3>
              </div>
              
              <form onSubmit={handleCreateRule} className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Rule Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newRule.name}
                    onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter rule name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Alert Type
                  </label>
                  <select
                    value={newRule.type}
                    onChange={(e) => setNewRule(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="phishing_rate">Phishing Rate Spike</option>
                    <option value="domain_frequency">Domain Frequency</option>
                    <option value="risk_threshold">High Risk Score</option>
                    <option value="model_performance">Model Performance</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Threshold
                  </label>
                  <input
                    type="text"
                    required
                    value={newRule.threshold}
                    onChange={(e) => setNewRule(prev => ({ ...prev, threshold: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter threshold value"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Severity Level
                  </label>
                  <select
                    value={newRule.severity}
                    onChange={(e) => setNewRule(prev => ({ ...prev, severity: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rule-enabled"
                    checked={newRule.enabled}
                    onChange={(e) => setNewRule(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded"
                  />
                  <label htmlFor="rule-enabled" className="ml-2 block text-sm text-slate-300">
                    Enable rule immediately
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRuleModal(false)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
                  >
                    Create Rule
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

export default AdminAlerts;