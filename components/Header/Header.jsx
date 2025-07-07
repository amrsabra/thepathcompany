// ✅ Updated Header.jsx — Investigate `forceSolid` not triggering visual change
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
  const [isScrolled, setIsScrolled] = useState(forceSolid);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState('en');
  const router = useRouter();
  const [userSession, setUserSession] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // ✅ Ensure isScrolled reflects the passed forceSolid prop
  useEffect(() => {
    setIsScrolled(forceSolid);
  }, [forceSolid]);

  useEffect(() => {
    if (forceSolid) return; // Skip if forceSolid is forcing solid header
  
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  useEffect(() => {
    if (!profileDropdownOpen) return;
    const handleClick = (e) => {
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
    }, 200);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    setProfileDropdownOpen(false);
    window.location.href = '/';
  };

  const handleViewPlans = () => {
    router.push('/plans');
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`} style={{ '--header-height': '120px' }}>
      <nav className="nav-content">
        <div className="logo-container">
          <a href="/" className="logo">
            <img src="/logoicon.png" alt="Logo" />
          </a>
        </div>
        <div className="left-section">
          <button className="browse-button" onClick={() => router.push('/campuses')}>Explore Campuses</button>
          <button className="nav-button"onClick={() => {window.location.href = '/plans';}}>Join TPC</button>
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
                <div className="profile-icon" title={userSession.user.email} onClick={() => setProfileDropdownOpen(prev => !prev)}>
                  <FiUser size={22} />
                </div>
                {profileDropdownOpen && (
                  <div className="profile-dropdown-menu">
                    <div className="profile-email">{userSession.user.email}</div>
                    <Link href="/profile" className="profile-link">
                      <FiUser size={16} />
                      Profile
                    </Link>
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
            onClick={() => setLanguage(prev => (prev === 'en' ? 'ar' : 'en'))}
          >
            <span className="lang-option en">EN</span>
            <span className="lang-option ar">ع</span>
            <span className="lang-indicator"></span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
