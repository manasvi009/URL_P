import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const AdminScans = () => {
  const [scans, setScans] = useState([]);
  const [filteredScans, setFilteredScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScans, setSelectedScans] = useState([]);
  const [filters, setFilters] = useState({
    label: 'all',
    minRisk: 0,
    maxRisk: 1,
    domain: '',
    dateRange: '30d'
  });

  // Filter options
  const labelOptions = [
    { value: 'all', label: 'All Scans' },
    { value: 'phishing', label: 'Phishing Only' },
    { value: 'legitimate', label: 'Legitimate Only' }
  ];

  useEffect(() => {
    fetchScans();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [scans, filters]);

  const fetchScans = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/history?limit=100`);
      setScans(response.data);
    } catch (error) {
      console.error('Error fetching scans:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...scans];

    // Label filter
    if (filters.label !== 'all') {
      filtered = filtered.filter(scan => scan.label === filters.label);
    }

    // Risk score filter
    filtered = filtered.filter(scan => 
      scan.risk_score >= filters.minRisk && scan.risk_score <= filters.maxRisk
    );

    // Domain filter
    if (filters.domain) {
      filtered = filtered.filter(scan => 
        scan.url.toLowerCase().includes(filters.domain.toLowerCase())
      );
    }

    setFilteredScans(filtered);
  };

  const handleSelectScan = (scanId) => {
    setSelectedScans(prev => 
      prev.includes(scanId) 
        ? prev.filter(id => id !== scanId)
        : [...prev, scanId]
    );
  };

  const handleSelectAll = () => {
    if (selectedScans.length === filteredScans.length) {
      setSelectedScans([]);
    } else {
      setSelectedScans(filteredScans.map(scan => scan._id));
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedScans.length} selected scans?`)) return;
    
    try {
      // In a real implementation, you'd call a bulk delete API
      setScans(prev => prev.filter(scan => !selectedScans.includes(scan._id)));
      setSelectedScans([]);
    } catch (error) {
      console.error('Error deleting scans:', error);
    }
  };

  const handleBulkFalsePositive = async () => {
    if (!window.confirm(`Mark ${selectedScans.length} scans as false positive?`)) return;
    
    try {
      // In a real implementation, you'd call a bulk update API
      setScans(prev => prev.map(scan => 
        selectedScans.includes(scan._id) 
          ? { ...scan, label: 'legitimate', risk_score: Math.min(scan.risk_score, 0.3) }
          : scan
      ));
      setSelectedScans([]);
    } catch (error) {
      console.error('Error marking as false positive:', error);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Timestamp', 'URL', 'Domain', 'Label', 'Risk Score'],
      ...filteredScans.map(scan => [
        new Date(scan.timestamp).toISOString(),
        scan.url,
        new URL(scan.url).hostname,
        scan.label,
        scan.risk_score
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scans-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Scan Management</h1>
          <p className="text-slate-400 mt-2">Monitor and manage all URL scanning activity</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={fetchScans}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Label Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Label</label>
            <select
              value={filters.label}
              onChange={(e) => setFilters(prev => ({ ...prev, label: e.target.value }))}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {labelOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Risk Score Range */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Risk Score Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={filters.minRisk}
                onChange={(e) => setFilters(prev => ({ ...prev, minRisk: parseFloat(e.target.value) }))}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
              />
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={filters.maxRisk}
                onChange={(e) => setFilters(prev => ({ ...prev, maxRisk: parseFloat(e.target.value) }))}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Domain Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Domain</label>
            <input
              type="text"
              value={filters.domain}
              onChange={(e) => setFilters(prev => ({ ...prev, domain: e.target.value }))}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Filter by domain..."
            />
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedScans.length > 0 && (
        <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-blue-200">
              {selectedScans.length} scan{selectedScans.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleBulkFalsePositive}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
              >
                Mark False Positive
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scans Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Recent Scans ({filteredScans.length})
          </h3>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export CSV</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-750">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedScans.length === filteredScans.length && filteredScans.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-600 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Domain</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Label</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Risk Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredScans.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No scans found matching your filters</p>
                  </td>
                </tr>
              ) : (
                filteredScans.map((scan) => {
                  const isSelected = selectedScans.includes(scan._id);
                  const isPhishing = scan.label === 'phishing';
                  const domain = scan.url ? new URL(scan.url).hostname : 'Unknown';
                  
                  return (
                    <tr 
                      key={scan._id} 
                      className={`hover:bg-slate-750/50 transition-colors duration-150 ${isSelected ? 'bg-blue-900/20' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectScan(scan._id)}
                          className="rounded border-slate-600 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {new Date(scan.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="flex items-center">
                          <span className="text-sm text-white font-mono truncate">{scan.url}</span>
                          <button className="ml-2 text-slate-400 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {domain}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          isPhishing 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                            : 'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {scan.label.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 bg-slate-700 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${
                                scan.risk_score > 0.8 ? 'bg-red-500' : 
                                scan.risk_score > 0.5 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${scan.risk_score * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-white font-mono">
                            {scan.risk_score.toFixed(3)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-400 hover:text-blue-300">View</button>
                          <button className="text-yellow-400 hover:text-yellow-300">Flag</button>
                          <button className="text-red-400 hover:text-red-300">Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminScans;