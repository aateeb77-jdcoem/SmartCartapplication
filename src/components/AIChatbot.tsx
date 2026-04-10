'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: "Hey! 👋 I'm SmartCart AI, your shopping assistant. I can help you compare prices, find deals, and make smart purchasing decisions. What are you looking for today?",
    timestamp: new Date(),
  },
];

export default function AIChatbot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      // Small delay so the panel animates first, then focus
      setTimeout(() => inputRef.current?.focus(), 350);
      setHasNewMessage(false);
      // Lock body scroll on mobile when chat is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    // Check for search intent — redirect to comparison
    const searchMatch = trimmed.match(/^(?:search|compare|find|look up)\s+(.+)/i);
    if (searchMatch) {
      const q = searchMatch[1].trim();
      const botReply: Message = {
        id: `msg-${Date.now()}-1`,
        role: 'assistant',
        content: `🔍 Searching for "${q}"... Redirecting you to the comparison page!`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, { id: `msg-${Date.now()}`, role: 'user', content: trimmed, timestamp: new Date() }, botReply]);
      setInput('');
      setTimeout(() => {
        setIsOpen(false);
        router.push(`/product-results?q=${encodeURIComponent(q)}`);
      }, 1200);
      return;
    }

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const chatHistory = [...messages, userMessage]
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "I'm having trouble processing that. Could you try rephrasing?";

      const assistantMessage: Message = {
        id: `msg-${Date.now()}-reply`,
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (!isOpen) setHasNewMessage(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `msg-${Date.now()}-error`, role: 'assistant', content: "Sorry, I couldn't process that right now. Please try again in a moment! 🙏", timestamp: new Date() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestion = (s: string) => {
    const fakeMsg: Message = { id: `msg-${Date.now()}`, role: 'user', content: s, timestamp: new Date() };
    setMessages((prev) => [...prev, fakeMsg]);
    setInput('');
    setIsTyping(true);
    fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: s }] }) })
      .then((r) => r.json())
      .then((data) => {
        const reply = data.choices?.[0]?.message?.content || "Here's what I found!";
        setMessages((prev) => [...prev, { id: `msg-${Date.now()}-r`, role: 'assistant', content: reply, timestamp: new Date() }]);
      })
      .catch(() => {
        setMessages((prev) => [...prev, { id: `msg-${Date.now()}-e`, role: 'assistant', content: "Sorry, I couldn't process that. Try again!", timestamp: new Date() }]);
      })
      .finally(() => setIsTyping(false));
  };

  const suggestions = ['Best phones under ₹20K', 'Compare headphones', 'Suggest laptops', 'Track a deal'];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        style={{
          position: 'fixed',
          bottom: 'calc(1rem + var(--safe-bottom, 0px))',
          right: '1rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(99,102,241,0.4), 0 0 0 4px rgba(99,102,241,0.1)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          transform: isOpen ? 'scale(0.9) rotate(90deg)' : 'scale(1)',
        }}
      >
        {hasNewMessage && !isOpen && (
          <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', borderRadius: '50%', background: '#ef4444', border: '2px solid #020817', animation: 'pulse 2s ease-in-out infinite' }} />
        )}
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Chat panel — uses CSS class for responsive full-screen on mobile */}
      <div className={`chatbot-panel ${isOpen ? 'chatbot-open' : 'chatbot-closed'}`}>
        {/* Header */}
        <div style={{ padding: '0.875rem 1rem', background: 'linear-gradient(135deg, rgba(79,70,229,0.2), rgba(124,58,237,0.1))', borderBottom: '1px solid rgba(71,85,105,0.4)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '1.125rem' }}>🤖</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>SmartCart AI</p>
            <p style={{ fontSize: '0.6875rem', color: '#34d399', margin: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
              Online
            </p>
          </div>
          <button onClick={() => setMessages(INITIAL_MESSAGES)} style={{ background: 'rgba(51,65,85,0.4)', border: '1px solid rgba(71,85,105,0.4)', borderRadius: '0.5rem', padding: '0.375rem 0.625rem', cursor: 'pointer', color: '#64748b', fontSize: '0.75rem', minHeight: '36px' }} title="Clear chat">Clear</button>
          {/* Close button — visible on mobile */}
          <button onClick={() => setIsOpen(false)} className="sm:hidden" style={{ background: 'rgba(51,65,85,0.4)', border: '1px solid rgba(71,85,105,0.4)', borderRadius: '0.5rem', padding: '0.375rem', cursor: 'pointer', color: '#94a3b8', minHeight: '36px', minWidth: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', WebkitOverflowScrolling: 'touch' }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', animation: 'fadeInUp 0.3s ease forwards' }}>
              <div style={{
                maxWidth: '85%',
                padding: '0.75rem 1rem',
                borderRadius: msg.role === 'user' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                background: msg.role === 'user' ? 'linear-gradient(135deg, #4f46e5, #6366f1)' : 'rgba(30, 41, 59, 0.6)',
                border: msg.role === 'user' ? 'none' : '1px solid rgba(71, 85, 105, 0.4)',
                fontSize: '0.875rem',
                lineHeight: 1.6,
                color: msg.role === 'user' ? 'white' : '#cbd5e1',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', animation: 'fadeIn 0.3s ease' }}>
              <div style={{ padding: '0.75rem 1rem', borderRadius: '1rem 1rem 1rem 0.25rem', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(71, 85, 105, 0.4)', display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#818cf8', animation: `typingDot 1.4s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && !isTyping && (
          <div style={{ padding: '0 1rem 0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', flexShrink: 0 }}>
            {suggestions.map((s) => (
              <button key={s} onClick={() => handleSuggestion(s)} style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '9999px', padding: '0.375rem 0.75rem', fontSize: '0.75rem', color: '#a5b4fc', cursor: 'pointer', transition: 'all 0.2s', minHeight: '36px' }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div style={{ padding: '0.75rem 1rem', paddingBottom: 'calc(0.75rem + var(--safe-bottom, 0px))', borderTop: '1px solid rgba(71,85,105,0.4)', display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0, background: 'rgba(15,23,42,0.5)' }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about products, prices..."
            style={{ flex: 1, background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(71,85,105,0.4)', borderRadius: '0.75rem', padding: '0.75rem', color: '#f1f5f9', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', minHeight: '48px' }}
            disabled={isTyping}
            autoComplete="off"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
            style={{
              width: '48px', height: '48px', borderRadius: '0.75rem',
              background: input.trim() && !isTyping ? 'linear-gradient(135deg, #4f46e5, #6366f1)' : 'rgba(51,65,85,0.4)',
              border: 'none', cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
