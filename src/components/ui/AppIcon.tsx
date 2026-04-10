'use client';

import React, { memo } from 'react';

type IconName =
  | 'SparklesIcon'
  | 'SearchIcon'
  | 'BellIcon'
  | 'UserIcon'
  | 'ArrowRightIcon'
  | 'ArrowLeftIcon'
  | 'ChevronRightIcon'
  | 'CheckIcon'
  | 'XIcon'
  | 'StarIcon'
  | 'TrendingUpIcon'
  | 'TrendingDownIcon'
  | 'ShoppingCartIcon'
  | 'TagIcon'
  | 'EyeIcon'
  | 'PlusIcon'
  | 'LoaderIcon'
  | 'ZapIcon'
  | 'ShieldIcon'
  | 'BarChartIcon';

interface AppIconProps {
  name: IconName;
  size?: number;
  className?: string;
  color?: string;
}

const ICONS: Record<IconName, (size: number) => React.ReactElement> = {
  SparklesIcon: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  SearchIcon: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  BellIcon: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  UserIcon: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  ArrowRightIcon: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ArrowLeftIcon: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ChevronRightIcon: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  CheckIcon: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  XIcon: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  StarIcon: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  TrendingUpIcon: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17 6 23 6 23 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  TrendingDownIcon: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17 18 23 18 23 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ShoppingCartIcon: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="21" r="1" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="21" r="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  TagIcon: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="7" y1="7" x2="7.01" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  EyeIcon: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  PlusIcon: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  LoaderIcon: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
      <path d="M21 12a9 9 0 11-6.22-8.56" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  ZapIcon: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ShieldIcon: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  BarChartIcon: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

const AppIcon = memo(function AppIcon({ name, size = 24, className = '', color }: AppIconProps) {
  const renderFn = ICONS[name];
  if (!renderFn) return null;
  return (
    <span
      className={className}
      style={{ display: 'inline-flex', color: color || 'currentColor', flexShrink: 0 }}
    >
      {renderFn(size)}
    </span>
  );
});

AppIcon.displayName = 'AppIcon';
export default AppIcon;
