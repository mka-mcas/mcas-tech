'use client';

import React, { useState } from 'react';
import BlindnessGlitch from '@/components/BlindnessGlitch';
import RiskInfographic from '@/components/RiskInfographic';

export default function SafeRidingKnowHow() {

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const isDark = theme === 'dark';

  const themeClasses = {
    pageBg: isDark ? 'bg-black text-zinc-100' : 'bg-stone-50 text-zinc-900',
    panel: isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200',
    muted: isDark ? 'text-zinc-400' : 'text-zinc-600',
    border: isDark ? 'border-zinc-800' : 'border-zinc-200',
    cardHover: isDark ? 'hover:border-zinc-700' : 'hover:border-zinc-300',
  };

  const modules = [
    {
      id: '01',
      category: 'Cognitive Mechanics',
      title: 'The Three Levels of Situational Awareness',
      description:
        "Master Endsley's classic model adapted to high-speed road dynamics: perception, comprehension, and future threat projection.",
    },
    {
      id: '02',
      category: 'Tactical Execution',
      title: 'Intersection Trajectory Appraisal',
      description:
        'Learn defensive scanning protocols and junction survival techniques using real-world mixed-traffic crash analysis.',
    },
    {
      id: '03',
      category: 'Kinematics',
      title: 'Gyroscopic Steering Deflection',
      description:
        'Understand the real mechanics of counter-steering, stabilization forces, and high-speed vehicle control.',
    },
    {
      id: '04',
      category: 'Dynamic Assessment',
      title: 'The Hazard Perception Toolkit',
      description:
        'Interactive cognitive reaction training and benchmark comparison for real-world riding risk awareness.',
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses.pageBg}`}>

      {/* ───────────────── HEADER ───────────────── */}
      <header className={`border-b ${themeClasses.border}`}>
        <div className="max-w-7xl mx-auto px-6 py-10">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400 mb-3">
                MCAS Knowledge Hub
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                SAFE RIDING KNOW-HOW
              </h1>

              <p className={`mt-4 text-lg max-w-3xl leading-relaxed ${themeClasses.muted}`}>
                Evidence-based rider education designed to strengthen hazard perception,
                cognitive awareness, and safe motorcycle decision-making.
              </p>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`
                px-5 py-3 rounded-xl border text-sm font-semibold transition-all
                ${themeClasses.panel}
              `}
            >
              {isDark ? '☀️ Daylight Mode' : '🌙 Dark Mode'}
            </button>

          </div>

        </div>
      </header>

      {/* ───────────────── COPYRIGHT NOTICE ───────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-10">

        <div className={`
          rounded-2xl border-l-4 border-emerald-500 p-6
          ${themeClasses.panel}
        `}>
          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-sm">
            <span>🛡️</span>
            <span>Open Sharing & Citation Notice</span>
          </div>

          <p className={`mt-3 text-sm leading-relaxed ${themeClasses.muted}`}>
            © {new Date().getFullYear()} MCAS Technology Platform. Educational use,
            redistribution, and teaching are strongly encouraged. Please maintain
            scientific integrity by crediting MCAS (mcas-tech.org) whenever these
            materials are shared or referenced.
          </p>
        </div>

      </section>

      {/* ───────────────── COGNITIVE MODULE ───────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-8">

        <div className="mb-6">
          <div className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-bold mb-3">
            Cognitive Perception Simulator
          </div>

          <h2 className="text-3xl font-black mb-4">
            Attention & Visual Awareness Calibration
          </h2>

          <p className={`max-w-3xl leading-relaxed ${themeClasses.muted}`}>
            Interactive cognitive exercises designed to expose inattentional blindness,
            delayed threat recognition, and visual filtering limitations during riding.
          </p>
        </div>

        <BlindnessGlitch />

      </section>

      {/* ───────────────── RISK TERMINAL ───────────────── */}
      <section className={`
        py-20 my-16 border-y transition-colors duration-300
        ${isDark
          ? 'bg-zinc-950 border-zinc-800'
          : 'bg-white border-zinc-200'}
      `}>

        <div className="max-w-screen-2xl mx-auto px-6">

          <div className="max-w-5xl mx-auto mb-10">

            <div className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-bold mb-3">
              Systemic Risk Assessment Terminal
            </div>

            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-5">
              Motorcycle Fatalities in Malaysia
            </h2>

            <p className={`text-lg leading-relaxed max-w-4xl ${themeClasses.muted}`}>
              Interactive macro-level crash analytics exploring where, when, how,
              and why fatal motorcycle crashes occur across Malaysian road systems.
            </p>

          </div>

          {/* FULL WIDTH INFOGRAPHIC */}
          <RiskInfographic theme={theme} />

        </div>

      </section>

      {/* ───────────────── LEARNING MODULES ───────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">

        <div className="mb-10">
          <div className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-bold mb-3">
            Rider Development Modules
          </div>

          <h2 className="text-4xl font-black mb-4">
            Core Cognitive & Tactical Training
          </h2>

          <p className={`max-w-3xl leading-relaxed ${themeClasses.muted}`}>
            Structured learning modules integrating hazard perception,
            rider psychology, tactical scanning, and vehicle control principles.
          </p>
        </div>

        {/* SINGLE COLUMN STACK */}
        <div className="space-y-6">

          {modules.map((module) => (

            <div
              key={module.id}
              className={`
                rounded-2xl border p-8 transition-all duration-300
                ${themeClasses.panel}
                ${themeClasses.cardHover}
              `}
            >

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">

                <div className="flex-1">

                  <div className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400 mb-3">
                    Module {module.id} // {module.category}
                  </div>

                  <h3 className="text-2xl font-black mb-4">
                    {module.title}
                  </h3>

                  <p className={`${themeClasses.muted} leading-relaxed max-w-3xl`}>
                    {module.description}
                  </p>

                </div>

                <div className="lg:w-64 flex-shrink-0">

                  <button className="
                    w-full rounded-xl bg-emerald-500 hover:bg-emerald-400
                    text-black font-bold py-4 px-5 transition-all
                  ">
                    Open Learning Module →
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}