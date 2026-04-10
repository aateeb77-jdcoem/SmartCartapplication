'use client';

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ResultsTopbar from './ResultsTopbar';
import LoadingSkeleton from './LoadingSkeleton';
import AIVerdictBanner from './AIVerdictBanner';
import ComparisonGrid from './ComparisonGrid';
import AIReviewAnalysis from './AIReviewAnalysis';
import PriceHistoryChart from './PriceHistoryChart';
import TrackProductButton from './TrackProductButton';
import { ProductData } from '../data/mockProductData';

function ProductResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || 'Sony WH-1000XM5';

  const [loadingStage, setLoadingStage] = useState<'scraping' | 'analyzing' | 'done' | 'error'>('scraping');
  const [product, setProduct] = useState<ProductData | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isTracked, setIsTracked] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (searchQuery: string) => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoadingStage('scraping');
    setProduct(null);
    setIsTracked(false);
    setErrorMsg('');

    // After 3s, visually transition to "analyzing" stage
    const stageTimer = setTimeout(() => {
      if (!controller.signal.aborted) setLoadingStage('analyzing');
    }, 3000);

    try {
      const response = await fetch(`/api/scrape?q=${encodeURIComponent(searchQuery)}`, {
        signal: controller.signal,
      });

      clearTimeout(stageTimer);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Failed to fetch data' }));
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const data: ProductData = await response.json();

      if (!controller.signal.aborted) {
        setProduct(data);
        setLoadingStage('done');
      }
    } catch (err: unknown) {
      clearTimeout(stageTimer);
      if (err instanceof Error && err.name === 'AbortError') return; // intentional cancel
      if (!controller.signal.aborted) {
        console.error(err);
        setErrorMsg(err instanceof Error ? err.message : 'An error occurred during comparison');
        setLoadingStage('error');
      }
    }
  }, []);

  useEffect(() => {
    fetchData(query);
    return () => {
      abortRef.current?.abort();
    };
  }, [query, fetchData]);

  if (loadingStage === 'error') {
    return (
      <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', background: 'rgba(239,68,68,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.5rem' }}>⚠️</span>
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fecaca', marginBottom: '0.5rem' }}>Comparison Failed</h2>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.5rem', maxWidth: '400px' }}>{errorMsg}</p>
        <button onClick={() => fetchData(query)} className="btn-primary">Try Again</button>
      </div>
    );
  }

  if (loadingStage !== 'done' || !product) {
    return <LoadingSkeleton stage={loadingStage as 'scraping' | 'analyzing'} query={query} />;
  }

  return (
    <div className="animate-fade-in-up">
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Search results for</p>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.125rem, 3vw, 1.5rem)', fontWeight: 700, color: '#f1f5f9' }}>{query}</h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
              Compared across {product.siteA.name} and {product.siteB.name} · Updated just now
            </p>
          </div>
          <button
            onClick={() => {
              const url = window.location.href;
              navigator.clipboard.writeText(url).then(() => {
                const btn = document.getElementById('share-btn');
                if (btn) { btn.textContent = '✓ Copied!'; setTimeout(() => { btn.textContent = '🔗 Share'; }, 2000); }
              });
            }}
            id="share-btn"
            style={{
              background: 'rgba(51,65,85,0.4)',
              border: '1px solid rgba(71,85,105,0.5)',
              borderRadius: '0.625rem',
              padding: '0.375rem 0.75rem',
              color: '#94a3b8',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            🔗 Share
          </button>
        </div>
      </div>
      <AIVerdictBanner verdict={product.verdict} />
      <ComparisonGrid product={product} />
      <AIReviewAnalysis reviews={product.reviewAnalysis} />
      <PriceHistoryChart priceHistory={product.priceHistory} isTracked={isTracked} />
      <TrackProductButton product={product} isTracked={isTracked} onTrack={() => setIsTracked(true)} />
    </div>
  );
}

export default function ProductResultsShell() {
  return (
    <div className="min-h-screen bg-slate-950">
      <ResultsTopbar />
      <main style={{ maxWidth: '1536px', margin: '0 auto', padding: '1rem 1rem 4rem' }}>
        <Suspense fallback={<LoadingSkeleton stage="scraping" query="Loading..." />}>
          <ProductResultsContent />
        </Suspense>
      </main>
    </div>
  );
}