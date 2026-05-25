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
        title: 'Road hierarchy',
        sub: 'Road type contribution',
        type: 'bar',

        data: [
          { name: 'Primary / arterial', value: 49.7, color: '#EF4444' },
          { name: 'Local street', value: 18.6, color: '#F97316' },
          { name: 'Secondary road', value: 16.5, color: '#F59E0B' },
          { name: 'Minor roads', value: 12.3, color: '#EAB308' },
          { name: 'Expressway', value: 3, color: '#94A3B8' },
        ],

        insight:
          'Primary and arterial roads account for almost half of all motorcycle fatalities.',
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

      {
        title: 'Day of week',
        sub: 'Weekly crash pattern',
        type: 'bar',

        data: [
          { name: 'Sunday', value: 15.8, color: '#EF4444' },
          { name: 'Monday', value: 15.3, color: '#F97316' },
          { name: 'Saturday', value: 14.7, color: '#F59E0B' },
          { name: 'Tuesday', value: 14.3, color: '#EAB308' },
          { name: 'Wednesday', value: 13.4, color: '#94A3B8' },
          { name: 'Thursday', value: 13.3, color: '#94A3B8' },
          { name: 'Friday', value: 13.2, color: '#94A3B8' },
        ],

        insight:
          'Weekend and transition days produce the highest fatality rates.',
      },

    ],
  },

  who: {
    label: 'WHO',
    icon: '👤',
    color: '#378ADD',
    big: '94%',
    bigDesc: 'of fatalities are male',

    mini: [
      ['Male riders', 94, '#378ADD'],
      ['Age 16–20', 22.5, '#EF4444'],
      ['Riders', 89, '#378ADD'],
    ],

    levels: [

      {
        title: 'Gender distribution',
        sub: 'Male vs female',
        type: 'pie',

        data: [
          { name: 'Male', value: 94, color: '#378ADD' },
          { name: 'Female', value: 6, color: '#EC4899' },
        ],

        insight:
          'Male riders dominate motorcycle fatality statistics across Malaysia.',
      },

      {
        title: 'Age group risk',
        sub: 'Fatality by age group',
        type: 'bar',

        data: [
          { name: '16–20', value: 22.5, color: '#EF4444' },
          { name: '21–25', value: 17.3, color: '#F97316' },
          { name: '26–30', value: 9.4, color: '#F59E0B' },
          { name: '41–50', value: 9.9, color: '#EAB308' },
          { name: '51–60', value: 9.1, color: '#94A3B8' },
        ],

        insight:
          'Young riders under 25 represent the highest-risk demographic.',
      },

      {
        title: 'Rider or passenger',
        sub: 'Motorcycle occupancy',
        type: 'pie',

        data: [
          { name: 'Rider', value: 89, color: '#EF4444' },
          { name: 'Passenger', value: 11, color: '#F59E0B' },
        ],

        insight:
          'Most fatalities are riders themselves rather than passengers.',
      },

    ],
  },

  how: {
    label: 'HOW',
    icon: '💥',
    color: '#E24B4A',
    big: '50%',
    bigDesc: 'caused by motorcyclists themselves',

    mini: [
      ['MC-at-fault', 50, '#EF4444'],
      ['Passenger car', 28, '#F59E0B'],
      ['Angular collision', 27.5, '#DC2626'],
    ],

    levels: [

      {
        title: 'Collision opponent',
        sub: 'Who they collided with',
        type: 'pie',

        data: [
          { name: 'Passenger car', value: 28, color: '#EF4444' },
          { name: 'MC vs MC', value: 25, color: '#F59E0B' },
          { name: 'Single crash', value: 25, color: '#FBBF24' },
          { name: 'Truck', value: 14, color: '#94A3B8' },
        ],

        insight:
          'Motorcyclists themselves contribute substantially to fatal crash causation.',
      },

      {
        title: 'Collision type',
        sub: 'Crash configuration',
        type: 'bar',

        data: [
          { name: 'Angular / side', value: 27.5, color: '#EF4444' },
          { name: 'Head-on', value: 21.4, color: '#F97316' },
          { name: 'Out of control', value: 19.9, color: '#F59E0B' },
          { name: 'Rear-end', value: 14.8, color: '#EAB308' },
        ],

        insight:
          'Angular and head-on crashes are among the deadliest motorcycle collision types.',
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
      ['No helmet', 24, '#F97316'],
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
          'Helmet quality and proper strapping remain critically important.',
      },

      {
        title: 'Licence status',
        sub: 'Licence category',
        type: 'pie',

        data: [
          { name: 'No licence', value: 35, color: '#EF4444' },
          { name: 'Full >5 years', value: 34, color: '#22C55E' },
          { name: 'Full <5 years', value: 29, color: '#F59E0B' },
          { name: 'Learner', value: 2, color: '#94A3B8' },
        ],

        insight:
          'A significant proportion of fatalities involve unlicensed or inexperienced riders.',
      },

    ],
  },

  injury: {
    label: 'INJURY',
    icon: '🤕',
    color: '#D4537E',
    big: '63%',
    bigDesc: 'die from head injuries',

    mini: [
      ['Head injuries', 63, '#EF4444'],
      ['Multiple body areas', 20, '#F59E0B'],
      ['Chest injuries', 9, '#94A3B8'],
    ],

    levels: [

      {
        title: 'Fatal injury location',
        sub: 'Body region distribution',
        type: 'pie',

        data: [
          { name: 'Head', value: 63, color: '#EF4444' },
          { name: 'Multiple areas', value: 20, color: '#F59E0B' },
          { name: 'Chest', value: 9, color: '#FBBF24' },
          { name: 'Neck', value: 4, color: '#94A3B8' },
          { name: 'Legs', value: 3, color: '#CBD5E1' },
        ],

        insight:
          'Head injuries remain the dominant fatal injury mechanism.',
      },

      {
        title: 'Helmet vs head injury',
        sub: 'Protection outcome',
        type: 'bar',

        data: [
          { name: 'Helmeted + head injury', value: 47, color: '#F59E0B' },
          { name: 'No helmet fatality', value: 20, color: '#EF4444' },
          { name: 'Helmeted + survived head', value: 33, color: '#22C55E' },
        ],

        insight:
          'Helmet standards and quality matter in addition to simple helmet use.',
      },

    ],
  },

};

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

    <ResponsiveContainer width="100%" height={320}>

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