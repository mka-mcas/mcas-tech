'use client';

import { useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

const DATA = {
  // === OLD DATA (Pre-2010 / ~2009) ===
  old: {
    label: 'PRE-2010',
    icon: '📅',
    color: '#64748b',
    period: 'circa 2009',
    big: '4,070',
    bigDesc: 'motorcycle deaths',

    mini: [
      ['Rural roads', 61, '#EF4444'],
      ['Male riders', 94, '#378ADD'],
      ['Head injuries', 63, '#D4537E'],
    ],

    levels: [ /* Your original rich data stays here */ 
      {
        title: 'Where Crashes Happen',
        sub: 'Area type distribution',
        type: 'pie',
        data: [
          { name: 'Rural', value: 61, color: '#EF4444' },
          { name: 'Small town', value: 19, color: '#F59E0B' },
          { name: 'Town', value: 12, color: '#FBBF24' },
          { name: 'City', value: 8, color: '#22C55E' },
        ],
        insight: 'Rural roads account for the majority of motorcycle fatalities despite lower traffic volume.'
      },
      // ... (I kept it short, but you can paste all your original levels here)
    ]
  },

  // === NEW DATA (2022) ===
  current: {
    label: '2022',
    icon: '📊',
    color: '#10b981',
    period: 'PDRM 2022',
    big: '6,080',
    bigDesc: 'total road deaths',

    mini: [
      ['Morning Rush', 526, '#7F77DD'],
      ['Skid/Run-off', 1364, '#EF4444'],
      ['Male Riders', 94, '#378ADD'],
    ],

    levels: [
      {
        title: 'Deadliest Collision Types',
        sub: 'Motorcycle fatalities 2022',
        type: 'pie',
        data: [
          { name: 'Terbabas (Skid)', value: 1364, color: '#EF4444' },
          { name: 'Side-swipe', value: 1126, color: '#F59E0B' },
          { name: 'Rear-end', value: 899, color: '#EAB308' },
          { name: 'Head-on', value: 837, color: '#84CC16' },
        ],
        insight: 'Losing control (Terbabas) is now the #1 killer of motorcyclists.'
      },
      {
        title: 'Fatal Injury Distribution',
        sub: 'Body parts 2022',
        type: 'pie',
        data: [
          { name: 'Legs/Thighs', value: 1715, color: '#EF4444' },
          { name: 'Multiple Injuries', value: 3262, color: '#F59E0B' },
          { name: 'Head', value: 570, color: '#EAB308' },
        ],
        insight: 'Leg injuries dominate, but head protection remains critical.'
      }
    ]
  }
};

const PieViz = ({ data }) => { /* Keep your existing PieViz */ };
const BarViz = ({ data }) => { /* Keep your existing BarViz */ };
const HourViz = ({ data }) => { /* Keep your existing HourViz */ };

export default function RiskInfographic({ theme = 'light' }) {
  const [era, setEra] = useState('current');        // 'old' or 'current'
  const [selected, setSelected] = useState('national');
  const [level, setLevel] = useState(0);

  const isDark = theme === 'dark';
  const card = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200';
  const muted = isDark ? 'text-zinc-400' : 'text-zinc-600';

  const currentEraData = DATA[era];
  const currentSection = currentEraData; // Simplified for now

  return (
    <div className={isDark ? 'text-zinc-100' : 'text-zinc-900'}>
      {/* Era Selector */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => { setEra('old'); setLevel(0); }}
          className={`px-6 py-3 rounded-2xl font-medium transition-all ${era === 'old' ? 'bg-zinc-800 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}
        >
          Pre-2010 Data
        </button>
        <button
          onClick={() => { setEra('current'); setLevel(0); }}
          className={`px-6 py-3 rounded-2xl font-medium transition-all ${era === 'current' ? 'bg-emerald-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}
        >
          2022 Data (Latest)
        </button>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-black mb-2">
          Motorcycle Risk Intelligence — {currentEraData.period}
        </h2>
        <p className={muted}>Compare trends across decades</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {Object.entries(currentEraData.mini || []).map(([label, value, color], i) => (
          <div key={i} className={`rounded-3xl p-6 ${card}`}>
            <div className="text-5xl font-black" style={{ color }}>{value}</div>
            <div className="text-sm mt-2">{label}</div>
          </div>
        ))}
      </div>

      {/* Detail Panels - You can expand this with full original levels */}
      <div className={`rounded-3xl border p-8 ${card}`}>
        <h3 className="text-2xl font-black mb-6">Key Insights ({currentEraData.period})</h3>
        
        {currentEraData.levels?.map((lvl, idx) => (
          <div key={idx} className="mb-10 last:mb-0">
            <h4 className="font-bold text-xl mb-4">{lvl.title}</h4>
            {lvl.type === 'pie' && <PieViz data={lvl.data} />}
            {lvl.type === 'bar' && <BarViz data={lvl.data} />}
            <div className="mt-6 p-5 rounded-2xl border-l-4 italic" style={{ borderLeftColor: currentEraData.color }}>
              {lvl.insight}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}