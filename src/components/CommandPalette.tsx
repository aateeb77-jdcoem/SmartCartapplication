'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const SEARCH_HISTORY_KEY = 'smartcart_search_history';
const MAX_HISTORY = 8;

function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addToSearchHistory(query: string) {
  if (typeof window === 'undefined') return;
  try {
    const history = getSearchHistory().filter((h) => h.toLowerCase() !== query.toLowerCase());
    history.unshift(query);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
  } catch {
    // Ignore storage errors
  }
}

export default function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setHistory(getSearchHistory());
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSearch = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    addToSearchHistory(trimmed);
    setIsOpen(false);
    router.push(`/product-results?q=${encodeURIComponent(trimmed)}`);
  }, [router]);

  const popular = ['iPhone 16 Pro Max', 'Sony WH-1000XM5', 'MacBook Air M3', 'Samsung S25 Ultra'];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 9998,
          animation: 'fadeIn 0.15s ease',
        }}
      />

      {/* Palette */}
      <div
        style={{
          position: 'fixed',
          top: '12%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '560px',
          maxWidth: 'calc(100vw - 1.5rem)',
          background: 'rgba(2, 8, 23, 0.98)',
          border: '1px solid rgba(71, 85, 105, 0.5)',
          borderRadius: '1.25rem',
          overflow: 'hidden',
          zIndex: 9999,
          boxShadow: '0 25px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.15)',
          animation: 'slideUp 0.2s ease',
        }}
      >
        {/* Search input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid rgba(71,85,105,0.4)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: '#818cf8', flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch(query);
            }}
            placeholder="Search for any product..."
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: '#f1f5f9',
              fontSize: '1rem',
            }}
            autoFocus
          />
          <kbd
            style={{
              padding: '0.125rem 0.5rem',
              borderRadius: '0.375rem',
              background: 'rgba(51,65,85,0.4)',
              border: '1px solid rgba(71,85,105,0.4)',
              fontSize: '0.6875rem',
              color: '#64748b',
              fontFamily: 'inherit',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results area */}
        <div style={{ maxHeight: '50vh', overflowY: 'auto', padding: '0.5rem', WebkitOverflowScrolling: 'touch' }}>
          {/* Search history */}
          {history.length > 0 && !query && (
            <div style={{ padding: '0.5rem 0.75rem' }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.5rem' }}>
                Recent Searches
              </p>
              {history.map((h) => (
                <button
                  key={h}
                  onClick={() => handleSearch(h)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.625rem 0.75rem',
                    minHeight: '44px',
                    borderRadius: '0.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#cbd5e1',
                    fontSize: '0.8125rem',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(51,65,85,0.4)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: '#475569', flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {h}
                </button>
              ))}
            </div>
          )}

          {/* Popular searches */}
          {!query && (
            <div style={{ padding: '0.5rem 0.75rem' }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.5rem' }}>
                Popular Products
              </p>
              {popular.map((p) => (
                <button
                  key={p}
                  onClick={() => handleSearch(p)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.625rem 0.75rem',
                    minHeight: '44px',
                    borderRadius: '0.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#cbd5e1',
                    fontSize: '0.8125rem',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(51,65,85,0.4)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: '#818cf8', flexShrink: 0 }}>
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Search action for typed query */}
          {query.trim() && (
            <div style={{ padding: '0.5rem 0.75rem' }}>
              <button
                onClick={() => handleSearch(query)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.75rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(99,102,241,0.08)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  cursor: 'pointer',
                  color: '#a5b4fc',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  transition: 'background 0.15s',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Compare &quot;{query.trim()}&quot;
              </button>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div
          style={{
            padding: '0.625rem 1.25rem',
            borderTop: '1px solid rgba(71,85,105,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '0.6875rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <kbd style={{ padding: '0.125rem 0.375rem', borderRadius: '0.25rem', background: 'rgba(51,65,85,0.4)', border: '1px solid rgba(71,85,105,0.4)', fontSize: '0.625rem', color: '#64748b' }}>Enter</kbd>
            to search
          </span>
          <span style={{ fontSize: '0.6875rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <kbd style={{ padding: '0.125rem 0.375rem', borderRadius: '0.25rem', background: 'rgba(51,65,85,0.4)', border: '1px solid rgba(71,85,105,0.4)', fontSize: '0.625rem', color: '#64748b' }}>Ctrl+K</kbd>
            anytime
          </span>
        </div>
      </div>
    </>
  );
}
