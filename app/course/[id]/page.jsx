'use client';

import { useState } from 'react';
import { FiClock, FiBook, FiAward, FiUsers, FiPlay, FiDownload, FiGlobe, FiShare2, FiBookmark, FiCode, FiDatabase, FiTrendingUp, FiLayers, FiStar, FiX, FiChevronDown, FiCheck } from 'react-icons/fi';
import '../../../styles/course-info.scss';

const CourseInfo = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  
  // Mock course data - this would come from your API/database
  const courseData = {
    title: "Advanced Machine Learning & AI",
    subtitle: "Master the fundamentals and advanced concepts of ML and AI",
    category: "Artificial Intelligence",
    instructor: {
      name: "Dr. Sarah Johnson",
      title: "AI Research Scientist",
      image: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=200&h=200",
      description: "Ph.D. in Computer Science with 10+ years of industry experience in AI and Machine Learning."
    },
    stats: {
      duration: "12 weeks",
      lessons: "24 lessons",
      students: "1.2k enrolled",
      level: "Advanced"
    },
    price: "$199.99",
    rating: 4.8,
    reviews: [
      {
        id: 1,
        user: {
          name: "Ahmed Mohamed",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100"
        },
        rating: 5,
        date: "2 weeks ago",
        content: "This course exceeded my expectations! The instructor explains complex concepts in a way that's easy to understand. The practical exercises are well-designed and helped me apply what I learned."
      },
      {
        id: 2,
        user: {
          name: "Sarah Ali",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100"
        },
        rating: 4,
        date: "1 month ago",
        content: "Great course overall. The content is well-structured and the instructor is knowledgeable. I would have liked more real-world examples, but still very valuable."
      },
      {
        id: 3,
        user: {
          name: "Mohamed Hassan",
          avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100"
        },
        rating: 5,
        date: "2 months ago",
        content: "One of the best courses I've taken. The instructor's teaching style is engaging and the course materials are comprehensive. Highly recommended!"
      }
    ],
    thumbnail: "https://images.unsplash.com/photo-1677759219429-56505710e582?auto=format&fit=crop&w=1200&h=600",
    overview: {
      description: "This comprehensive course covers everything from basic ML concepts to advanced AI implementations. Perfect for developers looking to expand their skillset into the world of artificial intelligence.",
      highlights: [
        "Build real-world AI applications",
        "Learn advanced neural network architectures",
        "Master data preprocessing techniques",
        "Implement deep learning models",
        "Understand AI ethics and best practices"
      ]
    },
    curriculum: [
      {
        title: "Introduction to Machine Learning",
        lessons: [
          { title: "What is Machine Learning?", duration: "45 min" },
          { title: "Types of ML Algorithms", duration: "60 min" },
          { title: "Setting Up Your Environment", duration: "30 min" }
        ]
      },
      {
        title: "Deep Learning Fundamentals",
        lessons: [
          { title: "Neural Networks Basics", duration: "55 min" },
          { title: "Activation Functions", duration: "45 min" },
          { title: "Backpropagation Explained", duration: "65 min" }
        ]
      }
    ]
  };

  return (
    <div className="course-info">
      {/* Hero Section */}
      <div className="course-info__hero">
        <div className="container">
          <div className="course-info__hero-content">
            <div className="course-info__breadcrumb">
              <a href="/courses">Courses</a>
              <span className="separator">/</span>
              <a href="/courses/ai">AI & Machine Learning</a>
              <span className="separator">/</span>
              <span className="current">{courseData.title}</span>
            </div>
            <h1>{courseData.title}</h1>
            <p className="course-info__subtitle">{courseData.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="course-info__main">
        <div className="container">
          <div className="course-info__grid">
            {/* Left Column - Course Content */}
            <div className="course-info__content">
              {/* Tabs Navigation */}
              <div className="course-info__tabs">
                <button 
                  className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button 
                  className={`tab ${activeTab === 'curriculum' ? 'active' : ''}`}
                  onClick={() => setActiveTab('curriculum')}
                >
                  Curriculum
                </button>
                <button 
                  className={`tab ${activeTab === 'instructor' ? 'active' : ''}`}
                  onClick={() => setActiveTab('instructor')}
                >
                  Instructor
                </button>
                <button 
                  className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews
                </button>
              </div>

              {/* Tab Content */}
              <div className="course-info__tab-content">
                {activeTab === 'overview' && (
                  <div className="course-info__overview">
                    <div className="course-info__category">
                      <span className="category-label">Category</span>
                      <span className="category-name">{courseData.category}</span>
                    </div>
                    <h2>About This Course</h2>
                    <p>{courseData.overview.description}</p>
                    
                    <h3>What You'll Learn</h3>
                    <ul className="course-info__highlights">
                      {courseData.overview.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>

                    <div className="course-info__ideal-for">
                      <h3>Ideal For</h3>
                      <div className="ideal-for-grid">
                        <div className="ideal-for-item">
                          <FiCode className="icon" />
                          <div className="content">
                            <h4>Software Developers</h4>
                            <p>Looking to expand their skillset into AI and ML</p>
                          </div>
                        </div>
                        <div className="ideal-for-item">
                          <FiDatabase className="icon" />
                          <div className="content">
                            <h4>Data Scientists</h4>
                            <p>Wanting to deepen their understanding of advanced ML concepts</p>
                          </div>
                        </div>
                        <div className="ideal-for-item">
                          <FiTrendingUp className="icon" />
                          <div className="content">
                            <h4>ML Engineers</h4>
                            <p>Seeking to master state-of-the-art AI techniques</p>
                          </div>
                        </div>
                        <div className="ideal-for-item">
                          <FiLayers className="icon" />
                          <div className="content">
                            <h4>Tech Leads</h4>
                            <p>Aiming to implement AI solutions in their projects</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'curriculum' && (
                  <div className="course-info__curriculum">
                    <h2>Course Curriculum</h2>
                    {courseData.curriculum.map((section, index) => (
                      <div key={index} className="curriculum-section">
                        <h3>{section.title}</h3>
                        <ul>
                          {section.lessons.map((lesson, lessonIndex) => (
                            <li key={lessonIndex}>
                              <div className="lesson-info">
                                <FiPlay className="lesson-icon" />
                                <span className="lesson-title">{lesson.title}</span>
                                <span className="lesson-duration">{lesson.duration}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'instructor' && (
                  <div className="course-info__instructor">
                    <div className="instructor-profile">
                      <img src={courseData.instructor.image} alt={courseData.instructor.name} />
                      <div className="instructor-details">
                        <h2>{courseData.instructor.name}</h2>
                        <h3>{courseData.instructor.title}</h3>
                        <p>{courseData.instructor.description}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="course-info__reviews">
                    <h2>Student Reviews</h2>
                    <div className="reviews-summary">
                      <div className="rating-big">
                        <span className="rating-number">{courseData.rating}</span>
                        <div className="rating-stars">★★★★★</div>
                        <span className="rating-count">{courseData.reviews.length} reviews</span>
                      </div>
                    </div>

                    <div className="reviews-actions">
                      <div className="review-dropdown">
                        <button 
                          className={`dropdown-toggle ${isReviewFormOpen ? 'expanded' : ''}`}
                          onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                        >
                          <span>Write a Review</span>
                          <FiChevronDown className={`dropdown-icon ${isReviewFormOpen ? 'expanded' : ''}`} />
                        </button>
                        
                        <div className={`dropdown-content ${isReviewFormOpen ? 'expanded' : ''}`}>
                          <div className="course-info__review-form">
                            <div className="rating-select">
                              <span className="rating-label">Your Rating</span>
                              <div className="stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button key={star} className="star-btn">
                                    <FiStar className="star-icon" />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="form-group">
                              <label>Your Review</label>
                              <textarea 
                                placeholder="Share your experience with this course..."
                                rows="4"
                              />
                            </div>
                            <button className="submit-review">
                              <FiCheck className="submit-icon" />
                              Submit Review
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="reviews-list">
                      {courseData.reviews.map((review) => (
                        <div key={review.id} className="review-card">
                          <div className="review-header">
                            <div className="user-info">
                              <img src={review.user.avatar} alt={review.user.name} className="user-avatar" />
                              <div className="user-details">
                                <h4>{review.user.name}</h4>
                                <span className="review-date">{review.date}</span>
                              </div>
                            </div>
                            <div className="review-rating">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`star-icon ${i < review.rating ? 'active' : ''}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="review-content">{review.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Course Card */}
            <div className="course-info__sidebar">
              <div className="course-card">
                <div className="course-card__video">
                  <div className="video-wrapper">
                    <iframe 
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                      title="Course Preview"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="video-info">
                    <div className="instructor">
                      <span className="by">By</span>
                      <a href="#instructor" className="name">{courseData.instructor.name}</a>
                    </div>
                  </div>
                </div>

                <div className="course-card__stats">
                  <div className="stat-item">
                    <FiClock className="stat-icon" />
                    <div className="stat-info">
                      <span className="stat-label">Duration</span>
                      <span className="stat-value">{courseData.stats.duration}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <FiAward className="stat-icon" />
                    <div className="stat-info">
                      <span className="stat-label">Level</span>
                      <span className="stat-value">{courseData.stats.level}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <FiGlobe className="stat-icon" />
                    <div className="stat-info">
                      <span className="stat-label">Language</span>
                      <span className="stat-value">Arabic</span>
                    </div>
                  </div>
                </div>

                <div className="course-card__pricing">
                  <button className="subscribe-button">
                    Subscribe Now
                  </button>
                  <div className="pricing-note">
                    Get access to all courses only for 11 USD/month
                  </div>
                </div>

                <div className="course-card__actions">
                  <button className="action-btn share">
                    <FiShare2 />
                    <span>Share Course</span>
                  </button>
                  <button className="action-btn save">
                    <FiBookmark />
                    <span>Save Course</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseInfo;