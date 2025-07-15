'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import Header from '../../components/Header/Header';
import '../../styles/login.scss';
import { supabase } from '../../supabaseClient';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isEmailFromCheckout, setIsEmailFromCheckout] = useState(false);

  useEffect(() => {
    const redirectIfLoggedIn = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        router.push('/');
      }
    };
    redirectIfLoggedIn();
  }, [router]);

  // Handle OAuth callback
  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.user && !error) {
        router.push('/');
      }
    };

    handleAuthCallback();
  }, [router]);

  useEffect(() => {
    // Check for email in query params (from checkout)
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl) {
      setFormData(prev => ({ ...prev, email: emailFromUrl }));
      setIsEmailFromCheckout(true);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setErrors({});
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setErrors({ password: 'Incorrect email or password' });
      } else if (data?.session) {
        router.push('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrors({ password: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log('Google login button clicked');
    setIsGoogleLoading(true);
    setErrors({});
    
    try {
      console.log('Initiating Google OAuth...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      console.log('OAuth response:', { data, error });
      
      if (error) {
        console.error('Google OAuth error:', error);
        setErrors({ google: `Google login failed: ${error.message}` });
      } else if (data) {
        console.log('OAuth successful, redirecting...');
        // The redirect should happen automatically
      }
    } catch (err) {
      console.error('Google login error:', err);
      setErrors({ google: `Something went wrong: ${err.message}` });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Header forceSolid={true} />
      <div className="login-container">
        <div className="left-column">
          <div className="login-header">
            <h1>Welcome Back!</h1>
            <p>Sign in to continue your learning journey</p>
          </div>

          <div className="social-login">
            <button 
              type="button" 
              className="social-button google" 
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
            >
              <FcGoogle size={20} />
              <span>{isGoogleLoading ? 'Connecting...' : 'Continue with Google'}</span>
            </button>
            {errors.google && <span className="error-message">{errors.google}</span>}
          </div>

          <div className="divider">
            <span>or continue with email</span>
          </div>
        </div>

        <div className="right-column">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email"
                readOnly={isEmailFromCheckout}
                style={isEmailFromCheckout ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {}}
              />
              {isEmailFromCheckout && (
                <small style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
                  Email from your purchase - cannot be changed
                </small>
              )}
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span className="checkbox-text">Remember me</span>
              </label>
              <Link href="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="signup-prompt">
              Don't have an account? <Link href="/signup">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
