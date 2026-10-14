"use client";

import { useState } from "react";
import Link from "next/link";

type Tab = "paper" | "data" | "evidence";

export default function PaperExplorerPage() {
  const [tab, setTab] = useState<Tab>("paper");
  const tabs: { id: Tab; label: string }[] = [
    { id: "paper", label: "Paper 1" },
    { id: "data", label: "Data" },
    { id: "evidence", label: "Evidence" },
  ];

  return (
    <main className="min-h-screen bg-[#070b12] px-4 pb-16 pt-28 text-slate-100 md:px-8">
      <div className="mx-auto max-w-6xl space-y-7">
        <header className="space-y-3">
          <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">← MCAS Research Platform</Link>
          <p className="pt-3 text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">Research workbench</p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Paper Explorer</h1>
          <p className="max-w-3xl text-slate-400">Explore a research paper alongside its data, methods and supporting evidence. This first interface is a scaffold; the full manuscript, figures and source-linked evidence still need to be connected.</p>
        </header>

        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3" role="tablist" aria-label="Paper Explorer sections">
          {tabs.map((item) => (
            <button key={item.id} role="tab" aria-selected={tab === item.id} onClick={() => setTab(item.id)}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${tab === item.id ? "bg-violet-400/15 text-violet-200 ring-1 ring-violet-300/40" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
              {item.label}
            </button>
          ))}
        </div>

        {tab === "paper" && (
          <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
            <article className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:p-8">
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-200">Paper content not yet linked</span>
              <h2 className="pt-2 text-2xl font-bold">Motorcycle fatigue and unsafe riding</h2>
              <p className="text-sm text-slate-400">Working paper workspace · manuscript source required</p>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Research focus</h3>
                <p className="leading-7 text-slate-300">This workspace is intended to connect the research question, measurement model, structural model, findings, figures and references in one navigable view. It is not a substitute for the manuscript: exact abstract text, numerical results and citations should be imported from the authoritative paper file.</p>
                <h3 className="pt-2 text-lg font-semibold">Planned reading sections</h3>
                <ol className="list-decimal space-y-2 pl-5 leading-6 text-slate-300">
                  <li>Abstract and research questions</li><li>Background and conceptual framework</li><li>Methods and measurement instruments</li><li>Results and interactive figures</li><li>Discussion, implications and limitations</li><li>References</li>
                </ol>
              </div>
            </article>
            <aside className="h-fit space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="font-semibold">Explorer status</h3>
              <Status label="Navigation tabs" value="Interactive" />
              <Status label="Manuscript text" value="Not connected" />
              <Status label="Figures and tables" value="Not connected" />
              <Status label="Clickable references" value="Not connected" />
              <p className="pt-2 text-xs leading-5 text-slate-500">To populate this reader accurately, connect the approved manuscript or source file rather than reconstructing exact findings from memory.</p>
            </aside>
          </section>
        )}

        {tab === "data" && (
          <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:p-8">
            <h2 className="text-xl font-bold">Data and analysis</h2>
            <p className="max-w-3xl leading-7 text-slate-300">This section will document the dataset, variable definitions, inclusion criteria, cleaning decisions, analysis scripts and model outputs that support the paper. Numeric values should be bound to the approved analysis outputs and not manually retyped into the interface.</p>
            <div className="grid gap-3 md:grid-cols-3">
              <Info title="Source dataset" body="Awaiting source file and provenance metadata." />
              <Info title="Analysis scripts" body="Connect the versioned R / lavaan outputs and analysis code." />
              <Info title="Reproducibility" body="Record dataset version, script version and output timestamp." />
            </div>
          </section>
        )}

        {tab === "evidence" && (
          <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:p-8">
            <h2 className="text-xl font-bold">Evidence explorer</h2>
            <p className="max-w-3xl leading-7 text-slate-300">Evidence cards will link each important claim to the exact table, figure, analysis output or reference that supports it. The purpose is to make the path from claim to evidence auditable.</p>
            <div className="grid gap-3 md:grid-cols-2">
              <Info title="Claim → result" body="Link a written claim to a table, figure or model output." />
              <Info title="Reference → source" body="Attach DOI or publisher links after bibliographic verification." />
            </div>
          </section>
        )}

        <footer className="border-t border-slate-800 pt-4 text-xs leading-5 text-slate-500">Interface scaffold only. The source manuscript, figures, analysis files and verified references have not yet been imported.</footer>
      </div>
    </main>
  );
}

function Status({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3 text-sm"><span className="text-slate-400">{label}</span><span className="text-right font-medium text-slate-200">{value}</span></div>;
}
function Info({ title, body }: { title: string; body: string }) {
  return <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{body}</p></div>;
}