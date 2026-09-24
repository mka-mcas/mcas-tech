"use client";

import React, { useMemo, useState } from "react";
import { ArrowDownRight, ChevronRight, Info, Network, Route, Sigma, SlidersHorizontal, X } from "lucide-react";
import { constructs, covariance, fit, paths, sequentialIndirect, type Construct, type SemPath } from "@/data/sem-data";

type Tab = "model" | "structural" | "measurement" | "journey";
type Detail = { kind: "path"; item: SemPath } | { kind: "construct"; item: Construct } | { kind: "covariance" } | { kind: "journey"; key: string } | null;

const pos: Record<string, {x:number;y:number}> = {
  motivation:{x:110,y:330}, prolong:{x:315,y:270}, kurang:{x:530,y:175},
  physical:{x:750,y:100}, mental:{x:750,y:290}, unsafe:{x:1030,y:205}
};

const pathColor = (p: SemPath) => p.p < .05 ? (p.beta < 0 ? "#fb7185" : "#38bdf8") : "#64748b";

function fmt(n:number, digits=3){ return n.toFixed(digits).replace(/^-0\.000$/,"0.000"); }
function pLabel(p:number|string){ return typeof p==="string" ? p : p < .001 ? "<.001" : p.toFixed(3).replace(/^0/,""); }

export default function InteractiveSEM(){
  const [tab,setTab]=useState<Tab>("model");
  const [detail,setDetail]=useState<Detail>(null);
  const [std,setStd]=useState(true);

  const visiblePaths = useMemo(()=> tab==="measurement" ? [] : paths, [tab]);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100">
      <header className="border-b border-slate-800/80 bg-[#0b101b]/95">
        <div className="mx-auto max-w-[1500px] px-5 pb-5 pt-28 md:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.25em] text-sky-400"><Network size={14}/> Interactive SEM Explorer</div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">From model diagram to statistical story.</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400 md:text-base">Explore the locked final SEM one relationship at a time. Tap a construct, path, indicator or covariance to see what the model actually estimates.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center md:grid-cols-4">
              {[["N",fit.n],["CFI",fit.cfi.toFixed(3)],["RMSEA",fit.rmsea.toFixed(3)],["SRMR",fit.srmr.toFixed(3)]].map(([k,v])=><div key={k} className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3"><div className="text-[10px] uppercase tracking-widest text-slate-500">{k}</div><div className="mt-1 font-mono text-lg text-white">{v}</div></div>)}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-5 py-6 md:px-8">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {([["model","Full model"],["structural","Structural"],["measurement","Measurement"],["journey","Model journey"]] as [Tab,string][]).map(([id,label])=>
            <button key={id} onClick={()=>setTab(id)} className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${tab===id ? "border-sky-400/50 bg-sky-400/10 text-sky-300":"border-slate-800 bg-slate-900 text-slate-400 hover:text-white"}`}>{label}</button>
          )}
          <div className="ml-auto flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs">
            <SlidersHorizontal size={13} className="text-slate-500"/>
            <span className="text-slate-500">Coefficient</span>
            <button onClick={()=>setStd(!std)} className="font-mono text-sky-300">{std ? "Std. β" : "Estimate"}</button>
          </div>
        </div>

        {tab==="journey" ? <Journey onOpen={(key)=>setDetail({kind:"journey",key})}/> :
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0b111c]">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div><div className="text-sm font-semibold">Locked final model</div><div className="mt-1 text-xs text-slate-500">Click any construct or path. Red = negative standardized association.</div></div>
              <div className="hidden items-center gap-4 text-[10px] uppercase tracking-wider text-slate-500 md:flex"><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-sky-400"/> supported path</span><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-slate-600"/> p ≥ .05</span></div>
            </div>
            <div className="overflow-x-auto">
              <svg viewBox="0 0 1190 600" className="min-w-[1050px] w-full select-none">
                <defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke"/></marker></defs>
                <rect x="0" y="0" width="1190" height="600" fill="#0b111c"/>
                {tab!=="measurement" && visiblePaths.map(p=>{
                  const a=pos[p.from], b=pos[p.to]; const dx=b.x-a.x, dy=b.y-a.y;
                  const x1=a.x+58, y1=a.y+25, x2=b.x-58, y2=b.y+25;
                  const path=`M ${x1} ${y1} C ${x1+dx*.35} ${y1}, ${x2-dx*.35} ${y2}, ${x2} ${y2}`;
                  return <g key={p.id} onClick={()=>setDetail({kind:"path",item:p})} className="cursor-pointer">
                    <path d={path} fill="none" stroke={pathColor(p)} strokeWidth={p.p<.05?2.5:1.5} strokeOpacity={p.p<.05?.95:.55} markerEnd="url(#arrow)"/>
                    <path d={path} fill="none" stroke="transparent" strokeWidth="14"/>
                    <text x={(x1+x2)/2} y={(y1+y2)/2-8} fill={pathColor(p)} fontSize="12" textAnchor="middle" fontFamily="ui-monospace">{std?fmt(p.beta):fmt(p.estimate)}</text>
                  </g>
                })}
                <g onClick={()=>setDetail({kind:"covariance"})} className="cursor-pointer">
                  <path d="M 1010 246 C 1010 305, 900 325, 850 315" fill="none" stroke="#a78bfa" strokeWidth="2" strokeDasharray="5 5"/>
                  <text x="920" y="335" fill="#a78bfa" fontSize="11" textAnchor="middle">residual covariance .469</text>
                </g>
                {constructs.map(c=>{
                  const p=pos[c.id];
                  return <g key={c.id} onClick={()=>setDetail({kind:"construct",item:c})} className="cursor-pointer">
                    <rect x={p.x-58} y={p.y} width="116" height="50" rx="10" fill="#121b2a" stroke={detail?.kind==="construct"&&detail.item.id===c.id?"#38bdf8":"#334155"} strokeWidth="2"/>
                    <text x={p.x} y={p.y+21} fill="#f8fafc" fontSize="12" fontWeight="600" textAnchor="middle">{c.label.length>17?c.label.slice(0,16)+"…":c.label}</text>
                    <text x={p.x} y={p.y+39} fill="#64748b" fontSize="9" textAnchor="middle">R² {c.r2?.toFixed(3)}</text>
                  </g>
                })}
                <text x="110" y="405" fill="#64748b" fontSize="11">Indicators are expanded in the Measurement view and in the construct panel.</text>
                <text x="1030" y="410" fill="#64748b" fontSize="11" textAnchor="middle">N = 689 · ML · 57 parameters</text>
              </svg>
            </div>
          </section>

          <DetailPanel detail={detail} std={std} onClose={()=>setDetail(null)}/>
        </div>}

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          <StatCard label="Model fit" value={`χ²(${fit.df}) = ${fit.chiSquare.toFixed(2)}`} sub={`CFI ${fit.cfi.toFixed(3)} · TLI ${fit.tli.toFixed(3)} · RMSEA ${fit.rmsea.toFixed(3)} [${fit.rmseaCI[0].toFixed(3)}, ${fit.rmseaCI[1].toFixed(3)}]`}/>
          <StatCard label="Sequential indirect effect" value="0.180" sub="Prolonged Fatigue → Low Energy → Mental Fatigue → Unsafe Riding; p = .184"/>
          <StatCard label="Interpretation rule" value="Association ≠ causation" sub="The SEM is cross-sectional. Paths describe modelled associations, not proof of causal mechanisms."/>
        </section>

        <section className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <div className="flex items-start gap-3"><Info className="mt-0.5 text-sky-400" size={17}/><div><h2 className="font-semibold">Same-cohort context</h2><p className="mt-1 max-w-5xl text-sm leading-6 text-slate-400">In the same cohort, occupational/service riders reported substantially greater riding exposure (about 6.63 vs 2.99 h/day), while fatigue prevalence was similar (33.4% vs 30.9%) and crash involvement was higher (32.7% vs 22.5%). These are separate analyses—not coefficients from this SEM—and help motivate examining exposure, fatigue and unsafe riding as related but distinct phenomena.</p></div></div>
        </section>
      </main>
    </div>
  );
}

function DetailPanel({detail,std,onClose}:{detail:Detail;std:boolean;onClose:()=>void}){
  return <aside className="min-h-[520px] rounded-2xl border border-slate-800 bg-[#0b111c] p-5">
    {!detail ? <div className="flex h-full min-h-[480px] flex-col items-center justify-center text-center"><Route className="text-slate-700" size={34}/><h3 className="mt-4 font-semibold text-slate-300">Explore the model</h3><p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">Select a path, construct, or covariance. The panel will explain the statistic and its interpretation.</p></div> :
    <div>
      <div className="mb-5 flex items-start justify-between gap-4"><div><div className="text-[10px] uppercase tracking-[.2em] text-sky-400">{detail.kind}</div><h3 className="mt-1 text-xl font-semibold">{detail.kind==="path"?`${detail.item.from} → ${detail.item.to}`:detail.kind==="construct"?detail.item.label:"Residual covariance"}</h3></div><button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-white"><X size={16}/></button></div>
      {detail.kind==="path" && <PathDetail p={detail.item} std={std}/>}
      {detail.kind==="construct" && <ConstructDetail c={detail.item}/>}
      {detail.kind==="covariance" && <CovarianceDetail/>}
      {detail.kind==="journey" && <JourneyDetail keyName={detail.key}/>}
    </div>}
  </aside>
}

function PathDetail({p,std}:{p:SemPath;std:boolean}){
  const significant=p.p<.05;
  return <div>
    <div className="grid grid-cols-2 gap-2">{[[std?"Std. β":"Estimate",std?fmt(p.beta):fmt(p.estimate)],["p",pLabel(p.p)],["SE",fmt(p.se)],["z",fmt(p.z)],["95% CI",`[${fmt(p.ci[0])}, ${fmt(p.ci[1])}]`]].map(([k,v])=><div key={String(k)} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3"><div className="text-[10px] uppercase tracking-wider text-slate-500">{k}</div><div className="mt-1 font-mono text-sm text-white">{v}</div></div>)}</div>
    <div className={`mt-4 rounded-xl border p-4 ${significant?"border-sky-500/20 bg-sky-500/5":"border-slate-800 bg-slate-950/30"}`}><div className="text-xs font-semibold">{significant?"Evidence in the fitted model":"Uncertain / not conventionally significant"}</div><p className="mt-2 text-sm leading-6 text-slate-400">{p.interpretation}</p></div>
    <div className="mt-5 border-t border-slate-800 pt-4"><div className="text-xs font-semibold text-slate-300">Technical</div><p className="mt-2 text-xs leading-5 text-slate-500">Structural coefficient reported from the locked lavaan solution. Standardized coefficients use <span className="font-mono text-slate-300">Std.all</span>; raw estimates are the unstandardized model coefficients.</p></div>
  </div>
}

function ConstructDetail({c}:{c:Construct}){
 return <div><div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"><div className="text-xs uppercase tracking-wider text-slate-500">Explained variance</div><div className="mt-1 text-3xl font-semibold">{c.r2?.toFixed(3)}</div><p className="mt-2 text-xs text-slate-500">R² for this endogenous latent construct.</p></div><div className="mt-4"><div className="mb-2 text-xs font-semibold text-slate-300">Indicators & standardized loadings</div>{c.indicators.map(i=><div key={i.id} className="flex items-center justify-between border-b border-slate-800 py-2.5"><div><div className="text-sm text-slate-300">{i.label}</div><div className="font-mono text-[10px] text-slate-600">{i.id}</div></div><div className="text-right"><div className={`font-mono text-sm ${i.loading<0?"text-rose-300":"text-sky-300"}`}>{i.loading.toFixed(3)}</div><div className="text-[10px] text-slate-600">p {i.p}</div></div></div>)}</div><div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/30 p-4 text-xs leading-5 text-slate-500">{c.note}</div></div>
}

function CovarianceDetail(){ return <div><div className="grid grid-cols-2 gap-2">{[["Std. covariance",covariance.standardized.toFixed(3)],["Estimate",covariance.estimate.toFixed(3)],["SE",covariance.se.toFixed(3)],["z",covariance.z.toFixed(3)],["p",covariance.p],["95% CI",`[${covariance.ci[0].toFixed(3)}, ${covariance.ci[1].toFixed(3)}]`]].map(([k,v])=><div key={k} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3"><div className="text-[10px] uppercase tracking-wider text-slate-500">{k}</div><div className="mt-1 font-mono text-sm">{v}</div></div>)}</div><div className="mt-4 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4"><div className="text-xs font-semibold text-violet-300">Why are these two indicators allowed to covary?</div><p className="mt-2 text-sm leading-6 text-slate-400">{covariance.note}</p></div></div> }

function Journey({onOpen}:{onOpen:(key:string)=>void}){ const items=[["initial","Initial idea","Fatigue treated as a simple physical + mental construct."],["measurement","Measurement review","The 2-factor M-CFQ model did not fit adequately; a 3-factor structure separating Low Energy was tested."],["locked","Locked SEM","The final structural model retains six latent constructs, the Crash History cross-loading, and the residual covariance specified in the source model."]]; return <section className="rounded-2xl border border-slate-800 bg-[#0b111c] p-6"><div className="flex items-center gap-2 text-sky-400"><Route size={16}/><span className="text-xs font-mono uppercase tracking-widest">Model journey</span></div><div className="mt-7 grid gap-4 lg:grid-cols-3">{items.map(([k,t,d],i)=><button key={k} onClick={()=>onOpen(k)} className="group rounded-2xl border border-slate-800 bg-slate-950/40 p-5 text-left hover:border-sky-500/30"><div className="flex items-center justify-between"><span className="font-mono text-xs text-slate-600">0{i+1}</span><ChevronRight size={16} className="text-slate-700 group-hover:text-sky-400"/></div><h3 className="mt-8 font-semibold">{t}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{d}</p></button>)}</div><div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/30 p-4 text-sm leading-6 text-slate-400"><b className="text-slate-200">Important:</b> this explorer presents the locked final SEM. It does not silently merge later sensitivity or post-review analyses whose numerical output is not encoded here.</div></section> }

function JourneyDetail({keyName}:{keyName:string}){ const map:Record<string,string>={initial:"The conceptual starting point was to treat motorcycle fatigue as physical + mental fatigue.",measurement:"CFA showed that the 2-factor M-CFQ structure was inadequate. The locked measurement model separates Low Energy (items 4–7), Mental Fatigue (8–11), and Physical Fatigue (1–3).",locked:"The locked final SEM uses N=689, ML estimation, 57 parameters, six latent constructs, the Crash History cross-loading, and Letih_RLR ~~ Letih_bwk_laju."}; return <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm leading-6 text-slate-400">{map[keyName] ?? "Model specification note."}</div> }

function StatCard({label,value,sub}:{label:string;value:string;sub:string}){return <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"><div className="text-[10px] uppercase tracking-[.18em] text-slate-500">{label}</div><div className="mt-2 font-mono text-sm text-slate-100">{value}</div><div className="mt-2 text-xs leading-5 text-slate-500">{sub}</div></div>}
