"use client";

import { useMemo, useState, type FormEvent } from "react";

type Item = { label: string; count: number };
type Findings = { total: number; expertise: Item[]; interests: Item[] };

const sections = [
  { id: "overview", label: "Overview" },
  { id: "capabilities", label: "Our capabilities" },
  { id: "interests", label: "Research interests" },
  { id: "reflection", label: "Looking ahead" },
];

function Distribution({ items, total, emptyLabel }: { items: Item[]; total: number; emptyLabel: string }) {
  const max = Math.max(1, ...items.map((item) => item.count));
  if (!items.length) return <p className="rounded-xl border border-dashed border-slate-700 p-5 text-sm text-slate-400">{emptyLabel}</p>;
  return <div className="space-y-5">{items.map((item) => (
    <div key={item.label}>
      <div className="mb-2 flex items-start justify-between gap-4 text-sm">
        <span className="leading-5 text-slate-200">{item.label}</span>
        <span className="shrink-0 font-mono text-sky-300">{item.count} <span className="text-slate-500">/ {total}</span></span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-400" style={{ width: `${(item.count / max) * 100}%` }} />
      </div>
      <p className="mt-1 text-right text-xs text-slate-500">{Math.round((item.count / total) * 100)}% of respondents</p>
    </div>
  ))}</div>;
}

export default function HubFindingsPage() {
  const [code, setCode] = useState("");
  const [findings, setFindings] = useState<Findings | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  async function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/hub/findings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to open HUB Findings.");
      setFindings(result.findings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load findings.");
    } finally {
      setLoading(false);
    }
  }

  const totalTopics = useMemo(() => findings ? findings.expertise.length + findings.interests.length : 0, [findings]);

  return (
    <main className="min-h-screen bg-[#070b12] px-4 pb-24 pt-28 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-950/70 via-slate-900 to-[#0b111b] p-6 sm:p-10">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-cyan-400/10" />
          <div className="absolute -right-5 -top-9 h-44 w-44 rounded-full border border-cyan-400/10" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-300">HUB CENTRE · COLLECTIVE INTELLIGENCE</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">HUB Findings</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">Understanding our collective capabilities, research interests and the questions that may shape our next chapter.</p>
          <div className="mt-7 flex flex-wrap gap-2 text-xs text-slate-400">
            <span className="rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1.5">Evidence first</span>
            <span className="rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1.5">Collective reflection</span>
            <span className="rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1.5">Future readiness</span>
          </div>
        </header>

        {!findings && (
          <section className="mt-8 grid gap-6 md:grid-cols-[1.1fr_.9fr]">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
              <p className="text-sm font-semibold text-cyan-300">A shared picture of our team</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Start with what we know.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">Explore aggregated patterns from the staff capability survey. The purpose is to understand the collective picture, recognise areas of strength and open a constructive conversation about what comes next.</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-950/70 p-4"><p className="text-2xl font-bold text-white">01</p><p className="mt-1 text-sm text-slate-300">What we bring</p></div>
                <div className="rounded-xl bg-slate-950/70 p-4"><p className="text-2xl font-bold text-white">02</p><p className="mt-1 text-sm text-slate-300">What interests us</p></div>
                <div className="rounded-xl bg-slate-950/70 p-4"><p className="text-2xl font-bold text-white">03</p><p className="mt-1 text-sm text-slate-300">What we may be missing</p></div>
                <div className="rounded-xl bg-slate-950/70 p-4"><p className="text-2xl font-bold text-white">04</p><p className="mt-1 text-sm text-slate-300">What we could create</p></div>
              </div>
            </div>
            <form onSubmit={unlock} className="self-center rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-widest text-slate-500">Shared access</p>
              <h2 className="mt-2 text-xl font-bold text-white">Open the findings</h2>
              <label className="mb-2 mt-6 block text-sm font-semibold text-slate-200" htmlFor="findings-code">HUB Findings access code</label>
              <input id="findings-code" type="password" autoComplete="current-password" value={code} onChange={(e) => setCode(e.target.value)} required className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" />
              {error && <p role="alert" className="mt-3 text-sm text-rose-300">{error}</p>}
              <button disabled={loading} className="mt-4 w-full rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50">{loading ? "Opening findings…" : "Explore HUB Findings"}</button>
              <p className="mt-4 text-xs leading-5 text-slate-500">This shared view contains aggregated patterns only. Individual submissions and verbatim answers are not displayed.</p>
            </form>
          </section>
        )}

        {findings && (
          <>
            <nav aria-label="Findings sections" className="sticky top-16 z-20 mt-6 flex gap-2 overflow-x-auto rounded-2xl border border-slate-800 bg-[#0b111b]/95 p-2 backdrop-blur">
              {sections.map((section) => <a key={section.id} href={`#${section.id}`} onClick={() => setActiveSection(section.id)} className={`shrink-0 rounded-xl px-4 py-2.5 text-sm transition ${activeSection === section.id ? "bg-cyan-400 font-semibold text-slate-950" : "text-slate-300 hover:bg-slate-800"}`}>{section.label}</a>)}
            </nav>

            <section id="overview" className="scroll-mt-36 pt-8">
              <div className="mb-4"><p className="font-mono text-xs uppercase tracking-widest text-cyan-300">01 · The collective picture</p><h2 className="mt-2 text-2xl font-bold text-white">A starting point for understanding ourselves</h2></div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"><p className="text-sm text-slate-400">Responses received</p><p className="mt-2 text-4xl font-black text-white">{findings.total}</p><p className="mt-2 text-xs text-slate-500">Participation count, not a performance measure.</p></div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"><p className="text-sm text-slate-400">Expertise themes shown</p><p className="mt-2 text-4xl font-black text-white">{findings.expertise.length}</p><p className="mt-2 text-xs text-slate-500">Themes meeting the confidentiality threshold.</p></div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"><p className="text-sm text-slate-400">Interest themes shown</p><p className="mt-2 text-4xl font-black text-white">{findings.interests.length}</p><p className="mt-2 text-xs text-slate-500">Themes meeting the confidentiality threshold.</p></div>
              </div>
              {findings.total < 5 && <div className="mt-5 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-5 text-sm leading-6 text-amber-100">The response count is currently below the minimum threshold for displaying topic distributions. This protects confidentiality where groups are small. The aggregate charts will appear when at least five responses have been received.</div>}
            </section>

            {findings.total >= 5 && <>
              <section id="capabilities" className="scroll-mt-36 pt-12">
                <div className="mb-5"><p className="font-mono text-xs uppercase tracking-widest text-cyan-300">02 · Our people</p><h2 className="mt-2 text-2xl font-bold text-white">Collective capabilities</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">A view of expertise reported through the survey. Counts indicate how many respondents selected each theme; respondents may select more than one.</p></div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8"><Distribution items={findings.expertise} total={findings.total} emptyLabel="No expertise category currently meets the reporting threshold." /></div>
              </section>
              <section id="interests" className="scroll-mt-36 pt-12">
                <div className="mb-5"><p className="font-mono text-xs uppercase tracking-widest text-cyan-300">03 · Our direction</p><h2 className="mt-2 text-2xl font-bold text-white">Research interests</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">The topics attracting research interest across the team. This is an indication of reported interest, not a measure of current institutional capability.</p></div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8"><Distribution items={findings.interests} total={findings.total} emptyLabel="No research-interest category currently meets the reporting threshold." /></div>
              </section>
            </>}

            <section id="reflection" className="scroll-mt-36 pt-12">
              <div className="mb-5"><p className="font-mono text-xs uppercase tracking-widest text-violet-300">04 · Questions for discussion</p><h2 className="mt-2 text-2xl font-bold text-white">Looking beyond the survey</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">These are prompts for collective reflection, not conclusions generated by the survey.</p></div>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["Strengths", "Where do we see areas of genuine collective strength, and how might these capabilities be connected?"],
                  ["Underutilised potential", "Are there skills or experiences within the team that could be applied more effectively?"],
                  ["People and mobility", "Are the needs of young and novice road users, older people, persons with disabilities, commuters and gig riders sufficiently reflected in our research?"],
                  ["Future readiness", "What human factors and mobility challenges should we be preparing to understand over the next five to ten years?"],
                  ["Evidence", "What data, methods, partnerships or field evidence would help us answer these questions?"],
                  ["Contribution", "Which ideas could become a practical study, tool, pilot, evidence product or policy contribution?"],
                ].map(([title, question], index) => <article key={title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><p className="font-mono text-xs text-violet-300">DISCUSSION {String(index + 1).padStart(2, "0")}</p><h3 className="mt-3 text-lg font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{question}</p></article>)}
              </div>
              <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6"><p className="font-mono text-xs uppercase tracking-widest text-cyan-300">The intended outcome</p><h3 className="mt-2 text-xl font-bold text-white">From collective insight to shared opportunities</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">The purpose is not to rank individuals or label the team as having deficiencies. It is to build a shared understanding of what we bring, what deserves further exploration and where our collective contribution could make a meaningful difference.</p></div>
            </section>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-6"><p className="text-xs text-slate-500">Aggregated survey findings · Small-group categories are suppressed to protect confidentiality.</p><button onClick={() => { setFindings(null); setCode(""); }} className="text-sm text-slate-400 underline decoration-slate-600 underline-offset-4 hover:text-white">Close findings</button></div>
          </>
        )}
      </div>
    </main>
  );
}
