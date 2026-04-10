'use client';

import React from 'react';

const ACTIVITIES = [
  { id: 'a1', type: 'price_drop', product: 'Sony WH-1000XM5', detail: 'Price dropped $31 at MegaMart', time: '2 min ago', icon: '📉', color: '#34d399' },
  { id: 'a2', type: 'verdict', product: 'iPad Air M2', detail: 'AI verdict: Buy from ShopNow', time: '18 min ago', icon: '🤖', color: '#818cf8' },
  { id: 'a3', type: 'alert', product: 'Samsung QLED 65"', detail: 'New lowest price: $897', time: '1 hr ago', icon: '🔔', color: '#f59e0b' },
  { id: 'a4', type: 'compare', product: 'Nike Air Max 270', detail: 'Compared across 2 stores', time: '3 hr ago', icon: '⚡', color: '#f472b6' },
  { id: 'a5', type: 'track', product: 'MacBook Air M3', detail: 'Added to tracking', time: 'Yesterday', icon: '👁️', color: '#60a5fa' },
];

function SkeletonRow() {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', padding: '0.875rem 0', borderBottom: '1px solid rgba(30,41,59,0.6)' }}>
      <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ height: '12px', width: '60%', marginBottom: '6px' }} />
        <div className="skeleton" style={{ height: '10px', width: '80%' }} />
      </div>
    </div>
  );
}

export default function RecentActivity({ isLoaded }: { isLoaded: boolean }) {
  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
          Recent Activity
        </h2>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
      </div>

      <div className="glass-card" style={{ padding: '0 1rem' }}>
        {!isLoaded
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          : ACTIVITIES.map((a, idx) => (
              <div
                key={a.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.875rem 0',
                  borderBottom: idx < ACTIVITIES.length - 1 ? '1px solid rgba(30,41,59,0.8)' : 'none',
                  animation: `fadeInUp 0.4s ${idx * 0.07}s ease both`,
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: `${a.color}18`,
                    border: `1px solid ${a.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    flexShrink: 0,
                  }}
                >
                  {a.icon}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: '#cbd5e1',
                      margin: '0 0 2px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {a.product}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{a.detail}</p>
                </div>

                {/* Time */}
                <span style={{ fontSize: '0.6875rem', color: '#475569', flexShrink: 0, paddingTop: '2px' }}>
                  {a.time}
                </span>
              </div>
            ))}
      </div>
    </section>
  );
}
