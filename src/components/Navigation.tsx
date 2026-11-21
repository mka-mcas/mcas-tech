"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Navigation() {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('mcas-theme');
    const dark = saved === 'dark';
    setIsDark(dark);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.dataset.theme = nextDark ? 'dark' : 'light';
    window.localStorage.setItem('mcas-theme', nextDark ? 'dark' : 'light');
  };

  const themeButton = (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      className="theme-toggle inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors"
    >
      <span aria-hidden="true">{isDark ? '☀' : '☾'}</span>
      <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
    </button>
  );

  return (
    <nav className="site-navigation fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="brand-mark font-mono font-black tracking-widest text-lg">
          MCAS<span className="text-sky-500">.ORG</span>
        </Link>

        <div className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium">
          <Link href="/about" className="nav-link transition-colors">About</Link>
          <Link href="/blog" className="nav-link transition-colors">Blog</Link>
          <Link href="/timeline" className="nav-link transition-colors">Timeline</Link>
          <Link href="/sem" className="text-sky-500 hover:text-sky-400 transition-colors">SEM Explorer</Link>
          <Link href="/paper-explorer" className="text-violet-500 hover:text-violet-400 transition-colors">Research Explorer</Link>
          <Link href="/simulator" className="text-cyan-600 hover:text-cyan-500 transition-colors">Technology Explorer</Link>
          <Link href="/reader" className="nav-link transition-colors">Life-long learning</Link>
          <Link href="/resources/safe-riding-know-how" className="nav-link font-bold transition-colors">Safe Riding Know-How</Link>
          {themeButton}
          {user ? (
            <button onClick={() => signOut()} className="portal-button rounded-lg px-4 py-1.5 text-xs font-mono transition-colors">LOGOUT</button>
          ) : (
            <Link href="/auth/login" className="portal-button rounded-lg px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors">Portal</Link>
          )}
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="nav-link md:hidden p-1 outline-none transition-colors"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-navigation md:hidden mt-4 pt-4 flex flex-col gap-4 text-sm font-medium">
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="nav-link py-1">About</Link>
          <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="nav-link py-1">Blog</Link>
          <Link href="/timeline" onClick={() => setIsMobileMenuOpen(false)} className="nav-link py-1">Timeline</Link>
          <Link href="/sem" onClick={() => setIsMobileMenuOpen(false)} className="text-sky-500 py-1">SEM Explorer</Link>
          <Link href="/paper-explorer" onClick={() => setIsMobileMenuOpen(false)} className="text-violet-500 py-1">Research Explorer</Link>
          <Link href="/simulator" onClick={() => setIsMobileMenuOpen(false)} className="text-cyan-600 py-1">Technology Explorer</Link>
          <Link href="/reader" onClick={() => setIsMobileMenuOpen(false)} className="nav-link py-1">Life-long learning</Link>
          <Link href="/resources/safe-riding-know-how" onClick={() => setIsMobileMenuOpen(false)} className="nav-link font-bold py-1">Safe Riding Know-How</Link>
          <div className="mobile-navigation-footer flex flex-col gap-3 pt-4">
            {themeButton}
            {user ? (
              <button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="portal-button w-full rounded-xl py-2.5 font-mono text-xs">LOGOUT</button>
            ) : (
              <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="portal-button block w-full rounded-xl py-2.5 text-center text-xs font-semibold uppercase tracking-wider">Portal</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
