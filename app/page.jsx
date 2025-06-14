'use client';

import { useState, useEffect } from 'react';
import { Rocket } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import '../styles/waitlist.scss';
import { supabase } from '../supabaseClient';

const calculateTimeLeft = () => {
  const launchDate = new Date('2025-09-01T00:00:00'); // September 1st, 2025
  const now = new Date();
  const difference = launchDate.getTime() - now.getTime();

  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

export default function WaitlistPage() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    featureSuggestions: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true });
        setWaitlistCount((count || 0) + 32);
    };
    fetchCount();
    const interval = setInterval(fetchCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // 1. Check if email already exists in the waitlist table
    const { data: existingUsers, error: fetchError } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', formData.email)
      .limit(1);
  
    if (fetchError) {
      alert('There was an error checking your email. Please try again.');
      console.error(fetchError);
      return;
    }
  
    if (existingUsers.length > 0) {
      alert('This email is already registered on the waitlist.');
      return;
    }
  
    // 2. Insert new user if email doesn't exist
    const { error } = await supabase.from('waitlist').insert([
      {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        suggestion: formData.featureSuggestions,
      }
    ]);
  
    if (error) {
      alert('There was an error joining the waitlist. Please try again.');
      console.error(error);
      return;
    }
  
    setSubmitted(true);
  
    // 3. Fetch updated user count
    const { count } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });
  
    setWaitlistCount(count || 0);
  };
  
  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span key={interval} className="countdown-item">
        {timeLeft[interval]} <span>{interval}</span>
      </span>
    );
  });

  return (
    <div className="waitlist-page" style={{ fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` }}>
      {/* Background decoration */}
      <div className="background-stars">
        <img 
          src="/logo.png" 
          alt="Project X Logo" 
          className="absolute top-8 left-1/2 transform -translate-x-1/2 h-16 w-auto opacity-100"
        />
      </div>

      <Head>
        <title>Project X Waitlist</title>
      </Head>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="content-card"
      >
        <div className="waitlist-header">
          <h2 className="gradient-text header-desktop">Unlock Access to Cinematic Learning</h2>
          <h2 className="gradient-text header-mobile">Unlcok Access to<br />Cinematic Learning</h2>
          {!submitted && (
          <p>
            Where learning meets storytelling, and excellence is the baseline.
          </p>
          )}
          {submitted && (
            <p className="mt-2 text-white font-bold">You're Registered!</p>
          )}
        </div>

        {!submitted ? (
          <form className="waitlist-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <div>
                <label htmlFor="first-name" className="sr-only">First Name</label>
                <input
                  id="first-name"
                  name="firstName"
                  type="text"
                  required
                  className=""
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="last-name" className="sr-only">Last Name</label>
                <input
                  id="last-name"
                  name="lastName"
                  type="text"
                  required
                  className=""
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className=""
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="feature-suggestions" className="sr-only">What would you like to see?</label>
              <textarea
                id="feature-suggestions"
                name="featureSuggestions"
                rows="3"
                className=""
                placeholder="What features or courses would you like to see on our platform? (optional)"
                value={formData.featureSuggestions}
                onChange={handleChange}
              ></textarea>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="submit-button"
              >
                Join the Elite Waitlist
              </motion.button>
              <div className="waitlist-count mt-2 text-xs text-gray-400">
              {waitlistCount} visionary learners have already joined. Will you be next?
              </div>
            </div>
          </form>
        ) : (
          <div className="thank-you-message relative">
            <p className="mt-2">
              Welcome to the cinematic revolution in learning. You'll be among the first to experience The Path Company.
            </p>
            <p className="mt-4">Your reward will arrive on launch day, stay tuned.</p>
          </div>
        )}

        <div className="countdown-section">
          <h3>Launch Countdown</h3>
          {timerComponents.length ? (
            <div className="countdown-display">
              {timerComponents}
            </div>
          ) : (
            <span className="launching-soon-text">Launching Now!</span>
          )}
        </div>
      </motion.div>
    </div>
  );
} 
