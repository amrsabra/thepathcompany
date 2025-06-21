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

  // Demo testimonials
  const testimonials = [
    {
      name: "Sarah Al-Rashid",
      role: "Software Engineer",
      company: "TechCorp Dubai",
      image: "/images/testimonial-1.jpg",
      rating: 5,
      text: "TPC transformed my career journey. The cinematic approach to learning made complex topics engaging and memorable. I've gained practical skills that I use daily in my role."
    },
    {
      name: "Ahmed Hassan",
      role: "Marketing Director",
      company: "Digital Solutions MENA",
      image: "/images/testimonial-2.jpg",
      rating: 5,
      text: "The quality of courses here is unmatched. The instructors are industry experts who bring real-world experience. The Plan My Career tool helped me choose the perfect learning path."
    },
    {
      name: "Layla Mansour",
      role: "UX Designer",
      company: "Creative Studio Riyadh",
      image: "/images/testimonial-3.jpg",
      rating: 5,
      text: "As someone who struggled with traditional learning methods, TPC's innovative approach was a game-changer. The visual storytelling and practical projects made learning enjoyable."
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

        <MembershipBenefits />
        <CourseSlider />
        <ComingSoonSlider />

        {/* Testimonials Section */}
        <section className="testimonials" ref={testimonialsRef}>
          <div className="container">
            <motion.div
              className="testimonials__header"
              initial={{ opacity: 0, y: 30 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="section-title">What Our Learners Say</h2>
              <p className="section-subtitle">Join thousands of satisfied learners who have transformed their careers with TPC</p>
            </motion.div>
            
            <div className="testimonials__grid">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="testimonial-card"
                  initial={{ opacity: 0, y: 50 }}
                  animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <div className="testimonial-card__rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FiStar key={i} className="star-icon" />
                    ))}
                  </div>
                  <p className="testimonial-card__text">"{testimonial.text}"</p>
                  <div className="testimonial-card__author">
                    <div className="testimonial-card__avatar">
                      <div className="avatar-placeholder">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="testimonial-card__info">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
