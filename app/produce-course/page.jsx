'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/header/Header';
import '../../styles/produce-course.scss';

const ProduceCourse = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    profession: '',
    position: '',
    expertise: '',
    courseIdea: '',
    hasTeachingExperience: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.hasTeachingExperience) {
      alert('Please select whether you have teaching experience.');
      return;
    }
    // TODO: Handle form submission
    console.log(formData);
  };

  return (
    <div className="produce-course">
      <Header forceSolid={true} />
      <div className="produce-course__hero">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Share Your Expertise
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Join our community of expert instructors and help others grow
        </motion.p>
      </div>

      <div className="produce-course__container">
        <motion.div 
          className="produce-course__form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <form onSubmit={handleSubmit} className="produce-course__form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">First & Last Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="profession">Profession</label>
              <input
                type="text"
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
                placeholder="e.g., Software Engineer, Business Consultant"
              />
            </div>

            <div className="form-group">
              <label htmlFor="position">Current Position</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                placeholder="e.g., Senior Developer, Team Lead"
              />
            </div>

            <div className="form-group">
              <label htmlFor="expertise">Area of Expertise</label>
              <input
                type="text"
                id="expertise"
                name="expertise"
                value={formData.expertise}
                onChange={handleChange}
                required
                placeholder="e.g., React Development, Digital Marketing"
              />
            </div>

            <div className="form-group">
              <label htmlFor="courseIdea">Course Idea</label>
              <textarea
                id="courseIdea"
                name="courseIdea"
                value={formData.courseIdea}
                onChange={handleChange}
                required
                placeholder="Brief description of your course idea and what students will learn"
              />
            </div>

            <div className="form-group">
              <label htmlFor="hasTeachingExperience">Do you have any teaching experience?<span className="required">*</span></label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="hasTeachingExperience"
                    value="yes"
                    checked={formData.hasTeachingExperience === 'yes'}
                    onChange={handleChange}
                    required
                  />
                  <span>Yes</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="hasTeachingExperience"
                    value="no"
                    checked={formData.hasTeachingExperience === 'no'}
                    onChange={handleChange}
                    required
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            <button type="submit" className="submit-button">
              Register Interest
            </button>
          </form>
        </motion.div>

        <motion.div 
          className="produce-course__info"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="info-card">
            <h3>Why Produce With Us?</h3>
            <ul>
              <li>
                <span className="icon">💡</span>
                <div>
                  <h4>Share Your Knowledge</h4>
                  <p>Impact thousands of learners worldwide with your expertise</p>
                </div>
              </li>
              <li>
                <span className="icon">💪</span>
                <div>
                  <h4>Full Production Support</h4>
                  <p>Get access to professional recording equipment and editing team</p>
                </div>
              </li>
              <li>
                <span className="icon">📈</span>
                <div>
                  <h4>Earn Revenue</h4>
                  <p>Competitive revenue sharing model for your courses</p>
                </div>
              </li>
              <li>
                <span className="icon">🌟</span>
                <div>
                  <h4>Build Your Brand</h4>
                  <p>Establish yourself as an industry expert</p>
                </div>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProduceCourse; 