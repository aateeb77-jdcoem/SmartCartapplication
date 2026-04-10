'use client';

import React, { useState } from 'react';
import { ProductData } from '../data/mockProductData';
import { useToast } from '@/components/ToastProvider';

export default function TrackProductButton({
  product,
  isTracked,
  onTrack,
}: {
  product?: ProductData;
  isTracked: boolean;
  onTrack: () => void;
}) {
  const { success } = useToast();
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (isTracked || !product) return;
    setLoading(true);
    // BACKEND INTEGRATION: POST /api/track { productId: product.id }
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    onTrack();
    success(
      'Product tracked!',
      `We'll alert you when ${product.name} drops in price.`
    );
  };

  if (!product) return null;

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
        marginBottom: '2rem',
        border: isTracked ? '1px solid rgba(16,185,129,0.3)' : undefined,
      }}
    >
      <div>
        <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>
          {isTracked ? '✓ Tracking active' : 'Track this product'}
        </p>
        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
          {isTracked
            ? "We'll notify you when prices change."
            : 'Get instant alerts when the price drops below your target.'}
        </p>
      </div>

      <button
        onClick={handleTrack}
        disabled={isTracked || loading}
        className="btn-primary"
        style={{
          minWidth: '160px',
          background: isTracked
            ? 'rgba(16,185,129,0.2)'
            : undefined,
          color: isTracked ? '#34d399' : undefined,
          border: isTracked ? '1px solid rgba(16,185,129,0.3)' : 'none',
          cursor: isTracked ? 'default' : 'pointer',
        }}
      >
        {loading ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
              <path d="M21 12a9 9 0 11-6.22-8.56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Tracking…
          </>
        ) : isTracked ? (
          '✓ Tracking'
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Track Price
          </>
        )}
      </button>
    </div>
  );
}
