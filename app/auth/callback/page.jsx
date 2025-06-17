'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../supabaseClient';
import '../../../styles/auth-callback.scss';

const AuthCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type');

        if (!accessToken || !refreshToken) {
          throw new Error('No tokens found in URL');
        }

        if (type === 'recovery') {
          // Don't set the session — just redirect to reset-password
          router.push(`/reset-password?access_token=${accessToken}&refresh_token=${refreshToken}`);
          return;
        }

        // For other types (signup, oauth login), set session
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) throw sessionError;

        if (type === 'signup') {
          router.push('/plans');
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        setError(error.message);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="auth-callback">
        <div className="auth-callback-content">
          <div className="error-message">
            <p>{error}</p>
            <p>Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-callback">
      <div className="auth-callback-content">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Processing authentication...</p>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallback />
    </Suspense>
  );
}
