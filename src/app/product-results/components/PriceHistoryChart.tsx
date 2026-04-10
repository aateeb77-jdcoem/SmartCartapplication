'use client';

import React from 'react';
import { ProductData } from '../data/mockProductData';

type PriceHistory = ProductData['priceHistory'];

export default function PriceHistoryChart({
  priceHistory,
  isTracked,
}: {
  priceHistory?: PriceHistory;
  isTracked: boolean;
}) {
  // Show "not enough data" message when we only have 1 point
  if (!priceHistory || priceHistory.length === 0) return null;

  if (priceHistory.length < 2) {
    return (
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 0.75rem' }}>
          Price History
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 0' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.125rem' }}>📊</span>
          </div>
          <div>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#cbd5e1', margin: '0 0 2px' }}>
              Not enough data yet
            </p>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
              Price history will build over time. Track this product to get alerts.
            </p>
          </div>
        </div>
        {isTracked && (
          <p style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.5rem', textAlign: 'center' }}>
            ✓ You&apos;ll get an alert when the price drops
          </p>
        )}
      </div>
    );
  }

  const WIDTH = 600;
  const HEIGHT = 160;
  const PADDING = { top: 16, right: 16, bottom: 32, left: 48 };
  const innerW = WIDTH - PADDING.left - PADDING.right;
  const innerH = HEIGHT - PADDING.top - PADDING.bottom;

  const allPrices = priceHistory.flatMap((d) => [d.shopNow, d.megaMart]).filter(p => p > 0);
  if (allPrices.length === 0) return null;

  const minP = Math.min(...allPrices) * 0.97;
  const maxP = Math.max(...allPrices) * 1.02;
  const range = maxP - minP || 1;

  const xScale = (i: number) => PADDING.left + (i / (priceHistory.length - 1)) * innerW;
  const yScale = (v: number) => PADDING.top + innerH - ((v - minP) / range) * innerH;

  type PricePoint = { date: string; shopNow: number; megaMart: number };

  // Build fill paths correctly for each line
  const buildFillPath = (accessor: (d: PricePoint) => number) => {
    const pts = priceHistory.map((d, i) => `${xScale(i)},${yScale(accessor(d))}`);
    const first = pts[0].split(',');
    const last = pts[pts.length - 1].split(',');
    const bottomY = PADDING.top + innerH;
    return `M${pts.join(' L')} L${last[0]},${bottomY} L${first[0]},${bottomY} Z`;
  };

  const shopNowFill = buildFillPath((d) => d.shopNow);
  const megaMartFill = buildFillPath((d) => d.megaMart);

  const shopNowLinePath = priceHistory
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(d.shopNow)}`)
    .join(' ');
  const megaMartLinePath = priceHistory
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(d.megaMart)}`)
    .join(' ');

  return (
    <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
          Price History
        </h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <div style={{ width: '24px', height: '2px', background: '#818cf8', borderRadius: '1px' }} />
            <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Amazon</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <div style={{ width: '24px', height: '2px', background: '#34d399', borderRadius: '1px' }} />
            <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Flipkart</span>
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ width: '100%', minWidth: '320px', display: 'block' }}>
          <defs>
            <linearGradient id="shopFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="megaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const y = PADDING.top + innerH * t;
            const price = maxP - (maxP - minP) * t;
            return (
              <g key={t}>
                <line x1={PADDING.left} y1={y} x2={PADDING.left + innerW} y2={y} stroke="rgba(51,65,85,0.4)" strokeWidth="1" strokeDasharray={t === 0 ? '0' : '4,4'} />
                <text x={PADDING.left - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#475569">
                  ₹{Math.round(price).toLocaleString('en-IN')}
                </text>
              </g>
            );
          })}

          {/* X axis labels */}
          {priceHistory.map((d, i) => (
            <text key={i} x={xScale(i)} y={HEIGHT - 6} textAnchor="middle" fontSize="9" fill="#475569">
              {d.date}
            </text>
          ))}

          {/* Fill areas */}
          <path d={shopNowFill} fill="url(#shopFill)" />
          <path d={megaMartFill} fill="url(#megaFill)" />

          {/* Lines */}
          <path d={shopNowLinePath} stroke="#818cf8" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={megaMartLinePath} stroke="#34d399" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

          {/* End-point dots */}
          <circle cx={xScale(priceHistory.length - 1)} cy={yScale(priceHistory.at(-1)!.shopNow)} r="4" fill="#818cf8" />
          <circle cx={xScale(priceHistory.length - 1)} cy={yScale(priceHistory.at(-1)!.megaMart)} r="4" fill="#34d399" />
        </svg>
      </div>

      {isTracked && (
        <p style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.75rem', textAlign: 'center' }}>
          ✓ You&apos;ll get an alert when the price drops further
        </p>
      )}
    </div>
  );
}
