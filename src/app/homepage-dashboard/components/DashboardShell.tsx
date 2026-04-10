'use client';

import React, { useState, useEffect } from 'react';
import DashboardTopbar from './DashboardTopbar';
import SearchHero from './SearchHero';
import DashboardStats from './DashboardStats';
import TrackedProductsGrid from './TrackedProductsGrid';
import RecentActivity from './RecentActivity';

export default function DashboardShell() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsLoaded(true));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <DashboardTopbar />

      <main style={{ maxWidth: '1536px', margin: '0 auto', padding: '0 1rem 4rem' }}>
        <SearchHero />
        <DashboardStats isLoaded={isLoaded} />

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2">
            <TrackedProductsGrid isLoaded={isLoaded} />
          </div>
          <div className="xl:col-span-1">
            <RecentActivity isLoaded={isLoaded} />
          </div>
        </div>
      </main>
    </div>
  );
}