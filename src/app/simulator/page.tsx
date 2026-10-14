"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { simulateMcasScenario, type Manoeuvre } from "@/lib/mcas-simulator/model";

const initial = {
  motorcycleSpeedKmh: 60,
  initialGapM: 25,
  leadVehicleSpeedKmh: 20,
  leadVehicleDecelMps2: 5,
  riderReactionS: 1.0,
  alertLeadTimeS: 0.4,
  riderDecelMps2: 4.0,
  roadFriction: 0.7,
  manoeuvre: "braking" as Manoeuvre,
  lateralShiftM: 1.2,
};

function Field({ label, value, min, max, step, unit, onChange }: {
  label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (n: number) => void;
}) {
  return <label className="block space-y-2">
    <span className="flex items-center justify-between gap-3 text-sm text-slate-300">
      <span>{label}</span><strong className="text-white tabular-nums">{value} {unit}</strong>
    </span>
    <input className="w-full accent-cyan-400" type="range" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(Number(e.target.value))} />
    <span className="flex justify-between text-xs text-slate-500"><span>{min} {unit}</span><span>{max} {unit}</span></span>
  </label>;
}

export default function MCASTrajectorySimulatorPage() {
  const [params, setParams] = useState(initial);
  const [showPath, setShowPath] = useState(true);
  const result = useMemo(() => simulateMcasScenario(params), [params]);
  const update = (key: keyof typeof initial, value: number | Manoeuvre) =>
    setParams((old) => ({ ...old, [key]: value }));
  const maxX = Math.max(40, ...result.points.map((p) => p.leadX));
  const minY = Math.min(-1.5, ...result.points.map((p) => p.lateralY)) - 1;
  const maxY = Math.max(1.5, ...result.points.map((p) => p.lateralY)) + 1;
  const chartW = 760, chartH = 220;
  const x = (v: number) => 25 + (v / maxX) * (chartW - 50);
  const y = (v: number) => chartH - 18 - ((v - minY) / (maxY - minY)) * (chartH - 36);
  const bikePath = result.points.map((p, i) => `${i ? "L" : "M"} ${x(p.bikeX)} ${y(p.lateralY)}`).join(" ");
  const leadPath = result.points.map((p, i) => `${i ? "L" : "M"} ${x(p.leadX)} ${y(0)}`).join(" ");
  const last = result.points[result.points.length - 1];

  return <main className="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-8">
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">← MCAS Research Platform</Link>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Research workbench · Prototype v0.1</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Collision Avoidance Simulator</h1>
          <p className="mt-3 max-w-3xl text-slate-400">Explore how initial speed, following gap, warning timing and rider response change a simplified motorcycle–vehicle encounter.</p>
        </div>
        <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-200">Synthetic · Not validated</span>
      </header>

      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between"><h2 className="font-semibold">Scenario parameters</h2><button onClick={() => setParams(initial)} className="text-xs text-cyan-300 hover:underline">Reset</button></div>
          <Field label="Motorcycle initial speed" value={params.motorcycleSpeedKmh} min={20} max={100} step={5} unit="km/h" onChange={(v) => update("motorcycleSpeedKmh", v)} />
          <Field label="Initial gap to lead vehicle" value={params.initialGapM} min={5} max={60} step={1} unit="m" onChange={(v) => update("initialGapM", v)} />
          <Field label="Lead vehicle speed" value={params.leadVehicleSpeedKmh} min={0} max={80} step={5} unit="km/h" onChange={(v) => update("leadVehicleSpeedKmh", v)} />
          <Field label="MCAS alert time from scenario start" value={params.alertLeadTimeS} min={0} max={2} step={0.1} unit="s" onChange={(v) => update("alertLeadTimeS", v)} />
          <Field label="Rider response delay after alert" value={params.riderReactionS} min={0.2} max={2.5} step={0.1} unit="s" onChange={(v) => update("riderReactionS", v)} />
          <Field label="Rider deceleration" value={params.riderDecelMps2} min={1} max={8} step={0.5} unit="m/s²" onChange={(v) => update("riderDecelMps2", v)} />
          <Field label="Road friction assumption" value={params.roadFriction} min={0.2} max={1} step={0.1} unit="μ" onChange={(v) => update("roadFriction", v)} />
          <label className="block space-y-2 text-sm text-slate-300">Avoidance response
            <select value={params.manoeuvre} onChange={(e) => update("manoeuvre", e.target.value as Manoeuvre)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white">
              <option value="braking">Braking only</option><option value="steering">Idealised steering shift</option><option value="combined">Combined (simplified)</option>
            </select>
          </label>
          {params.manoeuvre !== "braking" && <Field label="Illustrative lateral shift" value={params.lateralShiftM} min={0.3} max={2} step={0.1} unit="m" onChange={(v) => update("lateralShiftM", v)} />}
          <p className="text-xs leading-5 text-slate-500">Inputs are scenario assumptions, not measured MCAS event data. Alert time is user-defined; this prototype does not execute the production MCAS firmware.</p>
        </aside>

        <section className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Minimum longitudinal gap" value={`${result.minimumGapM.toFixed(1)} m`} />
            <Metric label="Closest approach time" value={`${result.minimumGapTimeS.toFixed(2)} s`} />
            <Metric label="Response begins" value={`${result.responseTimeS.toFixed(2)} s`} />
            <Metric label="Longitudinal overlap" value={result.collision ? "Detected" : "Not detected"} warning={result.collision} />
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">Trajectory overview</h2><p className="mt-1 text-xs text-slate-500">Position over time · longitudinal axis with illustrative lateral shift</p></div><label className="flex items-center gap-2 text-xs text-slate-400"><input type="checkbox" checked={showPath} onChange={(e) => setShowPath(e.target.checked)} /> Show trajectory</label></div>
            <div className="mt-4 overflow-x-auto">
              <svg viewBox={`0 0 ${chartW} ${chartH}`} role="img" aria-label="Simulated motorcycle and lead-vehicle trajectories" className="min-w-[560px] w-full">
                <defs><pattern id="grid" width="50" height="40" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.7" /></pattern></defs>
                <rect width={chartW} height={chartH} fill="url(#grid)" rx="8" />
                <line x1="25" y1={y(0)} x2={chartW-25} y2={y(0)} stroke="#475569" strokeDasharray="4 5" />
                {showPath && <><path d={bikePath} fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" /><path d={leadPath} fill="none" stroke="#fb923c" strokeWidth="3" strokeLinecap="round" /></>}
                <circle cx={x(last?.bikeX ?? 0)} cy={y(last?.lateralY ?? 0)} r="5" fill="#22d3ee" />
                <circle cx={x(last?.leadX ?? 0)} cy={y(0)} r="5" fill="#fb923c" />
                <text x="28" y="15" fill="#94a3b8" fontSize="10">Start</text><text x={chartW-90} y={chartH-4} fill="#94a3b8" fontSize="10">Distance →</text>
              </svg>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400"><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-cyan-400" />Motorcycle</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-orange-400" />Lead vehicle</span></div>
            <p className="mt-3 text-xs leading-5 text-slate-500">The lateral shift is illustrative only. Longitudinal overlap is not a complete 2D collision test, and the model does not represent motorcycle lean, tyre forces, steering stability or a validated evasive manoeuvre.</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
            <h2 className="font-semibold">Model record</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-950 p-3"><p className="text-xs text-slate-500">Model version</p><p className="mt-1 font-semibold">0.1.0</p></div>
              <div className="rounded-lg bg-slate-950 p-3"><p className="text-xs text-slate-500">Evidence class</p><p className="mt-1 font-semibold text-amber-200">Synthetic / unvalidated</p></div>
              <div className="rounded-lg bg-slate-950 p-3"><p className="text-xs text-slate-500">Final motorcycle speed</p><p className="mt-1 font-semibold">{result.finalBikeSpeedKmh.toFixed(1)} km/h</p></div>
            </div>
            <h3 className="mt-5 text-sm font-semibold text-slate-200">Assumptions and limitations</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-400">{result.assumptions.map((a) => <li key={a}>{a}</li>)}</ul>
            <button onClick={() => {
              const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const anchor = document.createElement("a"); anchor.href = url; anchor.download = "mcas-synthetic-scenario-v0.1.json"; anchor.click(); URL.revokeObjectURL(url);
            }} className="mt-5 rounded-lg border border-slate-700 px-4 py-2 text-sm text-cyan-200 hover:bg-slate-800">Export scenario JSON</button>
          </div>
        </section>
      </div>
      <footer className="border-t border-slate-800 pt-4 text-xs leading-5 text-slate-500">Research prototype for scenario exploration only. Not for rider training, safety-critical decisions or claims of MCAS effectiveness. No real event data are uploaded or stored.</footer>
    </div>
  </main>;
}

function Metric({ label, value, warning = false }: { label: string; value: string; warning?: boolean }) {
  return <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"><p className="text-xs text-slate-500">{label}</p><p className={`mt-2 text-xl font-bold tabular-nums ${warning ? "text-rose-300" : "text-white"}`}>{value}</p></div>;
}
