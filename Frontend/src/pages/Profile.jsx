import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/UI/Navbar';

const ProfilePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({ username: '', email: '', joinDate: '' });
  const [editUsername, setEditUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);

  /** Fetch profile on mount */
  useEffect(() => {
    if (!isAuthenticated) return navigate('/login');
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/');
        const res = await axios.get('http://localhost:3000/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.user) {
          const joined = new Date(res.data.user.createdAt || Date.now()).toLocaleDateString();
          setUserData({ username: res.data.user.username, email: res.data.user.email, joinDate: joined });
          setEditUsername(res.data.user.username);
        }
      } catch (err) {
        setError('Failed to load profile information');
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated, navigate]);

  /** Submit username change */
  const saveChanges = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'http://localhost:3000/auth/update-profile',
        { username: editUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status) {
        setUserData((prev) => ({ ...prev, username: editUsername }));
        setSuccess('Profile updated successfully');
        setEditMode(false);
      } else setError(res.data.message || 'Update failed');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <p className="text-center mt-10">Loading…</p>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-amber-50 py-12 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">My Profile</h1>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-600 mb-4">{success}</p>}

          {!editMode ? (
            <>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">USERNAME</h3>
                  <p className="text-lg">{userData.username}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">EMAIL</h3>
                  <p className="text-lg">{userData.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">MEMBER SINCE</h3>
                  <p className="text-lg">{userData.joinDate}</p>
                </div>
              </div>

              <button
                onClick={() => setEditMode(true)}
                className="w-full bg-amber-400 text-white py-2 rounded hover:bg-amber-500 mt-8"
              >
                Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={saveChanges} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">New Username</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-amber-400 text-gray-800 py-2 rounded hover:bg-amber-500 transition-colors"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="w-full bg-amber-200 text-gray-800 py-2 rounded hover:bg-amber-300 transition-colors"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;