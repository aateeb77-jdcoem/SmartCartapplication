'use client';

import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import AuthLeftPanel from './AuthLeftPanel';

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen bg-slate-950 flex overflow-hidden">
      {/* Left decorative panel */}
      <AuthLeftPanel />

      {/* Right auth panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
        {/* Subtle background grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99,102,241,0.15) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />

        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 10C3 6.13 6.13 3 10 3s7 3.13 7 7-3.13 7-7 7-7-3.13-7-7z" stroke="white" strokeWidth="1.5" />
                <path d="M7 10h6M10 7v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-100 tracking-tight">CompareAI</span>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-6 mb-8 border-b border-slate-800">
            <button
              onClick={() => setActiveTab('login')}
              className={`text-sm font-semibold pb-3 transition-all duration-200 ${
                activeTab === 'login' ?'text-indigo-400 border-b-2 border-indigo-500 -mb-px' :'text-slate-500 hover:text-slate-300 border-b-2 border-transparent'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`text-sm font-semibold pb-3 transition-all duration-200 ${
                activeTab === 'signup' ?'text-indigo-400 border-b-2 border-indigo-500 -mb-px' :'text-slate-500 hover:text-slate-300 border-b-2 border-transparent'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form area */}
          <div className="transition-all duration-300">
            {activeTab === 'login' ? (
              <LoginForm onSwitchToSignup={() => setActiveTab('signup')} />
            ) : (
              <SignupForm onSwitchToLogin={() => setActiveTab('login')} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}