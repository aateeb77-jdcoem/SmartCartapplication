import React from 'react';

const comparisonPreview = [
  {
    id: 'prev-sony',
    name: 'Sony WH-1000XM5',
    siteA: { name: 'ShopNow', price: '₹27,990', rating: 4.6 },
    siteB: { name: 'MegaMart', price: '₹24,990', rating: 4.4 },
    verdict: 'Buy from MegaMart',
    savings: '₹3,000',
  },
  {
    id: 'prev-ipad',
    name: 'iPad Air 11" M2',
    siteA: { name: 'ShopNow', price: '₹49,900', rating: 4.8 },
    siteB: { name: 'MegaMart', price: '₹51,900', rating: 4.7 },
    verdict: 'Buy from ShopNow',
    savings: '₹2,000',
  },
];

export default function AuthLeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 flex-col justify-between p-12 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      {/* Top content */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-indigo-300">AI-Powered Comparisons</span>
        </div>

        <h1 className="text-4xl font-bold text-slate-100 leading-tight mb-4">
          Stop guessing.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
            Start saving.
          </span>
        </h1>
        <p className="text-slate-400 text-base leading-relaxed max-w-sm">
          CompareAI scans two major retailers simultaneously, analyzes thousands of reviews with AI, and tells you exactly where and when to buy.
        </p>
      </div>
      {/* Comparison preview cards */}
      <div className="relative z-10 space-y-4">
        {comparisonPreview?.map((item) => (
          <div key={item?.id} className="glass-card p-4">
            <p className="text-sm font-semibold text-slate-200 mb-3">{item?.name}</p>
            <div className="flex gap-3 mb-3">
              <div className="flex-1 bg-slate-800/60 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-1">{item?.siteA?.name}</p>
                <p className="font-mono text-base font-bold text-slate-100">{item?.siteA?.price}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-amber-400 text-xs">★</span>
                  <span className="text-xs text-slate-400">{item?.siteA?.rating}</span>
                </div>
              </div>
              <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 relative">
                <div className="absolute -top-2 right-2">
                  <span className="badge-lowest text-[10px]">Lowest</span>
                </div>
                <p className="text-xs text-emerald-400/70 mb-1">{item?.siteB?.name}</p>
                <p className="font-mono text-base font-bold text-emerald-400">{item?.siteB?.price}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-amber-400 text-xs">★</span>
                  <span className="text-xs text-slate-400">{item?.siteB?.rating}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">AI Verdict</span>
              <span className="text-xs font-semibold text-indigo-400">{item?.verdict} · Save {item?.savings}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Stats row */}
      <div className="relative z-10 flex gap-6 pt-6 border-t border-slate-800/60">
        {[
          { label: 'Products Compared', value: '2.4M+' },
          { label: 'Avg. Savings Found', value: '₹3,600' },
          { label: 'AI Verdicts Issued', value: '890K+' },
        ]?.map((stat) => (
          <div key={`stat-${stat?.label}`}>
            <p className="text-lg font-bold text-slate-100">{stat?.value}</p>
            <p className="text-xs text-slate-500">{stat?.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}