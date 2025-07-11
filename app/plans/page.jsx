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
  FiChevronDown,
  FiPlay,
  FiDownload,
  FiAward,
  FiHeadphones,
  FiWifi,
  FiZap,
  FiGlobe,
  FiTrendingUp,
  FiCalendar,
  FiMessageCircle,
  FiVideo,
  FiFileText,
  FiTarget,
  FiGift
} from 'react-icons/fi';
import Header from '../../components/Header/Header';
import '../../styles/subscription-plans.scss';
import { supabase } from '../../supabaseClient';
import { useRouter } from 'next/navigation';

const SubscriptionPlans = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const createProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setIsLoading(false);
          return;
        }

        const pendingProfile = localStorage.getItem('pendingProfile');

        if (pendingProfile) {
          const profileData = JSON.parse(pendingProfile);

          const { error } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                email: user.email,
                ...profileData,
                subscription: false,
                created_at: new Date().toISOString(),
              }
            ]);

          if (error) {
            console.error('Error creating profile from pending:', error);
          } else {
            localStorage.removeItem('pendingProfile');
          }
        } else {
          // Google sign-in fallback
          const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .maybeSingle();

          if (!existingProfile) {
            const { error: insertError } = await supabase.from('profiles').insert([
              {
                id: user.id,
                email: user.email,
                username: user.user_metadata.full_name || user.email.split('@')[0],
                first_name: user.user_metadata.full_name?.split(' ')[0] || user.email.split('@')[0],
                last_name: user.user_metadata.full_name?.split(' ').slice(1).join(' ') || '',                
                date_of_birth: null,
                subscription: false,
                created_at: new Date().toISOString(),
              }
            ]);

            if (insertError) {
              console.error('Error inserting Google user profile:', insertError);
            }
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

  useEffect(() => {
    // ✅ Force layout reflow and scroll reset
    document.body.style.display = 'none';
  
    requestAnimationFrame(() => {
      document.body.style.display = '';
      window.scrollTo(0, 0);
    });
  }, []);
  

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const plan = {
    id: 'premium',
    name: 'TPC Premium',
    price: { monthly: 19, yearly: 179 },
    period: billingCycle === 'yearly' ? 'per year' : 'per month',
    description: 'Complete access to our entire learning platform',
    features: [
      { text: '300+ Premium Courses', included: true, icon: <FiBook />, highlight: true },
      { text: 'Download & Offline Access', included: true, icon: <FiDownload />, highlight: true },
      { text: 'Certificates & Badges', included: true, icon: <FiAward /> },
      { text: 'Community & Networking', included: true, icon: <FiMessageCircle /> },
      { text: 'Mobile & Desktop Apps', included: true, icon: <FiPlay /> },
      { text: '24/7 Priority Support', included: true, icon: <FiHeadphones /> },
      { text: 'AI Career Planning Tool', included: true, icon: <FiTarget /> },
      { text: 'Live Expert Sessions', included: true, icon: <FiVideo /> }
    ],
    icon: <FiStar />,
    color: 'purple'
  };

  const paymentMethods = [
    { name: 'Visa', icon: '/images/visa-logo.png' },
    { name: 'Mastercard', icon: '/images/mastercard-logo.png' },
    { name: 'American Express', icon: '/images/amex-logo.png' },
    { name: 'PayPal', icon: <FiCreditCard /> }
  ];

  const faqQuestions = [
    {
      question: 'Is my payment secure?',
      answer: 'Yes, we use industry-standard encryption and secure payment gateways.',
      icon: <FiShield />
    },
    {
      question: 'Can I change billing cycle?',
      answer: 'Yes, you can switch between monthly and yearly billing at any time.',
      icon: <FiHelpCircle />
    },
    {
      question: 'What if I cancel?',
      answer: 'You\'ll have access until the end of your billing period.',
      icon: <FiLock />
    }
  ];

  const getCurrentPrice = () => {
    return billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly;
  };

  const getSavings = () => {
    const monthlyTotal = plan.price.monthly * 12;
    const yearlyPrice = plan.price.yearly;
    return monthlyTotal - yearlyPrice;
  };

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
      
      <div className="plans-container">
        {/* Left Side - Plan Details */}
        <div className="plans-left">
          <motion.div
            className="hero-section"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Unlock Your Full Learning Potential</h1>
            <p>Get complete access to our entire learning platform with all premium features.</p>
          </motion.div>

          <motion.div
            className="plan-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="premium-badge">
              <FiStar />
              Premium Access
            </div>
            
            <div className="plan-header">
              <div className={`plan-icon ${plan.color}`}>
                {plan.icon}
              </div>
              <h3>{plan.name}</h3>
              <div className="plan-price">
                <span className="price">${getCurrentPrice()}</span>
                <span className="period">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
              </div>
              {billingCycle === 'yearly' && (
                <div className="yearly-savings">
                  Save ${getSavings()}
                </div>
              )}
              <p className="plan-description">{plan.description}</p>
            </div>

            <div className="plan-features">
              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className={`feature-item ${feature.highlight ? 'highlight' : ''}`}>
                  <div className="feature-icon">
                    <FiCheck />
                  </div>
                  <span className="feature-text">{feature.text}</span>
                  {feature.highlight && <div className="feature-sparkle">✨</div>}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side - Billing & Payment */}
        <div className="plans-right">
          <motion.div
            className="billing-section"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2>Choose Your Billing</h2>
            
            <div className="billing-toggle">
              <button
                className={`billing-option ${billingCycle === 'monthly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('monthly')}
              >
                <span>Monthly</span>
              </button>
              <button
                className={`toggle-switch ${billingCycle === 'yearly' ? 'active' : ''}`}
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                aria-label="Toggle billing cycle"
              >
                <div className="toggle-slider"></div>
              </button>
              <button
                className={`billing-option ${billingCycle === 'yearly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('yearly')}
              >
                <span>Yearly</span>
                {billingCycle === 'yearly' && <span className="save-badge">Save ${getSavings()}</span>}
              </button>
            </div>

            <button className="subscribe-btn">
              <FiZap />
              Get Premium Access
            </button>

            <div className="faq-section">
              <h3>Quick Questions</h3>
              <div className="faq-list">
                {faqQuestions.map((faq, index) => (
                  <div
                    key={index}
                    className={`faq-item ${openFaq === index ? 'active' : ''}`}
                    onClick={() => toggleFaq(index)}
                  >
                    <div className="faq-question">
                      <div className="faq-icon">{faq.icon}</div>
                      <span>{faq.question}</span>
                      <FiChevronDown className={`chevron ${openFaq === index ? 'active' : ''}`} />
                    </div>
                    <AnimatePresence>
                      {openFaq === index && (
                        <motion.div
                          className="faq-answer"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          <p>{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            <div className="payment-methods">
              <h3>Secure Payment</h3>
              <div className="payment-grid">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="payment-method">
                    {typeof method.icon === 'string' ? (
                      <img src={method.icon} alt={method.name} />
                    ) : (
                      <div className="payment-icon">{method.icon}</div>
                    )}
                    <span>{method.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
