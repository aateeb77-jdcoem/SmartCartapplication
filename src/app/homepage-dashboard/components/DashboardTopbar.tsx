'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardTopbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/sign-up-login-screen');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(2, 8, 23, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(30, 41, 59, 0.8)',
      }}
    >
      <div
        style={{
          maxWidth: '1536px',
          margin: '0 auto',
          padding: '0 1rem',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => router.push('/homepage-dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem',
            minHeight: '44px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99,102,241,0.35)',
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="3" y1="6" x2="21" y2="6" stroke="white" strokeWidth="1.5" />
              <path d="M16 10a4 4 0 01-8 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
            Smart<span style={{ color: '#818cf8' }}>Cart</span>
          </span>
        </button>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Notification bell */}
          <button
            className="btn-ghost"
            aria-label="Notifications"
            style={{ padding: '0.5rem', borderRadius: '0.625rem', minHeight: '44px', minWidth: '44px', justifyContent: 'center' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: '#94a3b8' }}>
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* User menu — avatar only on mobile, avatar+name on desktop */}
          <button
            onClick={handleLogout}
            title="Sign out"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(51, 65, 85, 0.6)',
              borderRadius: '0.625rem',
              padding: '0.375rem 0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minHeight: '44px',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'white',
                flexShrink: 0,
              }}
            >
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <span className="topbar-username" style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#cbd5e1' }}>
              {user?.name ?? 'Account'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
