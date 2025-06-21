'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/navigation';
import {
  FiUser,
  FiEdit3,
  FiSave,
  FiX,
  FiRefreshCw,
  FiShield,
  FiBook,
  FiAward,
  FiClock,
  FiHeart,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';
import Header from '../../components/Header/Header';
import { supabase } from '../../supabaseClient';
import '../../styles/profile.scss';

// 🔄 Avatar generator
const generateDicebearAvatar = (seed, style = 'adventurer') => {
  const hashedSeed = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${hashedSeed}`;
};

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    phone_number: '',
    avatar: null,
    username: ''
  });
  const [userPosition, setUserPosition] = useState(0);

  const getUserPosition = async (userId) => {
    try {
      const { data: allUsers, error } = await supabase
        .from('profiles')
        .select('id')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching user list:', error);
        return 0;
      }

      const index = allUsers.findIndex(user => user.id === userId);
      return index >= 0 ? index + 1 : 0;
    } catch (error) {
      console.error('Error calculating user position:', error);
      return 0;
    }
  };

  const generateRandomAvatar = async () => {
    const seed = Math.random().toString(36).substring(2); // random string
    const avatarUrl = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${seed}`;
  
    setProfileData(prev => ({
      ...prev,
      avatar: avatarUrl,
    }));
  };  

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      setUser(session.user);

      const profileFromDB = await fetchUserProfile(session.user.id);

      const defaultAvatar = generateDicebearAvatar(
        profileFromDB?.username || session.user.email
      );

      setProfileData({
        firstName: profileFromDB?.first_name || '',
        lastName: profileFromDB?.last_name || '',
        email: session.user.email || '',
        location: profileFromDB?.location || '',
        phone_number: profileFromDB?.phone_number || '',
        avatar: profileFromDB?.avatar || defaultAvatar,
        username: profileFromDB?.username || ''
      });

      const position = await getUserPosition(session.user.id);
      setUserPosition(position);

      setIsLoading(false);
    };

    checkUser();
  }, [router]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          location: profileData.location,
          phone_number: profileData.phone_number,
          avatar: profileData.avatar
        }
      });

      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          location: profileData.location,
          phone_number: profileData.phone_number,
          avatar: profileData.avatar,
          username: profileData.username,
          updated_info_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      setSaveMessage('Profile updated successfully!');
      setIsEditing(false);

      setUser(prev => ({
        ...prev,
        user_metadata: {
          ...prev.user_metadata,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          location: profileData.location,
          phone_number: profileData.phone_number,
          avatar: profileData.avatar
        }
      }));

      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveMessage(`Error updating profile: ${error.message}`);
      setTimeout(() => setSaveMessage(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <Header forceSolid={true} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Header forceSolid={true} />
      <div className="profile-container">
        <div className="profile-header">
          <h1>Profile</h1>
          <div className="gradient-line"></div>
          <p>Manage your account settings and preferences</p>
        </div>

        <div className="profile-content">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-avatar-section">
              <div className="avatar-container">
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Profile" className="avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    <FiUser size={48} />
                  </div>
                )}
                <button
                  className="avatar-edit-btn"
                  onClick={generateRandomAvatar}
                  title="Generate new avatar"
                >
                  <FiRefreshCw size={16} />
                </button>
              </div>
              <div className="avatar-info">
                <h2>{profileData.firstName} {profileData.lastName}</h2>
                <p className="username">@{profileData.username || user?.email?.split('@')[0] || 'user'}</p>
                <p className="member-since">Member since {new Date(user?.created_at).toLocaleDateString()}</p>
                <div className="user-id">#{userPosition}</div>
              </div>
            </div>

            <div className="profile-actions">
              {!isEditing ? (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  <FiEdit3 size={16} /> Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSave} disabled={isSaving}>
                    <FiSave size={16} /> {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button className="cancel-btn" onClick={() => setIsEditing(false)} disabled={isSaving}>
                    <FiX size={16} /> Cancel
                  </button>
                </div>
              )}
              {saveMessage && (
                <div className={`save-message ${saveMessage.includes('Error') ? 'error' : 'success'}`}>
                  {saveMessage}
                </div>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <div className="profile-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Enter your last name"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Username</label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Enter your username"
                  />
                  <small>This will be your unique identifier</small>
                </div>
                <div className="form-group full-width">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    placeholder="Your email address"
                  />
                  <small>Email cannot be changed</small>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="City, Country"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={profileData.phone_number}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone_number: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="stats-section">
              <h3>Your Learning Stats</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <FiBook size={24} />
                  </div>
                  <div className="stat-content">
                    <h4>Courses Enrolled</h4>
                    <p className="stat-number">12</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FiClock size={24} />
                  </div>
                  <div className="stat-content">
                    <h4>Hours Learned</h4>
                    <p className="stat-number">156</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FiAward size={24} />
                  </div>
                  <div className="stat-content">
                    <h4>Certificates</h4>
                    <p className="stat-number">8</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FiHeart size={24} />
                  </div>
                  <div className="stat-content">
                    <h4>Saved Courses</h4>
                    <p className="stat-number">24</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="settings-section">
              <h3>Account Settings</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-icon">
                      <FiShield size={20} />
                    </div>
                    <div className="setting-content">
                      <h4>Privacy Settings</h4>
                      <p>Manage your privacy preferences</p>
                    </div>
                  </div>
                  <button className="setting-btn">Manage</button>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-icon">
                      <FiSettings size={20} />
                    </div>
                    <div className="setting-content">
                      <h4>Notification Preferences</h4>
                      <p>Control your notification settings</p>
                    </div>
                  </div>
                  <button className="setting-btn">Manage</button>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-icon">
                      <FiLogOut size={20} />
                    </div>
                    <div className="setting-content">
                      <h4>Sign Out</h4>
                      <p>Sign out of your account</p>
                    </div>
                  </div>
                  <button className="setting-btn danger" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
