'use client';

import React from 'react';

const STAGES: Record<string, { label: string; sublabel: string; color: string }> = {
  scraping: {
    label: 'Scanning retailers…',
    sublabel: 'Fetching real-time prices from Amazon and Flipkart',
    color: '#818cf8',
  },
  analyzing: {
    label: 'Analyzing results…',
    sublabel: 'Comparing prices and building your verdict',
    color: '#34d399',
  },
};

export default function LoadingSkeleton({
  stage,
  query,
}: {
  stage: 'scraping' | 'analyzing';
  query: string;
}) {
  const { label, sublabel, color } = STAGES[stage] || STAGES.scraping;

  return (
    <div className="animate-fade-in">
      {/* Status pill */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '0.25rem' }}>Comparing</p>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 1rem' }}>{query}</h1>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.625rem',
            background: `${color}12`,
            border: `1px solid ${color}30`,
            borderRadius: '9999px',
            padding: '0.375rem 0.875rem',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            style={{ color, animation: 'spin 1s linear infinite' }}
          >
            <path d="M21 12a9 9 0 11-6.22-8.56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color }}>{label}</span>
        </div>
        <p style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '0.5rem' }}>{sublabel}</p>
      </div>

      {/* Skeleton verdict banner */}
      <div className="skeleton" style={{ height: '120px', borderRadius: '1rem', marginBottom: '1.5rem' }} />

      {/* Skeleton side-by-side grid — responsive */}
      <div className="comparison-grid-cols" style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="skeleton" style={{ height: '280px', borderRadius: '1rem' }} />
        <div className="skeleton" style={{ height: '280px', borderRadius: '1rem' }} />
      </div>

      {/* Skeleton review panels — responsive */}
      <div className="review-grid-cols" style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="skeleton" style={{ height: '200px', borderRadius: '1rem' }} />
        <div className="skeleton" style={{ height: '200px', borderRadius: '1rem' }} />
      </div>

      {/* Skeleton chart */}
      <div className="skeleton" style={{ height: '180px', borderRadius: '1rem' }} />
    </div>
  );
}
