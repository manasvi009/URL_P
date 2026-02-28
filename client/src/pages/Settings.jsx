import { useState } from 'react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Settings updated:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-indigo-900 to-violet-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="dashboard-header mb-10 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-violet-500 to-blue-500 bg-clip-text text-transparent">
            Account Settings
          </h1>
          <p className="text-xl text-cyan-200 max-w-2xl mx-auto">
            Manage your account preferences and security settings
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-md rounded-xl border border-cyan-500/30 p-8 shadow-lg shadow-cyan-500/10">
          <div className="flex flex-wrap gap-4 mb-8 border-b border-cyan-500/20 pb-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-cyan-600 to-violet-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-gray-800/50 text-cyan-200 hover:bg-gray-700/50'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'security'
                  ? 'bg-gradient-to-r from-cyan-600 to-violet-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-gray-800/50 text-cyan-200 hover:bg-gray-700/50'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'notifications'
                  ? 'bg-gradient-to-r from-cyan-600 to-violet-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-gray-800/50 text-cyan-200 hover:bg-gray-700/50'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'privacy'
                  ? 'bg-gradient-to-r from-cyan-600 to-violet-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-gray-800/50 text-cyan-200 hover:bg-gray-700/50'
              }`}
            >
              Privacy
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-cyan-200 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-200 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-cyan-200 mb-2">Bio</label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-cyan-200 mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter current password"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-cyan-200 mb-2">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-200 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <div className="bg-gray-800/30 p-4 rounded-lg border border-cyan-500/20">
                  <h3 className="text-lg font-semibold text-cyan-300 mb-2">Two-Factor Authentication</h3>
                  <p className="text-cyan-200/80 mb-4">Add an extra layer of security to your account</p>
                  <button
                    type="button"
                    className="bg-gradient-to-r from-cyan-600 to-violet-600 text-white px-4 py-2 rounded-lg font-medium hover:from-cyan-700 hover:to-violet-700 transition-all duration-300"
                  >
                    Enable 2FA
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-cyan-500/20">
                    <div>
                      <h4 className="text-cyan-300 font-medium">Email Notifications</h4>
                      <p className="text-cyan-200/80 text-sm">Receive emails about important account activity</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-cyan-500/20">
                    <div>
                      <h4 className="text-cyan-300 font-medium">Push Notifications</h4>
                      <p className="text-cyan-200/80 text-sm">Receive push notifications on your devices</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-cyan-500/20">
                    <div>
                      <h4 className="text-cyan-300 font-medium">Security Alerts</h4>
                      <p className="text-cyan-200/80 text-sm">Get alerts about suspicious activity</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-cyan-500/20">
                    <h4 className="text-cyan-300 font-medium mb-2">Data Sharing</h4>
                    <p className="text-cyan-200/80 text-sm mb-4">Control how your data is shared with third parties</p>
                    <select className="w-full px-4 py-2 bg-gray-700 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                      <option>Do not share data</option>
                      <option>Share with trusted partners only</option>
                      <option>Share with all partners</option>
                    </select>
                  </div>
                  
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-cyan-500/20">
                    <h4 className="text-cyan-300 font-medium mb-2">Account Deletion</h4>
                    <p className="text-cyan-200/80 text-sm mb-4">Permanently delete your account and all data</p>
                    <button
                      type="button"
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="bg-gradient-to-r from-cyan-600 to-violet-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-700 hover:to-violet-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}