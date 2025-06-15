'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiBook, 
  FiHeart, 
  FiCode, 
  FiBriefcase, 
  FiMusic, 
  FiFilm,
  FiCoffee,
  FiZap,
  FiChevronRight
} from 'react-icons/fi';
import Header from '../../components/Header/Header';
import '../../styles/courses.scss';

const Courses = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Courses', icon: <FiBook /> },
    { id: 'self-dev', name: 'Self Development', icon: <FiHeart /> },
    { id: 'tech', name: 'Technology', icon: <FiCode /> },
    { id: 'business', name: 'Business', icon: <FiBriefcase /> },
    { id: 'creative', name: 'Creative Arts', icon: <FiMusic /> },
    { id: 'media', name: 'Media & Film', icon: <FiFilm /> },
    { id: 'lifestyle', name: 'Lifestyle', icon: <FiCoffee /> },
    { id: 'gaming', name: 'Gaming', icon: <FiZap /> }
  ];

  // Mock course data - in a real app, this would come from an API
  const courses = [
    {
      id: 1,
      title: "Mastering Personal Growth",
      category: 'self-dev',
      instructor: "Sarah Johnson",
      rating: 4.8,
      duration: "12 hours",
      thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=500&h=300"
    },
    {
      id: 2,
      title: "Web Development Bootcamp",
      category: 'tech',
      instructor: "Mike Chen",
      rating: 4.9,
      duration: "24 hours",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=500&h=300"
    },
    {
      id: 3,
      title: "Business Strategy Fundamentals",
      category: 'business',
      instructor: "David Wilson",
      rating: 4.7,
      duration: "8 hours",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&h=300"
    },
    {
      id: 4,
      title: "Digital Photography Masterclass",
      category: 'creative',
      instructor: "Emma Thompson",
      rating: 4.9,
      duration: "16 hours",
      thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244ef32?auto=format&fit=crop&w=500&h=300"
    },
    {
      id: 5,
      title: "Video Production Essentials",
      category: 'media',
      instructor: "James Rodriguez",
      rating: 4.6,
      duration: "10 hours",
      thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=500&h=300"
    },
    {
      id: 6,
      title: "Healthy Living & Wellness",
      category: 'lifestyle',
      instructor: "Lisa Anderson",
      rating: 4.8,
      duration: "6 hours",
      thumbnail: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=500&h=300"
    },
    {
      id: 7,
      title: "Game Development Fundamentals",
      category: 'gaming',
      instructor: "Alex Turner",
      rating: 4.7,
      duration: "20 hours",
      thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&h=300"
    }
  ];

  const filteredCourses = activeCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === activeCategory);

  return (
    <div className="courses-page">
      <Header forceSolid={true} />
      
      <div className="courses-hero">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Explore Our Courses
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Discover a world of knowledge across various categories
        </motion.p>
      </div>

      <div className="courses-container">
        <div className="categories-sidebar">
          <h3>Categories</h3>
          <div className="categories-list">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="courses-grid">
          {filteredCourses.map(course => (
            <motion.div
              key={course.id}
              className="course-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="course-thumbnail">
                <img src={course.thumbnail} alt={course.title} />
              </div>
              <div className="course-content">
                <h3>{course.title}</h3>
                <p className="instructor">By {course.instructor}</p>
                <div className="course-stats">
                  <span className="rating">★ {course.rating}</span>
                  <span className="duration">{course.duration}</span>
                </div>
                <button className="view-course">
                  <span>View Course</span> <FiChevronRight />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses; 