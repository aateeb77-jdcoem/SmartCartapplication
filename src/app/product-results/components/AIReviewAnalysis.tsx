'use client';

import React from 'react';
import { ProductData } from '../data/mockProductData';

type ReviewAnalysis = ProductData['reviewAnalysis'];
type SiteReview = ReviewAnalysis['siteA'];

function SentimentBar({ score }: { score: number }) {
  if (score === 0) return null;
  const color = score >= 85 ? '#34d399' : score >= 70 ? '#f59e0b' : '#f87171';
  return (
    <div style={{ marginBottom: '0.875rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Sentiment Score</span>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color }}>{score}/100</span>
      </div>
      <div style={{ height: '6px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '9999px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${score}%`,
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            borderRadius: '9999px',
            transition: 'width 1s ease',
          }}
        />
      </div>
    </div>
  );
}

function ReviewPanel({ review, label }: { review: SiteReview; label: string }) {
  const hasContent = review.pros.length > 0 || review.cons.length > 0;
  const hasReview = review.topReview.text && review.topReview.author;

  if (!hasContent && !hasReview && review.sentimentScore === 0) {
    return (
      <div className="glass-card" style={{ padding: '1.25rem', opacity: 0.5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: '#818cf8' }}>
            {label}
          </span>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#f1f5f9' }}>{review.name}</span>
        </div>
        <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>No review data available</p>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: '#818cf8' }}>
          {label}
        </span>
        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#f1f5f9' }}>{review.name}</span>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: review.overallSentiment === 'Strongly Positive' ? '#34d399' : review.overallSentiment === 'Positive' ? '#a3e635' : '#64748b',
          }}
        >
          {review.overallSentiment}
        </span>
      </div>

      <SentimentBar score={review.sentimentScore} />

      {/* Pros */}
      {review.pros.length > 0 && (
        <div style={{ marginBottom: '0.875rem' }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
            Pros
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {review.pros.map((p, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.375rem' }}>
                <span style={{ color: '#34d399', flexShrink: 0, marginTop: '1px', fontSize: '0.6875rem' }}>+</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.5 }}>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Cons */}
      {review.cons.length > 0 && (
        <div style={{ marginBottom: '0.875rem' }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#f87171', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
            Cons
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {review.cons.map((c, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.375rem' }}>
                <span style={{ color: '#f87171', flexShrink: 0, marginTop: '1px', fontSize: '0.6875rem' }}>−</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.5 }}>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Top review — only if we have content */}
      {hasReview && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '0.75rem',
            padding: '0.875rem',
            borderLeft: '3px solid rgba(99,102,241,0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.625rem',
                fontWeight: 700,
                color: 'white',
              }}
            >
              {review.topReview.author?.[0]?.toUpperCase() || '?'}
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1' }}>{review.topReview.author}</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '1px' }}>
              {Array.from({ length: review.topReview.rating }).map((_, i) => (
                <span key={i} style={{ color: '#f59e0b', fontSize: '0.625rem' }}>★</span>
              ))}
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
            &quot;{review.topReview.text}&quot;
          </p>
        </div>
      )}
    </div>
  );
}

export default function AIReviewAnalysis({ reviews }: { reviews?: ReviewAnalysis }) {
  if (!reviews) return null;

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 1rem' }}>
        AI Review Analysis
      </h3>
      <div className="review-grid-cols" style={{ display: 'grid', gap: '1rem' }}>
        <ReviewPanel review={reviews.siteA} label="Site A —" />
        <ReviewPanel review={reviews.siteB} label="Site B —" />
      </div>
    </div>
  );
}
