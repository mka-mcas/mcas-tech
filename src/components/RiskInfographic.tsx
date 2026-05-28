'use client';

import { useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

// ─── TYPES ───────────────────────────────────────────────────────────────────

type EraKey = 'old' | 'current';

interface ChartEntry {
  name: string;
  value?: number;
  percentage?: number;
  color: string;
}

interface Level {
  title: string;
  sub: string;
  type: 'pie' | 'bar';
  data: ChartEntry[];
  insight: string;
}

interface EraData {
  label: string;
  icon: string;
  color: string;
  period: string;
  totalDeaths: string;
  mcDeaths: string;
  mcDeathsLabel: string;
  mini: [string, string, string][];
  levels: Level[];
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const DATA: Record<EraKey, EraData> = {

  // ── PRE-2010 (Source: 2009 Baseline) ──────────────────────────────────────
  old: {
    label: 'PRE-2010',
    icon: '📅',
    color: '#64748b',
    period: 'Circa 2009',
    totalDeaths: '6,745',
    mcDeaths: '4,070',
    mcDeathsLabel: 'Motorcycle deaths',
    mini: [
      ['Rural Road Fatalities',  '61%', '#EF4444'],
      ['Male Demographics',      '94%', '#378ADD'],
      ['Sustained Head Trauma',  '63%', '#D4537E'],
    ],
    levels: [
      {
        title: 'Where Crashes Happened',
        sub: 'Area type distribution — 2009 baseline',
        type: 'pie',
        data: [
          { name: 'Rural',      value: 61, color: '#EF4444' },
          { name: 'Small Town', value: 19, color: '#F59E0B' },
          { name: 'Town',       value: 12, color: '#FBBF24' },
          { name: 'City',       value:  8, color: '#22C55E' },
        ],
        insight:
          'Rural environments historically claimed the highest share of fatalities due to speed differentials and longer emergency response times.',
      },
      {
        title: 'Deadliest Road Classifications',
        sub: '% of total motorcycle fatalities — 2009 baseline',
        type: 'bar',
        data: [
          { name: 'Primary / Arterial', percentage: 49.7, color: '#3b82f6' },
          { name: 'Local Streets',      percentage: 18.6, color: '#6366f1' },
          { name: 'Secondary Roads',    percentage: 16.5, color: '#a855f7' },
          { name: 'Minor Roads',        percentage: 12.3, color: '#ec4899' },
          { name: 'Expressways',        percentage:  3.0, color: '#f43f5e' },
        ],
        insight:
          'Primary highways and arterial networks accounted for nearly half of all motorcycle fatalities.',
      },
    ],
  },

  // ── PDRM 2022 (Source: Laporan Perangkaan Kemalangan Jalan Raya 2022) ──────
  current: {
    label: '2022 REPORT',
    icon: '📊',
    color: '#10b981',
    period: 'PDRM 2022',
    totalDeaths: '6,080',
    // 4,101 rider deaths + 283 pillion deaths = 4,384 motorcycle occupant deaths
    mcDeaths: '4,384',
    mcDeathsLabel: 'Motorcycle occupant deaths (rider + pillion)',
    mini: [
      // Table B37: motorcycles in fatal accidents 0601–0800
      ['Fatal crashes — 6–8 AM peak',     '526',   '#7F77DD'],
      // Table B34: Terbabas (skid/run-off) fatal — highest single collision type
      ['Skid / Run-off deaths (Terbabas)', '1,364', '#EF4444'],
      // Table B49: riders killed with NO helmet (Tanpa Topi Keledar)
      ['Rider deaths — no helmet worn',    '2,348', '#F97316'],
    ],
    levels: [
      {
        // Table B34: Number of Motorcycles Involved by Type of First Collision
        title: 'Deadliest Collision Types (Table B34)',
        sub: 'Fatal motorcycle crashes by first collision type — 2022',
        type: 'pie',
        data: [
          { name: 'Terbabas (Skid / Run-off)', value: 1364, color: '#EF4444' },
          { name: 'Langgar Sebelah Tepi',       value: 1126, color: '#F59E0B' },
          { name: 'Langgar Belakang',           value:  899, color: '#EAB308' },
          { name: 'Depan Dengan Depan',         value:  837, color: '#84CC16' },
        ],
        insight:
          'Losing control (Terbabas) is the leading single-vehicle killer. ' +
          'Side-impact collisions (Langgar Sebelah Tepi) — often at junctions — ' +
          'follow closely, highlighting the danger of inattentive drivers cutting across riders.',
      },
      {
        // Table B33: Total Casualties by Body Part (all road users, 2022)
        title: 'Fatal Injury Locations (Table B33)',
        sub: 'Deaths by anatomical region — all road users 2022',
        type: 'bar',
        data: [
          { name: 'Polytrauma',    percentage: 3262, color: '#ec4899' },
          { name: 'Legs / Thighs', percentage: 1715, color: '#3b82f6' },
          { name: 'Head',          percentage:  570, color: '#f59e0b' },
          { name: 'Chest',         percentage:  159, color: '#ef4444' },
        ],
        insight:
          'Polytrauma — multiple simultaneous injuries — dominates the mortality profile, ' +
          'reflecting high-energy impacts with larger vehicles. ' +
          'Leg injuries are the most common non-fatal severe injury, typically from side impacts.',
      },
    ],
  },
};

// ─── CHART COMPONENTS ────────────────────────────────────────────────────────

interface VizProps {
  data: ChartEntry[];
  isDark: boolean;
}

function PieViz({ data, isDark }: VizProps) {
  const tooltipStyle = {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderColor:     isDark ? '#374151' : '#e5e7eb',
    color:           isDark ? '#f3f4f6' : '#1f2937',
  };
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function BarViz({ data, isDark }: VizProps) {
  const axisColor    = isDark ? '#9ca3af' : '#4b5563';
  const cursorFill   = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)';
  const tooltipStyle = {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderColor:     isDark ? '#374151' : '#e5e7eb',
  };
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <XAxis
            dataKey="name"
            stroke={axisColor}
            fontSize={11}
            tickLine={false}
          />
          <YAxis
            stroke={axisColor}
            fontSize={11}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: cursorFill }}
            contentStyle={tooltipStyle}
          />
          <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={entry.color ?? '#3b82f6'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

interface RiskInfographicProps {
  theme?: 'dark' | 'light';
}

export default function RiskInfographic({ theme = 'light' }: RiskInfographicProps) {
  const [era, setEra] = useState<EraKey>('current');

  const isDark = theme === 'dark';
  const d = DATA[era];

  // Manual theme classes — Tailwind dark: utilities are NOT used here because
  // theme is controlled by a prop, not Tailwind's dark mode class/media strategy.
  const bg      = isDark ? 'bg-zinc-900 border border-zinc-800'         : 'bg-white border border-zinc-200 shadow-sm';
  const muted   = isDark ? 'text-zinc-400'                              : 'text-zinc-500';
  const subText = isDark ? 'text-zinc-300'                              : 'text-zinc-700';
  const insetBg = isDark ? 'bg-zinc-950/40 border-zinc-700/60'          : 'bg-zinc-50 border-zinc-200';

  return (
    <div className={`w-full transition-colors duration-200 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>

      {/* ── Era Tabs ───────────────────────────────────────────── */}
      <div className="flex justify-center gap-4 mb-8">
        {(['old', 'current'] as EraKey[]).map(key => {
          const isActive = era === key;
          const activeClass =
            key === 'current'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-zinc-700 text-white shadow-md';
          const inactiveClass = isDark
            ? 'bg-zinc-800 text-zinc-400 hover:text-zinc-100'
            : 'bg-zinc-100 text-zinc-500 hover:text-zinc-800';
          return (
            <button
              key={key}
              onClick={() => setEra(key)}
              className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer
                ${isActive ? activeClass : inactiveClass}`}
            >
              {key === 'old' ? 'Pre-2010 Macro Trends' : '2022 PDRM Dataset'}
            </button>
          );
        })}
      </div>

      {/* ── Section Heading ───────────────────────────────────── */}
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-2">
          Motorcycle Risk Metrics — {d.period}
        </h2>
        <p className={`text-sm ${muted}`}>
          Comparative verification models built on PDRM statistics, analyzed by MIROS
        </p>
        <p className={`text-xs mt-1 ${muted}`}>
          National deaths: <strong>{d.totalDeaths}</strong> ·{' '}
          {d.mcDeathsLabel}: <strong>{d.mcDeaths}</strong>
        </p>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {d.mini.map(([label, value, color], i) => (
          <div key={i} className={`rounded-2xl p-6 flex flex-col justify-between ${bg}`}>
            <div>
              <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${muted}`}>
                Verified Incident Metric
              </div>
              <div className="text-4xl font-black tracking-tight" style={{ color }}>
                {value}
              </div>
            </div>
            <div className={`text-sm font-semibold mt-4 ${subText}`}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Deep Insight Charts ───────────────────────────────── */}
      <div className={`rounded-2xl border p-6 lg:p-8 ${bg}`}>
        <h3 className="text-xl font-black uppercase tracking-wider mb-8 text-emerald-500">
          Targeted Risk Domain Synthesis — {d.period}
        </h3>

        <div className="grid md:grid-cols-2 gap-10">
          {d.levels.map((lvl, idx) => (
            <div
              key={idx}
              className={`flex flex-col justify-between p-5 rounded-xl border ${insetBg}`}
            >
              <div>
                <h4 className="font-extrabold text-base tracking-tight mb-1">{lvl.title}</h4>
                <p className={`text-xs mb-6 ${muted}`}>{lvl.sub}</p>

                <div className="my-2">
                  {lvl.type === 'pie' && <PieViz data={lvl.data} isDark={isDark} />}
                  {lvl.type === 'bar' && <BarViz data={lvl.data} isDark={isDark} />}
                </div>
              </div>

              <div
                className={`mt-6 p-4 rounded-xl text-xs leading-relaxed border-l-2 font-medium
                  ${isDark ? 'bg-zinc-800/60 text-zinc-300' : 'bg-zinc-50 text-zinc-700'}`}
                style={{ borderLeftColor: d.color }}
              >
                <strong>Operational Takeaway:</strong> {lvl.insight}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}