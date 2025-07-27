'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [globalError, setGlobalError] = useState('');
  const formRef = useRef(null);

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
        .update({ id: user.id })
        .eq('email', normalizedEmail)
        .is('id', null);
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
          .update({ id: user.id })
          .eq('email', normalizedEmail)
          .is('id', null)
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
    setGlobalError('');
    if (!validate()) {
      // Scroll to first error field
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey && formRef.current) {
        const el = formRef.current.querySelector(`[name="${firstErrorKey}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setIsLoading(true);
    setErrors({});
    let didTimeout = false;
    const timeout = setTimeout(() => {
      didTimeout = true;
      setIsLoading(false);
      setGlobalError('Signup request timed out. Please check your connection and try again.');
    }, 10000);
    try {
      const inputEmail = formData.email.trim().toLowerCase();
      // Check if email already exists in profiles table
      console.log('Checking if email exists in profiles:', inputEmail);
      
      // First, let's see all profiles to debug
      const { data: allProfiles, error: allProfilesError } = await supabase
        .from('profiles')
        .select('email');
      console.log('All profiles in database:', allProfiles);
      console.log('All profiles error:', allProfilesError);
      
      // Try with different RLS context
      const { data: allProfiles2, error: allProfilesError2 } = await supabase
        .from('profiles')
        .select('*')
        .limit(10);
      
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', inputEmail)
        .maybeSingle();
      console.log('Profile check result:', { existingProfile, profileCheckError });
      console.log('Looking for email:', `"${inputEmail}"`);
      if (profileCheckError) {
        console.error('Profile check error:', profileCheckError);
        throw new Error('Error checking existing profiles. Please try again.');
      }
      if (existingProfile) {
        console.log('Profile already exists for email:', inputEmail);
        setErrors({ email: 'This email already exists.' });
        setIsLoading(false);
        clearTimeout(timeout);
        return;
      }
      console.log('No existing profile found, proceeding with signup');
      // Remove admin.listUsers check. Attempt signup directly.
      const monthIndex = months.indexOf(formData.birthMonth);
      const monthNum = (monthIndex + 1).toString().padStart(2, '0');
      const dayNum = formData.birthDay.toString().padStart(2, '0');
      const dob = `${formData.birthYear}-${monthNum}-${dayNum}`;
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: inputEmail,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            first_name: formData.firstName,
            last_name: formData.lastName,
            date_of_birth: dob,
          },
          emailRedirectTo: `${window.location.origin}/plans`,
        },
      });
      if (didTimeout) return;
      if (signUpError) {
        if (
          signUpError.message?.toLowerCase().includes('user already registered') ||
          (signUpError.message?.toLowerCase().includes('email') && signUpError.message?.toLowerCase().includes('exists'))
        ) {
          setErrors({ email: 'Email already exists.' });
        } else {
          setGlobalError(signUpError.message || 'Unexpected error occurred.');
        }
        setIsLoading(false);
        clearTimeout(timeout);
        return;
      }
      if (!data.user) {
        throw new Error("Sign up successful, but no user data was returned. Please contact support.");
      }
      // Profile is now created by a DB trigger. No need to insert it from the client.
      // Attempt to link subscription post-signup
      const { error: linkError } = await supabase
        .from('subscriptions')
        .update({ id: data.user.id })
        .eq('email', data.user.email)
        .is('id', null);
      if (linkError) {
        // This is not a critical error, so we just log it.
        console.error('Non-critical error: Failed to link subscription post-signup:', linkError);
      }
      setShowConfirmation(true);
    } catch (err) {
      if (!didTimeout) {
        setGlobalError(err.message || 'An unexpected error occurred.');
      }
    } 
    finally {
      setIsLoading(false);
      clearTimeout(timeout);
    }
  };    

  // The logic to insert the profile has been moved into handleSubmit.
  // The useEffect that previously handled this is no longer needed.

  useEffect(() => {
    // After signup and email confirmation, insert profile if it doesn't exist
    const insertProfileIfNeeded = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      if (!existingProfile) {
        // Insert profile
        const { error } = await supabase.from('profiles').insert([{
          id: user.id,
          email: user.email,
          username: user.user_metadata?.username || user.email.split('@')[0],
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          date_of_birth: user.user_metadata?.date_of_birth || null,
        }]);
        if (error) {
          console.error('Profile insert error:', error);
        }
      }
    };
    insertProfileIfNeeded();
  }, [showConfirmation]);

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

  useEffect(() => {
    // Check for email from URL parameters (payment flow)
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email');
    const successFromUrl = urlParams.get('success');
    if (emailFromUrl && successFromUrl === 'true') {
      setFormData(prev => ({ ...prev, email: emailFromUrl }));
      setIsEmailFromPayment(true);
    }
  }, []);

  return (
    <div className="signup-page">
      <Header forceSolid={true} />
      <div
        className="signup-container"
        style={showConfirmation ? {
          maxWidth: 480,
          margin: '80px auto',
          width: '100%',
          minHeight: '420px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
          borderRadius: 24,
          background: 'rgba(20,20,30,0.95)'
        } : {}}
      >
        {/* Only show left column when not in confirmation step */}
        {!showConfirmation && (
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
        )}
        <div className="right-column">
          {showConfirmation ? (
            <div className="confirmation-message">
              <Image src="/logoicon.png" alt="Logo" width={80} height={80} className="logo" />
              <>
                <h2>Check Your Email</h2>
                <p>Please check your email to confirm your account.<br />After confirming, you will be redirected to choose your plan.</p>
                <p style={{ marginTop: 20, color: '#bbb' }}>
                  Didn’t receive the email? Check your spam folder or <a href="mailto:support@thepathcompany.com" style={{ color: '#FFD600' }}>contact support</a>.
                </p>
              </>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="signup-form" ref={formRef}>
              {globalError && (
                <div style={{ color: 'white', background: 'red', padding: 12, borderRadius: 8, marginBottom: 16, textAlign: 'center', fontWeight: 600 }}>
                  {globalError}
                </div>
              )}
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