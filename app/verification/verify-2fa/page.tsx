'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Verify2FAPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    // Get email and password from URL params (passed from login page)
    const emailParam = searchParams.get('email');
    const passwordParam = searchParams.get('password');
    
    if (!emailParam || !passwordParam) {
      // If no credentials, redirect to login
      router.push('/login');
      return;
    }
    
    setEmail(emailParam);
    setPassword(passwordParam);
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          twoFactorCode: code,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect based on role
        if (data.user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/volunteers');
        }
      } else {
        setError(data.error || 'Invalid verification code');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    setResendSuccess(false);
    setError('');

    try {
      // Attempt login again to trigger a new 2FA code
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.requires2FA) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      }
    } catch (err) {
      setError('Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setCode(value);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '450px',
        width: '100%',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '16px',
          }}>
            🔐
          </div>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '8px',
          }}>
            Two-Factor Authentication
          </h1>
          <p style={{ 
            fontSize: '14px', 
            color: '#6b7280',
          }}>
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {/* Success message for resend */}
        {resendSuccess && (
          <div style={{
            backgroundColor: '#d1fae5',
            border: '1px solid #6ee7b7',
            color: '#065f46',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px',
            fontSize: '14px',
          }}>
            ✓ New verification code sent to your email!
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={{
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            color: '#c33',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        {/* Email display */}
        <div style={{
          backgroundColor: '#f3f4f6',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '24px',
          fontSize: '14px',
          textAlign: 'center',
        }}>
          <span style={{ color: '#6b7280' }}>Code sent to: </span>
          <strong>{email}</strong>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '500',
              textAlign: 'center',
            }}>
              Verification Code
            </label>
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="000000"
              maxLength={6}
              autoComplete="off"
              autoFocus
              required
              style={{
                width: '100%',
                padding: '16px',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '24px',
                letterSpacing: '8px',
                textAlign: 'center',
                fontWeight: 'bold',
                fontFamily: 'monospace',
              }}
            />
            <p style={{ 
              fontSize: '12px', 
              color: '#6b7280', 
              marginTop: '8px',
              textAlign: 'center',
            }}>
              Code expires in 10 minutes
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: code.length === 6 ? '#4F46E5' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: (loading || code.length !== 6) ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          borderTop: '1px solid #e5e7eb',
          marginTop: '24px',
          marginBottom: '24px',
        }} />

        {/* Resend & Back buttons */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '12px',
        }}>
          <button
            onClick={handleResendCode}
            disabled={resending}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'transparent',
              color: '#4F46E5',
              border: '1px solid #4F46E5',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: resending ? 'not-allowed' : 'pointer',
              opacity: resending ? 0.6 : 1,
            }}
          >
            {resending ? 'Sending...' : '↻ Resend Code'}
          </button>

          <a
            href="/login"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '10px',
              color: '#6b7280',
              fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            ← Back to Login
          </a>
        </div>

        {/* Help text */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#6b7280',
          lineHeight: '1.6',
        }}>
          <strong>Having trouble?</strong>
          <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px' }}>
            <li>Check your spam/junk folder</li>
            <li>Make sure the code hasn&apos;t expired</li>
            <li>Try requesting a new code</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
