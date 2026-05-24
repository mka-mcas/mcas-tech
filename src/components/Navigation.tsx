"use client";
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Navigation() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-black/60 backdrop-blur-md border-b border-slate-900/80 fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo (Updated to .ORG!) */}
        <Link href="/" className="font-mono font-black tracking-widest text-white text-lg">
          MCAS<span className="text-sky-500">.ORG</span>
        </Link>
        
        {/* Central/Right Menu Links */}
        <div className="flex items-center gap-6 md:gap-8 text-sm font-medium">
          <Link href="/about" className="text-slate-400 hover:text-white transition-colors">
            About
          </Link>
          <Link href="/blog" className="text-slate-400 hover:text-white transition-colors">
            Blog
          </Link>
          <Link href="/timeline" className="text-slate-400 hover:text-white transition-colors">
            Timeline
          </Link>
          
          {/* 🚀 Brand New Open Resources Section Added Safely Here: */}
          <Link href="/resources/safe-riding-know-how" className="text-slate-400 hover:text-emerald-400 font-bold transition-colors">
            Safe Riding Know-How
          </Link>
          
          {/* Dynamic Dashboard Portal Access */}
          {user ? (
            <button 
              onClick={() => signOut()} 
              className="bg-slate-900 border border-slate-800 text-slate-300 px-4 py-1.5 rounded-lg hover:text-white hover:border-slate-700 transition-all text-xs font-mono"
            >
              LOGOUT
            </button>
          ) : (
            <a 
              href="http://localhost:3000/auth/login" 
              className="bg-sky-500 hover:bg-sky-400 text-black font-semibold px-4 py-1.5 rounded-lg transition-all text-xs uppercase tracking-wider"
            >
              Portal
            </a>
          )}
        </div>

      </div>
    </nav>
  );
}