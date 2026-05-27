'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import RiskInfographic from '@/components/RiskInfographic';

export default function RiskIntelligencePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  const isDark = theme === 'dark';

  const pageBg = isDark
    ? 'bg-black text-zinc-100'
    : 'bg-stone-50 text-zinc-900';

  const muted = isDark
    ? 'text-zinc-400'
    : 'text-zinc-600';

  const border = isDark
    ? 'border-zinc-800'
    : 'border-zinc-200';

  const panel = isDark
    ? 'bg-zinc-900 border-zinc-800'
    : 'bg-white border-zinc-200';

  /* ───────────────── AUTH CHECK ───────────────── */
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  /* ───────────────── LOADING SCREEN ───────────────── */
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-zinc-400 font-medium tracking-wide">
        Verifying secure access...
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${pageBg}`}>

      {/* HEADER */}
      <header className={`border-b ${border}`}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] font-bold text-emerald-500 mb-3">
                MCAS RISK INTELLIGENCE SYSTEM
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-5">
                MOTORCYCLE FATALITY RISK — MALAYSIA
              </h1>
              <p className={`max-w-4xl text-sm sm:text-base leading-relaxed ${muted}`}>
                Interactive motorcycle safety intelligence platform integrating
                epidemiological crash analysis, behavioural risk interpretation,
                temporal risk mapping, injury analytics, and cognitive hazard education.
              </p>
            </div>

            {/* THEME TOGGLE */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`
                px-4 py-2 rounded-xl border text-sm font-semibold transition-all
                ${panel}
              `}
            >
              {isDark ? '☀️ Daylight' : '🌙 Dark'}
            </button>
          </div>

          {/* BACK TO HUB */}
          <div className="mt-8">
            <Link
              href="/safe-riding-know-how" // Fixed: Updated to match your actual route
              className="text-sm font-semibold text-sky-500 hover:text-sky-400 transition-colors inline-flex items-center gap-1"
            >
              ← Return to Knowledge Hub
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN DASHBOARD */}
      <section className={`py-10 border-b ${border}`}>
        <div className="max-w-7xl mx-auto px-6">
          <RiskInfographic theme={theme} />
        </div>
      </section>

      {/* FUTURE MODULES */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-3 gap-6">
          <div className={`rounded-2xl border p-6 ${panel}`}>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-500 mb-3">
              Upcoming Module
            </div>
            <h3 className="text-xl font-black mb-3">
              Hazard Perception Analytics
            </h3>
            <p className={`text-sm leading-relaxed ${muted}`}>
              Interactive rider cognition and hazard anticipation learning engine.
            </p>
          </div>

          <div className={`rounded-2xl border p-6 ${panel}`}>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-500 mb-3">
              Upcoming Module
            </div>
            <h3 className="text-xl font-black mb-3">
              Motorcycle Crash Explorer
            </h3>
            <p className={`text-sm leading-relaxed ${muted}`}>
              Drill-down collision mechanisms, crash sequences, and behavioural pathways.
            </p>
          </div>

          <div className={`rounded-2xl border p-6 ${panel}`}>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-500 mb-3">
              Upcoming Module
            </div>
            <h3 className="text-xl font-black mb-3">
              National Risk Timeline
            </h3>
            <p className={`text-sm leading-relaxed ${muted}`}>
              Longitudinal motorcycle fatality trends and temporal risk evolution.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 py-10">
        <p className={`text-xs ${muted}`}>
          MCAS Motorcycle Risk Intelligence Platform · Research & Public Education System
        </p>
      </footer>

    </div>
  );
}