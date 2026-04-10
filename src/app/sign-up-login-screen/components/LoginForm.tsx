'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ToastProvider';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Minimum 6 characters';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setErrors({});
    try {
      await login(email, password);
      success('Welcome back!', 'You have successfully signed in.');
      router.push('/homepage-dashboard');
    } catch {
      error('Sign in failed', 'Please check your credentials and try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#f1f5f9', margin: '0 0 0.375rem', letterSpacing: '-0.02em' }}>
          Welcome back
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          Sign in to your SmartCart account
        </p>
      </div>

      {/* Email */}
      <div>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.375rem' }}>
          Email
        </label>
        <input
          type="email"
          id="login-email"
          className="input-field"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        {errors.email && (
          <p style={{ fontSize: '0.75rem', color: '#f87171', margin: '4px 0 0' }}>{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
          <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#cbd5e1' }}>
            Password
          </label>
          <button type="button" style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: '#818cf8', cursor: 'pointer', padding: 0 }}>
            Forgot password?
          </button>
        </div>
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="login-password"
            className="input-field"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            style={{ paddingRight: '2.75rem' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#475569',
              padding: 0,
              lineHeight: 1,
            }}
          >
            {showPassword ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" /></svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p style={{ fontSize: '0.75rem', color: '#f87171', margin: '4px 0 0' }}>{errors.password}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        id="login-submit"
        className="btn-primary"
        disabled={isLoading}
        style={{ width: '100%', justifyContent: 'center', fontSize: '0.9375rem' }}
      >
        {isLoading ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
              <path d="M21 12a9 9 0 11-6.22-8.56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Signing in…
          </>
        ) : (
          'Sign In'
        )}
      </button>

      <p style={{ fontSize: '0.8125rem', color: '#475569', textAlign: 'center', margin: 0 }}>
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: 600, cursor: 'pointer', padding: 0 }}
        >
          Create one
        </button>
      </p>
    </form>
  );
}
