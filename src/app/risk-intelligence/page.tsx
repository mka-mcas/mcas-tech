'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import RiskInfographic from '@/components/RiskInfographic';

// ─── PDRM 2022 DATA ──────────────────────────────────────────────────────────

const FATALITY_TREND = [
  { year: 2018, deaths: 6284, accidents: 548598 },
  { year: 2019, deaths: 6167, accidents: 567516 },
  { year: 2020, deaths: 4634, accidents: 418237 },
  { year: 2021, deaths: 4539, accidents: 370286 },
  { year: 2022, deaths: 6080, accidents: 545588 },
];

const TIME_OF_DAY = [
  { label: '00–02', fatal: 208, serious: 81,  minor: 508  },
  { label: '02–04', fatal: 56,  serious: 20,  minor: 152  },
  { label: '04–06', fatal: 135, serious: 57,  minor: 99   },
  { label: '06–08', fatal: 526, serious: 274, minor: 3386 },
  { label: '08–10', fatal: 490, serious: 356, minor: 2587 },
  { label: '10–12', fatal: 357, serious: 175, minor: 1986 },
  { label: '12–14', fatal: 401, serious: 241, minor: 2753 },
  { label: '14–16', fatal: 434, serious: 262, minor: 2363 },
  { label: '16–18', fatal: 516, serious: 405, minor: 3472 },
  { label: '18–20', fatal: 383, serious: 382, minor: 3590 },
  { label: '20–22', fatal: 418, serious: 361, minor: 2395 },
  { label: '22–24', fatal: 177, serious: 222, minor: 1085 },
];

const COLLISION_TYPES = [
  { label: 'Skidding / Run-off',     fatal: 1214, pct: 29.6 },
  { label: 'Rear-end collision',     fatal: 849,  pct: 20.7 },
  { label: 'Head-on collision',      fatal: 787,  pct: 19.2 },
  { label: 'Sideswipe',             fatal: 442,  pct: 10.8 },
  { label: 'Side collision',         fatal: 126,  pct: 3.1  },
  { label: 'Other',                  fatal: 483,  pct: 11.8 },
];

const ROAD_CATEGORY = [
  { label: 'State Road\n(Jalan Negeri)',      fatal: 1497, total: 10993 },
  { label: 'Urban Road\n(Jalan Bandaran)',    fatal: 1227, total: 11109 },
  { label: 'Federal Road\n(Persekutuan)',     fatal: 1251, total: 6593  },
  { label: 'Expressway\n(Jalan Ekspres)',     fatal: 870,  total: 2823  },
  { label: 'Other',                          fatal: 826,  total: 3992  },
];

const AGE_GROUPS = [
  { label: '11–15', deaths: 2  },
  { label: '16–20', deaths: 16 },
  { label: '21–25', deaths: 635 },
  { label: '26–30', deaths: 595 },
  { label: '31–35', deaths: 380 },
  { label: '36–40', deaths: 296 },
  { label: '41–45', deaths: 382 },
  { label: '46–50', deaths: 290 },
  { label: '51–55', deaths: 264 },
  { label: '56–60', deaths: 291 },
  { label: '61–65', deaths: 284 },
  { label: '66–70', deaths: 275 },
  { label: '71–75', deaths: 242 },
  { label: '>75',   deaths: 147 },
];

const HELMET_DATA = [
  { label: 'Wearing Helmet',          deaths: 1686, total: 19029, deathRate: 8.9  },
  { label: 'No Helmet',               deaths: 2348, total: 12102, deathRate: 19.4 },
  { label: 'Strap Not Fastened',      deaths: 67,   total: 164,   deathRate: 40.9 },
];

const FAULT_DATA = [
  { label: 'Not at fault (other driver)',  deaths: 2372, pct: 41.8 },
  { label: 'Careless riding',              deaths: 761,  pct: 13.4 },
  { label: 'Following too close',          deaths: 481,  pct: 8.5  },
  { label: 'Running red light',            deaths: 339,  pct: 6.0  },
  { label: 'Dangerous riding',             deaths: 263,  pct: 4.6  },
  { label: 'Dangerous overtaking',         deaths: 235,  pct: 4.1  },
  { label: 'Dangerous turning',            deaths: 184,  pct: 3.2  },
  { label: 'Speeding',                     deaths: 222,  pct: 3.9  },
];

const LOCALITY_DATA = [
  { label: 'Rural (Luar Bandar)',   deaths: 1793 },
  { label: 'Town (Bandar)',         deaths: 1232 },
  { label: 'City (Bandaraya)',      deaths: 459  },
  { label: 'Small Town (Pekan)',    deaths: 617  },
];

// ─── UTILITY ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString('en-MY');
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function StatCard({
  value, label, sub, accent, isDark,
}: {
  value: string; label: string; sub?: string; accent?: string; isDark: boolean;
}) {
  const bg    = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200';
  const muted = isDark ? 'text-zinc-500' : 'text-zinc-500';
  return (
    <div className={`rounded-2xl border p-5 ${bg}`}>
      <div className={`text-3xl sm:text-4xl font-black tracking-tight ${accent ?? 'text-red-500'}`}>
        {value}
      </div>
      <div className="text-sm font-bold mt-1">{label}</div>
      {sub && <div className={`text-xs mt-1 ${muted}`}>{sub}</div>}
    </div>
  );
}

function SectionTitle({ label, title, isDark }: { label: string; title: string; isDark: boolean }) {
  const muted = isDark ? 'text-zinc-500' : 'text-zinc-500';
  return (
    <div className="mb-6">
      <div className={`text-xs uppercase tracking-[0.25em] font-bold text-emerald-500 mb-2`}>{label}</div>
      <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{title}</h2>
      <div className={`mt-1 h-0.5 w-16 ${isDark ? 'bg-zinc-700' : 'bg-zinc-200'}`} />
    </div>
  );
}

function InsightBadge({ text, isDark }: { text: string; isDark: boolean }) {
  return (
    <div className={`inline-flex items-start gap-2 rounded-xl px-4 py-3 text-sm leading-snug
      ${isDark ? 'bg-zinc-800/80 text-zinc-300' : 'bg-zinc-100 text-zinc-700'}`}>
      <span className="text-amber-400 font-bold mt-0.5 shrink-0">⚡</span>
      <span>{text}</span>
    </div>
  );
}

// ─── CHART: FATALITY TREND ───────────────────────────────────────────────────

function FatalityTrendChart({ isDark }: { isDark: boolean }) {
  const W = 560; const H = 180;
  const PAD = { t: 20, r: 20, b: 40, l: 52 };
  const chartW = W - PAD.l - PAD.r;
  const chartH = H - PAD.t - PAD.b;
  const maxD = 7000;
  const stroke = isDark ? '#e4e4e7' : '#27272a';
  const grid   = isDark ? '#3f3f46' : '#e4e4e7';
  const muted  = isDark ? '#71717a' : '#a1a1aa';

  const xs = FATALITY_TREND.map((_, i) => PAD.l + (i / (FATALITY_TREND.length - 1)) * chartW);
  const ys = FATALITY_TREND.map(d => PAD.t + chartH - (d.deaths / maxD) * chartH);

  const polyline = xs.map((x, i) => `${x},${ys[i]}`).join(' ');
  const area = `M${xs[0]},${PAD.t + chartH} ` +
    xs.map((x, i) => `L${x},${ys[i]}`).join(' ') +
    ` L${xs[xs.length - 1]},${PAD.t + chartH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 200 }}>
      {/* grid lines */}
      {[0, 2000, 4000, 6000].map(v => {
        const y = PAD.t + chartH - (v / maxD) * chartH;
        return (
          <g key={v}>
            <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke={grid} strokeWidth={1} />
            <text x={PAD.l - 6} y={y + 4} textAnchor="end" fill={muted} fontSize={10}>
              {v === 0 ? '0' : `${v / 1000}k`}
            </text>
          </g>
        );
      })}
      {/* area fill */}
      <path d={area} fill={isDark ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.08)'} />
      {/* line */}
      <polyline points={polyline} fill="none" stroke="#ef4444" strokeWidth={2.5} strokeLinejoin="round" />
      {/* COVID annotation */}
      <rect x={xs[2] - 42} y={PAD.t - 16} width={84} height={14} rx={3}
        fill={isDark ? '#3f3f46' : '#f4f4f5'} />
      <text x={xs[2]} y={PAD.t - 5} textAnchor="middle" fill={muted} fontSize={9}>
        COVID lockdowns
      </text>
      {/* dots + labels */}
      {FATALITY_TREND.map((d, i) => (
        <g key={d.year}>
          <circle cx={xs[i]} cy={ys[i]} r={4} fill={i === 4 ? '#ef4444' : '#f87171'} />
          <text x={xs[i]} y={ys[i] - 9} textAnchor="middle"
            fill={i === 4 ? '#ef4444' : stroke} fontSize={11} fontWeight={i === 4 ? 700 : 400}>
            {fmt(d.deaths)}
          </text>
          <text x={xs[i]} y={H - 6} textAnchor="middle" fill={muted} fontSize={11}>
            {d.year}
          </text>
        </g>
      ))}
      <line x1={xs[1]} y1={PAD.t - 2} x2={xs[2]} y2={PAD.t - 2}
        stroke={grid} strokeWidth={1} strokeDasharray="3,2" />
    </svg>
  );
}

// ─── CHART: TIME OF DAY HEATMAP BARS ─────────────────────────────────────────

function TimeOfDayChart({ isDark }: { isDark: boolean }) {
  const maxFatal = Math.max(...TIME_OF_DAY.map(d => d.fatal));
  const muted    = isDark ? 'text-zinc-500' : 'text-zinc-500';

  return (
    <div className="space-y-1.5">
      {TIME_OF_DAY.map(d => {
        const pct = (d.fatal / maxFatal) * 100;
        const isRush = d.label === '06–08' || d.label === '16–18';
        const isMidnight = d.label === '00–02';
        const barColor = isRush ? 'bg-red-500' : isMidnight ? 'bg-orange-400' : 'bg-zinc-400';

        return (
          <div key={d.label} className="flex items-center gap-3">
            <span className={`text-xs font-mono w-12 text-right shrink-0 ${muted}`}>{d.label}</span>
            <div className="flex-1 h-5 flex items-center relative">
              <div
                className={`h-full rounded-sm ${barColor} transition-all`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className={`text-xs font-mono w-10 shrink-0 ${isRush ? 'text-red-500 font-bold' : muted}`}>
              {d.fatal}
            </span>
          </div>
        );
      })}
      <div className={`text-xs mt-3 flex gap-4 ${muted}`}>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block" /> Peak rush hours
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-orange-400 inline-block" /> High fatality (late night)
        </span>
      </div>
    </div>
  );
}

// ─── CHART: COLLISION TYPES ───────────────────────────────────────────────────

function CollisionChart({ isDark }: { isDark: boolean }) {
  const maxFatal = Math.max(...COLLISION_TYPES.map(d => d.fatal));
  const muted    = isDark ? 'text-zinc-500' : 'text-zinc-500';
  const textCol  = isDark ? 'text-zinc-200' : 'text-zinc-800';

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#06b6d4', '#6366f1'];

  return (
    <div className="space-y-3">
      {COLLISION_TYPES.map((d, i) => (
        <div key={d.label}>
          <div className="flex justify-between text-sm mb-1">
            <span className={`font-semibold ${textCol}`}>{d.label}</span>
            <span className={`font-mono ${muted}`}>{d.fatal} deaths · {d.pct}%</span>
          </div>
          <div className={`h-2 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(d.fatal / maxFatal) * 100}%`, background: COLORS[i] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── CHART: AGE GROUP HISTOGRAM ───────────────────────────────────────────────

function AgeGroupChart({ isDark }: { isDark: boolean }) {
  const W = 560; const H = 160;
  const PAD = { t: 30, r: 12, b: 30, l: 36 };
  const chartW = W - PAD.l - PAD.r;
  const chartH = H - PAD.t - PAD.b;
  const maxD = Math.max(...AGE_GROUPS.map(d => d.deaths));
  const barW = chartW / AGE_GROUPS.length;
  const muted = isDark ? '#71717a' : '#a1a1aa';
  const grid  = isDark ? '#3f3f46' : '#e4e4e7';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 170 }}>
      {[0, 300, 600].map(v => {
        const y = PAD.t + chartH - (v / maxD) * chartH;
        return (
          <g key={v}>
            <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke={grid} strokeWidth={1} />
            <text x={PAD.l - 4} y={y + 4} textAnchor="end" fill={muted} fontSize={9}>{v}</text>
          </g>
        );
      })}
      {AGE_GROUPS.map((d, i) => {
        const bh = (d.deaths / maxD) * chartH;
        const x  = PAD.l + i * barW + barW * 0.1;
        const w  = barW * 0.8;
        const y  = PAD.t + chartH - bh;
        const isTop = d.deaths === maxD || AGE_GROUPS[i + 1]?.deaths === maxD;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={w} height={bh}
              fill={d.deaths >= 500 ? '#ef4444' : isDark ? '#52525b' : '#d4d4d8'} rx={2} />
            <text x={x + w / 2} y={H - 4} textAnchor="middle" fill={muted} fontSize={8}>
              {d.label}
            </text>
            {isTop && (
              <text x={x + w / 2} y={y - 4} textAnchor="middle"
                fill="#ef4444" fontSize={9} fontWeight={700}>
                {d.deaths}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── CHART: HELMET ────────────────────────────────────────────────────────────

function HelmetChart({ isDark }: { isDark: boolean }) {
  const textCol = isDark ? 'text-zinc-200' : 'text-zinc-800';
  const muted   = isDark ? 'text-zinc-500' : 'text-zinc-500';
  const bg      = isDark ? 'bg-zinc-800' : 'bg-zinc-100';

  return (
    <div className="space-y-4">
      {HELMET_DATA.map(d => (
        <div key={d.label}
          className={`rounded-xl p-4 ${bg}`}>
          <div className="flex justify-between items-start mb-2">
            <span className={`font-bold text-sm ${textCol}`}>{d.label}</span>
            <span className={`font-black text-lg ${d.deathRate > 15 ? 'text-red-500' : d.deathRate > 10 ? 'text-orange-400' : 'text-emerald-500'}`}>
              {d.deathRate}%
            </span>
          </div>
          <div className="flex gap-4 text-xs">
            <span className={muted}><b className={textCol}>{fmt(d.deaths)}</b> deaths</span>
            <span className={muted}><b className={textCol}>{fmt(d.total)}</b> total casualties</span>
          </div>
          <div className={`mt-2 h-1.5 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-zinc-200'}`}>
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-red-500"
              style={{ width: `${(d.deathRate / 45) * 100}%` }} />
          </div>
          <div className={`text-xs mt-1 ${muted}`}>Death rate among those in accidents</div>
        </div>
      ))}
    </div>
  );
}

// ─── CHART: FAULT BREAKDOWN ───────────────────────────────────────────────────

function FaultChart({ isDark }: { isDark: boolean }) {
  const total  = FAULT_DATA.reduce((s, d) => s + d.deaths, 0);
  const muted  = isDark ? 'text-zinc-500' : 'text-zinc-500';
  const textCol= isDark ? 'text-zinc-200' : 'text-zinc-800';

  return (
    <div className="space-y-2">
      {FAULT_DATA.map((d, i) => (
        <div key={d.label} className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-0.5">
              <span className={`font-medium ${textCol}`}>{d.label}</span>
              <span className={`font-mono ${muted}`}>{d.deaths}</span>
            </div>
            <div className={`h-1.5 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${d.pct}%`,
                  background: i === 0
                    ? '#3b82f6'
                    : `hsl(${10 + i * 20}, 80%, 55%)`,
                }}
              />
            </div>
          </div>
        </div>
      ))}
      <div className={`text-xs mt-3 p-3 rounded-lg ${isDark ? 'bg-blue-950/40 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
        ⚠️ <strong>41.8% of rider deaths</strong> occurred when the motorcyclist was NOT at fault —
        killed by another road user's negligence.
      </div>
    </div>
  );
}

// ─── CHART: ROAD CATEGORY DONUT ──────────────────────────────────────────────

function RoadCategoryChart({ isDark }: { isDark: boolean }) {
  const maxFatal = Math.max(...ROAD_CATEGORY.map(d => d.fatal));
  const muted    = isDark ? 'text-zinc-500' : 'text-zinc-500';
  const textCol  = isDark ? 'text-zinc-200' : 'text-zinc-800';
  const COLORS   = ['#ef4444', '#f97316', '#eab308', '#06b6d4', '#6366f1'];
  const totalFatal = ROAD_CATEGORY.reduce((s, d) => s + d.fatal, 0);

  return (
    <div className="space-y-3">
      {ROAD_CATEGORY.map((d, i) => {
        const label = d.label.replace('\n', ' ');
        return (
          <div key={d.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className={`font-semibold ${textCol}`}>{label}</span>
              <span className={`font-mono ${muted}`}>
                {d.fatal} deaths · {((d.fatal / totalFatal) * 100).toFixed(1)}%
              </span>
            </div>
            <div className={`h-2 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
              <div className="h-full rounded-full"
                style={{ width: `${(d.fatal / maxFatal) * 100}%`, background: COLORS[i] }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function RiskIntelligencePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [activeTab, setActiveTab] = useState<'overview' | 'time' | 'collision' | 'rider' | 'fault'>('overview');

  const isDark = theme === 'dark';

  const pageBg = isDark ? 'bg-black text-zinc-100'    : 'bg-stone-50 text-zinc-900';
  const muted  = isDark ? 'text-zinc-400'              : 'text-zinc-600';
  const border = isDark ? 'border-zinc-800'            : 'border-zinc-200';
  const panel  = isDark ? 'bg-zinc-900 border-zinc-800': 'bg-white border-zinc-200';

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-zinc-400 font-medium tracking-wide">
        Verifying secure access...
      </div>
    );
  }

  const TABS = [
    { key: 'overview',   label: '📊 Overview'       },
    { key: 'time',       label: '🕐 Time & Road'    },
    { key: 'collision',  label: '💥 Collision'      },
    { key: 'rider',      label: '🏍 Rider Profile'  },
    { key: 'fault',      label: '⚠️ Fault Analysis'  },
  ] as const;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${pageBg}`}>

      {/* ── HEADER ────────────────────────────────────────────────────── */}
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
                Evidence-based motorcycle safety intelligence powered by the{' '}
                <strong>PDRM Road Traffic Accident Statistics Report 2022</strong>.
                545,588 accidents. 6,080 deaths. Real data — for real decisions.
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${panel}`}
              >
                {isDark ? '☀️ Daylight' : '🌙 Dark'}
              </button>
              <span className={`text-xs ${muted}`}>Source: PDRM / JSPT 2022</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
            <Link
              href="/safe-riding-know-how"
              className="text-sm font-semibold text-sky-500 hover:text-sky-400 transition-colors inline-flex items-center gap-1"
            >
              ← Return to Knowledge Hub
            </Link>

            {/* ALERT BANNER */}
            <div className={`text-xs px-4 py-2 rounded-full font-semibold
              ${isDark ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              🚨 2022 deaths surged +34% vs 2021 — first post-COVID spike
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO KPI STRIP ────────────────────────────────────────────── */}
      <section className={`border-b ${border} py-8`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard value="6,080"   label="Total road deaths 2022"  sub="+34% vs 2021"           isDark={isDark} accent="text-red-500"     />
            <StatCard value="545,588" label="Total accidents 2022"    sub="+47.3% vs 2021"         isDark={isDark} accent="text-orange-500"  />
            <StatCard value="5,671"   label="Motorcycle fatalities"   sub="Riders involved"         isDark={isDark} accent="text-red-500"     />
            <StatCard value="4,101"   label="Rider deaths"            sub="Penunggang 2022"         isDark={isDark} accent="text-red-500"     />
            <StatCard value="57.3%"   label="of all road deaths"      sub="Are motorcyclists"       isDark={isDark} accent="text-amber-500"   />
            <StatCard value="16.7"    label="Deaths per day"          sub="Avg. national 2022"      isDark={isDark} accent="text-zinc-400"    />
          </div>
        </div>
      </section>

      {/* ── RISK INFOGRAPHIC (existing component) ─────────────────────── */}
      <section className={`py-10 border-b ${border}`}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle label="Risk Infographic" title="Interactive Risk Overview" isDark={isDark} />
          <RiskInfographic theme={theme} />
        </div>
      </section>

      {/* ── TAB NAVIGATION ────────────────────────────────────────────── */}
      <div className={`sticky top-0 z-40 border-b ${border} ${isDark ? 'bg-black/95' : 'bg-stone-50/95'} backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-3">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all
                  ${activeTab === t.key
                    ? 'bg-emerald-500 text-white'
                    : isDark
                      ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                      : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100'
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── TAB CONTENT ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">

        {/* ──── OVERVIEW TAB ────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* 5-year fatality trend */}
            <div className={`rounded-2xl border p-6 ${panel}`}>
              <SectionTitle
                label="Trend 2018–2022"
                title="National Road Death Trajectory"
                isDark={isDark}
              />
              <FatalityTrendChart isDark={isDark} />
              <div className="mt-4 grid sm:grid-cols-3 gap-3">
                <InsightBadge
                  isDark={isDark}
                  text="COVID lockdowns (2020–2021) caused a sharp drop — traffic returned in 2022 with a vengeance."
                />
                <InsightBadge
                  isDark={isDark}
                  text="2022 saw 1,541 more deaths than 2021. The post-pandemic rebound reversed years of gradual improvement."
                />
                <InsightBadge
                  isDark={isDark}
                  text="34.9 million registered vehicles on Malaysian roads in 2022 — the highest ever recorded."
                />
              </div>
            </div>

            {/* Motorcycle vs all vehicles */}
            <div className={`rounded-2xl border p-6 ${panel}`}>
              <SectionTitle label="2022 Motorcycle Share" title="Who Bears the Greatest Burden?" isDark={isDark} />
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <div className={`text-xs uppercase tracking-widest font-bold mb-4 ${muted}`}>
                    2022 motorcycle riders in accidents
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Rider deaths (Maut)',           val: 4101, total: 6080,  pct: 67.5 },
                      { label: 'Rider serious injuries (Parah)', val: 2836, total: 4306,  pct: 65.9 },
                      { label: 'Rider minor injuries (Ringan)',  val: 24376,total: 29730, pct: 82.0 },
                    ].map(r => (
                      <div key={r.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{r.label}</span>
                          <span className={`font-mono ${muted}`}>{fmt(r.val)} / {fmt(r.total)}</span>
                        </div>
                        <div className={`relative h-3 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                          <div
                            className="absolute left-0 top-0 h-full rounded-full bg-red-500"
                            style={{ width: `${r.pct}%` }}
                          />
                          <span className="absolute right-1 top-0 h-full flex items-center text-xs font-bold text-white">
                            {r.pct}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className={`text-sm mt-4 leading-relaxed ${muted}`}>
                    Motorcycles represent <strong className="text-red-500">67.5% of all road deaths</strong>{' '}
                    while being one of many vehicle types. The exposure risk per kilometre travelled
                    is exponentially higher than for car occupants.
                  </p>
                </div>

                <div>
                  <div className={`text-xs uppercase tracking-widest font-bold mb-4 ${muted}`}>
                    Pillion rider casualties 2022
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: 'Deaths',          val: 283,  color: 'bg-red-500'    },
                      { label: 'Serious injuries', val: 277,  color: 'bg-orange-400' },
                      { label: 'Minor injuries',   val: 972,  color: 'bg-yellow-400' },
                    ].map(r => (
                      <div key={r.label} className="flex items-center gap-3">
                        <span className={`text-xs w-28 ${muted}`}>{r.label}</span>
                        <div className={`h-5 rounded-sm ${r.color}`}
                          style={{ width: `${(r.val / 972) * 55}%` }} />
                        <span className={`text-xs font-mono font-bold ${muted}`}>{r.val}</span>
                      </div>
                    ))}
                  </div>
                  <p className={`text-sm mt-4 leading-relaxed ${muted}`}>
                    <strong>283 pillion riders killed</strong> in 2022. Passengers on motorcycles share
                    nearly equal exposure to fatal outcomes — yet receive less attention in safety campaigns.
                  </p>

                  <div className={`mt-4 p-4 rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-zinc-50'} text-sm`}>
                    <div className="font-black text-2xl text-emerald-500">17</div>
                    <div className={`text-xs ${muted}`}>Malaysian lives lost on roads every single day, 2022</div>
                    <div className="font-black text-2xl text-red-500 mt-2">11.5</div>
                    <div className={`text-xs ${muted}`}>Of those 17, are motorcyclists (daily average)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* State breakdown teaser */}
            <div className={`rounded-2xl border p-6 ${panel}`}>
              <SectionTitle label="State Risk 2022" title="Accidents by State (2022)" isDark={isDark} />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  { state: 'Selangor',      total: 156815 },
                  { state: 'Kuala Lumpur',  total: 64337  },
                  { state: 'Johor',         total: 76028  },
                  { state: 'Perak',         total: 40281  },
                  { state: 'Pulau Pinang',  total: 48694  },
                  { state: 'Kedah',         total: 25547  },
                  { state: 'Pahang',        total: 22517  },
                  { state: 'Negeri Sembilan',total: 26934 },
                ].map(s => (
                  <div key={s.state} className={`rounded-xl p-3 ${isDark ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                    <div className="text-xs font-bold text-emerald-500">{s.state}</div>
                    <div className="text-xl font-black">{fmt(s.total)}</div>
                    <div className={`text-xs ${muted}`}>accidents</div>
                  </div>
                ))}
              </div>
              <p className={`text-xs mt-4 ${muted}`}>
                Selangor alone accounts for 28.7% of all national accidents — driven by population density,
                vehicle volume, and commuter traffic.
              </p>
            </div>
          </div>
        )}

        {/* ──── TIME & ROAD TAB ─────────────────────────────────────── */}
        {activeTab === 'time' && (
          <div className="space-y-8">
            <div className={`rounded-2xl border p-6 ${panel}`}>
              <SectionTitle label="Hourly Risk" title="When Are Motorcyclists Killed?" isDark={isDark} />
              <TimeOfDayChart isDark={isDark} />
              <div className="mt-6 grid sm:grid-cols-3 gap-3">
                <InsightBadge isDark={isDark}
                  text="6–8 AM kills the most: 526 fatal crashes. Morning rush hour is the deadliest 2-hour window." />
                <InsightBadge isDark={isDark}
                  text="4–6 PM is the second peak: 516 fatalities. Evening rush compounds fatigue with high traffic volume." />
                <InsightBadge isDark={isDark}
                  text="Midnight–2 AM: high fatality rate per vehicle on road — fewer cars but impaired and fatigued riders." />
              </div>
            </div>

            <div className={`rounded-2xl border p-6 ${panel}`}>
              <SectionTitle label="Road Category" title="Where Do Motorcyclists Die?" isDark={isDark} />
              <RoadCategoryChart isDark={isDark} />
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                  <div className="text-sm font-bold mb-2">Rural roads (Jalan Negeri)</div>
                  <div className="text-3xl font-black text-red-500">1,497</div>
                  <div className={`text-xs ${muted}`}>Rider deaths — highest of any road type</div>
                  <p className={`text-xs mt-2 leading-relaxed ${muted}`}>
                    Higher speeds, fewer road safety features, longer emergency response times,
                    and frequent animal crossings contribute to the high fatality count.
                  </p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                  <div className="text-sm font-bold mb-2">Rural locality (Luar Bandar)</div>
                  <div className="text-3xl font-black text-orange-500">1,793</div>
                  <div className={`text-xs ${muted}`}>Rider deaths by locality type</div>
                  <p className={`text-xs mt-2 leading-relaxed ${muted}`}>
                    Rural riders face the highest absolute death count — motorcycles are often
                    the primary transport in areas with limited road infrastructure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ──── COLLISION TAB ───────────────────────────────────────── */}
        {activeTab === 'collision' && (
          <div className="space-y-8">
            <div className={`rounded-2xl border p-6 ${panel}`}>
              <SectionTitle label="How Riders Die" title="Primary Collision Types — Rider Deaths 2022" isDark={isDark} />
              <CollisionChart isDark={isDark} />
              <div className="mt-6 space-y-3">
                <InsightBadge isDark={isDark}
                  text="Skidding / Run-off (Terbabas) is the #1 killer with 1,214 rider deaths — loss of control on poor surfaces, excessive speed, or sudden steering." />
                <InsightBadge isDark={isDark}
                  text="Rear-end collisions (Langgar Belakang): 849 deaths. Motorcycles are often struck from behind in slow or stopped traffic — highly preventable with lane filtering laws." />
                <InsightBadge isDark={isDark}
                  text="Head-on collisions (Depan dengan Depan): 787 deaths. Often fatal due to combined closing speeds — primarily on single-carriageway rural roads." />
              </div>
            </div>

            <div className={`rounded-2xl border p-6 ${panel}`}>
              <SectionTitle label="Collision by Road Type" title="Road Category × Collision Severity" isDark={isDark} />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`border-b ${border}`}>
                      {['Road Type', 'Fatal', 'Serious', 'Minor', 'Total', 'Fatality Rate'].map(h => (
                        <th key={h} className={`py-2 px-3 text-left text-xs uppercase tracking-wide font-bold ${muted}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROAD_CATEGORY.map((r, i) => {
                      const label = r.label.replace('\n', ' ');
                      const rate  = ((r.fatal / r.total) * 100).toFixed(1);
                      return (
                        <tr key={r.label} className={`border-b ${border} ${i === 0 ? 'text-red-500' : ''}`}>
                          <td className="py-2.5 px-3 font-semibold">{label}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-red-500">{fmt(r.fatal)}</td>
                          <td className="py-2.5 px-3 font-mono">{ROAD_CATEGORY[i] ? '—' : ''}</td>
                          <td className="py-2.5 px-3 font-mono">—</td>
                          <td className="py-2.5 px-3 font-mono">{fmt(r.total)}</td>
                          <td className={`py-2.5 px-3 font-mono font-bold
                            ${parseFloat(rate) > 15 ? 'text-red-500' : parseFloat(rate) > 10 ? 'text-orange-400' : 'text-emerald-500'}`}>
                            {rate}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className={`text-xs mt-3 ${muted}`}>
                Expressway fatality rate (30.8%) is the highest — but expressways account for far
                fewer total crashes due to limited access design. State roads lead in total volume.
              </p>
            </div>
          </div>
        )}

        {/* ──── RIDER PROFILE TAB ───────────────────────────────────── */}
        {activeTab === 'rider' && (
          <div className="space-y-8">
            {/* Age */}
            <div className={`rounded-2xl border p-6 ${panel}`}>
              <SectionTitle label="Age Risk" title="Rider Deaths by Age Group" isDark={isDark} />
              <AgeGroupChart isDark={isDark} />
              <div className="mt-4 grid sm:grid-cols-3 gap-3">
                <InsightBadge isDark={isDark}
                  text="Age 21–25: 635 deaths — the highest single group. Young adults face a combination of inexperience, risk-taking behaviour, and high riding frequency." />
                <InsightBadge isDark={isDark}
                  text="Age 26–30: 595 deaths — the second-highest group. Together, ages 21–30 account for 30% of all rider deaths." />
                <InsightBadge isDark={isDark}
                  text="Deaths persist through 70+, reflecting Malaysia's aging rider demographic — motorcycles remain primary transport across all life stages." />
              </div>
            </div>

            {/* Helmet */}
            <div className={`rounded-2xl border p-6 ${panel}`}>
              <SectionTitle label="Helmet Effect" title="Helmet Usage vs. Death Rate" isDark={isDark} />
              <HelmetChart isDark={isDark} />
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl ${isDark ? 'bg-red-950/30 border border-red-900' : 'bg-red-50 border border-red-100'}`}>
                  <div className="text-2xl font-black text-red-500">2.18×</div>
                  <div className={`text-sm font-bold mt-1`}>Higher death risk without a helmet</div>
                  <p className={`text-xs mt-2 ${muted}`}>
                    No-helmet riders die at 19.4% vs 8.9% for helmet wearers — when in an accident,
                    they are more than twice as likely to be killed.
                  </p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-amber-950/30 border border-amber-900' : 'bg-amber-50 border border-amber-100'}`}>
                  <div className="text-2xl font-black text-amber-500">12,102</div>
                  <div className={`text-sm font-bold mt-1`}>Casualties from no-helmet riders</div>
                  <p className={`text-xs mt-2 ${muted}`}>
                    Despite being a smaller group, non-helmet wearers generated 12,102 casualties —
                    many of which were preventable with proper helmet use.
                  </p>
                </div>
              </div>
            </div>

            {/* Occupation */}
            <div className={`rounded-2xl border p-6 ${panel}`}>
              <SectionTitle label="Occupation" title="Who Are the Victims?" isDark={isDark} />
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: 'Working Adults (Bekerja)', deaths: 2420, total: 20031, color: 'text-red-500',     pct: '59%' },
                  { label: 'Students (Pelajar)',        deaths: 730,  total: 4698,  color: 'text-orange-400', pct: '18%' },
                  { label: 'Other / Unemployed',        deaths: 951,  total: 6584,  color: 'text-zinc-400',   pct: '23%' },
                ].map(o => (
                  <div key={o.label} className={`p-4 rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                    <div className={`text-3xl font-black ${o.color}`}>{fmt(o.deaths)}</div>
                    <div className="text-sm font-bold mt-1">{o.label}</div>
                    <div className={`text-xs ${muted}`}>{o.pct} of all rider deaths</div>
                    <div className={`text-xs mt-1 ${muted}`}>{fmt(o.total)} total casualties</div>
                  </div>
                ))}
              </div>
              <p className={`text-sm mt-4 leading-relaxed ${muted}`}>
                Working adults account for <strong>59% of rider deaths</strong> — predominantly daily
                commuters. Motorcycles are an economic necessity for millions of Malaysians, making
                every ride to work a calculated risk.
              </p>
            </div>
          </div>
        )}

        {/* ──── FAULT ANALYSIS TAB ─────────────────────────────────── */}
        {activeTab === 'fault' && (
          <div className="space-y-8">
            <div className={`rounded-2xl border p-6 ${panel}`}>
              <SectionTitle label="Fault Attribution" title="Why Are Riders Dying?" isDark={isDark} />
              <FaultChart isDark={isDark} />
            </div>

            <div className={`rounded-2xl border p-6 ${panel}`}>
              <SectionTitle label="Rider Behaviour" title="Key Controllable Risk Factors" isDark={isDark} />
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    fault: 'Careless Riding (Memandu Secara Cuai)',
                    deaths: 761, icon: '🏍️',
                    tip: 'Stay alert, eliminate distractions. Check mirrors every 5–7 seconds. Position yourself to be seen.',
                  },
                  {
                    fault: 'Following Too Closely (Mengekor Terlalu Rapat)',
                    deaths: 481, icon: '↔️',
                    tip: 'Maintain a 2-second gap minimum. Extend to 4 seconds at speeds above 80 km/h.',
                  },
                  {
                    fault: 'Running Red Lights (Tidak Mengikut Lampu Isyarat)',
                    deaths: 339, icon: '🚦',
                    tip: 'Intersection deaths are high-energy impacts. Full stops and checking cross-traffic saves lives.',
                  },
                  {
                    fault: 'Speeding (Terlampau Laju)',
                    deaths: 222, icon: '⚡',
                    tip: 'Speed doubles stopping distance and squares impact force. Urban speed limits exist for a reason.',
                  },
                  {
                    fault: 'Dangerous Overtaking (Memotong Secara Bahaya)',
                    deaths: 235, icon: '🔄',
                    tip: 'Never overtake at bends, crests, junctions, or in low-visibility conditions.',
                  },
                  {
                    fault: 'Dangerous Turning (Membelok Secara Bahaya)',
                    deaths: 184, icon: '↪️',
                    tip: 'Signal early, reduce speed before turns, check for oncoming traffic — especially on rural roads.',
                  },
                ].map(f => (
                  <div key={f.fault} className={`p-4 rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xl">{f.icon}</span>
                      <span className="text-2xl font-black text-red-500">{f.deaths}</span>
                    </div>
                    <div className="text-sm font-bold mb-1">{f.fault}</div>
                    <p className={`text-xs leading-relaxed ${muted}`}>{f.tip}</p>
                  </div>
                ))}
              </div>

              <div className={`mt-6 p-5 rounded-xl border ${isDark ? 'bg-blue-950/20 border-blue-900' : 'bg-blue-50 border-blue-100'}`}>
                <div className="text-sm font-black text-blue-500 mb-2">
                  ⚖️ The "Not at Fault" Problem
                </div>
                <p className={`text-sm leading-relaxed ${muted}`}>
                  <strong>2,372 riders died in 2022 despite not being at fault</strong> — killed by car
                  drivers, lorry operators, and other road users. This underscores that rider skill alone
                  is insufficient: defensive riding, high-visibility gear, and lane positioning must all
                  compensate for the errors of others. Malaysia needs stronger enforcement of car-driver
                  negligence affecting motorcyclists.
                </p>
              </div>
            </div>

            {/* Safety Action Cards */}
            <div className={`rounded-2xl border p-6 ${panel}`}>
              <SectionTitle label="Evidence-Based Action" title="What Actually Reduces Risk" isDark={isDark} />
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    rank: '01', title: 'Wear a Properly Fastened Helmet',
                    stat: '2.18× death risk without one',
                    body: 'The data is unambiguous: helmet use cuts your death probability in half when in an accident. ECE 22.06 or SIRIM-certified helmets only.',
                    color: 'text-emerald-500',
                  },
                  {
                    rank: '02', title: 'Avoid Rush Hour Where Possible',
                    stat: '526 deaths in just 6–8 AM',
                    body: 'Shifting your commute by 30–60 minutes, using alternative routes, or working from home reduces exposure to the highest-concentration death windows.',
                    color: 'text-emerald-500',
                  },
                  {
                    rank: '03', title: 'Ride High-Visibility',
                    stat: '41.8% died despite no fault',
                    body: 'Reflective vests, bright helmets, and LED lighting make you visible to the drivers who would otherwise fail to see you — often the actual cause of your death.',
                    color: 'text-emerald-500',
                  },
                ].map(c => (
                  <div key={c.rank} className={`p-5 rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                    <div className={`text-4xl font-black ${c.color} opacity-30`}>{c.rank}</div>
                    <div className="text-sm font-black mt-2 mb-1">{c.title}</div>
                    <div className="text-xs font-bold text-amber-400 mb-2">{c.stat}</div>
                    <p className={`text-xs leading-relaxed ${muted}`}>{c.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── UPCOMING MODULES ─────────────────────────────────────────── */}
      <section className={`border-t ${border}`}>
        <div className="max-w-7xl mx-auto px-6 py-14">
          <SectionTitle label="Coming Next" title="Modules in Development" isDark={isDark} />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Hazard Perception Analytics',
                desc:  'Interactive rider cognition and hazard anticipation learning engine based on real crash scenarios.',
              },
              {
                title: 'Motorcycle Crash Explorer',
                desc:  'Drill-down collision mechanisms, crash sequences, and behavioural pathways from PDRM incident data.',
              },
              {
                title: 'National Risk Timeline',
                desc:  'Longitudinal motorcycle fatality trends from 2010–2022, with state-by-state temporal risk evolution.',
              },
            ].map(m => (
              <div key={m.title} className={`rounded-2xl border p-6 ${panel}`}>
                <div className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-500 mb-3">
                  Upcoming Module
                </div>
                <h3 className="text-xl font-black mb-3">{m.title}</h3>
                <p className={`text-sm leading-relaxed ${muted}`}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className={`border-t ${border}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-wrap justify-between gap-4">
            <p className={`text-xs ${muted}`}>
              MCAS Motorcycle Risk Intelligence Platform · Research & Public Education System
            </p>
            <p className={`text-xs ${muted}`}>
              Data: Laporan Perangkaan Kemalangan Jalan Raya Malaysia, PDRM / JSPT 2022 ·
              Analysis by MCAS · For educational purposes
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
