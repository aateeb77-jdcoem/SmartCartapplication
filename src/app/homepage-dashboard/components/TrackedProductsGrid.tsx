'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import PriceSparkline from './PriceSparkline';

const TRACKED_PRODUCTS = [
  {
    id: 'tp-1',
    name: 'Sony WH-1000XM5',
    category: 'Headphones',
    bestPrice: 24990,
    originalPrice: 33990,
    bestSite: 'MegaMart',
    savings: 3000,
    priceHistory: [33990, 31990, 29490, 27990, 26490, 24990],
    emoji: '🎧',
  },
  {
    id: 'tp-2',
    name: 'iPad Air 11" M2',
    category: 'Tablets',
    bestPrice: 49900,
    originalPrice: 59900,
    bestSite: 'ShopNow',
    savings: 10000,
    priceHistory: [59900, 57900, 55900, 53900, 51900, 49900],
    emoji: '📱',
  },
  {
    id: 'tp-3',
    name: 'Samsung 65" QLED',
    category: 'TVs',
    bestPrice: 74990,
    originalPrice: 109990,
    bestSite: 'MegaMart',
    savings: 35000,
    priceHistory: [109990, 99990, 94990, 89990, 84990, 74990],
    emoji: '📺',
  },
  {
    id: 'tp-4',
    name: 'Nike Air Max 270',
    category: 'Footwear',
    bestPrice: 7495,
    originalPrice: 11795,
    bestSite: 'ShopNow',
    savings: 4300,
    priceHistory: [11795, 10995, 9995, 8995, 7995, 7495],
    emoji: '💟',
  },
];

function SkeletonCard() {
  return (
    <div className="glass-card skeleton" style={{ padding: '1.25rem', height: '140px' }} />
  );
}

export default function TrackedProductsGrid({ isLoaded }: { isLoaded: boolean }) {
  const router = useRouter();

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
          Tracked Products
        </h2>
        <span className="badge-neutral">Mock Data</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
          gap: '0.75rem',
        }}
      >
        {!isLoaded
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : TRACKED_PRODUCTS.map((p) => (
              <button
                key={p.id}
                onClick={() =>
                  router.push(`/product-results?q=${encodeURIComponent(p.name)}`)
                }
                className="glass-card-hover"
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  width: '100%',
                  background: 'none',
                  border: '1px solid rgba(71, 85, 105, 0.5)',
                  borderRadius: '1rem',
                  cursor: 'pointer',
                  animation: 'fadeInUp 0.5s ease forwards',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{p.emoji}</div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9', margin: '0 0 0.125rem' }}>
                      {p.name}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{p.category}</p>
                  </div>
                  <PriceSparkline data={p.priceHistory} />
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="price-tag" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#34d399' }}>
                    ₹{p.bestPrice.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#475569', textDecoration: 'line-through' }}>
                    ₹{p.originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Best at <span style={{ color: '#a5b4fc', fontWeight: 600 }}>{p.bestSite}</span>
                  </span>
                  <span className="badge-lowest" style={{ fontSize: '0.6875rem' }}>
                    Save ₹{p.savings.toLocaleString('en-IN')}
                  </span>
                </div>
              </button>
            ))}
      </div>
    </section>
  );
}
