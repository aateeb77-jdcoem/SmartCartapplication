'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ToastProvider';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export default function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const router = useRouter();
  const { signup, isLoading } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 8) e.password = 'Minimum 8 characters';
    if (!confirm) e.confirm = 'Please confirm your password';
    else if (confirm !== password) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setErrors({});
    try {
      await signup(name.trim(), email, password);
      success('Account created!', 'Welcome to SmartCart. Let\'s find you some deals.');
      router.push('/homepage-dashboard');
    } catch {
      error('Signup failed', 'Something went wrong. Please try again.');
    }
  };

  const Field = ({
    id, label, type = 'text', value, onChange, placeholder, errKey, extra,
  }: {
    id: string; label: string; type?: string; value: string;
    onChange: (v: string) => void; placeholder: string; errKey: string; extra?: React.ReactNode;
  }) => (
    <div>
      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.375rem' }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="input-field"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {extra}
      {errors[errKey] && (
        <p style={{ fontSize: '0.75rem', color: '#f87171', margin: '4px 0 0' }}>{errors[errKey]}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
      <div>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#f1f5f9', margin: '0 0 0.375rem', letterSpacing: '-0.02em' }}>
          Create your account
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          Start comparing smarter today — it's free
        </p>
      </div>

      <Field id="signup-name" label="Full Name" value={name} onChange={setName} placeholder="Jane Smith" errKey="name" />
      <Field id="signup-email" label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" errKey="email" />

      {/* Password with show/hide */}
      <div>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.375rem' }}>
          Password
        </label>
        <div style={{ position: 'relative' }}>
          <input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            className="input-field"
            placeholder="Min 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ paddingRight: '2.75rem' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 0, lineHeight: 1 }}
          >
            {showPassword ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" /></svg>
            )}
          </button>
        </div>
        {errors.password && <p style={{ fontSize: '0.75rem', color: '#f87171', margin: '4px 0 0' }}>{errors.password}</p>}
      </div>

      <Field id="signup-confirm" label="Confirm Password" type="password" value={confirm} onChange={setConfirm} placeholder="••••••••" errKey="confirm" />

      {/* Terms */}
      <p style={{ fontSize: '0.75rem', color: '#475569', margin: 0 }}>
        By creating an account you agree to our{' '}
        <span style={{ color: '#818cf8', cursor: 'pointer' }}>Terms of Service</span> and{' '}
        <span style={{ color: '#818cf8', cursor: 'pointer' }}>Privacy Policy</span>.
      </p>

      <button
        type="submit"
        id="signup-submit"
        className="btn-primary"
        disabled={isLoading}
        style={{ width: '100%', justifyContent: 'center', fontSize: '0.9375rem' }}
      >
        {isLoading ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
              <path d="M21 12a9 9 0 11-6.22-8.56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Creating account…
          </>
        ) : (
          'Create Account →'
        )}
      </button>

      <p style={{ fontSize: '0.8125rem', color: '#475569', textAlign: 'center', margin: 0 }}>
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: 600, cursor: 'pointer', padding: 0 }}
        >
          Sign in
        </button>
      </p>
    </form>
  );
}
