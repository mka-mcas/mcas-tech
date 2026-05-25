"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Navigation() {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-black/80 backdrop-blur-md border-b border-slate-900/80 fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="font-mono font-black tracking-widest text-white text-lg">
          MCAS<span className="text-sky-500">.ORG</span>
        </Link>
        
        {/* 💻 Desktop Links (Hidden automatically on small screens via 'hidden md:flex') */}
        <div className="hidden md:flex items-center gap-6 md:gap-8 text-sm font-medium">
          <Link href="/about" className="text-slate-400 hover:text-white transition-colors">
            About
          </Link>
          <Link href="/blog" className="text-slate-400 hover:text-white transition-colors">
            Blog
          </Link>
          <Link href="/timeline" className="text-slate-400 hover:text-white transition-colors">
            Timeline
          </Link>
          <Link href="/reader" className="text-slate-400 hover:text-white transition-colors">
            Life-long learning
          </Link>
          <Link href="/resources/safe-riding-know-how" className="text-slate-400 hover:text-emerald-400 font-bold transition-colors">
            Safe Riding Know-How
          </Link>
          
          {user ? (
            <button 
              onClick={() => signOut()} 
              className="bg-slate-900 border border-slate-800 text-slate-300 px-4 py-1.5 rounded-lg hover:text-white hover:border-slate-700 transition-all text-xs font-mono"
            >
              LOGOUT
            </button>
          ) : (
            <Link 
              href="/auth/login" 
              className="bg-sky-500 hover:bg-sky-400 text-black font-semibold px-4 py-1.5 rounded-lg transition-all text-xs uppercase tracking-wider"
            >
              Portal
            </Link>
          )}
        </div>

        {/* 📱 Mobile Hamburger Button (Visible only on mobile via 'md:hidden') */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-slate-400 hover:text-white p-1 outline-none transition-colors"
          aria-label="Toggle structural routing menu"
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

      {/* 📱 Mobile Dropdown Drawer Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-900/60 flex flex-col gap-4 text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-200">
          <Link 
            href="/about" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-slate-400 hover:text-white transition-colors py-1"
          >
            About
          </Link>
          <Link 
            href="/blog" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-slate-400 hover:text-white transition-colors py-1"
          >
            Blog
          </Link>
          <Link 
            href="/timeline" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-slate-400 hover:text-white transition-colors py-1"
          >
            Timeline
          </Link>
          <Link 
            href="/reader" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-slate-400 hover:text-white transition-colors py-1"
          >
            Life-long learning
          </Link>
          
          {/* Highlighted Mobile Access Vector Link */}
          <Link 
            href="/resources/safe-riding-know-how" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-emerald-400 font-bold py-1 border-l-2 border-emerald-500 pl-2"
          >
            Safe Riding Know-How
          </Link>
          
          <div className="border-t border-slate-900/80 pt-4 pb-2">
            {user ? (
              <button 
                onClick={() => { signOut(); setIsMobileMenuOpen(false); }} 
                className="w-full text-center bg-slate-900 border border-slate-800 text-slate-300 py-2.5 rounded-xl hover:text-white font-mono text-xs"
              >
                LOGOUT
              </button>
            ) : (
              <Link 
                href="/auth/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center bg-sky-500 hover:bg-sky-400 text-black font-semibold py-2.5 rounded-xl text-xs uppercase tracking-wider"
              >
                Portal
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}