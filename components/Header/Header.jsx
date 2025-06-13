'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiSearch, FiChevronDown, FiUser } from 'react-icons/fi';
import './Header.scss';
import { supabase } from '../../supabaseClient';

const categories = [
  { id: 1, name: 'Islamic Studies' },
  { id: 2, name: 'Fitness & Health' },
  { id: 3, name: 'Soft Skills' },
  { id: 4, name: 'Career Development' },
  { id: 5, name: 'Personal Goals' },
  { id: 6, name: 'Leadership' },
  { id: 7, name: 'Work-Life Balance' },
  { id: 8, name: 'Video Courses' }
];

const Header = ({ forceSolid = false }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState('en'); // 'en' or 'ar'
  const [isScrolled, setIsScrolled] = useState(forceSolid);
  const router = useRouter();
  const [userSession, setUserSession] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    if (!forceSolid) {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        setIsScrolled(scrollPosition > 100); // Change header after 100px scroll
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [forceSolid]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserSession(session);
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserSession(session);
    });
    return () => { listener?.subscription?.unsubscribe(); };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!profileDropdownOpen) return;
    const handleClick = (e) => {
      // Only close if click is outside the dropdown and icon
      if (!e.target.closest('.profile-dropdown-container')) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [profileDropdownOpen]);

  const closeDropdown = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsDropdownOpen(false);
      setIsClosing(false);
    }, 200); // Match the transition duration in SCSS
  };

  const toggleDropdown = () => {
    if (isDropdownOpen) {
      closeDropdown();
    } else {
      setIsDropdownOpen(true);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const handleViewPlans = () => {
    router.push('/plans');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfileDropdownOpen(false);
    window.location.reload();
  };

  const handleProfileIconClick = (e) => {
    e.stopPropagation();
    setProfileDropdownOpen(v => !v);
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation();
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="nav-content">
        <div className="logo-container">
          <a href="/" className="logo">
            <img src="/logoicon.png" alt="Logo" />
          </a>
        </div>
        <div className="left-section">
          <button 
            className="browse-button"
            onClick={() => router.push('/campuses')}
          >
            Explore Campuses
          </button>
          <button className="nav-button" onClick={handleViewPlans}>View Plans</button>

          {isScrolled && (
            <div className="nav-buttons">
              <button className="nav-button" onClick={handleViewPlans}>View Plans</button>
            </div>
          )}
        </div>

        <div className="right-section">
          <form className="search-form" onSubmit={handleSearch}>
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div className="vertical-separator" />
          <div className="auth-buttons">
            {userSession && userSession.user && userSession.user.email_confirmed_at ? (
              <div className="profile-dropdown-container">
                <div className="profile-icon" title={userSession.user.email} onClick={handleProfileIconClick} tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleProfileIconClick(e); }} aria-haspopup="true" aria-expanded={profileDropdownOpen}>
                  <FiUser size={22} />
                </div>
                {profileDropdownOpen && (
                  <div className="profile-dropdown-menu" onClick={handleDropdownClick} tabIndex={-1}>
                    <div className="profile-email">{userSession.user.email}</div>
                    <button className="logout-btn" onClick={handleLogout}>Log Out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/signup" className="sign-in">Sign Up</Link>
                <Link href="/login" className="login">Login</Link>
              </>
            )}
          </div>
          <button 
            className={`lang-switch ${language}`}
            onClick={toggleLanguage}
          >
            <span className="lang-option en">EN</span>
            <span className="lang-option ar">ع</span>
            <span className="lang-indicator"></span>
          </button>
        </div>
      </nav>

      {(isDropdownOpen || isClosing) && (
        <div 
          className={`dropdown-menu ${isClosing ? 'closing' : ''}`}
          onMouseLeave={closeDropdown}
        >
          <div className="menu-header">Browse Categories</div>
          <div className="menu-content">
            {categories.map(category => (
              <a key={category.id} href="#" className="category">
                {category.name}
                <span></span>
              </a>
            ))}
          </div>
          <div className="menu-footer">
            <a href="#" className="view-all-button">
              View All Categories
              <FiChevronDown />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 