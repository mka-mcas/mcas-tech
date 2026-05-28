'use client';

import { useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const DATA = {
  // === PRE-2010 DATA (Source: 2009 Baseline) ===
  old: {
    label: 'PRE-2010',
    icon: '📅',
    color: '#64748b',
    period: 'Circa 2009',
    totalDeaths: '6,745',
    mcDeaths: '4,070',
    mini: [
      ['Rural Road Fatalities', '61%', '#EF4444'],
      ['Male Demographics', '94%', '#378ADD'],
      ['Sustained Head Trauma', '63%', '#D4537E'],
    ],
    levels: [
      {
        title: 'Where Crashes Happened',
        sub: 'Area type distribution (2009)',
        type: 'pie',
        data: [
          { name: 'Rural', value: 61, color: '#EF4444' },
          { name: 'Small Town', value: 19, color: '#F59E0B' },
          { name: 'Town', value: 12, color: '#FBBF24' },
          { name: 'City', value: 8, color: '#22C55E' },
        ],
        insight: 'Rural environments historically claimed the highest share of fatalities due to speed differentials and longer medical response times.'
      },
      {
        title: 'Deadliest Road Classifications',
        sub: '% of total motorcycle fatalities (2009)',
        type: 'bar',
        data: [
          { name: 'Primary / Arterial', percentage: 49.7, color: '#3b82f6' },
          { name: 'Local Streets', percentage: 18.6, color: '#6366f1' },
          { name: 'Secondary Roads', percentage: 16.5, color: '#a855f7' },
          { name: 'Minor Roads', percentage: 12.3, color: '#ec4899' },
          { name: 'Expressways', percentage: 3.0, color: '#f43f5e' },
        ],
        insight: 'Primary highways and arterial networks accounted for nearly half of all motorcycle fatalities.'
      }
    ]
  },

  // === NEW DATA (Source: PDRM 2022 Official Audit Report) ===
  current: {
    label: '2022 REPORT',
    icon: '📊',
    color: '#10b981',
    period: 'PDRM 2022',
    totalDeaths: '6,080',
    mcDeaths: '4,384',
    mini: [
      ['Morning Peak Cases', '526', '#7F77DD'],
      ['Skid / Out of Control', '1,364', '#EF4444'],
      ['Male Driver Pool', '29,736', '#378ADD'],
    ],
    levels: [
      {
        title: 'Deadliest Collision Types (Jadual B34)',
        sub: 'Motorcycle involved fatal crash metrics',
        type: 'pie',
        data: [
          { name: 'Terbabas (Skid / Run-off)', value: 1364, color: '#EF4444' },
          { name: 'Langgar Sebelah Tepi', value: 1126, color: '#F59E0B' },
          { name: 'Langgar Belakang', value: 899, color: '#EAB308' },
          { name: 'Depan Dengan Depan', value: 837, color: '#84CC16' },
        ],
        insight: 'Losing control (Terbabas) remains the leading cause of single-vehicle motorcycle fatalities, followed closely by side-impact junction collisions[cite: 26].'
      },
      {
        title: 'Systemic Injury Distribution (Jadual B33)',
        sub: 'Anatomical location of trauma causing death',
        type: 'bar',
        data: [
          { name: 'Polytrauma (Pelbagai)', percentage: 3262, color: '#ec4899' },
          { name: 'Peha / Kaki (Extremities)', percentage: 1715, color: '#3b82f6' },
          { name: 'Kepala (Neural Cranium)', percentage: 570, color: '#f59e0b' },
          { name: 'Dada (Thoracic Region)', percentage: 159, color: '#ef4444' },
        ],
        insight: 'Widespread complex trauma dominates the mortality profile, highlighting high-velocity kinetic energy match-ups with larger vehicles[cite: 26].'
      }
    ]
  }
};

// --- Custom Recharts Visualizations Handles ---
const PieViz = ({ data, isDark }) => (
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
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: isDark ? '#1f2937' : '#ffffff', 
            borderColor: isDark ? '#374151' : '#e5e7eb',
            color: isDark ? '#f3f4f6' : '#1f2937'
          }} 
        />
        <Legend verticalAlign="bottom" height={36} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

const BarViz = ({ data, isDark }) => (
  <div className="w-full h-72">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <XAxis 
          dataKey="name" 
          stroke={isDark ? '#9ca3af' : '#4b5563'} 
          fontSize={11}
          tickLine={false}
        />
        <YAxis 
          stroke={isDark ? '#9ca3af' : '#4b5563'} 
          fontSize={11}
          tickLine={false}
        />
        <Tooltip 
          cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
          contentStyle={{ 
            backgroundColor: isDark ? '#1f2937' : '#ffffff', 
            borderColor: isDark ? '#374151' : '#e5e7eb' 
          }}
        />
        <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default function RiskInfographic({ theme = 'light' }) {
  const [era, setEra] = useState('current');

  const isDark = theme === 'dark';
  const card = isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-zinc-200 shadow-sm';
  const muted = isDark ? 'text-zinc-400' : 'text-zinc-600';

  const currentEraData = DATA[era];

  return (
    <div className={`w-full transition-colors duration-200 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      
      {/* Era Control Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setEra('old')}
          className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            era === 'old' 
              ? 'bg-zinc-700 text-white shadow-md' 
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Pre-2010 Macro Trends
        </button>
        <button
          onClick={() => setEra('current')}
          className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            era === 'current' 
              ? 'bg-emerald-600 text-white shadow-md' 
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-300'
          }`}
        >
          2022 PDRM Dataset
        </button>
      </div>

      {/* Visual Title Matrix Section */}
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-2">
          Motorcycle Risk Metrics — {currentEraData.period} 
        </h2>
        <p className={`text-sm ${muted}`}>Comparative verification models built on official enforcement records[cite: 22].</p>
      </div>

      {/* KPI Cards Grid - Fixed to reference array index correctly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {currentEraData.mini.map(([label, value, color], i) => (
          <div key={i} className={`rounded-2xl p-6 flex flex-col justify-between transition-transform ${card}`}>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                Verified Incident Metrics
              </div>
              <div className="text-4xl font-black tracking-tight" style={{ color }}>
                {value}
              </div>
            </div>
            <div className="text-sm font-semibold mt-4 text-zinc-500 dark:text-zinc-300">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Deep Insight Analysis Drill Container */}
      <div className={`rounded-2xl border p-6 lg:p-8 ${card}`}>
        <h3 className="text-xl font-black uppercase tracking-wider mb-8 text-emerald-500">
          Targeted Risk Domain Synthesis ({currentEraData.period})
        </h3>
        
        <div className="grid md:grid-cols-2 gap-10">
          {currentEraData.levels?.map((lvl, idx) => (
            <div key={idx} className="flex flex-col justify-between bg-zinc-950/20 dark:bg-zinc-900/40 p-5 rounded-xl border border-zinc-800/60">
              <div>
                <h4 className="font-extrabold text-base tracking-tight mb-1">{lvl.title}</h4>
                <p className="text-xs text-zinc-400 mb-6">{lvl.sub}</p>
                
                <div className="my-2">
                  {lvl.type === 'pie' && <PieViz data={lvl.data} isDark={isDark} />}
                  {lvl.type === 'bar' && <BarViz data={lvl.data} isDark={isDark} />}
                </div>
              </div>

              <div 
                className="mt-6 p-4 rounded-xl text-xs leading-relaxed border-l-2 font-medium bg-zinc-500/5" 
                style={{ borderLeftColor: currentEraData.color, color: isDark ? '#d1d5db' : '#374151' }}
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