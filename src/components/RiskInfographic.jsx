'use client';

import React, { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

/* ─── DATA MATRIX STRUCTURE WITH ACADEMIC CITATIONS ────────────────── */

const CATEGORIES = {
  where: {
    id: "where",
    icon: "📍",
    label: "Where crashes happen",
    sub: "Location & road type",
    accentHex: "#D97706",
    tailwindText: "text-amber-800",
    tailwindBorder: "border-amber-200",
    tailwindBg: "bg-amber-50/60",
    headline: "61% of fatal crashes occur in rural areas",
    levels: [
      {
        title: "By Area Type",
        insight:
          "Rural roads feel safer but they are the deadliest (61%) due to higher travel speeds, lower traffic control enforcement, slower emergency response windows, and lower helmet compliance safety records.",
        type: "pie",
        data: [
          { name: "Rural", value: 61, color: "#EF4444" },
          { name: "Small town", value: 19, color: "#F97316" },
          { name: "Town", value: 12, color: "#F59E0B" },
          { name: "City", value: 8, color: "#10B981" },
        ],
      },
      {
        title: "By Road Classification",
        insight:
          "Primary and arterial highway structures alone account for nearly half (49.7%) of all motorcycle fatalities. These routes are fast, long, and lack comprehensive physical lane segregation grids.",
        type: "hbar",
        data: [
          { name: "Primary / Arterial", value: 49.7, color: "#EF4444" },
          { name: "Local street", value: 18.6, color: "#F97316" },
          { name: "Secondary road", value: 16.5, color: "#F59E0B" },
          { name: "Minor road", value: 12.3, color: "#EAB308" },
          { name: "Expressway", value: 3.0, color: "#10B981" },
        ],
      },
      {
        title: "By Road Geometry Structure",
        insight:
          "Straight road corridors kill 3× more riders than sharp curves or bends. Wide-open stretches encourage psychological speeding overconfidence—clear sightlines do not equate to a protective forcefield.",
        type: "hbar",
        data: [
          { name: "Straight road", value: 66, color: "#EF4444" },
          { name: "T-junction", value: 14.3, color: "#F97316" },
          { name: "Bend / Curve", value: 13.5, color: "#F59E0B" },
          { name: "Cross junction", value: 5.0, color: "#EAB308" },
          { name: "Roundabout", value: 0.5, color: "#10B981" },
          { name: "Interchange", value: 0.4, color: "#10B981" },
        ],
      },
    ],
  },

  when: {
    id: "when",
    icon: "🕐",
    label: "When crashes happen",
    sub: "Time, day & weather",
    accentHex: "#4F46E5",
    tailwindText: "text-indigo-800",
    tailwindBorder: "border-indigo-200",
    tailwindBg: "bg-indigo-50/60",
    headline: "4–10 PM on weekends is peak danger time",
    levels: [
      {
        title: "Light & Atmospheric Conditions",
        insight:
          "An overwhelming 93% of fatal crashes occur during completely clear weather, and 55.6% happen in plain daylight. Environmental conditions are not the hazard—rider behavior and fatigue vectors are.",
        type: "dual",
        labels: ["Light Profiles", "Atmospheric Weather"],
        data: [
          { name: "Daytime", value: 55.6, color: "#F59E0B" },
          { name: "Night (lit)", value: 18.9, color: "#6366F1" },
          { name: "Night (dark)", value: 15.8, color: "#4338CA" },
          { name: "Dawn / Dusk", value: 9.7, color: "#F97316" },
        ],
        data2: [
          { name: "Clear sky", value: 93.0, color: "#10B981" },
          { name: "Rain / Wet", value: 5.4, color: "#6366F1" },
          { name: "Foggy haze", value: 0.9, color: "#9CA3AF" },
          { name: "Other mix", value: 0.7, color: "#4B5563" },
        ],
      },
      {
        title: "Hour Distribution Density",
        insight:
          "The evening period from 4 PM to 10 PM accounts for 35.3% of cumulative rider fatalities. The rush-hour transition and evening commute represent the most high-threat interval of any standard run.",
        type: "hour",
        data: [
          { name: "12–2 AM", value: 8.3 },
          { name: "2–4 AM", value: 4.5 },
          { name: "4–6 AM", value: 3.9 },
          { name: "6–8 AM", value: 8.8 },
          { name: "8–10 AM", value: 7.7 },
          { name: "10 AM–12", value: 6.7 },
          { name: "12–2 PM", value: 8.2 },
          { name: "2–4 PM", value: 8.3 },
          { name: "4–6 PM", value: 10.2 },
          { name: "6–8 PM", value: 12.4 },
          { name: "8–10 PM", value: 12.7 },
          { name: "10 PM–12", value: 8.5 },
        ],
      },
      {
        title: "Day of the Week Weighting",
        insight:
          "Sunday represents the deadliest single day frame for motorcycle operations. Leisure weekend trips over longer distances correlate with micro-lapses in concentration profiles.",
        type: "hbar",
        data: [
          { name: "Sunday", value: 15.8, color: "#EF4444" },
          { name: "Monday", value: 15.3, color: "#EF4444" },
          { name: "Saturday", value: 14.7, color: "#F97316" },
          { name: "Tuesday", value: 14.3, color: "#F59E0B" },
          { name: "Wednesday", value: 13.4, color: "#EAB308" },
          { name: "Thursday", value: 13.3, color: "#EAB308" },
          { name: "Friday", value: 13.2, color: "#A3E635" },
        ],
      },
    ],
  },

  how: {
    id: "how",
    icon: "💥",
    label: "How crashes happen",
    sub: "Collision types & vehicles",
    accentHex: "#DC2626",
    tailwindText: "text-red-800",
    tailwindBorder: "border-red-200",
    tailwindBg: "bg-red-50/60",
    headline: "Motorcyclists themselves trigger 50% of their fatal crashes",
    levels: [
      {
        title: "External Vehicle Affiliation",
        insight:
          "Single-vehicle out-of-control crashes (25%) combined with motorcycle-vs-motorcycle impacts (25%) mean that exactly half of all rider fatalities involve no third-party passenger cars or heavy commercial trucks.",
        type: "pie",
        data: [
          { name: "Passenger car", value: 28, color: "#F97316" },
          { name: "Bike vs Bike", value: 25, color: "#EF4444" },
          { name: "Single machine", value: 25, color: "#DC2626" },
          { name: "Truck / Lorry", value: 14, color: "#F59E0B" },
          { name: "Van / SUV", value: 5, color: "#EAB308" },
          { name: "Bus transit", value: 2, color: "#10B981" },
          { name: "Other profile", value: 9CA3AF, color: "#6B7280" },
        ],
      },
      {
        title: "Kinematic Impact Profile",
        insight:
          "Angular and side-impact structural failures dominate at 27.5%. This tracks vehicles violating a rider's right-of-way at cross junctions, leaving zero threshold zone to take defensive actions.",
        type: "hbar",
        data: [
          { name: "Angular / Side", value: 27.5, color: "#EF4444" },
          { name: "Head-on line", value: 21.4, color: "#DC2626" },
          { name: "Out of control", value: 19.9, color: "#F97316" },
          { name: "Rear-end bump", value: 14.8, color: "#F59E0B" },
          { name: "Lateral sideswipe", value: 8.9, color: "#EAB308" },
          { name: "Other formats", value: 7.5, color: "#6B7280" },
        ],
      },
    ],
  },

  who: {
    id: "who",
    icon: "👤",
    label: "Who is most at risk",
    sub: "Demographics of fatalities",
    accentHex: "#059669",
    tailwindText: "text-emerald-800",
    tailwindBorder: "border-emerald-200",
    tailwindBg: "bg-emerald-50/60",
    headline: "Young men aged 16–20 are the highest risk group",
    levels: [
      {
        title: "Gender & Saddle Allocation",
        insight:
          "92.1% of cumulative traffic fatalities are male profile assets, and 88.5% are operating directly in the driver saddle. Being a young male rider represents the ultimate concentration risk factor on public infrastructure.",
        type: "dual",
        labels: ["By Gender", "By Saddle Role"],
        data: [
          { name: "Male", value: 92.1, color: "#6366F1" },
          { name: "Female", value: 7.9, color: "#EC4899" },
        ],
        data2: [
          { name: "Rider Operator", value: 88.5, color: "#F59E0B" },
          { name: "Pillion Passenger", value: 11.5, color: "#9CA3AF" },
        ],
      },
      {
        title: "Age Distribution Blocks",
        insight:
          "Riders aged 16–20 account for the largest single mortality share at 22.5%. This stems from structural inexperience, lack of formal track safety training, and relying on self-taught exploratory habits.",
        type: "hbar",
        data: [
          { name: "16–20 years", value: 22.5, color: "#EF4444" },
          { name: "21–25 years", value: 17.3, color: "#F97316" },
          { name: "26–30 years", value: 9.4, color: "#F59E0B" },
          { name: "41–50 years", value: 22C55E, color: "#EAB308" },
          { name: "51–60 years", value: 9.1, color: "#A3E635" },
          { name: "60+ elderly", value: 9.1, color: "#10B981" },
          { name: "31–35 years", value: 6.4, color: "#10B981" },
          { name: "36–40 years", value: 4.8, color: "#0D9488" },
          { name: "11–15 youth", value: 4.7, color: "#0891B2" },
        ],
      },
      {
        title: "Machine Ownership Matrix",
        insight:
          "9 out of 10 fatal impacts happen on an asset registered under personal/private ownership metadata. The bike you ride every day carries the highest risk.",
        type: "pie",
        data: [
          { name: "Private / Personal", value: 90, color: "#F59E0B" },
          { name: "Commercial transit", value: 6, color: "#9CA3AF" },
          { name: "Corporate Services", value: 3, color: "#4B5563" },
          { name: "Government fleet", value: 1, color: "#374151" },
        ],
      },
    ],
  },

  safety: {
    id: "safety",
    icon: "🛡️",
    label: "Safety compliance gaps",
    sub: "Helmet & licence data",
    accentHex: "#DB2777",
    tailwindText: "text-pink-800",
    tailwindBorder: "border-pink-200",
    tailwindBg: "bg-pink-50/60",
    headline: "35% of riders killed had no valid licence",
    levels: [
      {
        title: "Helmet Mechanical Engagement",
        insight:
          "20% of operators killed wore no helmet array at the moment of kinetic failure, while 4% neglected to fasten their retention strap. Unsecured or missing retention shells remove all structural defense.",
        type: "pie",
        data: [
          { name: "Properly Fastened", value: 76, color: "#10B981" },
          { name: "Zero Helmet Array", value: 20, color: "#EF4444" },
          { name: "Unfastened Strap", value: 4, color: "#F97316" },
        ],
      },
      {
        title: "Licence Validation Status",
        insight:
          "A valid license represents technical compliance metrics. Crucially, over a third (35%) of all terminal crash profiles involve operators with zero regulatory credentials, bypassing verified evaluation tracks.",
        type: "hbar",
        data: [
          { name: "No Valid Licence", value: 35, color: "#EF4444" },
          { name: "Full Licence (>5 yrs)", value: 34, color: "#10B981" },
          { name: "Full Licence (<5 yrs)", value: 29, color: "#F59E0B" },
          { name: "L-Plate Apprentice", value: 2, color: "#F97316" },
        ],
      },
    ],
  },

  injury: {
    id: "injury",
    icon: "🤕",
    label: "Types of fatal injury",
    sub: "Body areas affected",
    accentHex: "#EA580C",
    tailwindText: "text-orange-800",
    tailwindBorder: "border-orange-200",
    tailwindBg: "bg-orange-50/60",
    headline: "63% of fatal injuries are to the head",
    levels: [
      {
        title: "Terminal Trauma Allocation",
        insight:
          "Head trauma remains the primary driver of mortality indices at 63%. Because brain tissue exhibits zero tolerance for terminal deceleration forces, protective shell validation remains non-negotiable for every single ride.",
        type: "pie",
        data: [
          { name: "Cranial Head Trauma", value: 63, color: "#EF4444" },
          { name: "Multiple Zone Failure", value: 20, color: "#F97316" },
          { name: "Thoracic Chest Trauma", value: 9, color: "#F59E0B" },
          { name: "Cervical Neck Fracture", value: 4, color: "#EAB308" },
          { name: "Lower Extremities", value: 3, color: "#10B981" },
          { name: "Pelvic Hip Fracture", value: 1, color: "#16A34A" },
        ],
      },
    ],
  },
};

/* ─── MINI VISUAL SUB-COMPONENTS ──────────────────────────────────── */

const RADIAN = Math.PI / 180;
const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }) => {
  if (percent < 0.04) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" className="text-[11px] font-black">
      {value}%
    </text>
  );
};

const CustomChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-3 shadow-xl text-xs font-mono text-zinc-800">
      <p className="text-zinc-500 font-bold mb-1">{data.name || data.payload?.name}</p>
      <p className="font-black text-sm text-zinc-900">
        {data.value}% Distribution
      </p>
    </div>
  );
};

function PieChartModule({ data, size = 180 }) {
  return (
    <div className="flex gap-6 items-center flex-wrap justify-center sm:justify-start">
      <div className="flex-shrink-0 mx-auto sm:mx-0">
        <PieChart width={size} height={size}>
          <Pie data={data} cx={size / 2} cy={size / 2} outerRadius={size / 2 - 6} labelLine={false} label={PieLabel} dataKey="value">
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
          </Pie>
          <Tooltip content={<CustomChartTooltip />} />
        </PieChart>
      </div>
      <div className="flex flex-col gap-1.5 flex-1 min-w-[240px]">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs font-mono border-b border-zinc-200 pb-1.5 last:border-0">
            <div className="flex items-center gap-2.5 truncate max-w-[180px]">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: item.color }} />
              <span className="text-zinc-600 truncate">{item.name}</span>
            </div>
            <span className="text-zinc-900 font-black tabular-nums">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HorizontalBarModule({ data }) {
  const maxValue = Math.max(...data.map(item => item.value));
  return (
    <div className="flex flex-col gap-3 font-mono">
      {data.map((item, idx) => (
        <div key={idx} className="flex items-center gap-4 text-xs">
          <div className="text-zinc-600 text-right font-bold truncate w-[130px] sm:w-[160px]" title={item.name}>
            {item.name}
          </div>
          <div className="flex-1 h-7 bg-zinc-100 rounded-lg border border-zinc-200 overflow-hidden relative">
            <div
              className="h-full rounded-md flex items-center justify-end pr-3 transition-all duration-700 ease-out"
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                background: item.color,
                minWidth: '42px'
              }}
            >
              <span className="text-[10px] font-black text-white">
                {item.value}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DailyHourModule({ data }) {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 12, right: 10, left: -25, bottom: 20 }}>
          <XAxis dataKey="name" tick={{ fill: "#52525b", fontSize: 10, fontFamily: 'monospace' }} interval={0} stroke="#e4e4e7" />
          <YAxis tick={{ fill: "#71717a", fontSize: 10, fontFamily: 'monospace' }} tickFormatter={v => `${v}%`} stroke="#e4e4e7" />
          <Tooltip content={<CustomChartTooltip />} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.value >= 11 ? "#EF4444" : entry.value >= 8 ? "#F59E0B" : "#e4e4e7"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-6 mt-4 text-[10px] font-mono tracking-wider uppercase text-zinc-500 border-t border-zinc-200 pt-4">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#EF4444]" /> Critical Threat Vector (• Peak Risk ≥11%)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#F59E0B]" /> Elevated Hazard (8%–11%)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#e4e4e7]" /> Baseline Vector (&lt;8%)
        </span>
      </div>
    </div>
  );
}

function DualPieModule({ labels, data, data2 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl">
        <p className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase mb-4 text-center">
          📊 Segregation Link Alpha: {labels[0]}
        </p>
        <PieChartModule data={data} size={150} />
      </div>
      <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl">
        <p className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase mb-4 text-center">
          📊 Segregation Link Beta: {labels[1]}
        </p>
        <PieChartModule data={data2} size={150} />
      </div>
    </div>
  );
}

/* ─── CORE INTERACTIVE CONSOLE SYSTEM ─────────────────────────────── */

export default function RiskInfographic() {
  const [mounted, setMounted] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [level, setLevel] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full bg-white text-zinc-500 min-h-[400px] flex items-center justify-center font-mono text-xs border border-zinc-200 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
          Initializing Instrumented Exposure Database...
        </div>
      </div>
    );
  }

  const cat = selectedId ? CATEGORIES[selectedId] : null;
  const currentLevel = cat ? cat.levels[level] : null;

  const selectCat = id => { setSelectedId(id); setLevel(0); };
  const goToLevel = idx => { setLevel(idx); };

  const stepBackwards = () => {
    if (level > 0) goToLevel(level - 1);
    else { setSelectedId(null); setLevel(0); }
  };

  /* ──────── INTERFACE STATE A: THE PRIMARY CORE SELECTOR DASHBOARD ──────── */
  if (!selectedId) {
    return (
      <div className="bg-white text-zinc-800 p-6 font-sans border border-zinc-200 rounded-3xl shadow-xl w-full max-w-7xl mx-auto transition-all duration-300">
        
        {/* Analytical Heading Block */}
        <div className="text-center mb-10 border-b border-zinc-200 pb-8">
          <p className="text-[10px] font-mono tracking-widest text-zinc-400 font-bold uppercase mb-3">
            Source Citation: Manan, M. M. A., &amp; Várhelyi, A. (2012). Motorcycle fatalities in Malaysia. IATSS Research, 36(1), 30-39.
          </p>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight uppercase leading-none text-zinc-900">
            Motorcycle Fatalities <br className="sm:hidden" />
            <span className="font-light text-zinc-400 lowercase text-xl sm:text-2xl font-mono block mt-2">
              in macro-analytics perspective [cite: 2460]
            </span>
          </h2>
          <p className="text-zinc-500 text-xs mt-3 max-w-2xl mx-auto leading-relaxed">
            Parsing comprehensive traffic safety matrices from Royal Malaysia Police data sets[cite: 2475, 2540]. Click any metrics domain to unlock multi-layered trend breakdowns.
          </p>
        </div>

        {/* ── Macro Telemetry Vital Signs Banner ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full mx-auto mb-10 bg-zinc-50 p-5 rounded-2xl border border-zinc-200">
          {[
            { value: "4,070", label: "fatalities in peak baseline year [cite: 2491]", color: "text-rose-600" },
            { value: "60%",   label: "of all macro Malaysian road deaths [cite: 2474, 2520]", color: "text-amber-600" },
            { value: "#1 Risk", label: "ASEAN fatality rate per capita [cite: 2474, 2602]", color: "text-indigo-600" },
            { value: "8 / Day", label: "mean mortal velocity frequency [cite: 2737]", color: "text-emerald-600" },
          ].map((stat, i) => (
            <div key={i} className="text-center border-r border-zinc-200 last:border-0 px-2">
              <div className={`text-2xl sm:text-3xl font-black tracking-tight ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-tight leading-snug">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Interactive Category Multi-Grid Array ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full mx-auto">
          {Object.values(CATEGORIES).map(item => (
            <button
              key={item.id}
              onClick={() => selectCat(item.id)}
              className={`${item.tailwindBg} border ${item.tailwindBorder} rounded-2xl p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:bg-white group outline-none hover:shadow-md`}
            >
              <div className="text-3xl mb-4 bg-white w-12 h-12 rounded-xl flex items-center justify-center border border-zinc-200 group-hover:border-zinc-300 transition-all">
                {item.icon}
              </div>
              <span className={`text-[10px] font-mono tracking-widest uppercase block mb-1 ${item.tailwindText}`}>
                {item.sub}
              </span>
              <h4 className="text-zinc-900 font-black text-lg mb-2 tracking-tight uppercase">
                {item.label}
              </h4>
              <p className="text-zinc-500 text-xs leading-relaxed border-t border-zinc-200 pt-3 font-medium min-h-[50px]">
                {item.headline}
              </p>
              <div className={`mt-4 text-[10px] font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 ${item.tailwindText}`}>
                Expose {item.levels.length} Analysis Layers 
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ──────── INTERFACE STATE B: SPECIFIC DIAGNOSTIC DRILL LAYER VIEW ──────── */
  return (
    <div className="bg-white text-zinc-800 p-6 font-sans border border-zinc-200 rounded-3xl shadow-xl w-full max-w-7xl mx-auto">

        {/* Clean Relative Context Navigation Path Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-zinc-200 pb-4">
          <button
            onClick={stepBackwards}
            className="bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 font-mono font-bold text-xs px-4 py-2 rounded-xl transition-all"
          >
            ← System Back
          </button>
          <div className="text-[11px] font-mono text-zinc-400 truncate">
            <button onClick={() => { setSelectedId(null); }} className="hover:text-zinc-600">
              Console
            </button>
            <span className="mx-2 text-zinc-300">/</span>
            <span style={{ color: cat.accentHex }} className="font-bold">
              {cat.icon} {cat.label}
            </span>
            <span className="mx-2 text-zinc-300">/</span>
            <span className="text-zinc-500">{currentLevel.title}</span>
          </div>
        </div>

        {/* Dynamic Progress Micro-Bar System */}
        <div className="flex gap-2 mb-8">
          {cat.levels.map((l, i) => (
            <button
              key={i}
              onClick={() => goToLevel(i)}
              title={`Switch layer node to: ${l.title}`}
              className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{ background: i <= level ? cat.accentHex : "#e4e4e7" }}
            />
          ))}
        </div>

        {/* Main Header Matrix Readout Box */}
        <div className="mb-6 space-y-3">
          <p className="text-[10px] font-mono tracking-widest uppercase font-bold" style={{ color: cat.accentHex }}>
            {cat.icon} Vector Sub-Layer // Index {level + 1} of {cat.levels.length}
          </p>
          <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-900 uppercase leading-none">
            {currentLevel.title}
          </h3>
          <div 
            className="rounded-2xl p-5 border text-xs sm:text-sm leading-relaxed"
            style={{
              background: `${cat.accentHex}05`,
              borderColor: `${cat.accentHex}25`
            }}
          >
            <span className="font-mono font-bold block mb-1 uppercase text-xs tracking-wider" style={{ color: cat.accentHex }}>
              ✦ Empirical Incident Analytics Profile:
            </span>
            <span className="text-zinc-700 font-medium">{currentLevel.insight}</span>
          </div>
        </div>

        {/* Main Graphical Presentation Block Section */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 mb-6 shadow-sm relative min-h-[220px] flex flex-col justify-center">
          {currentLevel.type === "pie" && <PieChartModule data={currentLevel.data} />}
          {currentLevel.type === "hbar" && <HorizontalBarModule data={currentLevel.data} />}
          {currentLevel.type === "hour" && <DailyHourModule data={currentLevel.data} />}
          {currentLevel.type === "dual" && (
            <DualPieModule labels={currentLevel.labels} data={currentLevel.data} data2={currentLevel.data2} />
          )}
        </div>

        {/* Matrix Quick-Jump Tab Triggers */}
        {cat.levels.length > 1 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {cat.levels.map((l, i) => (
              <button
                key={i}
                onClick={() => goToLevel(i)}
                className="flex-1 min-w-[120px] py-2 px-3 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-wider transition-all"
                style={
                  i === level
                    ? { background: cat.accentHex, borderColor: cat.accentHex, color: "#fff" }
                    : { background: "#fafafa", borderColor: "#e4e4e7", color: "#71717a" }
                }
              >
                Layer {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Primary Functional Call to Action (CTA) Control Line */}
        {level < cat.levels.length - 1 ? (
          <button
            onClick={() => goToLevel(level + 1)}
            className="w-full rounded-2xl py-4 text-xs font-mono font-bold uppercase tracking-widest transition-opacity hover:opacity-90 shadow-md text-white"
            style={{ background: cat.accentHex }}
          >
            Drill Deeper → Next Layer: {cat.levels[level + 1].title}
          </button>
        ) : (
          <button
            onClick={() => { setSelectedId(null); }}
            className="w-full bg-zinc-50 hover:bg-zinc-100 text-zinc-500 border border-zinc-200 rounded-2xl py-4 text-xs font-mono font-bold uppercase tracking-widest transition-colors outline-none"
          >
            ← Terminate Drill Map // Return to Console Home
          </button>
        )}
    </div>
  );
}