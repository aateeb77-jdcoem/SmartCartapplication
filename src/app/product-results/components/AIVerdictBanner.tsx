'use client';

import React from 'react';
import { MOCK_PRODUCT_DATA } from '../data/mockProductData';

type Verdict = typeof MOCK_PRODUCT_DATA.verdict;

export default function AIVerdictBanner({ verdict }: { verdict?: Verdict }) {
  if (!verdict) return null;

  const hasSavings = verdict.savingsAmount > 0;
  const isNotFound = verdict.site === 'None';

  return (
    <div
      className="verdict-banner"
      style={{ padding: '1.5rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}
    >
      {/* Bg glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(99,102,241,0.1)',
          filter: 'blur(40px)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(16,185,129,0.2))',
              border: '1px solid rgba(99,102,241,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '1.125rem' }}>🤖</span>
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.6875rem', color: '#818cf8', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                AI Verdict
              </span>
              <span className="badge-lowest" style={{ fontSize: '0.625rem' }}>
                {verdict.confidence} Confidence
              </span>
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#f1f5f9', margin: '0.25rem 0 0' }}>
              {verdict.recommendation}
            </h2>
          </div>
          {!isNotFound && (
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 2px' }}>
                {hasSavings ? 'You save' : 'Price diff'}
              </p>
              <p className="price-tag" style={{ fontSize: '1.25rem', fontWeight: 800, color: hasSavings ? '#34d399' : '#94a3b8', margin: 0 }}>
                {hasSavings ? `₹${verdict.savingsAmount.toLocaleString('en-IN')}` : 'Same price'}
              </p>
              {hasSavings && (
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{verdict.savingsPct}% less</p>
              )}
            </div>
          )}
        </div>

        {/* Summary */}
        <p style={{ fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.65, marginBottom: '1rem' }}>
          {verdict.summary}
        </p>

        {/* Pros & cons — responsive grid */}
        {(verdict.pros.length > 0 || verdict.cons.length > 0) && (
          <div className="verdict-pros-cons-grid" style={{ display: 'grid', gap: '0.75rem' }}>
            {verdict.pros.length > 0 && (
              <div>
                <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                  Why buy here
                </p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  {verdict.pros.map((p, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.375rem' }}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ marginTop: '2px', flexShrink: 0 }}>
                        <circle cx="8" cy="8" r="7" fill="rgba(16,185,129,0.15)" />
                        <path d="M5 8l2 2 4-3.5" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.5 }}>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {verdict.cons.length > 0 && (
              <div>
                <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#f87171', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                  Watch out for
                </p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  {verdict.cons.map((c, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.375rem' }}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ marginTop: '2px', flexShrink: 0 }}>
                        <circle cx="8" cy="8" r="7" fill="rgba(239,68,68,0.15)" />
                        <path d="M6 6l4 4M10 6l-4 4" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.5 }}>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
