'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/course-slider.scss';
import Link from 'next/link';

const categories = ['All', 'Academics', 'Entrepreneurship', 'Fitness', 'Soft Skills'];

// Mock course data with Unsplash image URLs
const courses = [
  {
    id: 1,
    title: 'Advanced Mathematics',
    category: 'Academics',
    instructor: 'Dr. Ahmed Hassan',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    duration: '12 hours',
    description: 'Master complex mathematical concepts with real-world applications'
  },
  {
    id: 2,
    title: 'Startup Fundamentals',
    category: 'Entrepreneurship',
    instructor: 'Sarah Al-Mansoori',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    duration: '8 hours',
    description: 'Learn the essentials of building and scaling your startup'
  },
  {
    id: 3,
    title: 'High-Intensity Training',
    category: 'Fitness',
    instructor: 'Mohammed Khalid',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    duration: '6 hours',
    description: 'Transform your body with professional training techniques'
  },
  {
    id: 4,
    title: 'Public Speaking Mastery',
    category: 'Soft Skills',
    instructor: 'Layla Al-Rashid',
    thumbnail: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    duration: '10 hours',
    description: 'Become a confident and compelling public speaker'
  },
  {
    id: 5,
    title: 'Quantum Physics',
    category: 'Academics',
    instructor: 'Dr. Yasmine El-Sayed',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    duration: '15 hours',
    description: 'Explore the fascinating world of quantum mechanics'
  },
  {
    id: 6,
    title: 'Digital Marketing Strategy',
    category: 'Entrepreneurship',
    instructor: 'Omar Al-Farsi',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    duration: '9 hours',
    description: 'Master digital marketing for business growth'
  },
  {
    id: 7,
    title: 'Yoga & Mindfulness',
    category: 'Fitness',
    instructor: 'Aisha Rahman',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    duration: '7 hours',
    description: 'Find balance through yoga and mindfulness practices'
  },
  {
    id: 8,
    title: 'Leadership Excellence',
    category: 'Soft Skills',
    instructor: 'Khalid Al-Mansoori',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    duration: '11 hours',
    description: 'Develop essential leadership skills for success'
  }
];

const CourseSlider = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  const filteredCourses = selectedCategory === 'All' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  const visibleCourses = 4; // Number of courses to show at once
  const totalSlides = Math.ceil(filteredCourses.length / visibleCourses);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  };

  const getVisibleCourses = () => {
    const start = currentIndex * visibleCourses;
    return filteredCourses.slice(start, start + visibleCourses);
  };

  return (
    <section className="course-slider">
      <div className="container">
        <div className="course-slider__header">
          <div className="course-slider__title">
            <h2 className="gradient-text">Featured Courses</h2>
            <p>Discover our most popular and highly-rated courses</p>
          </div>
          <div className="course-slider__filters">
            {categories.map((category) => (
              <motion.button
                key={category}
                className={`course-slider__filter ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentIndex(0);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
          <div className="course-slider__controls">
            <button className="course-slider__control" onClick={prevSlide}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="course-slider__control" onClick={nextSlide}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="course-slider__container" ref={sliderRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="course-slider__row"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              {getVisibleCourses().map((course) => (
                <motion.div
                  key={course.id}
                  className="course-card"
                  onHoverStart={() => setHoveredCourse(course.id)}
                  onHoverEnd={() => setHoveredCourse(null)}
                  whileHover={{ scale: 1.05, zIndex: 1 }}
                >
                  <div className="course-card__thumbnail">
                    <img src={course.thumbnail} alt={course.title} />
                    <div className="course-card__overlay" />
                  </div>
                  <div className="course-card__content">
                    <h3>{course.title}</h3>
                    <p className="course-card__instructor">{course.instructor}</p>
                    <p className="course-card__duration">{course.duration}</p>
                  </div>
                  {hoveredCourse === course.id && (
                    <motion.div
                      className="course-card__hover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="course-card__description">
                        {course.description}
                      </div>
                      <div className="course-card__actions">
                        <button className="course-card__play">Watch Now</button>
                        <Link href={`/course/${course.id}`} className="course-card__info">More Info</Link>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default CourseSlider; 