'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header/Header';
import { supabase } from '../../supabaseClient';
import '../../styles/reset-password.scss';

const ResetPasswordComponent = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const access_token = queryParams.get('access_token');
    const refresh_token = queryParams.get('refresh_token');
  
    if (!access_token || !refresh_token) {
      setError('Invalid or expired reset link. Please request a new one.');
      return;
    }
  
    // Set session once with token so Supabase allows password reset
    const setSessionAndContinue = async () => {
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
  
      if (error) {
        setError('Could not verify reset link. Please try again.');
      } else {
        setIsReady(true);
      }
    };
  
    setSessionAndContinue();
  }, []);  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(error.message);
      } else {
        await supabase.auth.signOut(); // 🔐 Sign out after resetting password
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err) {
      setError('Unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading or error state first
  if (!isReady && !error) {
    return (
      <div className="reset-password-page">
        <Header />
        <div className="reset-password-container">
          <div className="reset-password-box">
            <h1>Reset Password</h1>
            <p>Preparing reset form...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reset-password-page">
        <Header />
        <div className="reset-password-container">
          <div className="reset-password-box">
            <h1>Error</h1>
            <p className="error-message">{error}</p>
            <p><a href="/forgot-password">Try again</a></p>
          </div>
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div className="reset-password-page">
      <Header />
      <div className="reset-password-container">
        <div className="reset-password-box">
          <h1>Reset Password</h1>
          {!success ? (
            <>
              <p>Enter your new password below.</p>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
                    required
                    minLength={6}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    required
                    minLength={6}
                  />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </>
          ) : (
            <div className="success-message">
              <p>Password updated successfully! Redirecting to login...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordComponent />
    </Suspense>
  );
}
