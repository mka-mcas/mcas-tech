import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

/* ─── DATA ────────────────────────────────────────────────────────── */

const CATEGORIES = {
  where: {
    id: "where",
    icon: "📍",
    label: "Where crashes happen",
    sub: "Location & road type",
    accentHex: "#FBBF24",
    tailwindText: "text-amber-400",
    tailwindBorder: "border-amber-500/20",
    tailwindBg: "bg-amber-950/30",
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
          "Primary and arterial roads account for nearly 50% of all fatalities — long, fast, partially access-controlled routes with inherently dangerous features.",
        type: "hbar",
        data: [
          { name: "Primary / arterial", value: 49.7, color: "#EF4444" },
          { name: "Local street", value: 18.6, color: "#F97316" },
          { name: "Secondary road", value: 16.5, color: "#F59E0B" },
          { name: "Minor road", value: 12.3, color: "#EAB308" },
          { name: "Expressway", value: 3.0, color: "#22C55E" },
        ],
      },
      {
        title: "By road geometry",
        insight:
          "Straight roads kill 3× more than curves. Open stretches encourage speeding — don't be fooled by clear sight lines or empty roads.",
        type: "hbar",
        data: [
          { name: "Straight", value: 66, color: "#EF4444" },
          { name: "T-junction", value: 14.3, color: "#F97316" },
          { name: "Bend / curve", value: 13.5, color: "#F59E0B" },
          { name: "Cross junction", value: 5.0, color: "#EAB308" },
          { name: "Roundabout", value: 0.5, color: "#22C55E" },
          { name: "Interchange", value: 0.4, color: "#22C55E" },
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
    tailwindText: "text-indigo-400",
    tailwindBorder: "border-indigo-500/20",
    tailwindBg: "bg-indigo-950/30",
    headline: "4–10 PM on weekends is peak danger time",
    levels: [
      {
        title: "Light & weather conditions",
        insight:
          "93% of crashes happen in clear weather — dangerous conditions aren't the main killer, rider behaviour is. Most fatalities also occur during the day.",
        type: "dual",
        labels: ["Light conditions", "Weather"],
        data: [
          { name: "Daytime", value: 55.6, color: "#F59E0B" },
          { name: "Night (lit)", value: 18.9, color: "#818CF8" },
          { name: "Night (dark)", value: 15.8, color: "#4338CA" },
          { name: "Dawn / dusk", value: 9.7, color: "#F97316" },
        ],
        data2: [
          { name: "Clear", value: 93.0, color: "#22C55E" },
          { name: "Rain", value: 5.4, color: "#818CF8" },
          { name: "Foggy", value: 0.9, color: "#6B7280" },
          { name: "Other", value: 0.7, color: "#374151" },
        ],
      },
      {
        title: "Hour of day",
        insight:
          "4 PM – 10 PM accounts for 35% of all motorcycle fatalities. The evening commute home is the most dangerous ride of the day.",
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
      {
        title: "Day of week",
        insight:
          "Sunday is the single deadliest day. Weekend riding — leisure trips, longer distances, less rest — significantly raises risk.",
        type: "hbar",
        data: [
          { name: "Sunday", value: 15.8, color: "#EF4444" },
          { name: "Monday", value: 15.3, color: "#EF4444" },
          { name: "Saturday", value: 14.7, color: "#F97316" },
          { name: "Tuesday", value: 14.3, color: "#F59E0B" },
          { name: "Wednesday", value: 13.4, color: "#EAB308" },
          { name: "Thursday", value: 13.3, color: "#EAB308" },
          { name: "Friday", value: 13.2, color: "#84CC16" },
        ],
      },
    ],
  },

  how: {
    id: "how",
    icon: "💥",
    label: "How crashes happen",
    sub: "Collision types & vehicles",
    accentHex: "#EF4444",
    tailwindText: "text-red-400",
    tailwindBorder: "border-red-500/20",
    tailwindBg: "bg-red-950/30",
    headline: "Motorcyclists themselves cause 50% of their fatal crashes",
    levels: [
      {
        title: "Other vehicle involved",
        insight:
          "Single crashes + MC-vs-MC together equal 50% of all fatalities. Rider behaviour — not other vehicles — is the leading cause of death.",
        type: "pie",
        data: [
          { name: "Passenger car", value: 28, color: "#F97316" },
          { name: "MC vs MC", value: 25, color: "#EF4444" },
          { name: "Single accident", value: 25, color: "#DC2626" },
          { name: "Truck / lorry", value: 14, color: "#F59E0B" },
          { name: "Van / SUV", value: 5, color: "#EAB308" },
          { name: "Bus", value: 2, color: "#22C55E" },
          { name: "Other", value: 1, color: "#6B7280" },
        ],
      },
      {
        title: "Type of collision",
        insight:
          "Angular and side-impact crashes dominate. A vehicle crosses your path with no time to react — slow down hard at every intersection.",
        type: "hbar",
        data: [
          { name: "Angular / side", value: 27.5, color: "#EF4444" },
          { name: "Head-on", value: 21.4, color: "#DC2626" },
          { name: "Out of control", value: 19.9, color: "#F97316" },
          { name: "Rear-end", value: 14.8, color: "#F59E0B" },
          { name: "Sideswipe", value: 8.9, color: "#EAB308" },
          { name: "Other types", value: 7.5, color: "#6B7280" },
        ],
      },
    ],
  },

  who: {
    id: "who",
    icon: "👤",
    label: "Who is most at risk",
    sub: "Demographics of fatalities",
    accentHex: "#34D399",
    tailwindText: "text-emerald-400",
    tailwindBorder: "border-emerald-500/20",
    tailwindBg: "bg-emerald-950/30",
    headline: "Young men aged 16–20 are the highest risk group",
    levels: [
      {
        title: "Gender & role",
        insight:
          "94% of those killed are male, and 89% are the rider (not a passenger). Being young, male, and in the saddle carries the highest risk.",
        type: "dual",
        labels: ["By gender", "By role"],
        data: [
          { name: "Male", value: 94, color: "#818CF8" },
          { name: "Female", value: 6, color: "#F472B6" },
        ],
        data2: [
          { name: "Rider", value: 89, color: "#F59E0B" },
          { name: "Passenger", value: 11, color: "#6B7280" },
        ],
      },
      {
        title: "Age group",
        insight:
          "16–20 year-olds make up 22.5% of all fatalities — inexperience, impulsiveness, and lack of formal training are the key risk factors.",
        type: "hbar",
        data: [
          { name: "16–20", value: 22.5, color: "#EF4444" },
          { name: "21–25", value: 17.3, color: "#F97316" },
          { name: "26–30", value: 9.4, color: "#F59E0B" },
          { name: "41–50", value: 9.9, color: "#EAB308" },
          { name: "51–60", value: 9.1, color: "#84CC16" },
          { name: "60+", value: 9.1, color: "#22C55E" },
          { name: "31–35", value: 6.4, color: "#22C55E" },
          { name: "36–40", value: 4.8, color: "#14B8A6" },
          { name: "11–15", value: 4.7, color: "#06B6D4" },
        ],
      },
      {
        title: "Motorcycle ownership",
        insight:
          "9 in 10 fatal crashes involve a privately owned motorcycle. The bike you ride every day carries the highest risk.",
        type: "pie",
        data: [
          { name: "Private / personal", value: 90, color: "#F59E0B" },
          { name: "Commercial / goods", value: 6, color: "#6B7280" },
          { name: "Services", value: 3, color: "#4B5563" },
          { name: "Government", value: 1, color: "#374151" },
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
    tailwindText: "text-pink-400",
    tailwindBorder: "border-pink-500/20",
    tailwindBg: "bg-pink-950/30",
    headline: "35% of riders killed had no valid licence",
    levels: [
      {
        title: "Helmet usage at time of crash",
        insight:
          "1 in 5 riders killed wore no helmet — and 63% of all fatal injuries are to the head. Always wear a properly fastened helmet.",
        type: "pie",
        data: [
          { name: "Properly worn", value: 76, color: "#22C55E" },
          { name: "Not wearing", value: 20, color: "#EF4444" },
          { name: "Worn but not strapped", value: 4, color: "#F97316" },
        ],
      },
      {
        title: "Licence status at time of crash",
        insight:
          "A licence isn't just paperwork — it represents training. Over a third of those killed had no licence at all.",
        type: "hbar",
        data: [
          { name: "No licence", value: 35, color: "#EF4444" },
          { name: "Full licence (>5 yrs)", value: 34, color: "#22C55E" },
          { name: "Full licence (<5 yrs)", value: 29, color: "#F59E0B" },
          { name: "L-plate (learner)", value: 2, color: "#F97316" },
        ],
      },
    ],
  },

  injury: {
    id: "injury",
    icon: "🤕",
    label: "Types of fatal injury",
    sub: "Body areas affected",
    accentHex: "#FB923C",
    tailwindText: "text-orange-400",
    tailwindBorder: "border-orange-500/20",
    tailwindBg: "bg-orange-950/30",
    headline: "63% of fatal injuries are to the head",
    levels: [
      {
        title: "Injury location on the body",
        insight:
          "Your helmet protects the body part most likely to kill you. It is your single most important piece of equipment — every single ride, no exceptions.",
        type: "pie",
        data: [
          { name: "Head", value: 63, color: "#EF4444" },
          { name: "Multiple areas", value: 20, color: "#F97316" },
          { name: "Chest", value: 9, color: "#F59E0B" },
          { name: "Neck", value: 4, color: "#EAB308" },
          { name: "Legs", value: 3, color: "#22C55E" },
          { name: "Hips", value: 1, color: "#16A34A" },
        ],
      },
    ],
  },
};

/* ─── CHART COMPONENTS ────────────────────────────────────────────── */

const RADIAN = Math.PI / 180;

const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }) => {
  if (percent < 0.06) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      style={{ fontSize: 11, fontWeight: 700 }}>
      {value}%
    </text>
  );
};

const ChartTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm shadow-xl">
      <p className="text-white font-semibold mb-0.5">{d.name || d.payload?.name}</p>
      <p className="font-bold" style={{ color: d.fill || d.color || "#F59E0B" }}>
        {d.value}%
      </p>
    </div>
  );
};

function PieViz({ data, size = 180 }) {
  return (
    <div className="flex gap-6 items-center flex-wrap">
      <div className="flex-shrink-0">
        <PieChart width={size} height={size}>
          <Pie data={data} cx={size / 2} cy={size / 2} outerRadius={size / 2 - 8}
            labelLine={false} label={PieLabel} dataKey="value">
            {data.map((e, i) => <Cell key={i} fill={e.color} />)}
          </Pie>
          <Tooltip content={<ChartTip />} />
        </PieChart>
      </div>
      <div className="flex flex-col gap-2.5 flex-1 min-w-32">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: d.color }} />
            <span className="text-gray-400 text-sm leading-tight">{d.name}</span>
            <span className="ml-auto text-white font-bold text-sm tabular-nums">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HBarViz({ data }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="flex flex-col gap-2.5">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="text-gray-400 text-sm text-right flex-shrink-0" style={{ width: 148 }}>
            {d.name}
          </div>
          <div className="flex-1 h-7 bg-gray-800 rounded overflow-hidden">
            <div
              className="h-full rounded flex items-center justify-end pr-2"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: d.color,
                minWidth: 32,
                transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
              }}
            >
              <span className="text-xs font-bold" style={{ color: "#000", textShadow: "none" }}>
                {d.value}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function HourViz({ data }) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 44 }}>
          <XAxis
            dataKey="name"
            tick={{ fill: "#6B7280", fontSize: 10 }}
            angle={-40}
            textAnchor="end"
            interval={0}
          />
          <YAxis tick={{ fill: "#4B5563", fontSize: 11 }} tickFormatter={v => `${v}%`} />
          <Tooltip content={<ChartTip />} />
          <Bar dataKey="value" radius={[3, 3, 0, 0]}>
            {data.map((e, i) => (
              <Cell
                key={i}
                fill={e.value >= 10 ? "#EF4444" : e.value >= 8 ? "#F59E0B" : "#374151"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-5 mt-1 text-xs text-gray-500">
        {[
          { color: "#EF4444", label: "High risk ≥10%" },
          { color: "#F59E0B", label: "Moderate 8–10%" },
          { color: "#374151", label: "Lower <8%" },
        ].map(item => (
          <span key={item.label} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block flex-shrink-0" style={{ background: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function DualViz({ labels, data, data2 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 text-center">{labels[0]}</p>
        <PieViz data={data} size={160} />
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 text-center">{labels[1]}</p>
        <PieViz data={data2} size={160} />
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ──────────────────────────────────────────────── */

export default function RiskInfographic() {
  const [selectedId, setSelectedId] = useState(null);
  const [level, setLevel] = useState(0);
  const [animKey, setAnimKey] = useState(0); // triggers re-animation on level change

  const cat = selectedId ? CATEGORIES[selectedId] : null;
  const currentLevel = cat ? cat.levels[level] : null;

  const selectCat = id => { setSelectedId(id); setLevel(0); setAnimKey(k => k + 1); };
  const goToLevel = l => { setLevel(l); setAnimKey(k => k + 1); };

  const goBack = () => {
    if (level > 0) goToLevel(level - 1);
    else { setSelectedId(null); setLevel(0); }
  };

  /* ── HOME SCREEN ── */
  if (!selectedId) {
    return (
      <div className="bg-gray-950 text-white min-h-screen p-6 font-sans">
        {/* Hero stats */}
        <div className="text-center mb-12 pt-4">
          <p className="text-xs tracking-widest text-gray-600 uppercase mb-5">
            Malaysia road safety · source data 2000–2009
          </p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3 leading-tight">
            Motorcycle fatalities<br />
            <span className="text-gray-500 font-light text-2xl sm:text-3xl">in Malaysia</span>
          </h1>
          <p className="text-gray-500 text-sm mb-10">
            Tap any category to explore the data. Each click reveals a deeper layer.
          </p>

          <div className="flex justify-center gap-8 sm:gap-14 flex-wrap mb-2">
            {[
              { val: "4,070", label: "fatalities in 2009 alone", color: "#EF4444" },
              { val: "60%",   label: "of all Malaysian road deaths", color: "#FBBF24" },
              { val: "#1",    label: "ASEAN fatality rate per capita", color: "#818CF8" },
              { val: "8/day", label: "average over 10 years",         color: "#34D399" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-black" style={{ color: s.color }}>
                  {s.val}
                </div>
                <div className="text-xs text-gray-600 mt-1 max-w-24">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Category grid */}
        <div
          className="grid gap-4 max-w-4xl mx-auto"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
        >
          {Object.values(CATEGORIES).map(c => (
            <button
              key={c.id}
              onClick={() => selectCat(c.id)}
              className={`${c.tailwindBg} border ${c.tailwindBorder} rounded-2xl p-6 text-left cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-opacity-60 focus:outline-none focus:ring-2`}
              style={{ focusRingColor: c.accentHex }}
            >
              <div className="text-3xl mb-4">{c.icon}</div>
              <div className={`text-xs tracking-widest uppercase mb-2 ${c.tailwindText}`}>{c.sub}</div>
              <div className="text-white font-bold text-lg mb-3 leading-snug">{c.label}</div>
              <div className="text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-3">
                {c.headline}
              </div>
              <div className={`mt-4 text-xs tracking-widest ${c.tailwindText} flex items-center gap-1`}>
                {c.levels.length} drill levels
                <span className="ml-1">→</span>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center mt-12 text-xs text-gray-800">
          Source: Manan &amp; Várhelyi (2012), IATSS Research · Malaysian Royal Police Department
        </p>
      </div>
    );
  }

  /* ── DETAIL / DRILL VIEW ── */
  return (
    <div className="bg-gray-950 text-white min-h-screen p-6 font-sans">
      <div className="max-w-3xl mx-auto">

        {/* Breadcrumb nav */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={goBack}
            className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
          >
            ← Back
          </button>
          <div className="text-sm text-gray-600 truncate">
            <button
              onClick={() => { setSelectedId(null); setLevel(0); }}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              Home
            </button>
            <span className="mx-2">/</span>
            <span style={{ color: cat.accentHex }}>{cat.icon} {cat.label}</span>
            {level > 0 && (
              <>
                <span className="mx-2 text-gray-700">/</span>
                <span className="text-gray-400">{currentLevel.title}</span>
              </>
            )}
          </div>
        </div>

        {/* Level progress bar */}
        <div className="flex gap-1.5 mb-8">
          {cat.levels.map((l, i) => (
            <button
              key={i}
              onClick={() => goToLevel(i)}
              title={l.title}
              className="flex-1 h-1 rounded-full transition-all duration-300 hover:opacity-80"
              style={{ background: i <= level ? cat.accentHex : "#1F2937" }}
            />
          ))}
        </div>

        {/* Level label & title */}
        <div className="mb-6" key={animKey}>
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: cat.accentHex }}>
            {cat.icon} {cat.label} · level {level + 1} of {cat.levels.length}
          </p>
          <h2 className="text-3xl sm:text-4xl font-black mb-5 leading-tight">
            {currentLevel.title}
          </h2>
          <div
            className="rounded-xl p-4 border"
            style={{
              background: `${cat.accentHex}10`,
              borderColor: `${cat.accentHex}30`,
            }}
          >
            <span className="font-semibold text-sm" style={{ color: cat.accentHex }}>
              Key insight:{" "}
            </span>
            <span className="text-gray-300 text-sm leading-relaxed">{currentLevel.insight}</span>
          </div>
        </div>

        {/* Chart area */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          {currentLevel.type === "pie" && <PieViz data={currentLevel.data} />}
          {currentLevel.type === "hbar" && <HBarViz data={currentLevel.data} />}
          {currentLevel.type === "hour" && <HourViz data={currentLevel.data} />}
          {currentLevel.type === "dual" && (
            <DualViz
              labels={currentLevel.labels}
              data={currentLevel.data}
              data2={currentLevel.data2}
            />
          )}
        </div>

        {/* Quick-jump to other levels */}
        {cat.levels.length > 1 && (
          <div className="flex gap-2 mb-4">
            {cat.levels.map((l, i) => (
              <button
                key={i}
                onClick={() => goToLevel(i)}
                className="flex-1 py-2 rounded-lg border text-xs transition-colors"
                style={
                  i === level
                    ? { background: cat.accentHex, borderColor: cat.accentHex, color: "#000", fontWeight: 700 }
                    : { background: "transparent", borderColor: "#1F2937", color: "#6B7280" }
                }
              >
                {i + 1}. {l.title.length > 18 ? l.title.slice(0, 18) + "…" : l.title}
              </button>
            ))}
          </div>
        )}

        {/* Primary CTA */}
        {level < cat.levels.length - 1 ? (
          <button
            onClick={() => goToLevel(level + 1)}
            className="w-full rounded-xl py-4 text-base font-black tracking-wider uppercase transition-opacity hover:opacity-90 focus:outline-none"
            style={{ background: cat.accentHex, color: "#000" }}
          >
            Drill deeper → {cat.levels[level + 1].title}
          </button>
        ) : (
          <button
            onClick={() => { setSelectedId(null); setLevel(0); }}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl py-4 text-gray-500 text-sm hover:bg-gray-800 transition-colors"
          >
            ← Back to all categories
          </button>
        )}

        <p className="text-center mt-8 text-xs text-gray-800">
          Source: Manan &amp; Várhelyi (2012), IATSS Research · Malaysian Royal Police 2000–2009
        </p>
      </div>
    </div>
  );
}
