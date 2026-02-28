import { useEffect, useState } from 'react';
import api from '../api/api';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notificationsEmail: true,
    notificationsPush: false,
    notificationsSecurity: true,
    privacyDataSharing: 'none',
    twoFactorEnabled: false,
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/user/settings');
      const data = res.data || {};
      setFormData((prev) => ({
        ...prev,
        name: data.username || '',
        email: data.email || '',
        bio: data.bio || '',
        notificationsEmail: data.notifications?.email ?? true,
        notificationsPush: data.notifications?.push ?? false,
        notificationsSecurity: data.notifications?.security ?? true,
        privacyDataSharing: data.privacy?.data_sharing || 'none',
        twoFactorEnabled: data.security?.two_factor_enabled ?? false,
      }));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (success) setSuccess('');
    if (error) setError('');
  };

  const saveProfile = async () => {
    await api.patch('/user/settings', {
      username: formData.name,
      bio: formData.bio,
    });
  };

  const saveNotifications = async () => {
    await api.patch('/user/settings', {
      notifications_email: formData.notificationsEmail,
      notifications_push: formData.notificationsPush,
      notifications_security: formData.notificationsSecurity,
    });
  };

  const savePrivacy = async () => {
    await api.patch('/user/settings', {
      privacy_data_sharing: formData.privacyDataSharing,
    });
  };

  const saveSecurity = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      throw new Error('Please fill all password fields');
    }
    if (formData.newPassword !== formData.confirmPassword) {
      throw new Error('New passwords do not match');
    }
    await api.post('/user/change-password', {
      current_password: formData.currentPassword,
      new_password: formData.newPassword,
    });
    setFormData((prev) => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      if (activeTab === 'profile') {
        await saveProfile();
        setSuccess('Profile updated successfully');
      } else if (activeTab === 'security') {
        await saveSecurity();
        setSuccess('Security settings updated successfully');
      } else if (activeTab === 'notifications') {
        await saveNotifications();
        setSuccess('Notification preferences saved');
      } else if (activeTab === 'privacy') {
        await savePrivacy();
        setSuccess('Privacy settings saved');
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-indigo-900 to-violet-900 p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

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
          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-3 bg-green-500/20 border border-green-500/40 rounded-lg text-green-300 text-sm">
              {success}
            </div>
          )}

          <div className="flex flex-wrap gap-4 mb-8 border-b border-cyan-500/20 pb-4">
            {['profile', 'security', 'notifications', 'privacy'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 capitalize ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-cyan-600 to-violet-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'bg-gray-800/50 text-cyan-200 hover:bg-gray-700/50'
                }`}
              >
                {tab}
              </button>
            ))}
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
                      className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-200 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 bg-gray-800/30 border border-cyan-500/20 rounded-lg text-cyan-200/80 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-cyan-200 mb-2">Bio</label>
                  <textarea
                    rows="4"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white"
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
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white"
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
                      className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white"
                      placeholder="Minimum 8 characters"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-200 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <div className="bg-gray-800/30 p-4 rounded-lg border border-cyan-500/20">
                  <h3 className="text-lg font-semibold text-cyan-300 mb-2">Two-Factor Authentication</h3>
                  <p className="text-cyan-200/80 mb-1">Status: {formData.twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
                  <p className="text-cyan-200/60 text-sm">2FA toggle will be available in next release.</p>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                {[
                  ['notificationsEmail', 'Email Notifications', 'Receive emails about important account activity'],
                  ['notificationsPush', 'Push Notifications', 'Receive push notifications on your devices'],
                  ['notificationsSecurity', 'Security Alerts', 'Get alerts about suspicious activity'],
                ].map(([key, title, desc]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-cyan-500/20">
                    <div>
                      <h4 className="text-cyan-300 font-medium">{title}</h4>
                      <p className="text-cyan-200/80 text-sm">{desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name={key} checked={formData[key]} onChange={handleInputChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="p-4 bg-gray-800/30 rounded-lg border border-cyan-500/20">
                  <h4 className="text-cyan-300 font-medium mb-2">Data Sharing</h4>
                  <p className="text-cyan-200/80 text-sm mb-4">Control how your data is shared with partners</p>
                  <select
                    name="privacyDataSharing"
                    value={formData.privacyDataSharing}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-cyan-500/30 rounded-lg text-white"
                  >
                    <option value="none">Do not share data</option>
                    <option value="trusted">Share with trusted partners only</option>
                    <option value="all">Share with all partners</option>
                  </select>
                </div>
                <div className="p-4 bg-gray-800/30 rounded-lg border border-cyan-500/20">
                  <h4 className="text-cyan-300 font-medium mb-2">Account Deletion</h4>
                  <p className="text-cyan-200/80 text-sm mb-4">For safety, account deletion requires support verification.</p>
                  <button type="button" className="bg-red-600/70 cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium" disabled>
                    Delete Account (Contact Support)
                  </button>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-cyan-600 to-violet-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-700 hover:to-violet-700 transition-all duration-300 disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
