'use client';

import { useState } from 'react';
import Header from '../../components/Header/Header';
import { FiArrowRight, FiCode, FiBriefcase, FiHeart, FiZap } from 'react-icons/fi';
import '../../styles/campuses.scss';

const campuses = [
  {
    id: 1,
    name: 'Engineering Campus',
    description: 'Master the art of building and innovating. From software engineering to mechanical systems.',
    icon: <FiCode />,
    color: '#872B97',
    courses: 24,
    students: '12.5k',
    skills: ['Software Development', 'System Design', 'Problem Solving']
  },
  {
    id: 2,
    name: 'Medical Campus',
    description: 'Dive into the world of healthcare and medical sciences. Learn from leading medical professionals.',
    icon: <FiHeart />,
    color: '#FF3C68',
    courses: 18,
    students: '8.3k',
    skills: ['Clinical Skills', 'Medical Research', 'Patient Care']
  },
  {
    id: 3,
    name: 'Entrepreneurship Campus',
    description: 'Develop entrepreneurial skills and business acumen. From startups to corporate leadership.',
    icon: <FiBriefcase />,
    color: '#FF7130',
    courses: 21,
    students: '15.2k',
    skills: ['Entrepreneurship', 'Business Strategy', 'Leadership']
  },
  {
    id: 4,
    name: 'Personal Development Campus',
    description: 'Enhance your soft skills and personal growth. Leadership, communication, and emotional intelligence.',
    icon: <FiZap />,
    color: '#00BFA5',
    courses: 16,
    students: '9.7k',
    skills: ['Communication', 'Leadership', 'Emotional Intelligence']
  }
];

const Campuses = () => {
  const [hoveredCampus, setHoveredCampus] = useState(null);

  return (
    <div className="campuses-page">
      <Header forceSolid={true} />
      
      <main className="campuses-container">
        <div className="campuses-header">
          <h1>TPC Learning Ecosystem</h1>
          <div className="gradient-line"></div>
          <p>Immerse yourself in specialized learning environments designed for your field of interest</p>
        </div>

        <div className="campuses-grid">
          {campuses.map((campus) => (
            <div 
              key={campus.id}
              className={`campus-card ${hoveredCampus === campus.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredCampus(campus.id)}
              onMouseLeave={() => setHoveredCampus(null)}
            >
              <div className="campus-content">
                <div className="campus-header">
                  <div className="campus-icon" style={{ color: campus.color }}>
                    {campus.icon}
                  </div>
                  <h2>{campus.name}</h2>
                </div>
                <p>{campus.description}</p>
                <div className="campus-stats">
                  <span>{campus.courses} Courses</span>
                  <span>{campus.students} Students</span>
                </div>
                <div className="skills-list">
                  {campus.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
                <button className="explore-button">
                  Explore Campus
                  <FiArrowRight />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Campuses; 