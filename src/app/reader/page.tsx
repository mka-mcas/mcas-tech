'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { kitabChapters, ChapterData } from '@/content/kitab-at-tauhid';

export default function PrivateReaderConsole() {
  const { user } = useAuth();
  
  // Interface reactive states
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [themeMode, setThemeMode] = useState<'parchment' | 'dark'>('dark');
  const [expandedIssues, setExpandedIssues] = useState<boolean>(false);

  // 🛡️ Security Guard Check: Gatekeeper structure for private entry
  if (!user) {
    return (
      <div className="min-h-screen bg-[#060911] text-zinc-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center shadow-2xl">
          <span className="text-4xl block mb-3">🔒</span>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Private Access Restricted</h2>
          <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
            This workspace houses private research content pipelines. Access to these active modules is currently locked until your account profile permissions are explicitly updated.
          </p>
          <div className="mt-6">
            <a 
              href="/auth/login" 
              className="inline-block bg-sky-500 hover:bg-sky-400 text-black text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-lg transition-all"
            >
              Return to Portal Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  const currentChapter: ChapterData = kitabChapters[activeChapterIndex];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      themeMode === 'parchment' ? 'bg-[#fcfaf2] text-[#1c1917]' : 'bg-[#090d16] text-zinc-100'
    }`}>
      
      {/* --- Context Sticky Secondary Header Controls --- */}
      <div className={`sticky top-[60px] z-40 border-b px-6 py-3 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 ${
        themeMode === 'parchment' ? 'bg-[#fcfaf2]/80 border-stone-200' : 'bg-[#090d16]/80 border-slate-900'
      }`}>
        {/* Chapter Carousel Selection */}
        <div className="flex gap-2">
          {kitabChapters.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => { setActiveChapterIndex(idx); setExpandedIssues(false); }}
              className={`py-1.5 px-3 rounded-lg text-xs font-mono font-bold transition-all ${
                activeChapterIndex === idx 
                  ? 'bg-sky-500 text-black shadow-md' 
                  : themeMode === 'parchment' ? 'bg-stone-200 hover:bg-stone-300 text-stone-700' : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
              }`}
            >
              CH {ch.id}
            </button>
          ))}
        </div>

        {/* Aesthetic Theme Mode Controller */}
        <button
          onClick={() => setThemeMode(themeMode === 'dark' ? 'parchment' : 'dark')}
          className={`py-1.5 px-4 rounded-lg text-[11px] font-bold uppercase tracking-wider transition border ${
            themeMode === 'parchment' 
              ? 'bg-stone-900 border-stone-800 text-white hover:bg-stone-800' 
              : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:text-white'
          }`}
        >
          {themeMode === 'dark' ? '📜 Parchment Theme' : '🕶️ Cyber Dark Mode'}
        </button>
      </div>

      {/* --- Main Document Reading Content Container --- */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        
        {/* Document Header Text */}
        <div className="mb-12 text-center">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-500 block mb-2">
            Kitab At-Tauhid // Private Edition
          </span>
          <h1 className={`text-3xl font-black tracking-tight uppercase ${
            themeMode === 'parchment' ? 'text-stone-900' : 'text-white'
          }`}>
            {currentChapter.title}
          </h1>
          <p className={`text-sm mt-2 font-medium ${
            themeMode === 'parchment' ? 'text-stone-600' : 'text-zinc-400'
          }`}>
            {currentChapter.subtitle}
          </p>
        </div>

        {/* --- Render Content Text Stack Loops --- */}
        <div className="space-y-12">
          {currentChapter.sections.map((section, sIdx) => (
            <div 
              key={sIdx} 
              className={`p-6 rounded-2xl border transition-all ${
                themeMode === 'parchment' 
                  ? 'bg-white border-stone-200/60 shadow-sm' 
                  : 'bg-slate-950/40 border-slate-900/60'
              }`}
            >
              {/* Scalable Right-to-Left Arabic Font Block Rendering */}
              <div 
                dir="rtl" 
                className="text-right text-2xl md:text-3xl font-serif font-bold mb-6 leading-loose tracking-wide text-amber-500 select-all"
                style={{ fontFamily: 'Noto Naskh Arabic, Traditional Arabic, serif' }}
              >
                {section.arabic}
              </div>

              {/* Translation English Copy Block */}
              <p className={`text-sm md:text-base leading-relaxed font-medium italic ${
                themeMode === 'parchment' ? 'text-stone-800' : 'text-zinc-300'
              }`}>
                {section.translation}
              </p>

              {/* Administrative Sub-script Reference Line */}
              {section.reference && (
                <div className="mt-4 text-[10px] font-mono tracking-wider text-sky-500 font-bold uppercase">
                  ✦ Source link: {section.reference}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* --- Interactive Collapsible Issues Panel Section --- */}
        <div className={`mt-16 border rounded-2xl overflow-hidden transition-all ${
          themeMode === 'parchment' ? 'border-stone-200 bg-white' : 'border-slate-900 bg-slate-950/20'
        }`}>
          <button
            onClick={() => setExpandedIssues(!expandedIssues)}
            className={`w-full px-6 py-4 flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider transition ${
              themeMode === 'parchment' ? 'hover:bg-stone-50' : 'hover:bg-slate-900/40'
            }`}
          >
            <span>📊 Important Issues Content Modules</span>
            <span>{expandedIssues ? 'Collapse ▲' : 'Expand Vector ▼'}</span>
          </button>

          {expandedIssues && (
            <div className={`p-6 border-t font-sans space-y-4 animate-in fade-in duration-200 ${
              themeMode === 'parchment' ? 'border-stone-100 text-stone-800' : 'border-slate-900 text-zinc-300'
            }`}>
              {currentChapter.importantIssues.map((issue, iIdx) => (
                <div key={iIdx} className="flex items-start space-x-3 text-xs md:text-sm leading-relaxed">
                  <span className="text-sky-500 font-mono font-bold">[{iIdx + 1}]</span>
                  <p className="font-medium">{issue}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}