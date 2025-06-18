'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiUser, 
  FiMail, 
  FiCalendar, 
  FiMapPin, 
  FiEdit3, 
  FiSave, 
  FiX,
  FiCamera,
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

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    avatar: null
  });
  const [userPosition, setUserPosition] = useState(0);

  // Function to get user's position in database
  const getUserPosition = async (userId) => {
    try {
      // Fetch all users ordered by creation date
      const { data: allUsers, error } = await supabase
        .from('profiles')
        .select('id')
        .order('created_at', { ascending: true });
  
      if (error) {
        console.error('Error fetching user list:', error);
        return 0;
      }
  
      // Find the index of the current user
      const index = allUsers.findIndex(user => user.id === userId);
      
      // Return 1-based position
      return index >= 0 ? index + 1 : 0;
    } catch (error) {
      console.error('Error calculating user position:', error);
      return 0;
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
      setProfileData({
        firstName: session.user.user_metadata?.firstName || '',
        lastName: session.user.user_metadata?.lastName || '',
        email: session.user.email || '',
        bio: session.user.user_metadata?.bio || '',
        location: session.user.user_metadata?.location || '',
        website: session.user.user_metadata?.website || '',
        avatar: session.user.user_metadata?.avatar || null
      });

      // Get user's position in database
      const position = await getUserPosition(session.user.id, session.user.created_at);
      setUserPosition(position);
      
      setIsLoading(false);
    };

    checkUser();
  }, [router]);

  const handleSave = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          bio: profileData.bio,
          location: profileData.location,
          website: profileData.website,
          avatar: profileData.avatar
        }
      });

      if (error) throw error;
      
      setIsEditing(false);
      // Update local user state
      setUser(prev => ({
        ...prev,
        user_metadata: {
          ...prev.user_metadata,
          ...profileData
        }
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
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
                <button className="avatar-edit-btn">
                  <FiCamera size={16} />
                </button>
              </div>
              <div className="avatar-info">
                <h2>{profileData.firstName} {profileData.lastName}</h2>
                <p className="member-since">Member since {new Date(user?.created_at).toLocaleDateString()}</p>
                <div className="user-id">#{userPosition}</div>
              </div>
            </div>

            <div className="profile-actions">
              {!isEditing ? (
                <button 
                  className="edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  <FiEdit3 size={16} />
                  Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button 
                    className="save-btn"
                    onClick={handleSave}
                  >
                    <FiSave size={16} />
                    Save
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={() => setIsEditing(false)}
                  >
                    <FiX size={16} />
                    Cancel
                  </button>
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
                  <label>Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled={true}
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
                  <label>Website</label>
                  <input
                    type="url"
                    value={profileData.website}
                    onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                    rows={4}
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
                  <button 
                    className="setting-btn danger"
                    onClick={handleLogout}
                  >
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