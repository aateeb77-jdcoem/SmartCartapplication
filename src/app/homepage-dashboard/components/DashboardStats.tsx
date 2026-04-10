'use client';

import React, { useEffect, useState } from 'react';

const STATS = [
  { label: 'Products Tracked', value: 1284, suffix: '', icon: '📦', color: '#818cf8' },
  { label: 'Total Saved', value: 3600, prefix: '₹', suffix: '', icon: '💰', color: '#34d399' },
  { label: 'Comparisons Run', value: 5621, suffix: '', icon: '⚡', color: '#f59e0b' },
  { label: 'AI Verdicts', value: 890, suffix: 'K+', icon: '🤖', color: '#f472b6' },
];

function AnimatedCount({ target, prefix = '', suffix = '', active }: {
  target: number; prefix?: string; suffix?: string; active: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.ceil(target / 40);
    const t = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [active, target]);

  return (
    <span className="price-tag" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontWeight: 800, color: '#f1f5f9' }}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export default function DashboardStats({ isLoaded }: { isLoaded: boolean }) {
  return (
    <div className="stats-grid" style={{ marginTop: '0.5rem' }}>
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="glass-card"
          style={{ padding: '1rem', position: 'relative', overflow: 'hidden' }}
        >
          {/* Glow accent */}
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: stat.color,
              opacity: 0.08,
              filter: 'blur(20px)',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.125rem' }}>{stat.icon}</span>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{stat.label}</span>
          </div>

          <AnimatedCount target={stat.value} prefix={stat.prefix} suffix={stat.suffix} active={isLoaded} />

          <div style={{ marginTop: '0.5rem', height: '2px', borderRadius: '9999px', background: `linear-gradient(90deg, ${stat.color}40, ${stat.color}10)` }} />
        </div>
      ))}
    </div>
  );
}
