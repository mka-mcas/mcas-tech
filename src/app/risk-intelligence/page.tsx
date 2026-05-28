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

  const pageBg = isDark ? 'bg-black text-zinc-100' : 'bg-stone-50 text-zinc-900';
  const muted = isDark ? 'text-zinc-400' : 'text-zinc-600';
  const border = isDark ? 'border-zinc-800' : 'border-zinc-200';
  const panel = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200';
  const accent = 'text-emerald-500';

  /* AUTH CHECK */
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

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
                MCAS RISK INTELLIGENCE SYSTEM • PDRM 2022 DATA
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-5">
                MOTORCYCLE FATALITY RISK — MALAYSIA
              </h1>
              <p className={`max-w-4xl text-sm sm:text-base leading-relaxed ${muted}`}>
                Real-time intelligence from <span className="font-semibold text-white">PDRM 2022 Report</span>. 
                Motorcycles dominate road deaths in Malaysia. Knowledge saves lives.
              </p>
            </div>

            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${panel}`}
            >
              {isDark ? '☀️ Daylight Mode' : '🌙 Dark Mode'}
            </button>
          </div>

          <div className="mt-8">
            <Link
              href="/safe-riding-know-how"
              className="text-sm font-semibold text-sky-500 hover:text-sky-400 transition-colors inline-flex items-center gap-1"
            >
              ← Return to Knowledge Hub
            </Link>
          </div>
        </div>
      </header>

      {/* NATIONAL OVERVIEW */}
      <section className={`py-12 border-b ${border}`}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
            2022 NATIONAL SNAPSHOT <span className="text-emerald-500 text-xl">📊</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Total Accidents", value: "545,588", change: "+47.3% vs 2021", color: "text-orange-400" },
              { label: "Total Deaths", value: "6,080", change: "+1,541 vs 2021", color: "text-red-500" },
              { label: "Registered Vehicles", value: "34.9M", change: "", color: "" },
              { label: "Motorcycle Dominance", value: "≈70-75%", change: "of road deaths", color: accent },
            ].map((stat, i) => (
              <div key={i} className={`rounded-2xl border p-6 ${panel}`}>
                <div className={`text-xs uppercase tracking-widest mb-2 ${muted}`}>{stat.label}</div>
                <div className="text-4xl font-black mb-1">{stat.value}</div>
                {stat.change && <div className={`text-sm ${stat.color}`}>{stat.change}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOTORCYCLE SPECIFIC RISKS */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-black mb-8">Motorcycle Fatalities — 2022</h2>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Rider + Pillion Stats */}
          <div className="lg:col-span-7">
            <div className={`rounded-3xl border p-8 ${panel}`}>
              <h3 className="text-xl font-bold mb-6 text-emerald-500">CASUALTIES</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <div className="text-5xl font-black text-red-500">5,671</div>
                  <div className="text-sm text-red-400">Motorcyclists involved in fatal/serious crashes</div>
                  <div className="mt-6 space-y-4 text-sm">
                    <div><span className="font-semibold">Riders (Penunggang):</span> 4,101 deaths</div>
                    <div><span className="font-semibold">Pillion (Pembonceng):</span> 283 deaths</div>
                  </div>
                </div>
                <div className="text-sm leading-relaxed text-zinc-400">
                  Motorcycles remain the highest risk category on Malaysian roads. Riders face disproportionate fatality rates due to low protection.
                </div>
              </div>
            </div>
          </div>

          {/* Top Collision Types */}
          <div className="lg:col-span-5">
            <div className={`rounded-3xl border p-8 h-full ${panel}`}>
              <h3 className="text-xl font-bold mb-6 text-emerald-500">DEADLIEST COLLISIONS</h3>
              <ul className="space-y-6">
                {[
                  ["Terbabas (Skid / Run-off-road)", "1,364 fatal"],
                  ["Langgar Sebelah Tepi (Side-swipe)", "1,126 fatal"],
                  ["Langgar Belakang (Rear-end)", "899 fatal"],
                  ["Depan Dengan Depan (Head-on)", "837 fatal"],
                ].map(([type, count]) => (
                  <li key={type} className="flex justify-between items-center border-b border-zinc-800 pb-4 last:border-0">
                    <span>{type}</span>
                    <span className="font-mono text-red-400 font-semibold">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TEMPORAL & ENVIRONMENTAL RISKS */}
      <section className={`max-w-7xl mx-auto px-6 py-14 border-t ${border}`}>
        <h2 className="text-2xl font-black mb-8">When & Where Risk Peaks</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Time of Day */}
          <div className={`rounded-2xl border p-8 ${panel}`}>
            <h3 className="font-bold mb-6">Peak Fatal Hours (Motorcycles)</h3>
            <div className="space-y-5 text-sm">
              <div className="flex justify-between"><span>Morning Rush (06:01–08:00)</span><span className="text-red-400">526 fatal</span></div>
              <div className="flex justify-between"><span>Evening Rush (16:01–18:00)</span><span className="text-red-400">516 fatal</span></div>
              <div className="flex justify-between"><span>Late Night (00:01–02:00)</span><span className="text-red-400">208 fatal</span></div>
            </div>
            <p className={`mt-8 text-xs ${muted}`}>Stay extra alert during rush hours. Fatigue + speed = deadly combination.</p>
          </div>

          {/* Road Types */}
          <div className={`rounded-2xl border p-8 ${panel}`}>
            <h3 className="font-bold mb-6">Most Dangerous Roads</h3>
            <p className="text-sm leading-relaxed mb-4">
              State roads (<em>Jalan Negeri</em>) and urban roads are consistently the highest risk corridors.
            </p>
            <div className="text-xs uppercase tracking-widest text-emerald-500">Expressways: 870 fatal (still significant)</div>
          </div>

          {/* Injury Patterns */}
          <div className={`rounded-2xl border p-8 ${panel}`}>
            <h3 className="font-bold mb-6">Common Fatal Injuries</h3>
            <ul className="space-y-3 text-sm">
              <li>Legs / Thighs — <span className="text-red-400">1,715 deaths</span></li>
              <li>Multiple Injuries — <span className="text-red-400">3,262 deaths</span></li>
              <li>Head Injuries — <span className="text-red-400">570 deaths</span></li>
            </ul>
            <p className={`mt-6 text-xs ${muted}`}>Proper helmet + protective gear dramatically improves survival odds.</p>
          </div>
        </div>
      </section>

      // ... (keep the imports and auth logic from previous version)

      {/* NATIONAL OVERVIEW + other sections remain the same */}

      {/* RISKINFOGRAPHIC */}
      <section className={`py-14 border-t ${border}`}>
        <div className="max-w-7xl mx-auto px-6">
          <RiskInfographic theme={theme} />
        </div>
      </section>

      {/* SIMPLE RISK CALCULATOR */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-linear-to-br from-red-950/30 to-transparent">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-8">Quick Personal Risk Check</h2>
          <div className={`p-8 rounded-3xl border ${panel}`}>
            <p className="mb-6 text-sm">Answer a few questions to estimate your relative risk level.</p>
            {/* Placeholder - you can expand this into a real form later */}
            <button 
              onClick={() => alert("🚨 Full interactive Risk Calculator coming soon! (Age, riding hours, helmet habit, etc.)")}
              className="bg-red-600 hover:bg-red-500 px-8 py-4 rounded-2xl font-semibold text-white transition-colors"
            >
              Start Risk Assessment →
            </button>
          </div>
        </div>
      </section>

      {/* Rest of the page remains the same */}

      {/* RISKINFOGRAPHIC + SAFETY TAKEAWAYS */}
      <section className={`py-14 border-t ${border}`}>
        <div className="max-w-7xl mx-auto px-6">
          <RiskInfographic theme={theme} />
        </div>
      </section>

      {/* BEHAVIOURAL SAFETY CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-linear-to-br from-emerald-950/50 to-transparent">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-6">Your Safety Is Non-Negotiable</h2>
          <p className="text-lg leading-relaxed text-zinc-300 mb-10">
            Most motorcycle fatalities are preventable through defensive riding, proper gear, and avoiding high-risk behaviours.
          </p>
          <Link
            href="/safe-riding-know-how"
            className="inline-block bg-emerald-600 hover:bg-emerald-500 transition-colors text-white font-semibold px-10 py-4 rounded-2xl text-lg"
          >
            Master Defensive Riding → 
          </Link>
        </div>
      </section>

      {/* FUTURE MODULES + FOOTER */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Same as before but with better copy */}
          {[
            ["Hazard Perception Training", "Build faster reaction to common Malaysian road traps."],
            ["Crash Dynamics Explorer", "Understand exactly how side-swipes and run-offs happen."],
            ["Trend Tracker 2018–2025", "Watch how interventions change the fatality curve."],
          ].map(([title, desc]) => (
            <div key={title} className={`rounded-2xl border p-8 ${panel}`}>
              <div className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-500 mb-3">COMING SOON</div>
              <h3 className="text-xl font-black mb-3">{title}</h3>
              <p className={`text-sm leading-relaxed ${muted}`}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-zinc-800">
        <p className={`text-xs ${muted}`}>
          MCAS Motorcycle Risk Intelligence Platform • Powered by PDRM Data • For Public Education & Research Only
        </p>
      </footer>
    </div>
  );
}