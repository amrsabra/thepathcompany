'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../supabaseClient';
import '../../../styles/auth-callback.scss';

const AuthCallback = () => {
  const router = useRouter();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        if (!accessToken || !refreshToken) {
          throw new Error('No tokens found in URL');
        }

        if (type === 'recovery') {
          // 🚀 Redirect to reset-password with tokens in query string
          router.push(`/reset-password?access_token=${accessToken}&refresh_token=${refreshToken}`);
          return;
        }

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
      } catch (err) {
        console.error('Error in auth callback:', err);
        setError(err.message);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [router]);

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
