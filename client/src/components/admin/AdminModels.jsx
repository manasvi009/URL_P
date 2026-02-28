import React, { useState, useEffect } from 'react';

const AdminModels = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Mock model data
  const mockModels = [
    {
      id: '1',
      name: 'Phishing Detection Model',
      version: 'v4.2',
      status: 'active',
      training_date: '2024-01-10T14:30:00Z',
      metrics: {
        accuracy: 0.997,
        precision: 0.985,
        recall: 0.992,
        f1_score: 0.988,
        roc_auc: 0.995
      },
      confusion_matrix: [
        [985, 15],  // True Negatives, False Positives
        [8, 992]    // False Negatives, True Positives
      ]
    },
    {
      id: '2',
      name: 'Phishing Detection Model',
      version: 'v4.1',
      status: 'inactive',
      training_date: '2023-12-15T10:15:00Z',
      metrics: {
        accuracy: 0.992,
        precision: 0.978,
        recall: 0.985,
        f1_score: 0.981,
        roc_auc: 0.991
      },
      confusion_matrix: [
        [978, 22],
        [15, 985]
      ]
    }
  ];

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      // In a real implementation: const response = await api.get('/admin/models');
      setTimeout(() => {
        setModels(mockModels);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching models:', error);
      setLoading(false);
    }
  };

  const handleModelUpload = async (e) => {
    e.preventDefault();
    // Mock file upload
    const newModel = {
      id: Date.now().toString(),
      name: 'New Phishing Model',
      version: 'v4.3',
      status: 'inactive',
      training_date: new Date().toISOString(),
      metrics: {
        accuracy: 0.998,
        precision: 0.990,
        recall: 0.995,
        f1_score: 0.992,
        roc_auc: 0.996
      },
      confusion_matrix: [
        [990, 10],
        [5, 995]
      ]
    };
    setModels(prev => [newModel, ...prev]);
    setShowUploadModal(false);
  };

  const handleRollback = (modelId) => {
    if (window.confirm('Rollback to this model version?')) {
      setModels(prev => prev.map(model => ({
        ...model,
        status: model.id === modelId ? 'active' : 'inactive'
      })));
    }
  };

  const handleEvaluate = (modelId) => {
    // Mock evaluation
    alert('Model evaluation started. Results will be available shortly.');
  };

  const activeModel = models.find(model => model.status === 'active');

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
          <h1 className="text-3xl font-bold text-white">Model Management</h1>
          <p className="text-slate-400 mt-2">Manage machine learning models for phishing detection</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span>Upload Model</span>
        </button>
      </div>

      {/* Current Model Card */}
      {activeModel && (
        <div className="bg-gradient-to-br from-blue-900/30 to-violet-900/30 backdrop-blur-sm border border-blue-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">{activeModel.name}</h2>
              <p className="text-blue-300">Current Active Model</p>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-sm font-medium">
              ACTIVE
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-sm text-slate-400">Version</p>
              <p className="text-lg font-semibold text-white">{activeModel.version}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Accuracy</p>
              <p className="text-lg font-semibold text-green-400">{(activeModel.metrics.accuracy * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Precision</p>
              <p className="text-lg font-semibold text-blue-400">{(activeModel.metrics.precision * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Recall</p>
              <p className="text-lg font-semibold text-violet-400">{(activeModel.metrics.recall * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">ROC-AUC</p>
              <p className="text-lg font-semibold text-yellow-400">{(activeModel.metrics.roc_auc * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Models List */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">Model Versions</h3>
        </div>
        
        <div className="divide-y divide-slate-700">
          {models.map((model) => (
            <div key={model.id} className="p-6 hover:bg-slate-750/30 transition-colors duration-150">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-white">{model.name}</h4>
                    <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">
                      {model.version}
                    </span>
                    {model.status === 'active' && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-sm">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm mb-4">
                    Trained on {new Date(model.training_date).toLocaleDateString()}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500">Accuracy</p>
                      <p className="text-sm font-medium text-white">{(model.metrics.accuracy * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Precision</p>
                      <p className="text-sm font-medium text-white">{(model.metrics.precision * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Recall</p>
                      <p className="text-sm font-medium text-white">{(model.metrics.recall * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">F1-Score</p>
                      <p className="text-sm font-medium text-white">{(model.metrics.f1_score * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                  
                  {/* Confusion Matrix Preview */}
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-slate-300 mb-2">Confusion Matrix Preview</h5>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2 bg-green-500/10 rounded">
                        <p className="text-xs text-slate-400">True Negatives</p>
                        <p className="text-lg font-bold text-green-400">{model.confusion_matrix[0][0]}</p>
                      </div>
                      <div className="p-2 bg-yellow-500/10 rounded">
                        <p className="text-xs text-slate-400">False Positives</p>
                        <p className="text-lg font-bold text-yellow-400">{model.confusion_matrix[0][1]}</p>
                      </div>
                      <div className="p-2 bg-orange-500/10 rounded">
                        <p className="text-xs text-slate-400">False Negatives</p>
                        <p className="text-lg font-bold text-orange-400">{model.confusion_matrix[1][0]}</p>
                      </div>
                      <div className="p-2 bg-blue-500/10 rounded">
                        <p className="text-xs text-slate-400">True Positives</p>
                        <p className="text-lg font-bold text-blue-400">{model.confusion_matrix[1][1]}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  {model.status !== 'active' && (
                    <button
                      onClick={() => handleRollback(model.id)}
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-all duration-200"
                    >
                      Activate
                    </button>
                  )}
                  <button
                    onClick={() => handleEvaluate(model.id)}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-all duration-200"
                  >
                    Evaluate
                  </button>
                  <button className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-all duration-200">
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowUploadModal(false)}>
              <div className="absolute inset-0 bg-black bg-opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-slate-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-700">
              <div className="px-6 py-4 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white">Upload New Model</h3>
              </div>
              
              <form onSubmit={handleModelUpload} className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Model File (.pkl)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 32m0 0l4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-slate-400">
                        <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-400 hover:text-blue-300">
                          <span>Upload a file</span>
                          <input type="file" className="sr-only" accept=".pkl" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500">PKL files only</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Model Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter model name"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
                  >
                    Upload Model
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

export default AdminModels;