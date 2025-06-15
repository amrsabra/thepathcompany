'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useRouter } from 'next/navigation';
import PersonalizationFlow from './PersonalizationFlow';
import CourseSlider from './CourseSlider';
import MembershipBenefits from './MembershipBenefits';
import ComingSoonSlider from './ComingSoonSlider';
import Header from './header/Header';
import '../styles/homepage.scss';
import '../styles/course-slider.scss';
import '../styles/membership-benefits.scss';
import '../styles/coming-soon-slider.scss';

const Homepage = () => {
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  const [showPersonalization, setShowPersonalization] = useState(false);

  const handlePersonalizationComplete = (answers) => {
    console.log('Personalization answers:', answers);
    setShowPersonalization(false);
    // Here you can handle the answers, e.g., store them in state or send to backend
  };

  const handleSubscribe = () => {
    // Redirect to subscription page
    window.location.href = '/plans';
  };

  return (
    <div className="homepage">
      <Header />
      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="hero__background">
          <div className="hero__gradient-overlay" />
          <div className="hero__particles" />
        </div>
        <div className="container">
          <motion.div
            className="hero__content"
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero__title">
              <img src="/logo.png" alt="The Path Company Logo" className="mx-auto mb-2 h-16 w-auto" />
              <br />
              Where Learning Meets
              <br />
              <span className="gradient-text">Cinematic Excellence</span>
            </h1>
            <p className="hero__subtitle">
              Transform your future with premium, handpicked courses designed for the next generation of Arab leaders.
            </p>
            <div className="hero__buttons">
              <motion.button
                className="hero__cta hero__cta--primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPersonalization(true)}
              >
                Personalise Your Experience
              </motion.button>
              <motion.button
                className="hero__cta hero__cta--secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubscribe}
              >
                Subscribe Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Membership Benefits Section */}
      <MembershipBenefits />

      {/* Course Slider Section */}
      <CourseSlider />

      {/* Coming Soon Slider Section (New) */}
      <ComingSoonSlider />

      {/* Personalization Flow */}
      {showPersonalization && (
        <PersonalizationFlow onComplete={handlePersonalizationComplete} />
      )}
    </div>
  );
};

export default Homepage; 
