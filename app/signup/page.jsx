'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
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
  FiEye,
  FiEyeOff
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import Header from '../../components/Header/Header';
import '../../styles/signup.scss';
import '../../styles/subscription-plans.scss';
import { supabase } from '../../supabaseClient';
import Image from 'next/image';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isEmailFromPayment, setIsEmailFromPayment] = useState(false);
  const [confirmationTimeout, setConfirmationTimeout] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const getDaysInMonth = (month, year) => {
    if (!month) return [];
    const monthIndex = months.indexOf(month);
    const yearToUse = year || currentYear;
    const date = new Date(parseInt(yearToUse), monthIndex + 1, 0);
    return Array.from({ length: date.getDate() }, (_, i) => i + 1);
  };
  const availableDays = getDaysInMonth(formData.birthMonth, formData.birthYear);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      if (name.startsWith('birth')) {
        setErrors(prev => ({ ...prev, dateOfBirth: '' }));
      }
      if (name === 'birthMonth') {
        newData.birthDay = '';
      }
      if (name === 'birthYear' && prev.birthDay && prev.birthMonth) {
        const newDays = getDaysInMonth(prev.birthMonth, value);
        if (!newDays.includes(parseInt(prev.birthDay))) {
          newData.birthDay = '';
        }
      }
      return newData;
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.birthDay || !formData.birthMonth || !formData.birthYear) newErrors.dateOfBirth = 'Complete date of birth is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleGoogleSignUp = async () => {
  console.log('Google signup button clicked');
  setIsGoogleLoading(true);
  setErrors({});

  try {
    console.log('Initiating Google OAuth for signup...');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/plans`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      },
    });

    console.log('OAuth response:', { data, error });

    if (error) {
      console.error("Google sign-in error:", error.message);
      setErrors({ google: `Google sign-in failed: ${error.message}` });
    } else if (data) {
      console.log('OAuth successful, redirecting...');
      // The redirect should happen automatically
    }
  } catch (err) {
    console.error('Google signup error:', err);
    setErrors({ google: `Something went wrong: ${err.message}` });
  } finally {
    setIsGoogleLoading(false);
  }
};

useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event !== 'SIGNED_IN' || !session?.user) return;

      const user = session.user;
      const normalizedEmail = user.email.trim().toLowerCase();
      console.log('Google OAuth SIGNED_IN event:', normalizedEmail, user.id);

      // Immediately attempt to link subscription after Google OAuth signup
      const { error: linkError } = await supabase
        .from('subscriptions')
        .update({ user_id: user.id })
        .eq('email', normalizedEmail)
        .is('user_id', null);
      if (linkError) {
        console.error('Linking error after Google OAuth signup:', linkError);
      } else {
        console.log('Linking attempted after Google OAuth signup for:', normalizedEmail);
      }

      // 1. Upsert profile if not present
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (!existingProfile && !profileError) {
        // You can customize the fields as needed
        await supabase.from('profiles').insert([{
          id: user.id,
          email: user.email,
          username: user.user_metadata?.full_name || user.email.split('@')[0],
          first_name: user.user_metadata?.given_name || '',
          last_name: user.user_metadata?.family_name || '',
          date_of_birth: null,
          stripe_customer: null,
        }]);
      }

      // 2. Link subscription
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .update({ user_id: user.id })
          .eq('email', normalizedEmail)
          .is('user_id', null)
          .select();
        if (error) {
          console.error('Subscription linking error:', error);
        } else {
          console.log('Subscription linking result:', data, 'Rows updated:', data?.length);
        }
      } catch (linkError) {
        console.error('Error linking subscription on auth:', linkError);
      }
    }
  );

  return () => subscription.unsubscribe();
}, []);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
  
    setIsLoading(true);
    setErrors({});
    setShowConfirmation(false);
  
    try {
      const inputEmail = formData.email.trim().toLowerCase();
      console.log("🔍 Normalized input email:", inputEmail);
  
      // Step 1: Check if email exists in the profiles table directly with ilike
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .ilike('email', inputEmail)
        .maybeSingle();
  
      if (profileError) {
        console.error("Profile lookup failed:", profileError);
        setErrors({ submit: 'Error verifying email address. Please try again.' });
        setIsLoading(false);
        return;
      }
  
      if (existingProfile) {
        console.log("Email already exists in profiles. Blocking sign-up.");
        setErrors({ email: 'Email is already registered' });
        setIsLoading(false);
        return;
      }
  
      // Step 2: Proceed with sign-up
      const profileData = {
        username: formData.username,
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
      };
  
      console.log('Saving to pendingProfile:', profileData);
      localStorage.setItem('pendingProfile', JSON.stringify(profileData));
  
      const { data, error } = await supabase.auth.signUp({
        email: inputEmail,
        password: formData.password,
        options: {
          data: profileData,
          emailRedirectTo: `${window.location.origin}/plans`,
        },
      });
  
      if (error) {
        console.error("Sign-up error:", error);
        setErrors({ submit: error.message });
        setIsLoading(false);
        return;
      }

      // Immediately attempt to link subscription after signup (before email confirmation)
      if (data?.user) {
        const normalizedEmail = data.user.email.trim().toLowerCase();
        console.log('Attempting to link subscription right after signup:', normalizedEmail, data.user.id);
        const { error: linkError } = await supabase
          .from('subscriptions')
          .update({ user_id: data.user.id })
          .eq('email', normalizedEmail)
          .is('user_id', null);
        if (linkError) {
          console.error('Linking error after signup:', linkError);
        } else {
          console.log('Linking attempted after signup for:', normalizedEmail);
        }
      }
  
      setShowConfirmation(true);
    } catch (err) {
      console.error("Unexpected error during sign-up:", err);
      setErrors({ submit: 'Unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };    

  useEffect(() => {
    if (!signupSuccess) return;
    let interval;
    let timeout;
    interval = setInterval(async () => {
      const { data, error } = await supabase.auth.refreshSession();
      const session = data?.session;
      if (session?.user?.email_confirmed_at) {
        setEmailConfirmed(true);
        clearInterval(interval);
        clearTimeout(timeout);
        // After confirmation, check for subscription and redirect
        const user = session.user;
        // Link subscription if from payment flow
        if (isEmailFromPayment) {
          try {
            const response = await fetch('/api/link-subscription-to-profile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: user.email, userId: user.id })
            });
            if (response.ok) {
              console.log('Subscription linked successfully');
            } else {
              console.error('Failed to link subscription');
            }
          } catch (linkError) {
            console.error('Error linking subscription:', linkError);
          }
        }
        // Check for active subscription
        const { data: subData, error: subError } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('email', user.email)
          .eq('status', 'active')
          .maybeSingle();
        if (subData && subData.id) {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/plans';
        }
      }
    }, 3000);
    // Timeout after 2 minutes
    timeout = setTimeout(() => {
      setConfirmationTimeout(true);
      clearInterval(interval);
    }, 120000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [signupSuccess, isEmailFromPayment]);

  useEffect(() => {
    // Check for email from URL parameters (payment flow)
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email');
    const successFromUrl = urlParams.get('success');
    
    if (emailFromUrl && successFromUrl === 'true') {
      setFormData(prev => ({ ...prev, email: emailFromUrl }));
      setIsEmailFromPayment(true);
    }

    const insertProfileIfNeeded = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const pending = localStorage.getItem('pendingProfile');
      console.log('Session:', session);
      console.log('Pending profile:', pending);
      if (session?.user && pending) {
        const profile = JSON.parse(pending);
        // Fix date_of_birth to be YYYY-MM-DD
        let dob = null;
        if (profile.date_of_birth) {
          const [year, month, day] = profile.date_of_birth.split('-');
          const monthNum = (isNaN(month) ? (months.indexOf(month) + 1).toString().padStart(2, '0') : month.padStart(2, '0'));
          dob = `${year}-${monthNum}-${day.padStart(2, '0')}`;
        }
        const upsertPayload = {
          id: session.user.id,
          username: profile.username,
          first_name: profile.first_name,
          last_name: profile.last_name,
          date_of_birth: dob,
          stripe_customer: null,
        };
        console.log('Upserting profile:', upsertPayload);
        const { error } = await supabase.from('profiles').upsert([upsertPayload]);
        if (error) {
          console.error('Profile insert error:', error);
        }
        console.log('Profile inserted!');
        localStorage.removeItem('pendingProfile');
        // Always attempt to link any orphaned subscriptions for this email
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const normalizedEmail = session.user.email.trim().toLowerCase();
            console.log('Attempting to link subscription for:', normalizedEmail, session.user.id);

            const { data, error } = await supabase
              .from('subscriptions')
              .update({ user_id: session.user.id })
              .eq('email', normalizedEmail)
              .is('user_id', null)
              .select(); // fetch updated rows for logging

            if (error) {
              console.error('Subscription linking error:', error);
            } else {
              console.log('Subscription linking result:', data, 'Rows updated:', data?.length);
            }
          } else {
            console.log('No session user found after profile upsert.');
          }
        } catch (linkError) {
          console.error('Error linking subscription (post-profile upsert):', linkError);
        }
      }
    };
    insertProfileIfNeeded();
  }, []);

  // Resend confirmation email handler
  const handleResendConfirmation = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    setResendError('');
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email: formData.email });
      if (error) {
        setResendError('Failed to resend confirmation email. Please try again later.');
      } else {
        setResendSuccess(true);
      }
    } catch (err) {
      setResendError('Unexpected error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <Header forceSolid={true} />
      <div className="signup-container">
        <div className="left-column">
          <div className="signup-header">
            <h1>Create Your Account</h1>
            <p>Join our community and start your journey</p>
          </div>
          <div className="social-signup">
            <button 
              type="button" 
              className="social-button" 
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading}
            >
              <FcGoogle size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
            </button>
            {errors.google && <span className="error-message">{errors.google}</span>}
          </div>
          <div className="divider">
            <span>or continue with email</span>
          </div>
        </div>
        <div className="right-column">
          {showConfirmation ? (
            <div className="confirmation-message">
              <Image src="/logoicon.png" alt="Logo" width={80} height={80} className="logo" />
              {!emailConfirmed ? (
                <>
                  <h2>Check Your Email</h2>
                  <p>Please check your email to confirm your account.<br />After confirming, you will be redirected to choose your plan.</p>
                  {confirmationTimeout && (
                    <div style={{ marginTop: 20 }}>
                      <p style={{ color: 'red' }}>
                        Still waiting for confirmation? If you did not receive the email, you can resend it or go back to the signup form.
                      </p>
                      <button
                        onClick={handleResendConfirmation}
                        disabled={resendLoading}
                        style={{ marginTop: 10, padding: '8px 20px', borderRadius: 8, background: '#FFD600', color: '#181818', border: 'none', fontWeight: 600, cursor: resendLoading ? 'not-allowed' : 'pointer' }}
                      >
                        {resendLoading ? 'Resending...' : 'Resend Confirmation Email'}
                      </button>
                      {resendSuccess && <p style={{ color: 'green', marginTop: 8 }}>Confirmation email resent! Please check your inbox.</p>}
                      {resendError && <p style={{ color: 'red', marginTop: 8 }}>{resendError}</p>}
                      <button
                        onClick={() => { setShowConfirmation(false); setConfirmationTimeout(false); }}
                        style={{ marginTop: 10, marginLeft: 10, padding: '8px 20px', borderRadius: 8, background: '#232323', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Back to Signup
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h2>Email Confirmed!</h2>
                  <p>You can close this tab now.</p>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-group">
                <div className="name-fields">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className={errors.firstName ? 'error' : ''}
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className={errors.lastName ? 'error' : ''}
                  />
                </div>
                {(errors.firstName || errors.lastName) && (
                  <span className="error-message">{errors.firstName || errors.lastName}</span>
                )}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className={errors.username ? 'error' : ''}
                  autoComplete="off"
                />
                {errors.username && <span className="error-message">{errors.username}</span>}
              </div>
              <div className="form-group">
                <div className="date-fields">
                  <select
                    name="birthMonth"
                    value={formData.birthMonth}
                    onChange={handleChange}
                    className={errors.dateOfBirth ? 'error' : ''}
                  >
                    <option value="">Month</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <select
                    name="birthDay"
                    value={formData.birthDay}
                    onChange={handleChange}
                    className={errors.dateOfBirth ? 'error' : ''}
                  >
                    <option value="">Day</option>
                    {availableDays.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <select
                    name="birthYear"
                    value={formData.birthYear}
                    onChange={handleChange}
                    className={errors.dateOfBirth ? 'error' : ''}
                  >
                    <option value="">Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className={errors.email ? 'error' : ''}
                  readOnly={isEmailFromPayment}
                  style={isEmailFromPayment ? { backgroundColor: '#232323', color: '#fff', cursor: 'not-allowed', opacity: 1 } : {}}
                />
                {isEmailFromPayment && (
                  <small style={{ color: '#bbb', fontSize: '12px', marginTop: '4px' }}>
                    Email from payment - cannot be changed
                  </small>
                )}
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <div className="form-group password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={errors.password ? 'error' : ''}
                />
                <span className="view-password-icon" onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? <FiEye /> : <FiEyeOff />}
                </span>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>
              <div className="form-group password-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={errors.confirmPassword ? 'error' : ''}
                />
                <span className="view-password-icon" onClick={() => setShowConfirmPassword(v => !v)}>
                  {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
                </span>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
              <button type="submit" className="signup-button" disabled={isLoading}>
                {isLoading ? (
                  <span className="signup-spinner">
                    <svg width="24" height="24" viewBox="0 0 50 50">
                      <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5" stroke="currentColor" />
                    </svg>
                  </span>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>
          )}
          <div className="login-link-row">
            <span>Already have an account? <Link href="/login">Log in</Link></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 