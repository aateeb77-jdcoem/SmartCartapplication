'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, 'id'>) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

// ─── Context ────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Icons ──────────────────────────────────────────────────────────────────

function ToastIcon({ type }: { type: ToastType }) {
  if (type === 'success')
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="1.5" />
        <path d="M5 8l2 2 4-4" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (type === 'error')
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" fill="rgba(239,68,68,0.2)" stroke="#ef4444" strokeWidth="1.5" />
        <path d="M6 6l4 4M10 6l-4 4" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  if (type === 'warning')
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2L14.5 13H1.5L8 2z" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 7v3" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="11.5" r="0.5" fill="#f59e0b" />
      </svg>
    );
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" fill="rgba(99,102,241,0.2)" stroke="#6366f1" strokeWidth="1.5" />
      <path d="M8 7v4" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="5.5" r="0.5" fill="#6366f1" />
    </svg>
  );
}

// ─── Single Toast Item ───────────────────────────────────────────────────────

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  const borderColor =
    toast.type === 'success'
      ? 'rgba(16,185,129,0.3)'
      : toast.type === 'error'
      ? 'rgba(239,68,68,0.3)'
      : toast.type === 'warning'
      ? 'rgba(245,158,11,0.3)'
      : 'rgba(99,102,241,0.3)';

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${borderColor}`,
        borderRadius: '0.75rem',
        padding: '0.875rem 1rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        width: '320px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        animation: 'fadeInUp 0.3s ease',
      }}
    >
      <div style={{ flexShrink: 0, marginTop: '1px' }}>
        <ToastIcon type={toast.type} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9', margin: 0 }}>
          {toast.title}
        </p>
        {toast.description && (
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0' }}>
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        style={{
          flexShrink: 0,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#475569',
          padding: '0',
          lineHeight: 1,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

// ─── Provider ───────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((opts: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-4), { id, ...opts }]);
  }, []);

  const success = useCallback(
    (title: string, description?: string) => toast({ type: 'success', title, description }),
    [toast]
  );
  const error = useCallback(
    (title: string, description?: string) => toast({ type: 'error', title, description }),
    [toast]
  );
  const info = useCallback(
    (title: string, description?: string) => toast({ type: 'info', title, description }),
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
