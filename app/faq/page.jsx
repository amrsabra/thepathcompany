'use client';

import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import '../../styles/faq.scss';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqSections = [
    {
      title: "About The Path Company",
      questions: [
        {
          question: "What is TPC's mission?",
          answer: "At TPC, our mission is to empower learners through cinematic, high-quality courses that educate, inspire, and unlock real-world potential. We are committed to raising the standard of education across the MENA region and beyond."
        },
        {
          question: "What makes TPC different from other learning platforms?",
          answer: "We strive to leverage innovation not just to improve the quality of learning, but to transform the entire experience for our learners. By constantly introducing new ideas, tools, and features, we aim to make education more engaging, more accessible, and more powerful."
        }
      ]
    },
    {
      title: "Our Courses",
      questions: [
        {
          question: "What types of courses do you offer?",
          answer: "We offer a wide range of courses across various fields including technology, business, design, and personal development. Our courses are created by industry experts and are regularly updated to keep up with the latest trends and technologies."
        },
        {
          question: "Who are the instructors?",
          answer: "Our instructors are industry professionals, subject matter experts, and experienced educators who bring real-world experience and practical knowledge to their teaching. Each instructor is carefully selected based on their expertise and teaching ability."
        },
        {
          question: "Are the courses self-paced or live?",
          answer: "We offer both self-paced and live courses. Self-paced courses allow you to learn at your own speed, while live courses provide real-time interaction with instructors and fellow students. The format is clearly indicated on each course page."
        },
        {
          question: "What languages are the courses available in?",
          answer: "Our courses are primarily available in English and Arabic, with more languages being added based on demand. Each course page clearly indicates the available languages."
        }
      ]
    },
    {
      title: "Plan My Career (AI Tool)",
      questions: [
        {
          question: "What is the Plan My Career tool?",
          answer: "Plan My Career is our AI-powered career planning tool that helps you identify the best learning path based on your goals, skills, and interests. It provides personalized course recommendations and career guidance."
        },
        {
          question: "How does Plan My Career recommend courses?",
          answer: "The tool uses advanced algorithms to analyze your career goals, current skills, and learning preferences. It then matches you with courses that will help you achieve your objectives and fill any skill gaps."
        },
        {
          question: "Is Plan My Career free to use?",
          answer: "Yes, Plan My Career is completely free to use for all users. It's our way of helping you make informed decisions about your learning journey."
        },
        {
          question: "Can Plan My Career help me if I'm unsure about my career goals?",
          answer: "Absolutely! The tool includes career exploration features that can help you discover potential career paths based on your interests and skills. It provides insights into different industries and roles."
        },
        {
          question: "How accurate are the recommendations?",
          answer: "Our recommendations are based on extensive data analysis and industry trends. While we strive for high accuracy, we recommend using the tool as a guide and combining it with your own research and intuition."
        }
      ]
    },
    {
      title: "Payments",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept various payment methods including credit/debit cards, PayPal, and local payment methods specific to the MENA region. All payments are processed securely through our trusted payment partners."
        },
        {
          question: "Is there a refund policy?",
          answer: "Yes, we offer a 14-day refund policy for our courses. If you're not satisfied with your purchase, you can request a refund within 14 days of purchase, provided you haven't completed more than 30% of the course content."
        }
      ]
    },
    {
      title: "Technical Support",
      questions: [
        {
          question: "I'm having trouble accessing my course. What should I do?",
          answer: "First, try clearing your browser cache and cookies. If the issue persists, check your internet connection and try using a different browser. If problems continue, contact our technical support team through the help center."
        },
        {
          question: "What devices and browsers are supported?",
          answer: "Our platform works on all modern browsers (Chrome, Firefox, Safari, Edge) and is optimized for both desktop and mobile devices. For the best experience, we recommend using the latest version of Chrome."
        },
        {
          question: "How do I contact technical support?",
          answer: "You can reach our technical support team through the help center on our website, via email at support@thepathcompany.com, or through our live chat feature during business hours."
        }
      ]
    },
    {
      title: "General Questions",
      questions: [
        {
          question: "How can I stay updated on new courses and features?",
          answer: "Subscribe to our newsletter, follow us on social media, or enable notifications in your account settings to receive updates about new courses, features, and special offers."
        },
        {
          question: "Where can I follow The Path Company on social media?",
          answer: "You can find us on LinkedIn, Twitter, Instagram, and Facebook. Links to our social media profiles are available in the footer of our website and in your account dashboard."
        }
      ]
    }
  ];

  const toggleFAQ = (sectionIndex, questionIndex) => {
    const newIndex = `${sectionIndex}-${questionIndex}`;
    setActiveIndex(activeIndex === newIndex ? null : newIndex);
  };

  return (
    <div className="faq-page">
      <div className="container">
        <div className="faq-header">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about our platform and services</p>
        </div>

        <div className="faq-sections">
          {faqSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="faq-section">
              <h2 className="section-title">{section.title}</h2>
              <div className="faq-grid">
                {section.questions.map((faq, questionIndex) => (
                  <div 
                    key={questionIndex} 
                    className={`faq-item ${activeIndex === `${sectionIndex}-${questionIndex}` ? 'active' : ''}`}
                    onClick={() => toggleFAQ(sectionIndex, questionIndex)}
                  >
                    <div className="faq-question">
                      <h3>{faq.question}</h3>
                      {activeIndex === `${sectionIndex}-${questionIndex}` ? (
                        <FiChevronUp className="chevron-icon" />
                      ) : (
                        <FiChevronDown className="chevron-icon" />
                      )}
                    </div>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="faq-cta">
          <h2>Still have questions?</h2>
          <p>Our support team is here to help you 24/7</p>
          <button className="contact-button">Contact Support</button>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 