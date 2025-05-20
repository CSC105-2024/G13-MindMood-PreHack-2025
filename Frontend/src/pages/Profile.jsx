import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/UI/Navbar';

const ProfilePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({ 
    username: '', 
    email: '', 
    joinDate: '',
    profilePicture: null 
  });
  const [editUsername, setEditUsername] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
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
          setUserData({ 
            username: res.data.user.username, 
            email: res.data.user.email, 
            joinDate: joined,
            profilePicture: res.data.user.profilePicture || null
          });
          setEditUsername(res.data.user.username);
          if (res.data.user.profilePicture) {
            setPreviewImage(res.data.user.profilePicture);
          }
        }
      } catch (err) {
        setError('Failed to load profile information');
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated, navigate]);

  /** Handle image selection */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (1MB limit)
      if (file.size > 1000000) {
        setError('Image too large. Please select an image smaller than 1MB.');
        e.target.value = null; // Reset the input
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        e.target.value = null; // Reset the input
        return;
      }
      
      setProfileImage(file);
      setError(''); // Clear any previous errors
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /** Submit profile changes */
  const saveChanges = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Create form data to handle file upload
      const formData = new FormData();
      formData.append('username', editUsername);
      
      // Only append file if a new one is selected
      if (profileImage) {
        formData.append('profilePicture', profileImage);
      }
      
      console.log("Sending update with:", { username: editUsername, hasImage: !!profileImage });
      
      const res = await axios.put(
        'http://localhost:3000/auth/update-profile',
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type manually - axios will set the correct boundary with multipart/form-data
          } 
        }
      );
      
      if (res.data.status) {
        setUserData((prev) => ({ 
          ...prev, 
          username: editUsername,
          profilePicture: res.data.user.profilePicture || prev.profilePicture 
        }));
        setSuccess('Profile updated successfully');
        setEditMode(false);
        setProfileImage(null); // Reset after successful upload
      } else {
        setError(res.data.message || 'Update failed');
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  /** Get avatar display (either uploaded image or default placeholder) */
  const getAvatarDisplay = () => {
    if (previewImage) {
      return (
        <div className="relative">
          <img 
            src={previewImage} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover border-2 border-amber-400"
          />
          <div className="absolute inset-0 rounded-full border-2 border-amber-400"></div>
        </div>
      );
    }
    
    // Default placeholder with user's initials
    const initials = userData.username ? userData.username[0].toUpperCase() : '?';
    return (
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-amber-200 flex items-center justify-center">
          <span className="text-2xl font-bold text-amber-800">{initials}</span>
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-amber-400"></div>
      </div>
    );
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
          <h1 className="text-2xl font-bold text-center mb-6">My Profile</h1>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {success && <p className="text-green-600 mb-4 text-center">{success}</p>}

          {!editMode ? (
            <>
              {/* View mode */}
              <div className="flex flex-col items-center mb-6">
                {/* Profile Picture - Always visible */}
                <div className="mb-4">
                  {getAvatarDisplay()}
                </div>
                
                <div className="space-y-4 w-full">
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
              </div>
            </>
          ) : (
            <>
              {/* Edit mode */}
              <div className="flex flex-col items-center mb-6">
                {/* Profile Picture with preview */}
                <div className="mb-4">
                  {getAvatarDisplay()}
                </div>
              </div>
              
              <form onSubmit={saveChanges} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border rounded px-3 py-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Select a new image to change your profile picture (max 1MB)
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-1">Username</label>
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
                  onClick={() => {
                    setEditMode(false);
                    setPreviewImage(userData.profilePicture); // Reset preview on cancel
                    setProfileImage(null);
                    setError(''); // Clear any errors
                  }}
                  className="w-full bg-amber-200 text-gray-800 py-2 rounded hover:bg-amber-300 transition-colors"
                >
                  Cancel
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;