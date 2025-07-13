"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiBookOpen, FiAward, FiClock, FiUser, FiCpu, FiZap, FiSettings, FiCode, FiMap, FiEye, FiTrendingUp, FiActivity, FiSearch, FiCheck, FiArrowLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import '@mux/mux-player';
import '../../../styles/coursecatalog/test.scss';
import { ContainerTextFlip } from "@/components/ui/container-text-flip";

export default function CourseCatalogPage() {
  const [expandedModules, setExpandedModules] = useState({});
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowSticky(window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleModule = (moduleIndex) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleIndex]: !prev[moduleIndex]
    }));
  };
  const courses = [
    {
      img: 'https://placehold.co/400x600?text=Robotics',
      title: 'Intro to Robotics',
      subtitle: 'With Leading Experts',
      duration: '1 hour 30 minutes',
    },
    {
      img: 'https://placehold.co/400x600?text=AI',
      title: 'AI for Beginners',
      subtitle: 'With Top Instructors',
      duration: '1 hour 13 minutes',
    },
    {
      img: 'https://placehold.co/400x600?text=Embedded',
      title: 'Embedded Systems 101',
      subtitle: 'With Industry Pros',
      duration: '1 hour 27 minutes',
    },
    {
      img: 'https://placehold.co/400x600?text=Automation',
      title: 'Automation Essentials',
      subtitle: 'By Automation Gurus',
      duration: '1 hour 10 minutes',
    },
    {
      img: 'https://placehold.co/400x600?text=IoT',
      title: 'IoT Fundamentals',
      subtitle: 'With IoT Innovators',
      duration: '1 hour 22 minutes',
    },
    {
      img: 'https://placehold.co/400x600?text=Machine+Learning',
      title: 'Machine Learning Basics',
      subtitle: 'With Data Scientists',
      duration: '1 hour 18 minutes',
    },
    {
      img: 'https://placehold.co/400x600?text=Control+Systems',
      title: 'Control Systems',
      subtitle: 'By Control Experts',
      duration: '1 hour 25 minutes',
    },
    {
      img: 'https://placehold.co/400x600?text=Electronics',
      title: 'Electronics for Makers',
      subtitle: 'With Maker Pros',
      duration: '1 hour 15 minutes',
    },
  ];
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const scrolling = React.useRef(false);

  // Arrow navigation (transform-based only)
  const scrollCarousel = (dir) => {
    if (scrolling.current) return;
    let next = currentIndex;
    if (dir === 'left' && currentIndex > 0) {
      next = currentIndex - 1;
    } else if (dir === 'right' && currentIndex < courses.length - 3) {
      next = currentIndex + 1;
    }
    if (next === currentIndex) return;
    scrolling.current = true;
    setCurrentIndex(next);
    setTimeout(() => { scrolling.current = false; }, 420);
  };

  // Trackpad/wheel navigation (one card per scroll, always precise)
  React.useEffect(() => {
    const wrapper = document.querySelector('.related-courses-carousel-wrapper');
    if (!wrapper) return;
    let wheelTimeout;
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) < 10) return; // ignore tiny scrolls
      e.preventDefault();
      if (scrolling.current) return;
      let next = currentIndex + (e.deltaX > 0 ? 1 : -1);
      next = Math.max(0, Math.min(next, courses.length - 3));
      if (next === currentIndex) return;
      scrolling.current = true;
      setCurrentIndex(next);
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => { scrolling.current = false; }, 420);
    };
    wrapper.addEventListener('wheel', onWheel, { passive: false });
    return () => wrapper.removeEventListener('wheel', onWheel);
  }, [currentIndex, courses.length]);

  // Remove carousel constants and revert to previous logic

  return (
    <div className="test-course-page">
      <button className="back-btn" onClick={() => window.history.back()}>
        <FiArrowLeft className="back-btn-icon" />
        <span>Back</span>
      </button>
      <div className="test-course-content">
        <mux-player
          playback-id="e2GsHPL1hyonXQE763o6mxRNkJN01f00oNJ7yv3pq3nUc"
          class="test-course-video"
        />
        <h1 className="test-course-title">The Art of Mechatronic Engineering</h1>
        <div className="test-course-separator" />
        <div className="test-course-instructor">
          <img src="/logo.png" alt="TPC Icon" className="tpc-icon" />
          <span className="tpc-x">x</span>
          <span className="tpc-instructor-name">Amro Sabra</span>
        </div>
        {/* Watch Now Button */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '32px 0 24px 0' }}>
          <button
            className="watch-now-btn"
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          >
            Watch Now
          </button>
        </div>
      </div>

      <div className="course-curriculum">
        <div className="curriculum-modules">
          {[
            {
              title: "Module 1: Foundation & Theory",
              lessons: [
                { number: "01", title: "Introduction to Autonomous Systems", description: "Understanding the fundamentals of autonomous navigation and control", duration: "18 min" },
                { number: "02", title: "Mechatronic System Design", description: "Integrating mechanical, electrical, and software components", duration: "25 min" },
                { number: "03", title: "Control System Fundamentals", description: "PID control, feedback loops, and system stability", duration: "22 min" }
              ]
            },
            {
              title: "Module 2: Hardware Integration",
              lessons: [
                { number: "04", title: "Motor Control & Actuation", description: "DC motors, stepper motors, and motor driver circuits", duration: "30 min" },
                { number: "05", title: "Sensor Integration", description: "GPS, IMU, encoders, and environmental sensors", duration: "28 min" },
                { number: "06", title: "Power Management Systems", description: "Battery selection, voltage regulation, and power distribution", duration: "20 min" }
              ]
            },
            {
              title: "Module 3: Software & Algorithms",
              lessons: [
                { number: "07", title: "Path Planning Algorithms", description: "A*, RRT, and dynamic path planning for autonomous navigation", duration: "35 min" },
                { number: "08", title: "SLAM Implementation", description: "Simultaneous Localization and Mapping for unknown environments", duration: "40 min" },
                { number: "09", title: "Computer Vision Integration", description: "Camera calibration, object detection, and visual navigation", duration: "32 min" }
              ]
            },
            {
              title: "Module 4: Advanced Features",
              lessons: [
                { number: "10", title: "Multi-Sensor Fusion", description: "Combining data from multiple sensors for robust navigation", duration: "38 min" },
                { number: "11", title: "Machine Learning Integration", description: "Neural networks for terrain classification and obstacle avoidance", duration: "45 min" },
                { number: "12", title: "Real-time Communication", description: "Wireless communication protocols and remote monitoring", duration: "25 min" }
              ]
            },
            {
              title: "Module 5: Testing & Deployment",
              lessons: [
                { number: "13", title: "Simulation & Testing", description: "Using Gazebo and ROS for virtual testing and validation", duration: "30 min" },
                { number: "14", title: "Field Testing & Optimization", description: "Real-world testing, performance tuning, and reliability", duration: "35 min" },
                { number: "15", title: "Project Showcase & Next Steps", description: "Final project presentation and career advancement strategies", duration: "20 min" }
              ]
            }
          ].map((module, moduleIndex) => (
            <div key={moduleIndex} className="module-item">
              <div 
                className="module-header"
                onClick={() => toggleModule(moduleIndex)}
              >
                <h3>{module.title}</h3>
                <div className="module-meta">
                  <span className="lesson-count">{module.lessons.length} lessons</span>
                  <span className="total-duration">
                    {module.lessons.reduce((total, lesson) => total + parseInt(lesson.duration), 0)} min
                  </span>
                  {expandedModules[moduleIndex] ? <FiChevronUp /> : <FiChevronDown />}
                </div>
              </div>
              
              <AnimatePresence>
                {expandedModules[moduleIndex] && (
                  <motion.div
                    className="module-lessons"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="lesson-item">
                        <div className="lesson-info">
                          <span className="lesson-number">{lesson.number}</span>
                          <div className="lesson-details">
                            <h4>{lesson.title}</h4>
                            <p>{lesson.description}</p>
                          </div>
                        </div>
                        <span className="lesson-duration">{lesson.duration}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
      
      {/* Instructor Section */}
      <div className="instructor-section">
        <img src="/logo.png" alt="Amro Sabra" className="instructor-photo" />
        <div className="instructor-info">
          <h3>About Amro Sabra</h3>
          <p className="instructor-bio">
            Amro Sabra is a passionate educator and engineer with a deep background in robotics, mechatronics, and AI. He has led multidisciplinary teams in both academia and industry, and is dedicated to making advanced engineering accessible to all.
          </p>
          <div className="instructor-credentials">
            <strong>Credentials:</strong>
            <ul>
              <li>MSc in Mechatronics Engineering</li>
              <li>Lead Robotics Engineer, TPC</li>
              <li>10+ years teaching & mentoring</li>
            </ul>
          </div>
          <div className="instructor-philosophy">
            <strong>Teaching Philosophy:</strong>
            <p>
              "I believe in hands-on, project-based learning that empowers students to solve real-world problems. My goal is to inspire curiosity, creativity, and confidence in every learner."
            </p>
          </div>
        </div>
      </div>

      {/* Skills You Will Learn Section */}
      <div className="skills-learn-section">
        <h3>Skills you will learn</h3>
        <div className="skills-learn-groups">
          <div className="skills-learn-group">
            <strong>Build Real Systems</strong>
            <ul>
              <li><span className="checkmark-icon"><FiCheck /></span><span className="checkmark-text">Build autonomous robots</span></li>
              <li><span className="checkmark-icon"><FiCheck /></span><span className="checkmark-text">Integrate sensors</span></li>
              <li><span className="checkmark-icon"><FiCheck /></span><span className="checkmark-text">Program navigation</span></li>
              <li><span className="checkmark-icon"><FiCheck /></span><span className="checkmark-text">Test in real-world</span></li>
            </ul>
          </div>
          <div className="skills-learn-group">
            <strong>Master Core Concepts</strong>
            <ul>
              <li><span className="checkmark-icon"><FiCheck /></span><span className="checkmark-text">Mechatronic design</span></li>
              <li><span className="checkmark-icon"><FiCheck /></span><span className="checkmark-text">Embedded programming</span></li>
              <li><span className="checkmark-icon"><FiCheck /></span><span className="checkmark-text">Path planning & SLAM</span></li>
              <li><span className="checkmark-icon"><FiCheck /></span><span className="checkmark-text">Computer vision basics</span></li>
            </ul>
          </div>
          <div className="skills-learn-group">
            <strong>Advance Your Career</strong>
            <ul>
              <li><span className="checkmark-icon"><FiCheck /></span><span className="checkmark-text">Robotics engineering</span></li>
              <li><span className="checkmark-icon"><FiCheck /></span><span className="checkmark-text">Automation specialist</span></li>
              <li><span className="checkmark-icon"><FiCheck /></span><span className="checkmark-text">AI/ML for hardware</span></li>
              <li><span className="checkmark-icon"><FiCheck /></span><span className="checkmark-text">R&D project experience</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Message */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            className="sticky-bottom-message"
            initial={{ opacity: 0, y: 600 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 600 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <div className="sticky-message-content">
              <div className="sticky-message-left">
                <div className="sticky-course-info">
                  <img src="/logo.png" alt="TPC" className="sticky-logo" />
                  <div className="sticky-course-details">
                    <h3>The Art of Mechatronic Engineering</h3>
                    <p>Access all courses at anytime for $10/month</p>
                  </div>
                </div>
              </div>
              <div className="sticky-message-right">
                <button className="sticky-enroll-btn">Join TPC</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Testimonial Area */}
      <div className="testimonial-area" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '48px 0 32px 0' }}>
        <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '20px', padding: '32px 40px', maxWidth: 700, boxShadow: '0 4px 32px 0 rgba(0,0,0,0.10)', textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: 28, fontWeight: 600, fontStyle: 'italic', marginBottom: 20, lineHeight: 1.3 }}>
            <ContainerTextFlip words={[
              "This course gave me the confidence to build my own robot from scratch. The hands-on approach and clear explanations made complex topics easy to understand.",
              "The projects were fun and practical. I learned more in a few weeks than I did in a whole semester!",
              "Amro's teaching style is engaging and motivating. I finally understand how all the pieces fit together.",
              "Highly recommended for anyone interested in robotics or mechatronics!"
            ]} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <img src="/logoicon.png" alt="Student" style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff' }} />
            <span style={{ fontWeight: 500, fontSize: 18 }}>TPC Students</span>
          </div>
        </div>
      </div>

      {/* Related Courses Section */}
      <div className="related-courses-section">
        <div className="related-courses-header">
          <h3>Related Courses</h3>
          <div className="carousel-arrows-topright">
            <button className="carousel-arrow left" onClick={() => scrollCarousel('left')} disabled={currentIndex === 0}><FiChevronLeft /></button>
            <button className="carousel-arrow right" onClick={() => scrollCarousel('right')} disabled={currentIndex === courses.length - 3}><FiChevronRight /></button>
          </div>
        </div>
        <div className="related-courses-carousel-wrapper" style={{ overflow: 'hidden', width: '90vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <motion.div
            className="related-courses-carousel"
            animate={{ x: -(currentIndex * 312) }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ display: 'flex', width: '924px', maxWidth: '100%', margin: 0, paddingRight: 0 }}
          >
            {courses.map((course, idx) => (
              <a href="#" className="carousel-card" key={idx} style={{ minWidth: 300, marginRight: idx !== courses.length - 1 ? 12 : 0 }}>
                <div className="carousel-bg" style={{ backgroundImage: `url(${course.img})` }} />
                <div className="carousel-overlay">
                  <div className="carousel-title">{course.title}</div>
                  <div className="carousel-subtitle">{course.subtitle}</div>
                  <div className="carousel-duration">{course.duration}</div>
                </div>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}