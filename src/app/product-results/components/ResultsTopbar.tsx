'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addToSearchHistory } from '@/components/CommandPalette';

export default function ResultsTopbar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    addToSearchHistory(trimmed);
    router.push(`/product-results?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(2, 8, 23, 0.9)',
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
          gap: '0.75rem',
        }}
      >
        {/* Back + Logo */}
        <button
          onClick={() => router.push('/homepage-dashboard')}
          aria-label="Back to dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#94a3b8',
            padding: '0.25rem',
            transition: 'color 0.2s',
            flexShrink: 0,
            minHeight: '44px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="3" y1="6" x2="21" y2="6" stroke="white" strokeWidth="1.5" />
              <path d="M16 10a4 4 0 01-8 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="hidden sm:inline" style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#f1f5f9' }}>
            Smart<span style={{ color: '#818cf8' }}>Cart</span>
          </span>
        </button>

        {/* Divider — hidden on mobile */}
        <div className="hidden sm:block" style={{ width: '1px', height: '24px', background: 'rgba(51,65,85,0.8)' }} />

        {/* Desktop inline search — hidden on mobile */}
        <form onSubmit={handleSearch} className="hidden sm:flex" style={{ flex: 1, maxWidth: '520px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(51, 65, 85, 0.7)',
              borderRadius: '0.75rem',
              padding: '0.375rem 0.5rem 0.375rem 0.875rem',
              gap: '0.5rem',
              width: '100%',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: '#475569', flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search another product…"
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#f1f5f9', fontSize: '0.875rem', minHeight: '36px' }}
              autoComplete="off"
            />
            {query && (
              <button type="submit" style={{ background: 'rgba(79,70,229,0.8)', border: 'none', borderRadius: '0.5rem', padding: '0.375rem 0.75rem', color: 'white', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', minHeight: '32px' }}>Go</button>
            )}
          </div>
        </form>

        {/* Mobile search toggle */}
        <div className="sm:hidden" style={{ marginLeft: 'auto' }}>
          <button
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Search"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0.5rem', minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile search drawer */}
      {showSearch && (
        <div className="sm:hidden" style={{ padding: '0.5rem 1rem 0.75rem', borderTop: '1px solid rgba(30,41,59,0.6)', animation: 'fadeInUp 0.2s ease' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search product…"
              autoFocus
              autoComplete="off"
              style={{ flex: 1, background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.7)', borderRadius: '0.75rem', padding: '0.75rem', color: '#f1f5f9', fontSize: '1rem', outline: 'none', minHeight: '48px' }}
            />
            <button type="submit" className="btn-primary" style={{ borderRadius: '0.75rem', padding: '0 1rem', fontSize: '0.875rem' }}>Go</button>
          </form>
        </div>
      )}
    </header>
  );
}
