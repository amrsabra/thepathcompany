'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiFacebook, 
  FiInstagram, 
  FiLinkedin, 
  FiMail, 
  FiClock,
  FiHelpCircle,
  FiUsers,
  FiArrowRight,
  FiYoutube
} from 'react-icons/fi';
import { BsTwitterX } from 'react-icons/bs';
import Header from '../../components/header/Header';
import '../../styles/contact-us.scss';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
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
    // TODO: Handle form submission
    console.log(formData);
  };

  return (
    <div className="contact-us">
      <Header forceSolid={true} />
      <div className="contact-us__hero">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Get in Touch
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          We're here to help and answer any questions you might have
        </motion.p>
      </div>

      <div className="contact-us__container">
        <motion.div 
          className="contact-us__form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="faq-prompt">
            <FiHelpCircle className="faq-icon" />
            <div className="faq-text">
              <h4>Looking for quick answers?</h4>
              <p>Check our FAQ section first</p>
            </div>
            <a href="/faq" className="faq-link">
              View FAQ <FiArrowRight />
            </a>
          </div>

          <form onSubmit={handleSubmit} className="contact-us__form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
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
                  placeholder="Your email address"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What is your message about?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="How can we help you?"
                rows={3}
              />
            </div>

            <button type="submit" className="submit-button">
              Send Message
            </button>
          </form>
        </motion.div>

        <motion.div 
          className="contact-us__info"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="info-card">
            <h3>Contact Information</h3>
            <ul>
              <li>
                <span className="icon">
                  <FiMail />
                </span>
                <div>
                  <h4>Email Us</h4>
                  <p>support@projectx.com</p>
                  <p>For fastest response Mon-Fri</p>
                </div>
              </li>
              <li>
                <span className="icon">
                  <FiClock />
                </span>
                <div>
                  <h4>Office Hours</h4>
                  <p>Monday - Friday</p>
                  <p>9:00 AM - 6:00 PM EST</p>
                </div>
              </li>
              <li>
                <span className="icon">
                  <FiUsers />
                </span>
                <div>
                  <h4>Connect With Us</h4>
                  <div className="social-links">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                      <FiFacebook />
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                      <FiYoutube />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                      <FiInstagram />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                      <FiLinkedin />
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs; 