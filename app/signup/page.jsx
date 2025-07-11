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

      // Check if profile already exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (!existingProfile && !profileError) {
        const { error: insertError } = await supabase.from('profiles').insert([{
          id: user.id,
          username: user.user_metadata.full_name || user.email.split('@')[0],
          first_name: user.user_metadata.given_name || '',
          last_name: user.user_metadata.family_name || '',
          date_of_birth: null,
          stripe_customer: null,
        }]);

        if (insertError) {
          console.error('❌ Failed to insert Google user into profiles:', insertError);
        } else {
          console.log('✅ Google user inserted into profiles.');
        }
      } else {
        console.log('ℹ️ Google user already exists in profiles.');
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
    interval = setInterval(async () => {
      const { data, error } = await supabase.auth.refreshSession();
      const session = data?.session;
      if (session?.user?.email_confirmed_at) {
        setEmailConfirmed(true);
        clearInterval(interval);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [signupSuccess]);

  useEffect(() => {
    const insertProfileIfNeeded = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const pending = localStorage.getItem('pendingProfile');
      console.log('Session:', session);
      console.log('Pending profile:', pending);
      if (session?.user && pending) {
        const profile = JSON.parse(pending);
        const { error } = await supabase.from('profiles').upsert([{
          id: session.user.id,
          ...profile,
          stripe_customer: null,
        }]);
        if (error) {
          console.error('Profile insert error:', error);
        } else {
          console.log('Profile inserted!');
          localStorage.removeItem('pendingProfile');
        }
      }
    };
    insertProfileIfNeeded();
  }, []);

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
                />
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