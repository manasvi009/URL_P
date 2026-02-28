import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AdminReports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');
  const [featureSearch, setFeatureSearch] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock report data for demonstration
  const mockReport = {
    id: 'scan-123',
    url: 'https://suspicious-banking-verification.net/login?session=12345',
    timestamp: '2024-01-15T14:30:00Z',
    label: 'phishing',
    risk_score: 0.94,
    features: {
      url_length: 67,
      num_dots: 3,
      has_ip_address: false,
      is_suspicious_tld: true,
      contains_suspicious_words: true,
      num_redirects: 2,
      uses_https: true,
      has_suspicious_params: true,
      domain_age: 5, // days
      alexa_rank: 999999,
      is_phishing_word: true,
      contains_suspicious_symbols: false,
      has_subdomain: true,
      url_entropy: 3.2
    },
    explanation: 'This URL exhibits multiple phishing indicators including a suspicious domain structure, suspicious keywords in the URL, and a high number of redirects. The domain appears to be newly registered and mimics a legitimate banking service.',
    evidence: [
      {
        indicator: 'Suspicious Domain Structure',
        description: 'Domain contains multiple subdomains and suspicious keywords',
        severity: 'high'
      },
      {
        indicator: 'Suspicious Keywords',
        description: 'URL contains words like "verification", "session" commonly used in phishing',
        severity: 'high'
      },
      {
        indicator: 'Multiple Redirects',
        description: 'URL performs 2 redirects which is common in phishing campaigns',
        severity: 'medium'
      },
      {
        indicator: 'New Domain',
        description: 'Domain appears to be registered only 5 days ago',
        severity: 'medium'
      }
    ],
    audit_log: [
      {
        timestamp: '2024-01-15T14:30:00Z',
        action: 'SCAN_INITIATED',
        user: 'system',
        details: 'URL scan initiated by admin user'
      },
      {
        timestamp: '2024-01-15T14:30:02Z',
        action: 'FEATURES_EXTRACTED',
        user: 'system',
        details: '25 features extracted from URL'
      },
      {
        timestamp: '2024-01-15T14:30:03Z',
        action: 'ML_MODEL_PREDICTION',
        user: 'system',
        details: 'Phishing model prediction: 94% confidence'
      },
      {
        timestamp: '2024-01-15T14:30:05Z',
        action: 'LLM_EXPLANATION',
        user: 'system',
        details: 'Generated AI explanation for detection'
      }
    ]
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      // In a real implementation, fetch from API
      // const response = await api.get(`/reports/${id}`);
      // setReport(response.data);
      
      // Using mock data for now
      setTimeout(() => {
        setReport(mockReport);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching report:', error);
      setLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score > 0.8) return 'text-red-400';
    if (score > 0.5) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRiskLabel = (score) => {
    if (score > 0.8) return 'High Risk';
    if (score > 0.5) return 'Medium Risk';
    return 'Low Risk';
  };

  const filteredFeatures = report?.features 
    ? Object.entries(report.features).filter(([key, value]) =>
        key.toLowerCase().includes(featureSearch.toLowerCase()) ||
        String(value).toLowerCase().includes(featureSearch.toLowerCase())
      )
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-white mb-2">Report Not Found</h2>
        <p className="text-slate-400 mb-4">The requested report could not be found.</p>
        <button
          onClick={() => navigate('/admin/scans')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
        >
          Back to Scans
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <h1 className="text-2xl font-bold text-white">Scan Report</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                report.label === 'phishing'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-green-500/20 text-green-400 border border-green-500/30'
              }`}>
                {report.label.toUpperCase()}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-300 font-mono break-all">{report.url}</span>
                  <button className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-400">Risk Score</p>
                <p className={`text-2xl font-bold ${getRiskColor(report.risk_score)}`}>
                  {(report.risk_score * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Risk Level</p>
                <p className={`text-lg font-semibold ${getRiskColor(report.risk_score)}`}>
                  {getRiskLabel(report.risk_score)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Scanned</p>
                <p className="text-lg text-white">
                  {new Date(report.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Mark Legitimate</span>
        </button>
        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Confirm Phishing</span>
        </button>
        <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
          </svg>
          <span>Add to Blacklist</span>
        </button>
        <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Add to Whitelist</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl">
        <div className="border-b border-slate-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'summary', label: 'Summary' },
              { id: 'features', label: 'Features' },
              { id: 'evidence', label: 'Evidence' },
              { id: 'explanation', label: 'LLM Explanation' },
              { id: 'audit', label: 'Audit Log' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-750/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Threat Assessment</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-400">Overall Risk</p>
                      <p className={`text-xl font-bold ${getRiskColor(report.risk_score)}`}>
                        {getRiskLabel(report.risk_score)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Confidence Level</p>
                      <p className="text-lg text-white">High</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-750/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Technical Details</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-400">Domain</p>
                      <p className="text-white font-mono">
                        {report.url ? new URL(report.url).hostname : 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Scan ID</p>
                      <p className="text-white font-mono">{report.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={featureSearch}
                  onChange={(e) => setFeatureSearch(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search features..."
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFeatures.map(([key, value]) => (
                  <div key={key} className="bg-slate-750/30 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-slate-300 mb-1">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h4>
                        <p className="text-white font-mono text-sm">
                          {typeof value === 'boolean' ? (value ? 'True' : 'False') : String(value)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        typeof value === 'boolean' && value
                          ? 'bg-red-500/20 text-red-400'
                          : typeof value === 'boolean'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {typeof value === 'boolean' ? (value ? 'FLAGGED' : 'OK') : 'VALUE'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evidence Tab */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              {report.evidence.map((item, index) => (
                <div key={index} className="bg-slate-750/30 rounded-xl p-4 border-l-4 border-red-500">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-2">{item.indicator}</h4>
                      <p className="text-slate-300">{item.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.severity === 'high'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : item.severity === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {item.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LLM Explanation Tab */}
          {activeTab === 'explanation' && (
            <div className="bg-slate-750/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">AI Analysis</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 leading-relaxed">{report.explanation}</p>
              </div>
            </div>
          )}

          {/* Audit Log Tab */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              {report.audit_log.map((log, index) => (
                <div key={index} className="bg-slate-750/30 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-medium text-white">{log.action}</span>
                        <span className="text-xs text-slate-400">by {log.user}</span>
                      </div>
                      <p className="text-slate-300 text-sm">{log.details}</p>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;