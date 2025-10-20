import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../services/api';

function Profile() {
  const { user, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState({
    style: [],
    gender: '',
    location: ''
  });
  const [styleInput, setStyleInput] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [updateStatus, setUpdateStatus] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/user/profile');
        setEmail(res.data.email || '');
        setPreferences(res.data.preferences || { style: [], gender: '', location: '' });
        setStyleInput(res.data.preferences?.style?.join(', ') || '');
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updatedPreferences = {
        ...preferences,
        style: styleInput.split(',').map(s => s.trim()).filter(Boolean)
      };

      await axios.put('/user/profile', {
        email,
        preferences: updatedPreferences
      });

      setUpdateStatus('✅ Profile updated successfully');
      setTimeout(() => setUpdateStatus(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setUpdateStatus('❌ Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus('❌ Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordStatus('❌ Password must be at least 6 characters');
      return;
    }

    try {
      await axios.put('/user/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setPasswordStatus('✅ Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordStatus(''), 3000);
    } catch (err) {
      console.error('Failed to change password:', err);
      setPasswordStatus('❌ Failed to change password. Check your current password.');
    }
  };

  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                className="input"
                value={preferences.gender}
                onChange={(e) => setPreferences({ ...preferences, gender: e.target.value })}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Katsayal"
                value={preferences.location}
                onChange={(e) => setPreferences({ ...preferences, location: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Style Preferences</label>
              <input
                type="text"
                className="input"
                placeholder="e.g., streetwear, casual, formal"
                value={styleInput}
                onChange={(e) => setStyleInput(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Comma-separated style tags</p>
            </div>

            <button
              type="submit"
              className="btn bg-purple-600 hover:bg-purple-700 text-white"
            >
              Update Profile
            </button>

            {updateStatus && (
              <p className="text-sm text-center mt-2">{updateStatus}</p>
            )}
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Change Password</h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <input
                type="password"
                className="input"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input
                type="password"
                className="input"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <input
                type="password"
                className="input"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="btn bg-blue-600 hover:bg-blue-700 text-white"
            >
              Change Password
            </button>

            {passwordStatus && (
              <p className="text-sm text-center mt-2">{passwordStatus}</p>
            )}
          </form>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white border rounded-lg p-6 mt-6">
        <h3 className="text-xl font-semibold mb-4">Account Actions</h3>
        <div className="flex gap-4">
          <button
            onClick={logout}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
