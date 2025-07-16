'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiUser, FiChevronLeft, FiChevronRight, FiClock, FiUsers } from 'react-icons/fi';
import { 
  FiStar,
  FiUsers as FiUsersCategory,
  FiPenTool,
  FiBriefcase,
  FiHome,
  FiFilm,
  FiCoffee,
  FiZap,
  FiHeart
} from 'react-icons/fi';
import '../../styles/dashboard.scss';
import { supabase } from '../../supabaseClient';

const Dashboard = ({ user }) => {
  const [language, setLanguage] = useState('en');
  const categoriesRef = useRef(null);
  const trendingCoursesRef = useRef(null);
  const goalsCoursesRef = useRef(null);

  const mockTrendingCourses = [
    {
      id: 1,
      title: "Advanced React Patterns",
      category: "Development",
      duration: "6h 30min",
      students: "2.3k",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
      progress: 65
    },
    {
      id: 2,
      title: "Digital Photography Masterclass",
      category: "Photography",
      duration: "8h 15min",
      students: "1.8k",
      image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&auto=format&fit=crop&q=60",
      progress: 0
    },
    {
      id: 3,
      title: "UI/UX Design Principles",
      category: "Design",
      duration: "5h 45min",
      students: "3.1k",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60",
      progress: 0
    },
    {
      id: 4,
      title: "Business Strategy Fundamentals",
      category: "Business",
      duration: "7h 20min",
      students: "2.7k",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
      progress: 0
    },
    {
      id: 5,
      title: "Creative Writing Workshop",
      category: "Writing",
      duration: "4h 45min",
      students: "1.5k",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=60",
      progress: 0
    }
  ];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const scroll = (direction, ref) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      ref.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const linkSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const user = session.user;
      const normalizedEmail = user.email.trim().toLowerCase();

      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('email', normalizedEmail)
        .is('user_id', null)
        .maybeSingle();

      if (subData) {
        await supabase
          .from('subscriptions')
          .update({ user_id: user.id })
          .eq('email', normalizedEmail)
          .is('user_id', null);
      }
    };
    linkSubscription();
  }, []);

  // Mock user data - remove this when real user data is available
  const mockUser = {
    firstName: 'Amro'
  };
  const userName = user?.firstName || mockUser.firstName;

  return (
    <div className="dashboard-container">
      {/* Left Column - Navigation */}
      <div className="left-column">
        <div className="logo-container">
          <Link href="/" className="logo gradient-text">
            TPC
          </Link>
        </div>
        
        <nav className="nav-menu">
          <Link href="/dashboard" className="nav-item active">
            Home
          </Link>
          <Link href="/career-journey" className="nav-item">
            Plan My Journey
          </Link>
          <Link href="/enrolled-courses" className="nav-item">
            Enrolled Courses
          </Link>
          <Link href="/saved-courses" className="nav-item">
            Saved Courses
          </Link>
          <div className="separator" />
          <Link href="/notes" className="nav-item">
            My Notes
          </Link>
          <Link href="/inside-projectx" className="nav-item">
            Inside ProjectX
          </Link>
          <Link href="/achievements" className="nav-item">
            Achievements
          </Link>
          <div className="separator" />
          <Link href="/about" className="nav-item">
            About Us
          </Link>
          <Link href="/contact" className="nav-item">
            Contact Us
          </Link>
          <Link href="/policies" className="nav-item">
            Policies
          </Link>
        </nav>
      </div>

      {/* Middle Column - Main Content */}
      <main className="middle-column">
        <div className="search-container">
          <input 
            type="search" 
            placeholder="Search courses..." 
            className="search-input"
          />
          <div className="user-controls">
            <button 
              className={`lang-switch ${language}`}
              onClick={toggleLanguage}
            >
              <span className="lang-option en">EN</span>
              <span className="lang-option ar">ع</span>
              <span className="lang-indicator"></span>
            </button>
            <button className="profile-button">
              <FiUser size={22} color="rgba(255, 255, 255, 0.9)" />
            </button>
          </div>
        </div>

        <section className="course-categories">
          <div className="categories-container">
            <button className="nav-arrow left" onClick={() => scroll('left', categoriesRef)}>
              <FiChevronLeft />
            </button>
            <div className="categories-scroll" ref={categoriesRef}>
              <button className="category-item active">
                <div className="icon-container">
                  <FiStar className="category-icon" />
                </div>
                <div className="text-container">
                  <span>All</span>
                </div>
              </button>
              <button className="category-item">
                <div className="icon-container">
                  <FiUsersCategory className="category-icon" />
                </div>
                <div className="text-container">
                  <span>Acting &<br/>Performing Arts</span>
                </div>
              </button>
              <button className="category-item">
                <div className="icon-container">
                  <FiPenTool className="category-icon" />
                </div>
                <div className="text-container">
                  <span>Art & Design</span>
                </div>
              </button>
              <button className="category-item">
                <div className="icon-container">
                  <FiBriefcase className="category-icon" />
                </div>
                <div className="text-container">
                  <span>Business</span>
                </div>
              </button>
              <button className="category-item">
                <div className="icon-container">
                  <FiHome className="category-icon" />
                </div>
                <div className="text-container">
                  <span>Community</span>
                </div>
              </button>
              <button className="category-item">
                <div className="icon-container">
                  <FiFilm className="category-icon" />
                </div>
                <div className="text-container">
                  <span>Film & TV</span>
                </div>
              </button>
              <button className="category-item">
                <div className="icon-container">
                  <FiCoffee className="category-icon" />
                </div>
                <div className="text-container">
                  <span>Food & Drink</span>
                </div>
              </button>
              <button className="category-item">
                <div className="icon-container">
                  <FiZap className="category-icon" />
                </div>
                <div className="text-container">
                  <span>Games</span>
                </div>
              </button>
              <button className="category-item">
                <div className="icon-container">
                  <FiHeart className="category-icon" />
                </div>
                <div className="text-container">
                  <span>Health</span>
                </div>
              </button>
            </div>
            <button className="nav-arrow right" onClick={() => scroll('right', categoriesRef)}>
              <FiChevronRight />
            </button>
          </div>
        </section>

        <div className="section-separator"></div>

        <section className="next-step-intro">
          <h2>What's the next step, <span>{userName}</span>?</h2>
        </section>

        <section className="trending-courses">
          <div className="section-header">
            <h2>Trending courses</h2>
          </div>
          <div className="courses-container">
            <button 
              className="nav-arrow left" 
              onClick={() => scroll('left', trendingCoursesRef)}
            >
              <FiChevronLeft />
            </button>
            <div className="courses-scroll" ref={trendingCoursesRef}>
              {mockTrendingCourses.map(course => (
                <div key={course.id} className="course-card">
                  <div 
                    className="course-image" 
                    style={{ backgroundImage: `url(${course.image})` }}
                  >
                    <span className="course-category">{course.category}</span>
                  </div>
                  <div className="course-content">
                    <h3>{course.title}</h3>
                    <div className="course-info">
                      <span>
                        <FiClock />
                        {course.duration}
                      </span>
                      <span>
                        <FiUsers />
                        {course.students} students
                      </span>
                    </div>
                    {course.progress > 0 && (
                      <div className="progress-bar">
                        <div 
                          className="progress" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="nav-arrow right" 
              onClick={() => scroll('right', trendingCoursesRef)}
            >
              <FiChevronRight />
            </button>
          </div>
        </section>

        <div className="recommended-goals">
          <div className="section-header">
            <h2>Recommended for Your Goals</h2>
            <div className="goal-tag">Frontend Development</div>
          </div>
          
          <div className="courses-container">
            <button className="nav-arrow" onClick={() => scroll('goals-scroll', 'left')}>
              <FiChevronLeft />
            </button>
            
            <div className="courses-scroll" ref={goalsCoursesRef}>
              <div className="course-card">
                <div className="course-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1555952517-2e8e729e0b44?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1764&q=80")' }}>
                  <div className="course-category">React</div>
                </div>
                <div className="course-content">
                  <h3>Advanced Component Patterns</h3>
                  <div className="course-info">
                    <span><FiClock /> 8h 45m</span>
                    <span><FiUsers /> 4.2k students</span>
                  </div>
                  <div className="goal-progress">
                    <div className="progress-text">
                      <span>Aligns with: UI Architecture</span>
                      <span>85% match</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="course-card">
                <div className="course-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80")' }}>
                  <div className="course-category">TypeScript</div>
                </div>
                <div className="course-content">
                  <h3>TypeScript for React Developers</h3>
                  <div className="course-info">
                    <span><FiClock /> 6h 30m</span>
                    <span><FiUsers /> 3.8k students</span>
                  </div>
                  <div className="goal-progress">
                    <div className="progress-text">
                      <span>Aligns with: Type Safety</span>
                      <span>92% match</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="course-card">
                <div className="course-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1618788372246-79faff0c3742?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80")' }}>
                  <div className="course-category">Testing</div>
                </div>
                <div className="course-content">
                  <h3>Testing React Applications</h3>
                  <div className="course-info">
                    <span><FiClock /> 7h 15m</span>
                    <span><FiUsers /> 2.9k students</span>
                  </div>
                  <div className="goal-progress">
                    <div className="progress-text">
                      <span>Aligns with: Code Quality</span>
                      <span>78% match</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="course-card">
                <div className="course-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80")' }}>
                  <div className="course-category">Performance</div>
                </div>
                <div className="course-content">
                  <h3>React Performance Optimization</h3>
                  <div className="course-info">
                    <span><FiClock /> 5h 20m</span>
                    <span><FiUsers /> 3.1k students</span>
                  </div>
                  <div className="goal-progress">
                    <div className="progress-text">
                      <span>Aligns with: Optimization</span>
                      <span>88% match</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button className="nav-arrow" onClick={() => scroll('goals-scroll', 'right')}>
              <FiChevronRight />
            </button>
          </div>
        </div>
      </main>

      {/* Right Column - Course Info */}
      <div className="right-column">
        <div className="scrollable-content">
          <div className="last-viewed-course">
            <h3>Last Viewed Course</h3>
            <div className="course-preview">
              <div className="course-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60")' }}></div>
              <div className="course-details">
                <h4>Advanced React Patterns</h4>
                <div className="course-progress">
                  <div className="progress-text">65% Complete</div>
                  <div className="progress-bar">
                    <div className="progress" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
              <button className="resume-button">RESUME</button>
            </div>
          </div>

          <div className="instructor-info">
            <h3>ABOUT THE INSTRUCTOR</h3>
            <div className="instructor-preview">
              <div className="instructor-header">
                <div className="instructor-image">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Instructor" />
                </div>
                <div className="instructor-details">
                  <h4 className="instructor-name">Sarah Johnson</h4>
                  <p className="instructor-title">Senior Frontend Developer</p>
                </div>
              </div>
              <p className="instructor-description">Expert in React and modern web development with 8+ years of experience building scalable applications.</p>
              <button className="view-more-button">VIEW MORE</button>
            </div>
          </div>

          <div className="course-credits">
            <h3>COURSE CREDITS</h3>
            <div className="credits-list">
              <div className="credit-item">
                <div className="credit-role">Course Producer</div>
                <div className="credit-name">Michael Chen</div>
              </div>
              <div className="credit-item">
                <div className="credit-role">Technical Director</div>
                <div className="credit-name">Emily Rodriguez</div>
              </div>
              <div className="credit-item">
                <div className="credit-role">Content Developer</div>
                <div className="credit-name">David Kim</div>
              </div>
              <div className="credit-item">
                <div className="credit-role">Video Editor</div>
                <div className="credit-name">Lisa Thompson</div>
              </div>
              <div className="credit-item">
                <div className="credit-role">Graphics Designer</div>
                <div className="credit-name">James Wilson</div>
              </div>
              <div className="credit-item">
                <div className="credit-role">Quality Assurance</div>
                <div className="credit-name">Anna Martinez</div>
              </div>
              <div className="credit-item">
                <div className="credit-role">Technical Reviewer</div>
                <div className="credit-name">Robert Taylor</div>
              </div>
              <div className="credit-item">
                <div className="credit-role">Curriculum Advisor</div>
                <div className="credit-name">Sophie Anderson</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  // For now, we'll pass null as user since we haven't implemented authentication yet
  return <Dashboard user={null} />;
} 