'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiChevronDown, FiChevronUp, FiStar } from 'react-icons/fi';
import PersonalizationFlow from './PersonalizationFlow';
import CourseSlider from './CourseSlider';
import MembershipBenefits from './MembershipBenefits';
import ComingSoonSlider from './ComingSoonSlider';
import Header from './Header/Header';
import Footer from './Footer';
import '../styles/homepage.scss';
import '../styles/course-slider.scss';
import '../styles/membership-benefits.scss';
import '../styles/coming-soon-slider.scss';
import { ThreeDMarquee } from '@/components/ui/3d-marquee';

const Homepage = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [faqRef, faqInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [forceSolid, setForceSolid] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);

  const handlePersonalizationComplete = (answers) => {
    console.log('Personalization answers:', answers);
    setShowPersonalization(false);
  };

  const handleSubscribe = () => {
    window.location.href = '/plans';
  };

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  // Selected FAQ questions from the FAQ page
  const faqData = [
    {
      question: "What makes TPC different from other learning platforms?",
      answer: "We strive to leverage innovation not just to improve the quality of learning, but to transform the entire experience for our learners. By constantly introducing new ideas, tools, and features, we aim to make education more engaging, more accessible, and more powerful."
    },
    {
      question: "What types of courses do you offer?",
      answer: "We offer a wide range of courses across various fields including technology, business, design, and personal development. Our courses are created by industry experts and are regularly updated to keep up with the latest trends and technologies."
    },
    {
      question: "What is the Plan My Career tool?",
      answer: "Plan My Career is our AI-powered career planning tool that helps you identify the best learning path based on your goals, skills, and interests. It provides personalized course recommendations and career guidance."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including credit/debit cards, PayPal, and local payment methods specific to the MENA region. All payments are processed securely through our trusted payment partners."
    }
  ];

  // ✅ Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setForceSolid(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Header forceSolid={forceSolid} />
      <div className="homepage">
        <section className="hero" ref={heroRef}>
          <div className="hero__background">
            <div className="hero__gradient-overlay" />
            <div className="hero__particles" />
          </div>
          <div className="container">
            <div className="hero__columns">
              <div className="hero__left">
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
                </motion.div>
              </div>
              <div className="hero__right">
                <div className="marquee-wrapper">
                  <ThreeDMarquee
                    images={[
                      "https://assets.aceternity.com/cloudinary_bkp/3d-card.png",
                      "https://assets.aceternity.com/animated-modal.png",
                      "https://assets.aceternity.com/animated-testimonials.webp",
                      "https://assets.aceternity.com/cloudinary_bkp/Tooltip_luwy44.png",
                      "https://assets.aceternity.com/github-globe.png",
                      "https://assets.aceternity.com/glare-card.png",
                      "https://assets.aceternity.com/layout-grid.png",
                      "https://assets.aceternity.com/flip-text.png",
                      "https://assets.aceternity.com/hero-highlight.png",
                      "https://assets.aceternity.com/carousel.webp",
                      "https://assets.aceternity.com/placeholders-and-vanish-input.png",
                      "https://assets.aceternity.com/shooting-stars-and-stars-background.png",
                    ]}
                    className="custom-marquee"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <MembershipBenefits />
        <CourseSlider />
        <ComingSoonSlider />

        {/* FAQ Section */}
        <section className="faq-section" ref={faqRef}>
          <div className="container">
            <motion.div
              className="faq-section__header"
              initial={{ opacity: 0, y: 30 }}
              animate={faqInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-subtitle">Find answers to common questions about our platform and services</p>
            </motion.div>
            
            <div className="faq-section__grid">
              {faqData.map((faq, index) => (
                <motion.div
                  key={index}
                  className={`faq-item ${activeFAQ === index ? 'active' : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={faqInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="faq-item__question">
                    <h3>{faq.question}</h3>
                    {activeFAQ === index ? (
                      <FiChevronUp className="chevron-icon" />
                    ) : (
                      <FiChevronDown className="chevron-icon" />
                    )}
                  </div>
                  <div className="faq-item__answer">
                    <p>{faq.answer}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              className="faq-section__cta"
              initial={{ opacity: 0, y: 30 }}
              animate={faqInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p>Still have questions?</p>
              <button className="cta-button" onClick={() => window.location.href = '/faq'}>
                View All FAQs
              </button>
            </motion.div>
          </div>
        </section>

        {showPersonalization && (
          <PersonalizationFlow onComplete={handlePersonalizationComplete} />
        )}
      </div>
      <Footer />
    </>
  );
};

export default Homepage;
