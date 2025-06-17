'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header/Header';
import { supabase } from '../../supabaseClient';
import '../../styles/forgot-password.scss';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError('Could not send reset email. Please check your email and try again.');
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <Header forceSolid={true} />
      <div className="forgot-password-container">
        <div className="forgot-password-content">
          <h1>Reset Password</h1>
          {!success ? (
            <>
              <p>Enter your email address and we'll send you a link to reset your password.</p>
              <form onSubmit={handleSubmit} className="forgot-password-form">
                <div className="form-group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="reset-button" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="success-message">
              <p>Check your email for the password reset link.</p>
              <div className="back-to-login">
                <Link href="/login">Back to Login</Link>
              </div>
            </div>
          )}
          {!success && (
            <div className="back-to-login">
              <Link href="/login">Back to Login</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
