"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type ResponseMode = "brake" | "maintain" | "accelerate";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export default function TechnologyExplorer() {
  const [speed, setSpeed] = useState(60);
  const [leadSpeed, setLeadSpeed] = useState(38);
  const [distance, setDistance] = useState(52);
  const [response, setResponse] = useState<ResponseMode | null>(null);

  const relativeSpeed = Math.max(0, speed - leadSpeed);
  const ttc = relativeSpeed > 0 ? distance / (relativeSpeed / 3.6) : Infinity;

  const alert = useMemo(() => {
    if (!Number.isFinite(ttc)) return { label: "NO THREAT", tone: "green", detail: "The closing speed is zero or negative." };
    if (ttc > 12) return { label: "APPROACHING", tone: "green", detail: "There is time to recognise the developing situation." };
    if (ttc > 7) return { label: "ATTENTION", tone: "amber", detail: "The closing situation is becoming more important." };
    if (ttc > 3) return { label: "WARNING", tone: "orange", detail: "The available time to respond is narrowing." };
    return { label: "CRITICAL", tone: "red", detail: "Very little time remains before a potential conflict." };
  }, [ttc]);

  const leadScale = clamp(1.05 - distance / 110, 0.32, 1);
  const leadBottom = clamp(42 + (1 - distance / 110) * 38, 43, 80);

  const responseText: Record<ResponseMode, string> = {
    brake: "Braking increases the available separation and can reduce closing speed.",
    maintain: "Maintaining speed leaves the current closing relationship unchanged.",
    accelerate: "Accelerating increases closing speed and reduces the available time.",
  };

  const reset = () => {
    setSpeed(60);
    setLeadSpeed(38);
    setDistance(52);
    setResponse(null);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_75%_10%,rgba(14,165,233,0.13),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f1f5f9_100%)] pt-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-700">
              MCAS Technology Explorer · v0.1
            </div>
            <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              When should a motorcycle rider be warned?
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Experience the relationship between speed, distance and time to collision before we show you the technology behind it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#experience" className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-slate-800">
                Experience it
              </a>
              <Link href="/sem" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                Explore the research
              </Link>
            </div>
            <p className="mt-5 max-w-lg text-xs leading-5 text-slate-500">
              This is an explanatory simulation. It illustrates the TTC mechanism and alert logic; it is not a field-performance estimate.
            </p>
          </div>

          <ScenarioView ttc={ttc} alert={alert} speed={speed} distance={distance} leadBottom={leadBottom} leadScale={leadScale} />
        </div>
      </section>

      <section id="experience" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-14">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">01 · Explore the mechanism</div>
                <h2 className="mt-2 text-2xl font-black tracking-tight">Change the situation.</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                  TTC is driven by the distance to the object and the relative speed at which the motorcycle is closing on it.
                </p>
              </div>
              <button onClick={reset} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50">Reset</button>
            </div>

            <div className="mt-8 space-y-7">
              <Slider label="Motorcycle speed" value={speed} min={30} max={120} suffix=" km/h" onChange={setSpeed} />
              <Slider label="Lead vehicle speed" value={leadSpeed} min={0} max={100} suffix=" km/h" onChange={setLeadSpeed} />
              <Slider label="Following distance" value={distance} min={10} max={110} suffix=" m" onChange={setDistance} />
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <ResponseButton active={response === "brake"} onClick={() => setResponse("brake")} title="Brake" detail="Increase separation" />
              <ResponseButton active={response === "maintain"} onClick={() => setResponse("maintain")} title="Maintain" detail="Keep the current state" />
              <ResponseButton active={response === "accelerate"} onClick={() => setResponse("accelerate")} title="Accelerate" detail="Increase closing speed" />
            </div>

            {response && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                <span className="font-bold text-slate-900">Your choice:</span> {responseText[response]}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl sm:p-8">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-sky-400">02 · What the system sees</div>
            <h2 className="mt-2 text-2xl font-black tracking-tight">A changing safety margin.</h2>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <DarkMetric label="Relative speed" value={relativeSpeed + " km/h"} />
              <DarkMetric label="TTC" value={Number.isFinite(ttc) ? ttc.toFixed(1) + " s" : "∞"} />
              <DarkMetric label="Alert state" value={alert.label} />
              <DarkMetric label="Response" value={response ?? "not selected"} />
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Current interpretation</div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{alert.detail}</p>
            </div>
            <div className="mt-6 border-t border-white/10 pt-6">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">TTC calculation</div>
              <div className="mt-2 font-mono text-2xl font-black text-white">
                {Number.isFinite(ttc) ? distance + " ÷ " + (relativeSpeed / 3.6).toFixed(2) : "distance ÷ 0"}
              </div>
              <div className="mt-1 text-xs text-slate-500">distance ÷ relative speed in m/s</div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">03 · The important part</div>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">This isn&apos;t just a simulation.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              The interaction explains a mechanism. The next step is to connect that mechanism to the evidence gathered through MCAS research and field work.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <EvidenceCard value="125,960 km" label="cumulative pilot travel" />
            <EvidenceCard value="2,850 h" label="activation time" />
            <EvidenceCard value="1,013" label="collision-avoidance cases" />
            <EvidenceCard value="35" label="units deployed" />
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/timeline" className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800">Explore the evidence journey</Link>
            <Link href="/sem" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Explore the SEM</Link>
          </div>

          <p className="mt-5 max-w-2xl text-xs leading-5 text-slate-500">
            Field figures shown here are research-program figures and should be interpreted in the context of the underlying study methods and evidence. This page does not infer a causal effect from the simulator.
          </p>
        </div>
      </section>
    </main>
  );
}

function ScenarioView({ ttc, alert, speed, distance, leadBottom, leadScale }: any) {
  const toneClass = alert.tone === "red" ? "bg-red-400" : alert.tone === "orange" ? "bg-orange-400" : alert.tone === "amber" ? "bg-amber-400" : "bg-emerald-400";
  const progress = clamp(Number.isFinite(ttc) ? 100 - ttc * 4 : 8, 8, 100);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/70">
      <div className="relative h-[460px] overflow-hidden rounded-2xl bg-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#9cc9df_0%,#dce9df_30%,#64748b_30%,#334155_100%)]" />
        <div className="absolute inset-x-0 top-[29%] h-1 bg-white/40" />
        <div className="absolute bottom-0 left-1/2 h-[76%] w-[74%] -translate-x-1/2 bg-slate-600 [clip-path:polygon(22%_0,78%_0,100%_100%,0_100%)]" />
        <div className="absolute bottom-0 left-1/2 h-[76%] w-[3px] -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,transparent_0_28px,#f8fafc_28px_50px)] opacity-80" />
        <div className="absolute bottom-0 left-1/2 h-[76%] w-[42%] -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,transparent_0_46px,rgba(255,255,255,.32)_46px_49px)] opacity-70" />

        <div className="absolute left-1/2 z-10 transition-all duration-300" style={{ bottom: leadBottom + "%", transform: "translateX(-50%) scale(" + leadScale + ")" }}>
          <div className="relative h-16 w-28 rounded-[18px] bg-slate-100 shadow-xl">
            <div className="absolute left-3 right-3 top-2 h-7 rounded-xl bg-slate-500/80" />
            <div className="absolute -bottom-2 left-3 h-5 w-5 rounded-full bg-slate-900" />
            <div className="absolute -bottom-2 right-3 h-5 w-5 rounded-full bg-slate-900" />
            <div className="absolute bottom-2 left-2 h-2 w-3 rounded bg-red-400" />
            <div className="absolute bottom-2 right-2 h-2 w-3 rounded bg-red-400" />
          </div>
        </div>

        <div className="absolute bottom-[12%] left-1/2 z-20 -translate-x-1/2">
          <div className="relative h-24 w-14">
            <div className="absolute left-1/2 top-0 h-14 w-5 -translate-x-1/2 rounded-full bg-slate-950" />
            <div className="absolute left-1/2 top-9 h-12 w-10 -translate-x-1/2 rounded-t-[18px] bg-sky-600" />
            <div className="absolute bottom-0 left-1/2 h-14 w-2 -translate-x-1/2 rounded-full bg-slate-950" />
            <div className="absolute left-1/2 top-8 h-2 w-14 -translate-x-1/2 rounded bg-slate-950" />
          </div>
        </div>

        <div className="absolute left-4 top-4 rounded-xl border border-white/20 bg-slate-950/65 px-3 py-2 text-xs text-white backdrop-blur">
          <div className="font-bold tracking-wide">LIVE SCENARIO</div>
          <div className="mt-1 text-slate-300">Motorcycle following a vehicle</div>
        </div>

        <div className="absolute right-4 top-4 min-w-32 rounded-xl border border-white/20 bg-slate-950/75 p-3 text-white backdrop-blur">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Alert state</div>
          <div className="mt-1 text-lg font-black">{alert.label}</div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
            <div className={"h-full rounded-full transition-all " + toneClass} style={{ width: progress + "%" }} />
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
          <Metric label="Speed" value={speed + " km/h"} />
          <Metric label="Distance" value={distance + " m"} />
          <Metric label="TTC" value={Number.isFinite(ttc) ? ttc.toFixed(1) + " s" : "∞"} emphasis />
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return <div className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-white backdrop-blur">
    <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{label}</div>
    <div className={"mt-0.5 font-mono text-sm font-black " + (emphasis ? "text-sky-300" : "")}>{value}</div>
  </div>;
}

function DarkMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</div>
    <div className="mt-2 font-mono text-lg font-black text-white">{value}</div>
  </div>;
}

function Slider({ label, value, min, max, suffix, onChange }: { label: string; value: number; min: number; max: number; suffix: string; onChange: (value: number) => void }) {
  return <label className="block">
    <div className="mb-2 flex items-center justify-between text-sm">
      <span className="font-semibold text-slate-700">{label}</span>
      <span className="font-mono font-black text-slate-950">{value}{suffix}</span>
    </div>
    <input type="range" min={min} max={max} step={1} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-sky-600" />
    <div className="mt-1 flex justify-between text-[10px] font-medium text-slate-400"><span>{min}{suffix}</span><span>{max}{suffix}</span></div>
  </label>;
}

function ResponseButton({ active, onClick, title, detail }: { active: boolean; onClick: () => void; title: string; detail: string }) {
  return <button onClick={onClick} className={"rounded-2xl border p-4 text-left transition " + (active ? "border-sky-500 bg-sky-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50")}>
    <div className={"text-sm font-black " + (active ? "text-sky-700" : "text-slate-900")}>{title}</div>
    <div className="mt-1 text-xs leading-5 text-slate-500">{detail}</div>
  </button>;
}

function EvidenceCard({ value, label }: { value: string; label: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <div className="font-mono text-2xl font-black tracking-tight text-slate-950">{value}</div>
    <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</div>
  </div>;
}
