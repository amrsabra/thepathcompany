'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCheck, 
  FiX, 
  FiBook, 
  FiStar,
  FiUsers,
  FiCreditCard,
  FiLock,
  FiShield,
  FiHelpCircle,
  FiChevronDown
} from 'react-icons/fi';
import Header from '../../components/Header/Header';
import '../../styles/subscription-plans.scss';
import { supabase } from '../../supabaseClient';
import { useRouter } from 'next/navigation';

const SubscriptionPlans = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const createProfile = async () => {
      try {
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // No user signed in — skip profile creation
          setIsLoading(false);
          return;
        }        
        // Get pending profile data from localStorage
        const pendingProfile = localStorage.getItem('pendingProfile');
        
        if (pendingProfile) {
          const profileData = JSON.parse(pendingProfile);
          
          // Create profile in the database with subscription set to false
          const { error } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                email: user.email,
                ...profileData,
                subscription: false, // Set subscription status to false by default
                created_at: new Date().toISOString(),
              }
            ]);

          if (error) {
            console.error('Error creating profile:', error);
          } else {
            // Clear the pending profile data
            localStorage.removeItem('pendingProfile');
          }
        }
      } catch (error) {
        console.error('Error in profile creation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    createProfile();
  }, [router]);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$11',
      period: 'per month',
      description: 'Perfect for beginners who want to start their learning journey',
      features: [
        { text: 'Access to all courses', included: true },
        { text: 'Downloadable resources', included: true },
        { text: 'Certificate of completion', included: true },
        { text: 'Priority support', included: false },
        { text: 'Offline access', included: false },
        { text: 'Advanced courses', included: false }
      ],
      popular: false,
      icon: <FiBook />
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$19',
      period: 'per month',
      description: 'Ideal for serious learners who want to accelerate their growth',
      features: [
        { text: 'Access to all courses', included: true },
        { text: 'Downloadable resources', included: true },
        { text: 'Certificate of completion', included: true },
        { text: 'Priority support', included: true },
        { text: 'Offline access', included: true },
        { text: 'Advanced courses', included: false }
      ],
      popular: true,
      icon: <FiStar />
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$29',
      period: 'per month',
      description: 'For organizations and teams looking to upskill together',
      features: [
        { text: 'Access to all courses', included: true },
        { text: 'Downloadable resources', included: true },
        { text: 'Certificate of completion', included: true },
        { text: 'Priority support', included: true },
        { text: 'Offline access', included: true },
        { text: 'Advanced courses', included: true }
      ],
      popular: false,
      icon: <FiUsers />
    }
  ];

  const paymentMethods = [
    { name: 'Visa', icon: <FiCreditCard /> },
    { name: 'Mastercard', icon: <FiCreditCard /> },
    { name: 'PayPal', icon: <FiCreditCard /> },
    { name: 'Apple Pay', icon: <FiCreditCard /> },
    { name: 'Google Pay', icon: <FiCreditCard /> }
  ];

  const faqQuestions = [
    {
      question: 'Is my payment information secure?',
      answer: 'Yes, we use industry-standard encryption and security measures to protect your payment information. All transactions are processed through secure payment gateways.',
      icon: <FiShield />
    },
    {
      question: 'Can I change my plan later?',
      answer: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle.',
      icon: <FiHelpCircle />
    },
    {
      question: 'What happens if I cancel my subscription?',
      answer: 'You\'ll continue to have access to all features until the end of your current billing period. After that, you\'ll lose access to premium features.',
      icon: <FiLock />
    }
  ];

  if (isLoading) {
    return (
      <div className="subscription-plans-page">
        <Header forceSolid={true} />
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Setting up your account...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-plans-page">
      <Header forceSolid={true} />
      <form className="plans-single-col-layout" autoComplete="off">
        <div className="plans-left-col">
          <div className="subscribe-header">
            <h2>Subscribe to TPC Pro</h2>
          </div>
          <div className="price-section">
            <div className="usd-price">
              <span className="usd">US$</span>
              <span className="amount">20</span>
              <span className="per-month">Per Month</span>
            </div>
            <div className="recurring-pay-toggle">
              <span className="checkmark">✓</span> recurring pay
            </div>
            <div className="plan-buttons">
              <button type="button" className="plan-btn selected">Monthly | $20</button>
              <button type="button" className="plan-btn">Yearly | $200</button>
            </div>
          </div>
          <button className="pay-subscribe-btn" type="submit">Pay and subscribe</button>
          <div className="powered-by-stripe">
            Powered by <span className="stripe-logo">stripe</span>
            <span className="stripe-links">
              <a href="#">Terms</a> <a href="#">Privacy</a>
            </span>
          </div>
        </div>
      </form>
      <div className="secure-payment-section">
        <div className="secure-payment-box">
          <span className="lock-icon"><FiLock /></span>
          <span>Secure payment...</span>
          <div className="payment-methods-row">
            <img src="/images/visa-logo.png" alt="Visa" />
            <img src="/images/mastercard-logo.png" alt="Mastercard" />
            <img src="/images/amex-logo.png" alt="American Express" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans; 