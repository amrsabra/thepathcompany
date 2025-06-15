'use client';

import { useState } from 'react';
import { FiGift, FiMail, FiMessageSquare, FiUser, FiCheck } from 'react-icons/fi';
import Header from '../../components/Header/Header';
import '../../styles/give-gift.scss';

const GiveGift = () => {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    recipientName: '',
    recipientEmail: '',
    message: '',
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
    // TODO: Implement gift sending logic
    console.log('Gift form submitted:', formData);
  };

  return (
    <>
      <Header forceSolid={true} />
      <div className="give-gift-container">
        <div className="give-gift-header">
          <h1>Give the Gift of Learning</h1>
          <p>Share the joy of learning with someone special</p>
        </div>

        <div className="give-gift-content">
          <div className="gift-card">
            <div className="gift-card-header">
              <div className="header-left">
                <FiGift className="gift-icon" />
                <h2>Yearly Subscription Gift</h2>
              </div>
              <div className="price-container">
                <div className="price">$99</div>
                <div className="billing-info">billed once</div>
              </div>
            </div>

            <form className="gift-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <h3 className="section-title">Your Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <FiUser className="icon" />
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="senderName"
                      value={formData.senderName}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <FiMail className="icon" />
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      name="senderEmail"
                      value={formData.senderEmail}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">Recipient's Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <FiUser className="icon" />
                      Recipient's Name
                    </label>
                    <input
                      type="text"
                      name="recipientName"
                      value={formData.recipientName}
                      onChange={handleChange}
                      placeholder="Enter recipient's name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <FiMail className="icon" />
                      Recipient's Email
                    </label>
                    <input
                      type="email"
                      name="recipientEmail"
                      value={formData.recipientEmail}
                      onChange={handleChange}
                      placeholder="Enter recipient's email address"
                      required
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>
                    <FiMessageSquare className="icon" />
                    Personal Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write a personal message to accompany your gift"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="send-gift-button">
                Send Gift
              </button>
            </form>
          </div>

          <div className="gift-info">
            <div className="subscription-details">
              <h3>Subscription Benefits</h3>
              <ul className="benefits">
                <li>
                  <FiCheck className="check-icon" />
                  Full access to all courses
                </li>
                <li>
                  <FiCheck className="check-icon" />
                  Watch courses offline anytime
                </li>
                <li>
                  <FiCheck className="check-icon" />
                  Access to TPC application
                </li>
                <li>
                  <FiCheck className="check-icon" />
                  Access to AI-Powered guidance
                </li>
              </ul>
            </div>

            <div className="section-divider" />

            <div className="how-it-works">
              <h3>How it works</h3>
              <ol>
                <li>Enter your recipient's email address</li>
                <li>Write a personal message</li>
                <li>Complete the payment process</li>
                <li>Your gift will be sent immediately</li>
              </ol>
              <p className="note">
                The recipient will receive an email with instructions on how to activate their subscription.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GiveGift; 