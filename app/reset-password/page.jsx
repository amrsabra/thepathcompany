'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../../components/Header/Header';
import { supabase } from '../../supabaseClient';
import '../../styles/reset-password.scss';

const ResetPasswordComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeReset = async () => {
      try {
        // First, sign out any existing session
        await supabase.auth.signOut();

        // Get the access token from the URL
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');

        if (!accessToken || !refreshToken) {
          setError('Invalid or expired reset link. Please try again.');
          setTimeout(() => {
            router.push('/forgot-password');
          }, 3000);
          return;
        }

        // Set the session temporarily to allow password reset
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (error) throw error;
        setIsReady(true);
      } catch (error) {
        setError('Invalid or expired reset link. Please try again.');
        setTimeout(() => {
          router.push('/forgot-password');
        }, 3000);
      }
    };

    initializeReset();
  }, [searchParams, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      
      // Sign out after password reset
      await supabase.auth.signOut();
      
      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isReady) {
    return (
      <div className="reset-password-page">
        <Header />
        <div className="reset-password-container">
          <div className="reset-password-box">
            <h1>Reset Password</h1>
            <div className="loading-message">
              <p>Preparing password reset...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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