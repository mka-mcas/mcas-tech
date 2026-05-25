'use client';

import { useState } from 'react';

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
} from 'recharts';

const DATA = {
  where: {
    label: 'WHERE',
    icon: '📍',
    color: '#EF9F27',
    big: '61%',
    bigDesc: 'of crashes in rural areas',

    mini: [
      ['Rural roads', 61, '#EF4444'],
      ['Primary roads', 49.7, '#F59E0B'],
      ['Straight sections', 66, '#DC2626'],
    ],

    levels: [
      {
        title: 'Where do crashes happen?',
        sub: 'Area type distribution',
        type: 'pie',

        data: [
          { name: 'Rural', value: 61, color: '#EF4444' },
          { name: 'Small town', value: 19, color: '#F59E0B' },
          { name: 'Town', value: 12, color: '#FBBF24' },
          { name: 'City', value: 8, color: '#22C55E' },
        ],

        insight:
          'Rural roads account for the majority of motorcycle fatalities despite lower traffic volume.',
      },

      {
        title: 'Road geometry',
        sub: 'Crash location geometry',
        type: 'bar',

        data: [
          { name: 'Straight', value: 66, color: '#EF4444' },
          { name: 'T-junction', value: 14.3, color: '#F97316' },
          { name: 'Curve', value: 13.5, color: '#F59E0B' },
          { name: 'Cross junction', value: 5, color: '#EAB308' },
        ],

        insight:
          'Straight roads kill far more riders than curves because they encourage speed adaptation.',
      },
    ],
  },

  when: {
    label: 'WHEN',
    icon: '🕐',
    color: '#7F77DD',
    big: '35%',
    bigDesc: 'of crashes occur 4–10 pm',

    mini: [
      ['Evening peak', 35, '#7F77DD'],
      ['Weekend days', 31, '#8B5CF6'],
      ['Clear weather', 93, '#22C55E'],
    ],

    levels: [
      {
        title: 'Hour of day',
        sub: 'Fatality distribution',

        type: 'hour',

        data: [
          { name: '12–2am', value: 8.3 },
          { name: '2–4am', value: 4.5 },
          { name: '4–6am', value: 3.9 },
          { name: '6–8am', value: 8.8 },
          { name: '8–10am', value: 7.7 },
          { name: '10–12pm', value: 6.7 },
          { name: '12–2pm', value: 8.2 },
          { name: '2–4pm', value: 8.3 },
          { name: '4–6pm', value: 10.2 },
          { name: '6–8pm', value: 12.4 },
          { name: '8–10pm', value: 12.7 },
          { name: '10–12am', value: 8.5 },
        ],

        insight:
          'The most dangerous riding period is between 4 pm and 10 pm.',
      },
    ],
  },

  gear: {
    label: 'GEAR & LICENCE',
    icon: '🛡️',
    color: '#1D9E75',
    big: '35%',
    bigDesc: 'had no valid licence',

    mini: [
      ['No licence', 35, '#EF4444'],
      ['No / improper helmet', 24, '#F97316'],
      ['Head injuries', 63, '#F59E0B'],
    ],

    levels: [
      {
        title: 'Helmet use',
        sub: 'Helmet compliance',

        type: 'pie',

        data: [
          { name: 'Correctly worn', value: 76, color: '#22C55E' },
          { name: 'Not wearing', value: 20, color: '#EF4444' },
          { name: 'Not strapped', value: 4, color: '#F97316' },
        ],

        insight:
          'Helmet quality and correct strapping are critical for reducing fatal head injury.',
      },
    ],
  },
};

function PieViz({ data }) {

  return (

    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 items-center">

      <div className="flex justify-center">

        <PieChart width={220} height={220}>

          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={90}
          >

            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}

          </Pie>

          <Tooltip />

        </PieChart>

      </div>

      <div className="flex flex-col gap-3">

        {data.map((d, i) => (

          <div key={i} className="flex items-center gap-3">

            <div
              className="w-3 h-3 rounded-sm"
              style={{
                background: d.color,
              }}
            />

            <div className="text-sm text-zinc-600">
              {d.name}
            </div>

            <div className="ml-auto text-sm font-black">
              {d.value}%
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

function BarViz({ data }) {

  return (

    <div className="flex flex-col gap-4">

      {data.map((d, i) => (

        <div
          key={i}
          className="grid grid-cols-[120px_1fr] gap-4 items-center"
        >

          <div className="text-xs text-zinc-500">
            {d.name}
          </div>

          <div className="h-7 bg-zinc-100 rounded-xl overflow-hidden">

            <div
              className="h-full rounded-xl flex items-center justify-end px-3"
              style={{
                width: `${d.value}%`,
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

function HourViz({ data }) {

  return (

    <ResponsiveContainer width="100%" height={280}>

      <BarChart data={data}>

        <XAxis
          dataKey="name"
          tick={{
            fontSize: 10,
            fill: '#71717A',
          }}
          angle={-35}
          textAnchor="end"
          interval={0}
        />

        <YAxis
          tick={{
            fontSize: 11,
            fill: '#71717A',
          }}
        />

        <Tooltip />

        <Bar dataKey="value">

          {data.map((d, i) => (

            <Cell
              key={i}
              fill={
                d.value >= 10
                  ? '#EF4444'
                  : d.value >= 8
                  ? '#F59E0B'
                  : '#94A3B8'
              }
            />

          ))}

        </Bar>

      </BarChart>

    </ResponsiveContainer>
  );
}

export default function RiskInfographic({
  theme = 'light',
}) {

  const [selected, setSelected] = useState(null);

  const [level, setLevel] = useState(0);

  const isDark = theme === 'dark';

  const bg = isDark
    ? 'bg-zinc-950'
    : 'bg-white';

  const border = isDark
    ? 'border-zinc-800'
    : 'border-zinc-200';

  const muted = isDark
    ? 'text-zinc-400'
    : 'text-zinc-600';

  const text = isDark
    ? 'text-white'
    : 'text-zinc-900';

  const card = isDark
    ? 'bg-zinc-900 border-zinc-800'
    : 'bg-white border-zinc-200';

  const current =
    selected
      ? DATA[selected]
      : null;

  const currentLevel =
    current
      ? current.levels[level]
      : null;

  return (

    <div className={`${bg} ${text}`}>

      {/* HEADER */}

      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">

        <div>

          <div className={`text-xs uppercase tracking-[0.2em] ${muted}`}>
            Motorcycle fatality risk — Malaysia
          </div>

          <div className={`text-xs mt-1 ${muted}`}>
            Source: PDRM · MIROS · WHO · Manan & Várhelyi (2012)
          </div>

        </div>

      </div>

      {/* KPI ROW */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        {[
          {
            val: '6,745',
            label: 'road deaths in 2009',
            color: '#EF4444',
          },

          {
            val: '60%',
            label: 'of fatalities involve motorcyclists',
            color: '#F59E0B',
          },

          {
            val: '4,070',
            label: 'motorcycle deaths in 2009',
            color: '#7F77DD',
          },
        ].map((kpi) => (

          <div
            key={kpi.label}
            className={`rounded-2xl border p-5 ${card}`}
          >

            <div
              className="text-3xl font-black"
              style={{
                color: kpi.color,
              }}
            >
              {kpi.val}
            </div>

            <div className={`text-xs mt-2 leading-relaxed ${muted}`}>
              {kpi.label}
            </div>

          </div>

        ))}

      </div>

      {/* CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

        {Object.entries(DATA).map(([id, c]) => (

          <button
            key={id}
            onClick={() => {
              setSelected(id);
              setLevel(0);
            }}
            className={`
              rounded-2xl border p-5 text-left transition-all
              hover:-translate-y-0.5
              ${card}
            `}
            style={{
              borderColor:
                selected === id
                  ? c.color
                  : undefined,
            }}
          >

            <div
              className="text-xs uppercase tracking-[0.2em] font-bold mb-3"
              style={{
                color: c.color,
              }}
            >
              {c.icon} {c.label}
            </div>

            <div
              className="text-4xl font-black mb-2"
              style={{
                color: c.color,
              }}
            >
              {c.big}
            </div>

            <div className={`text-xs mb-5 leading-relaxed ${muted}`}>
              {c.bigDesc}
            </div>

            <div className="flex flex-col gap-3">

              {c.mini.map(([label, value, color]) => (

                <div
                  key={label}
                  className="grid grid-cols-[90px_1fr_40px] gap-3 items-center"
                >

                  <div className={`text-[10px] leading-tight ${muted}`}>
                    {label}
                  </div>

                  <div className="h-1.5 rounded-full bg-zinc-200 overflow-hidden">

                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${value}%`,
                        background: color,
                      }}
                    />

                  </div>

                  <div
                    className="text-[10px] font-bold text-right"
                    style={{
                      color,
                    }}
                  >
                    {value}%
                  </div>

                </div>

              ))}

            </div>

          </button>

        ))}

      </div>

      {/* INLINE PANEL */}

      {current && (

        <div
          className={`
            rounded-3xl border mt-5 overflow-hidden
            ${card}
          `}
          style={{
            borderColor: current.color,
          }}
        >

          {/* PANEL HEADER */}

          <div className={`border-b p-5 ${border}`}>

            <div className="flex items-start justify-between gap-4 flex-wrap">

              <div>

                <div
                  className="text-xs uppercase tracking-[0.2em] font-bold mb-2"
                  style={{
                    color: current.color,
                  }}
                >
                  {current.icon} {current.label}
                </div>

                <h3 className="text-xl font-black mb-1">
                  {currentLevel.title}
                </h3>

                <div className={`text-sm ${muted}`}>
                  {currentLevel.sub}
                </div>

              </div>

              <button
                onClick={() => setSelected(null)}
                className={`
                  px-4 py-2 rounded-xl border text-sm
                  ${card}
                `}
              >
                Close
              </button>

            </div>

          </div>

          {/* PANEL CONTENT */}

          <div className="p-6">

            {currentLevel.type === 'pie' && (
              <PieViz data={currentLevel.data} />
            )}

            {currentLevel.type === 'bar' && (
              <BarViz data={currentLevel.data} />
            )}

            {currentLevel.type === 'hour' && (
              <HourViz data={currentLevel.data} />
            )}

            {/* INSIGHT */}

            <div
              className="rounded-2xl p-5 mt-6 text-sm leading-relaxed"
              style={{
                background: `${current.color}12`,
                borderLeft: `4px solid ${current.color}`,
              }}
            >
              {currentLevel.insight}
            </div>

          </div>

          {/* PANEL NAV */}

          <div className={`border-t p-5 flex items-center justify-between ${border}`}>

            <div className={`text-xs ${muted}`}>
              Level {level + 1} of {current.levels.length}
            </div>

            <div className="flex gap-3">

              <button
                disabled={level === 0}
                onClick={() => setLevel(level - 1)}
                className={`
                  px-4 py-2 rounded-xl border text-sm disabled:opacity-40
                  ${card}
                `}
              >
                ← Back
              </button>

              <button
                disabled={level >= current.levels.length - 1}
                onClick={() => setLevel(level + 1)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-40"
                style={{
                  background: current.color,
                }}
              >
                Drill deeper →
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}