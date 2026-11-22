"use client";
import { useState } from "react";

type Findings = { total: number; expertise: { label: string; count: number }[]; interests: { label: string; count: number }[] };

export default function HubFindingsPage() {
  const [code, setCode] = useState("");
  const [findings, setFindings] = useState<Findings | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function unlock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch("/api/hub/findings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to open HUB Findings.");
      setFindings(result.findings);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to load findings."); }
    finally { setLoading(false); }
  }

  const bars = (items: Findings["expertise"]) => items.map((item) => (
    <div key={item.label} className="mb-4">
      <div className="mb-1 flex justify-between gap-4 text-sm"><span className="text-slate-300">{item.label}</span><span className="font-mono text-sky-300">{item.count}</span></div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-sky-500" style={{ width: `${findings ? item.count / findings.total * 100 : 0}%` }} /></div>
    </div>
  ));

  return <main className="min-h-screen bg-[#070b12] px-5 pb-20 pt-32 text-slate-100"><div className="mx-auto max-w-4xl">
    <p className="font-mono text-xs uppercase tracking-[0.25em] text-sky-400">HUB CENTRE · SHARED INSIGHTS</p>
    <h1 className="mt-3 text-4xl font-black text-white">HUB Findings</h1>
    <p className="mt-3 text-slate-300">Different strengths. Shared purpose. Safer roads.</p>
    <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-400">A shared view of our collective capabilities and research interests. This page displays aggregated patterns only; individual submissions and verbatim answers are not available here.</p>
    {!findings && <form onSubmit={unlock} className="mt-8 max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <label className="mb-2 block text-sm font-semibold text-white" htmlFor="findings-code">HUB Findings access code</label>
      <input id="findings-code" type="password" autoComplete="current-password" value={code} onChange={e=>setCode(e.target.value)} required className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500" />
      {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
      <button disabled={loading} className="mt-4 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-slate-950 disabled:opacity-50">{loading ? "Opening…" : "View shared findings"}</button>
    </form>}
    {findings && <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"><p className="text-sm text-slate-400">Responses received</p><p className="mt-2 text-4xl font-black text-white">{findings.total}</p><p className="mt-2 text-xs text-slate-500">Participation count only; not a measure of staff performance.</p></div>
      {findings.total < 5 ? <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-100">Findings will appear when at least five responses have been received. Small-group data is suppressed to protect confidentiality.</p> : <>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"><h2 className="mb-5 text-lg font-bold text-white">Collective expertise</h2>{bars(findings.expertise)}</section>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"><h2 className="mb-5 text-lg font-bold text-white">Research interests</h2>{bars(findings.interests)}</section>
      </>}
      <button onClick={()=>{setFindings(null);setCode("");}} className="text-sm text-slate-400 underline">Close findings</button>
    </div>}
  </div></main>;
}
