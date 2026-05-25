'use client';

import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ──────────────────────────────────────────────────────────
   DATA
────────────────────────────────────────────────────────── */

const CATEGORIES = {
  where: {
    id: "where",
    icon: "📍",
    label: "Where crashes happen",
    sub: "Location & road type",
    accentHex: "#FBBF24",
    headline: "61% of fatal crashes occur in rural areas",
    levels: [
      {
        title: "By area type",
        insight:
          "Rural roads feel safer but they're the deadliest — less enforcement, slower rescue response, and lower helmet compliance.",
        type: "pie",
        data: [
          { name: "Rural", value: 61, color: "#EF4444" },
          { name: "Small town", value: 19, color: "#F97316" },
          { name: "Town", value: 12, color: "#F59E0B" },
          { name: "City", value: 8, color: "#22C55E" },
        ],
      },

      {
        title: "By road type",
        insight:
          "Primary and arterial roads account for nearly 50% of all fatalities.",
        type: "hbar",
        data: [
          { name: "Primary / arterial", value: 49.7, color: "#EF4444" },
          { name: "Local street", value: 18.6, color: "#F97316" },
          { name: "Secondary road", value: 16.5, color: "#F59E0B" },
          { name: "Minor road", value: 12.3, color: "#EAB308" },
          { name: "Expressway", value: 3.0, color: "#22C55E" },
        ],
      },
    ],
  },

  when: {
    id: "when",
    icon: "🕐",
    label: "When crashes happen",
    sub: "Time, day & weather",
    accentHex: "#818CF8",
    headline: "4–10 PM on weekends is peak danger time",
    levels: [
      {
        title: "Hour of day",
        insight:
          "4 PM – 10 PM accounts for 35% of all motorcycle fatalities.",
        type: "hour",
        data: [
          { name: "12–2am", value: 8.3 },
          { name: "2–4am", value: 4.5 },
          { name: "4–6am", value: 3.9 },
          { name: "6–8am", value: 8.8 },
          { name: "8–10am", value: 7.7 },
          { name: "10am–12", value: 6.7 },
          { name: "12–2pm", value: 8.2 },
          { name: "2–4pm", value: 8.3 },
          { name: "4–6pm", value: 10.2 },
          { name: "6–8pm", value: 12.4 },
          { name: "8–10pm", value: 12.7 },
          { name: "10pm–12", value: 8.5 },
        ],
      },
    ],
  },

  safety: {
    id: "safety",
    icon: "🛡️",
    label: "Safety compliance gaps",
    sub: "Helmet & licence data",
    accentHex: "#F472B6",
    headline: "35% of riders killed had no valid licence",
    levels: [
      {
        title: "Helmet usage",
        insight:
          "1 in 5 riders killed wore no helmet.",
        type: "pie",
        data: [
          { name: "Properly worn", value: 76, color: "#22C55E" },
          { name: "Not wearing", value: 20, color: "#EF4444" },
          { name: "Unstrapped", value: 4, color: "#F97316" },
        ],
      },
    ],
  },
};

/* ──────────────────────────────────────────────────────────
   HELPERS
────────────────────────────────────────────────────────── */

const RADIAN = Math.PI / 180;

function useTheme(theme) {
  return useMemo(() => {
    const isDark = theme === "dark";

    return {
      isDark,

      bg: isDark ? "bg-zinc-950" : "bg-stone-50",

      panel: isDark
        ? "bg-zinc-900 border-zinc-800"
        : "bg-white border-zinc-200 shadow-sm",

      text: isDark ? "text-white" : "text-zinc-900",

      muted: isDark ? "text-zinc-400" : "text-zinc-600",

      soft: isDark ? "text-zinc-500" : "text-zinc-500",

      border: isDark ? "border-zinc-800" : "border-zinc-200",

      buttonInactive: isDark
        ? "bg-zinc-900 border-zinc-800 text-zinc-400"
        : "bg-white border-zinc-300 text-zinc-700",

      chartBg: isDark ? "#18181B" : "#FFFFFF",

      tooltipBg: isDark ? "#18181B" : "#FFFFFF",

      tooltipBorder: isDark ? "#3F3F46" : "#D4D4D8",
    };
  }, [theme]);
}

/* ──────────────────────────────────────────────────────────
   CHART LABEL
────────────────────────────────────────────────────────── */

const PieLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  value,
}) => {
  if (percent < 0.06) return null;

  const r = innerRadius + (outerRadius - innerRadius) * 0.55;

  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      {value}%
    </text>
  );
};

/* ──────────────────────────────────────────────────────────
   TOOLTIP
────────────────────────────────────────────────────────── */

function ChartTip({ active, payload, theme }) {
  const t = useTheme(theme);

  if (!active || !payload?.length) return null;

  const d = payload[0];

  return (
    <div
      className="rounded-xl px-3 py-2 border shadow-xl"
      style={{
        background: t.tooltipBg,
        borderColor: t.tooltipBorder,
      }}
    >
      <p className={`font-semibold text-sm ${t.text}`}>
        {d.name || d.payload?.name}
      </p>

      <p
        className="font-black text-sm"
        style={{
          color: d.fill || d.color || "#F59E0B",
        }}
      >
        {d.value}%
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   PIE CHART
────────────────────────────────────────────────────────── */

function PieViz({ data, theme, size = 220 }) {
  const t = useTheme(theme);

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-center">

      <div className="flex-shrink-0">
        <PieChart width={size} height={size}>
          <Pie
            data={data}
            cx={size / 2}
            cy={size / 2}
            outerRadius={size / 2 - 8}
            labelLine={false}
            label={PieLabel}
            dataKey="value"
          >
            {data.map((e, i) => (
              <Cell key={i} fill={e.color} />
            ))}
          </Pie>

          <Tooltip content={<ChartTip theme={theme} />} />
        </PieChart>
      </div>

      <div className="flex flex-col gap-3 flex-1 w-full">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-3">

            <div
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{
                background: d.color,
              }}
            />

            <span className={`text-sm ${t.muted}`}>
              {d.name}
            </span>

            <span className={`ml-auto font-black text-sm ${t.text}`}>
              {d.value}%
            </span>

          </div>
        ))}
      </div>

    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   HORIZONTAL BAR
────────────────────────────────────────────────────────── */

function HBarViz({ data, theme }) {
  const t = useTheme(theme);

  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex flex-col gap-4">

      {data.map((d, i) => (

        <div
          key={i}
          className="grid grid-cols-[140px_1fr] lg:grid-cols-[220px_1fr] gap-4 items-center"
        >

          <div className={`text-sm ${t.muted}`}>
            {d.name}
          </div>

          <div
            className={`h-8 rounded-xl overflow-hidden ${
              t.isDark ? "bg-zinc-800" : "bg-zinc-100"
            }`}
          >

            <div
              className="h-full flex items-center justify-end px-3 rounded-xl transition-all duration-700"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: d.color,
                minWidth: 48,
              }}
            >
              <span className="text-xs font-black text-black">
                {d.value}%
              </span>
            </div>

          </div>

        </div>

      ))}

    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   HOUR CHART
────────────────────────────────────────────────────────── */

function HourViz({ data, theme }) {
  const t = useTheme(theme);

  return (
    <div>

      <ResponsiveContainer width="100%" height={320}>

        <BarChart
          data={data}
          margin={{
            top: 8,
            right: 8,
            left: -24,
            bottom: 44,
          }}
        >

          <XAxis
            dataKey="name"
            tick={{
              fill: t.isDark ? "#A1A1AA" : "#52525B",
              fontSize: 11,
            }}
            angle={-35}
            textAnchor="end"
            interval={0}
          />

          <YAxis
            tick={{
              fill: t.isDark ? "#71717A" : "#71717A",
              fontSize: 11,
            }}
            tickFormatter={(v) => `${v}%`}
          />

          <Tooltip content={<ChartTip theme={theme} />} />

          <Bar dataKey="value" radius={[6, 6, 0, 0]}>

            {data.map((e, i) => (

              <Cell
                key={i}
                fill={
                  e.value >= 10
                    ? "#EF4444"
                    : e.value >= 8
                    ? "#F59E0B"
                    : "#64748B"
                }
              />

            ))}

          </Bar>

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   MAIN COMPONENT
────────────────────────────────────────────────────────── */

export default function RiskInfographic({
  theme = "dark",
}) {

  const t = useTheme(theme);

  const [selectedId, setSelectedId] = useState(null);

  const [level, setLevel] = useState(0);

  const cat = selectedId
    ? CATEGORIES[selectedId]
    : null;

  const currentLevel = cat
    ? cat.levels[level]
    : null;

  const selectCat = (id) => {
    setSelectedId(id);
    setLevel(0);
  };

  const goToLevel = (l) => {
    setLevel(l);
  };

  const goBack = () => {
    if (level > 0) {
      goToLevel(level - 1);
    } else {
      setSelectedId(null);
      setLevel(0);
    }
  };

  /* ───────────────── HOME SCREEN ───────────────── */

  if (!selectedId) {

    return (

      <div className={`${t.bg} ${t.text} p-6 lg:p-10 rounded-3xl`}>

        {/* HERO */}

        <div className="text-center mb-16">

          <p className={`text-xs uppercase tracking-[0.3em] mb-5 ${t.soft}`}>
            Malaysia road safety · source data 2000–2009
          </p>

          <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-none mb-5">
            Motorcycle Fatalities
          </h1>

          <p className={`max-w-2xl mx-auto text-lg leading-relaxed ${t.muted}`}>
            Interactive macro-analytics exploring fatal motorcycle crash
            patterns across Malaysian road systems.
          </p>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-16">

          {[
            {
              val: "4,070",
              label: "fatalities in 2009",
              color: "#EF4444",
            },

            {
              val: "60%",
              label: "of Malaysian road deaths",
              color: "#FBBF24",
            },

            {
              val: "#1",
              label: "ASEAN fatality rate",
              color: "#818CF8",
            },

            {
              val: "8/day",
              label: "average over 10 years",
              color: "#34D399",
            },
          ].map((s) => (

            <div
              key={s.label}
              className={`rounded-2xl border p-6 text-center ${t.panel}`}
            >

              <div
                className="text-4xl font-black mb-2"
                style={{
                  color: s.color,
                }}
              >
                {s.val}
              </div>

              <div className={`text-sm leading-relaxed ${t.muted}`}>
                {s.label}
              </div>

            </div>

          ))}

        </div>

        {/* CATEGORY GRID */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {Object.values(CATEGORIES).map((c) => (

            <button
              key={c.id}
              onClick={() => selectCat(c.id)}
              className={`
                rounded-3xl border p-7 text-left transition-all duration-300
                hover:-translate-y-1 hover:shadow-xl
                ${t.panel}
              `}
            >

              <div className="text-4xl mb-5">
                {c.icon}
              </div>

              <div
                className="text-xs uppercase tracking-[0.25em] font-bold mb-3"
                style={{
                  color: c.accentHex,
                }}
              >
                {c.sub}
              </div>

              <div className="text-2xl font-black mb-4 leading-tight">
                {c.label}
              </div>

              <div className={`${t.muted} leading-relaxed text-sm`}>
                {c.headline}
              </div>

              <div
                className="mt-6 text-xs font-bold uppercase tracking-[0.25em]"
                style={{
                  color: c.accentHex,
                }}
              >
                {c.levels.length} drill levels →
              </div>

            </button>

          ))}

        </div>

      </div>
    );
  }

  /* ───────────────── DETAIL SCREEN ───────────────── */

  return (

    <div className={`${t.bg} ${t.text} p-6 lg:p-10 rounded-3xl`}>

      <div className="max-w-6xl mx-auto">

        {/* NAV */}

        <div className="flex items-center gap-4 mb-10">

          <button
            onClick={goBack}
            className={`
              rounded-xl px-5 py-3 border text-sm font-semibold transition-all
              ${t.buttonInactive}
            `}
          >
            ← Back
          </button>

          <div className={`text-sm truncate ${t.soft}`}>

            <button
              onClick={() => {
                setSelectedId(null);
                setLevel(0);
              }}
              className="hover:underline"
            >
              Home
            </button>

            <span className="mx-2">/</span>

            <span
              style={{
                color: cat.accentHex,
              }}
            >
              {cat.icon} {cat.label}
            </span>

          </div>

        </div>

        {/* TITLE */}

        <div className="mb-10">

          <div
            className="text-xs uppercase tracking-[0.25em] font-bold mb-4"
            style={{
              color: cat.accentHex,
            }}
          >
            Level {level + 1} of {cat.levels.length}
          </div>

          <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6">
            {currentLevel.title}
          </h2>

          <div
            className="rounded-2xl border p-6"
            style={{
              background: `${cat.accentHex}12`,
              borderColor: `${cat.accentHex}30`,
            }}
          >

            <div
              className="text-sm font-bold uppercase tracking-[0.2em] mb-3"
              style={{
                color: cat.accentHex,
              }}
            >
              Key Insight
            </div>

            <div className={`${t.muted} leading-relaxed text-base`}>
              {currentLevel.insight}
            </div>

          </div>

        </div>

        {/* CHART */}

        <div
          className={`rounded-3xl border p-6 lg:p-10 mb-8 ${t.panel}`}
        >

          {currentLevel.type === "pie" && (
            <PieViz
              data={currentLevel.data}
              theme={theme}
            />
          )}

          {currentLevel.type === "hbar" && (
            <HBarViz
              data={currentLevel.data}
              theme={theme}
            />
          )}

          {currentLevel.type === "hour" && (
            <HourViz
              data={currentLevel.data}
              theme={theme}
            />
          )}

        </div>

        {/* LEVEL NAV */}

        {cat.levels.length > 1 && (

          <div className="flex flex-wrap gap-3 mb-8">

            {cat.levels.map((l, i) => (

              <button
                key={i}
                onClick={() => goToLevel(i)}
                className="px-5 py-3 rounded-xl border text-sm transition-all"
                style={
                  i === level
                    ? {
                        background: cat.accentHex,
                        borderColor: cat.accentHex,
                        color: "#000",
                        fontWeight: 800,
                      }
                    : {}
                }
              >

                {i + 1}. {l.title}

              </button>

            ))}

          </div>

        )}

        {/* CTA */}

        {level < cat.levels.length - 1 ? (

          <button
            onClick={() => goToLevel(level + 1)}
            className="w-full rounded-2xl py-5 text-base font-black uppercase tracking-[0.2em] transition-all hover:opacity-90"
            style={{
              background: cat.accentHex,
              color: "#000",
            }}
          >
            Drill Deeper →
          </button>

        ) : (

          <button
            onClick={() => {
              setSelectedId(null);
              setLevel(0);
            }}
            className={`
              w-full rounded-2xl py-5 border text-sm font-semibold
              ${t.buttonInactive}
            `}
          >
            ← Back to Categories
          </button>

        )}

        {/* FOOTNOTE */}

        <p className={`text-center mt-10 text-xs ${t.soft}`}>
          Source: Manan &amp; Várhelyi (2012), IATSS Research · Malaysian Royal Police
        </p>

      </div>

    </div>

  );
}