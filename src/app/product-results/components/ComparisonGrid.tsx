'use client';

import React from 'react';
import { ProductData } from '../data/mockProductData';
import AppImage from '@/components/ui/AppImage';

// ── SiteCard — hoisted outside to prevent unmount/remount on every render ────
function SiteCard({ site, isWinner }: { site: ProductData['siteA']; isWinner: boolean }) {
  const isAvailable = site.inStock && site.price > 0;

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.25rem',
        position: 'relative',
        border: isWinner && isAvailable
          ? '1px solid rgba(16,185,129,0.3)'
          : '1px solid rgba(71,85,105,0.5)',
        opacity: isAvailable ? 1 : 0.6,
        transition: 'opacity 0.3s ease',
      }}
    >
      {isWinner && isAvailable && (
        <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)' }}>
          <span className="badge-lowest" style={{ fontSize: '0.6875rem', whiteSpace: 'nowrap' }}>
            ⚡ Best Deal
          </span>
        </div>
      )}

      {/* Store name + status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 2px' }}>Available at</p>
          <p style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{site.name}</p>
        </div>
        <span className={isAvailable ? 'badge-lowest' : 'badge-higher'} style={{ fontSize: '0.6875rem' }}>
          {isAvailable ? '✓ In Stock' : `✗ Not available`}
        </span>
      </div>

      {/* Product image */}
      <div
        style={{
          width: '100%',
          height: '160px',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          background: 'rgba(15, 23, 42, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        {site.image ? (
          <AppImage
            src={site.image}
            alt={site.imageAlt || site.name}
            width={200}
            height={150}
            className=""
            style={{ objectFit: 'contain', maxHeight: '100%', width: 'auto', height: 'auto' }}
          />
        ) : (
          <div style={{ color: '#475569', fontSize: '2rem' }}>📦</div>
        )}
      </div>

      {/* Price */}
      <div style={{ marginBottom: '0.875rem' }}>
        {isAvailable ? (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span
                className="price-tag"
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: isWinner ? '#34d399' : '#f1f5f9',
                }}
              >
                ₹{site.price.toLocaleString('en-IN')}
              </span>
              {site.originalPrice > site.price && (
                <span style={{ fontSize: '0.875rem', color: '#475569', textDecoration: 'line-through' }}>
                  ₹{site.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {site.discount && (
                <span className="badge-lowest" style={{ fontSize: '0.625rem' }}>{site.discount}</span>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0' }}>{site.stockLevel}</p>
          </>
        ) : (
          <div style={{ padding: '0.75rem 0' }}>
            <p style={{ fontSize: '1rem', fontWeight: 600, color: '#f87171', margin: 0 }}>Not Available</p>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0' }}>
              This product was not found on {site.name}
            </p>
          </div>
        )}
      </div>

      {/* Rating — only show if available */}
      {isAvailable && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.875rem' }}>
          <span style={{ color: '#f59e0b', fontSize: '0.875rem' }}>★</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9' }}>{site.rating}</span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>({site.reviewCount.toLocaleString()} reviews)</span>
        </div>
      )}

      {/* Delivery */}
      {isAvailable && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '0.5rem',
            padding: '0.625rem 0.75rem',
            marginBottom: '0.875rem',
          }}
        >
          <p style={{ fontSize: '0.6875rem', color: '#64748b', margin: '0 0 2px' }}>Delivery</p>
          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#cbd5e1', margin: 0 }}>{site.deliveryEstimate}</p>
        </div>
      )}

      {/* Visit Store CTA */}
      {isAvailable && site.url && site.url !== '#' && (
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{
            width: '100%',
            textAlign: 'center',
            textDecoration: 'none',
            fontSize: '0.8125rem',
            padding: '0.5rem 1rem',
            marginBottom: '0.625rem',
            display: 'block',
          }}
        >
          Visit {site.name} →
        </a>
      )}

      {/* Badges */}
      {site.badges.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {site.badges.map((b) => (
            <span key={b} className="badge-neutral" style={{ fontSize: '0.6875rem' }}>{b}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── ComparisonGrid ──────────────────────────────────────────────────────────
export default function ComparisonGrid({ product }: { product?: ProductData }) {
  if (!product) return null;

  const { siteA, siteB, verdict, specs } = product;
  const winnerSite = verdict.site;

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Side-by-side cards — responsive: stack on mobile */}
      <div
        style={{
          display: 'grid',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
        className="comparison-grid-cols"
      >
        <SiteCard site={siteA} isWinner={winnerSite === siteA.name} />
        <SiteCard site={siteB} isWinner={winnerSite === siteB.name} />
      </div>

      {/* Specs table */}
      {specs.length > 0 && (
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 1rem' }}>
            Specifications
          </h3>
          <div
            style={{ display: 'grid', gap: '0.5rem' }}
            className="specs-grid-cols"
          >
            {specs.map((s) => (
              <div
                key={s.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  background: 'rgba(15, 23, 42, 0.3)',
                  borderRadius: '0.5rem',
                }}
              >
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.label}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
