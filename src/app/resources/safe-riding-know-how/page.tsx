'use client';

import { useState } from 'react';
import BlindnessGlitch from '@/components/BlindnessGlitch';
import RiskInfographic from '@/components/RiskInfographic';
import Link from 'next/link';

export default function SafeRidingKnowHow() {

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

  return (

    <div className={`min-h-screen transition-colors duration-300 ${pageBg}`}>

      {/* ───────────────── HEADER ───────────────── */}

      <header className={`border-b ${border}`}>

        <div className="max-w-6xl mx-auto px-6 py-10">

          <div className="flex items-start justify-between gap-6 flex-wrap">

            <div>

              <div className="text-xs uppercase tracking-[0.25em] font-bold text-emerald-500 mb-3">
                MCAS KNOWLEDGE HUB
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
                SAFE RIDING KNOW-HOW
              </h1>

              <p className={`max-w-3xl text-sm sm:text-base leading-relaxed ${muted}`}>
                Evidence-based motorcycle safety education integrating hazard perception,
                rider psychology, behavioural risk analytics, and systemic crash analysis.
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

        </div>

      </header>

      {/* ───────────────── COPYRIGHT ───────────────── */}

      <section className="max-w-6xl mx-auto px-6 py-6">

        <div className={`
          rounded-2xl border-l-4 border-emerald-500 p-5
          ${panel}
        `}>

          <div className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-500 mb-3">
            Open Sharing & Citation Notice
          </div>

          <p className={`text-sm leading-relaxed ${muted}`}>
            © {new Date().getFullYear()} MCAS Technology Platform.
            Educational sharing, rider training, and redistribution are encouraged.
            Please credit MCAS (mcas-tech.org) whenever these materials are used.
          </p>

        </div>

      </section>

      {/* ───────────────── BLINDNESS MODULE ───────────────── */}

      <section className="max-w-6xl mx-auto px-6 pb-10">

        <div className="mb-5">

          <div className="text-xs uppercase tracking-[0.25em] font-bold text-emerald-500 mb-3">
            Cognitive Perception Simulator
          </div>

          <h2 className="text-2xl font-black mb-3">
            Visual Attention Calibration
          </h2>

          <p className={`text-sm leading-relaxed max-w-3xl ${muted}`}>
            Interactive exercises exposing inattentional blindness,
            delayed hazard recognition, and visual filtering limitations during riding.
          </p>

        </div>

        <BlindnessGlitch />

      </section>

      {/* ───────────────── RISK INTELLIGENCE ───────────────── */}

<section className={`border-y py-12 ${border}`}>

  <div className="max-w-6xl mx-auto px-6">

    <div className={`rounded-3xl border p-8 md:p-12 ${panel}`}>

      <div className="text-xs uppercase tracking-[0.25em] font-bold text-emerald-500 mb-4">
        Motorcycle Risk Intelligence Platform
      </div>

      <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
        Explore Malaysia’s Interactive Motorcycle Fatality Intelligence System
      </h2>

      <p className={`max-w-3xl text-sm sm:text-base leading-relaxed mb-8 ${muted}`}>
        Dive into behavioural risk analytics, temporal crash trends,
        injury mechanisms, rider vulnerability patterns, and systemic
        motorcycle safety intelligence using national-level crash datasets.
      </p>

      <Link
        href="/safe-riding-know-how/"
        className="
          inline-flex items-center gap-3
          bg-emerald-500 hover:bg-emerald-400
          text-black font-black uppercase tracking-wide
          px-6 py-4 rounded-2xl
          transition-all
        "
      >
        Launch Risk Intelligence →
      </Link>

    </div>

  </div>

</section>

      {/* ───────────────── FOOTER ───────────────── */}

      <footer className="max-w-6xl mx-auto px-6 py-10">

        <p className={`text-xs ${muted}`}>
          MCAS Rider Cognitive Safety Platform · Behavioural Hazard Education Initiative
        </p>

      </footer>

    </div>
  );
}