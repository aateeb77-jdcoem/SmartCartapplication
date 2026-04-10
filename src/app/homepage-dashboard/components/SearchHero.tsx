'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addToSearchHistory } from '@/components/CommandPalette';

export default function SearchHero() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    addToSearchHistory(trimmed);
    router.push(`/product-results?q=${encodeURIComponent(trimmed)}`);
  };

  const suggestions = [
    'Sony WH-1000XM5',
    'iPhone 16 Pro',
    'Samsung 65" QLED',
    'Nike Air Max 270',
  ];

  return (
    <section style={{ padding: '2rem 0 1.5rem' }}>
      {/* Headline */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '9999px',
            padding: '0.25rem 0.875rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', animation: 'pulse 2s ease-in-out infinite' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#a5b4fc' }}>
            AI-Powered Price Comparison
          </span>
        </div>
        <h1
          style={{
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
            fontWeight: 800,
            color: '#f1f5f9',
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
            margin: '0 0 0.625rem',
            padding: '0 0.5rem',
          }}
        >
          Stop paying more.{' '}
          <span style={{ background: 'linear-gradient(135deg, #818cf8, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Start saving.
          </span>
        </h1>
        <p style={{ fontSize: 'clamp(0.8125rem, 2.5vw, 1rem)', color: '#64748b', maxWidth: '500px', margin: '0 auto', padding: '0 1rem', lineHeight: 1.6 }}>
          Search any product — we compare prices across major retailers and give you an AI verdict instantly.
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} style={{ maxWidth: '680px', margin: '0 auto', padding: '0 0.25rem' }}>
        <div
          className="search-glow"
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(51, 65, 85, 0.8)',
            borderRadius: '1rem',
            padding: '0.375rem 0.375rem 0.375rem 1rem',
            transition: 'all 0.2s',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: '#475569', flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a product…"
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: '#f1f5f9',
              fontSize: '1rem', /* 16px — prevents iOS auto-zoom */
              padding: '0.625rem 0.75rem',
              minHeight: '44px',
            }}
            autoComplete="off"
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ borderRadius: '0.625rem', padding: '0.625rem 1.25rem', fontSize: '0.875rem', whiteSpace: 'nowrap' }}
          >
            Compare
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="hidden sm:inline">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </form>

      {/* Quick suggestions — horizontal scroll on mobile */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          justifyContent: 'center',
          marginTop: '0.875rem',
          flexWrap: 'wrap',
          padding: '0 0.5rem',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: '#475569' }}>Try:</span>
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => {
              setQuery(s);
              addToSearchHistory(s);
              router.push(`/product-results?q=${encodeURIComponent(s)}`);
            }}
            style={{
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(51, 65, 85, 0.5)',
              borderRadius: '9999px',
              padding: '0.375rem 0.75rem',
              fontSize: '0.75rem',
              color: '#94a3b8',
              cursor: 'pointer',
              transition: 'all 0.15s',
              minHeight: '32px',
              whiteSpace: 'nowrap',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Keyboard shortcut hint — hidden on mobile (no keyboard shortcut support) */}
      <div className="hidden sm:block" style={{ textAlign: 'center', marginTop: '0.75rem' }}>
        <span style={{ fontSize: '0.6875rem', color: '#475569', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
          Pro tip: Press{' '}
          <kbd style={{
            padding: '0.125rem 0.5rem',
            borderRadius: '0.375rem',
            background: 'rgba(51,65,85,0.4)',
            border: '1px solid rgba(71,85,105,0.4)',
            fontSize: '0.625rem',
            color: '#94a3b8',
            fontFamily: 'inherit',
          }}>Ctrl+K</kbd>
          {' '}to search from anywhere
        </span>
      </div>
    </section>
  );
}
