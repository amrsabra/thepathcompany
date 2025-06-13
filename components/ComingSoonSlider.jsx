'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiBell } from 'react-icons/fi';
import '../styles/coming-soon-slider.scss';

// Mock data for upcoming courses
const upcomingCourses = [
  {
    id: 'cs1',
    title: 'LIQUID DEATH',
    description: 'Business Rebels: CEO Mike Cessario on Branding for Disruption',
    // Image by Austin Distel on Unsplash (Man in chair)
    thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80',
    releaseDate: 'Apr 24'
  },
  {
    id: 'cs2',
    title: 'BOBBIE FORMULA',
    description: 'Business Rebels: CEO Laura Modi on Turning Buyers Into Believers',
    // Image by CoWomen on Unsplash (Woman in green)
    thumbnail: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    releaseDate: 'May 1'
  },
  {
    id: 'cs3',
    title: 'ADVANCED AI',
    description: 'Exploring the Frontiers of Artificial Intelligence & Machine Learning',
    // Image by Possessed Photography on Unsplash (Abstract tech)
    thumbnail: 'https://images.unsplash.com/photo-1677759219429-56505710e582?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    releaseDate: 'May 15'
  },
  {
    id: 'cs4',
    title: 'SPACE EXPLORATION',
    description: 'The Future of Interstellar Travel and Colonization Efforts',
    // Image by NASA on Unsplash (Nebula)
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1776&q=80',
    releaseDate: 'Jun 1'
  }
];

const ComingSoonSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remindedCourses, setRemindedCourses] = useState(new Set());
  const sliderRef = useRef(null);
  const visibleCourses = 2; // Show 2 cards at a time like the image
  const totalSlides = Math.ceil(upcomingCourses.length / visibleCourses);

  const handleRemindMe = (courseId) => {
    setRemindedCourses(prev => {
      const newSet = new Set(prev);
      newSet.add(courseId);
      return newSet;
    });
    // Here you would typically make an API call to save the reminder
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  const getVisibleCourses = () => {
    const start = currentIndex * visibleCourses;
    // Handle wrapping around for the last slide if needed
    const items = [];
    for (let i = 0; i < visibleCourses; i++) {
      items.push(upcomingCourses[(start + i) % upcomingCourses.length]);
    }
    return items;
    // return upcomingCourses.slice(start, start + visibleCourses); // Simpler version if no wrap needed
  };

  return (
    <section className="coming-soon-slider">
      <div className="container">
        <h2 className="coming-soon-slider__title">Coming Soon</h2>
        <div className="coming-soon-slider__wrapper">
          <button className="coming-soon-slider__control prev" onClick={prevSlide}>
            <FiChevronLeft />
          </button>
          <div className="coming-soon-slider__container" ref={sliderRef}>
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentIndex} // Animate when index changes
                className="coming-soon-slider__row"
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {getVisibleCourses().map((course) => (
                  <div key={course.id} className="coming-soon-card">
                    <div className="coming-soon-card__date-tag">{course.releaseDate}</div>
                    <div className="coming-soon-card__remind-me">
                      <button 
                        className={`remind-me-button ${remindedCourses.has(course.id) ? 'reminded' : ''}`}
                        onClick={() => handleRemindMe(course.id)}
                      >
                        <FiBell />
                        <span>{remindedCourses.has(course.id) ? 'Reminded' : 'Remind Me'}</span>
                      </button>
                    </div>
                    <img src={course.thumbnail} alt={course.title} className="coming-soon-card__thumbnail" />
                    <div className="coming-soon-card__overlay"></div>
                    <div className="coming-soon-card__content">
                      <h3 className="coming-soon-card__title">{course.title}</h3>
                      <span className="coming-soon-card__separator"></span>
                      <p className="coming-soon-card__description">{course.description}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          <button className="coming-soon-slider__control next" onClick={nextSlide}>
            <FiChevronRight />
          </button>
        </div>
        {/* Optional Pagination Dots/Lines */}
        <div className="coming-soon-slider__pagination">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={`pagination-indicator ${currentIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
        {/* CTA Section */}
        <div className="coming-soon-slider__cta">
          <h3 className="coming-soon-slider__cta-title">Ready to start learning and finally reach your goals?</h3>
          <button className="coming-soon-slider__cta-button">
          I'm ready to begin
          </button>
        </div>
      </div>
    </section>
  );
};

export default ComingSoonSlider; 