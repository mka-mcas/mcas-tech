"use client";

import React, { useState } from "react";
import { ChevronRight, Info, Network, Route, SlidersHorizontal, Sun, Moon, X } from "lucide-react";
import { constructs, covariance, fit, paths, sequentialIndirect, directUnsafeInterpretation, type Construct, type SemPath } from "@/data/sem-data";

type Tab = "model" | "structural" | "measurement" | "journey" | "evidence";
type IndicatorDetail = { id: string; label: string; loading: number; p: number | string; construct: string };
type Detail = { kind: "path"; item: SemPath } | { kind: "construct"; item: Construct } | { kind: "indicator"; item: IndicatorDetail } | { kind: "covariance" } | { kind: "journey"; key: string } | null;

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
  const [light,setLight]=useState(false);
  const [showGuide,setShowGuide]=useState(false);

  return (
    <div className={light ? "sem-light min-h-screen bg-slate-50 text-slate-900" : "min-h-screen bg-[#090d16] text-slate-100"}>
      <header className={light ? "border-b border-slate-200 bg-white/95" : "border-b border-slate-800/80 bg-[#0b101b]/95"}>
        <div className="mx-auto max-w-[1550px] px-5 pb-5 pt-28 md:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.25em] text-sky-500">
                <Network size={14} /> Interactive SEM Explorer
              </div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                From model diagram to statistical story.
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400 md:text-base">
                Explore the locked final SEM one relationship at a time. The diagram follows conventional SEM notation: ellipses are latent variables, rectangles are observed indicators, one-headed arrows are directed paths, and double-headed curved arrows are covariances.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2 md:gap-3">
              <button
                onClick={() => setLight(!light)}
                aria-label={light ? "Switch to dark mode" : "Switch to daylight mode"}
                className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${light ? "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200" : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"}`}
              >
                {light ? <Moon size={14} /> : <Sun size={14} />}
                {light ? "Dark" : "Daylight"}
              </button>
              <div className="grid grid-cols-2 gap-2 text-center md:grid-cols-4">
                {[
                  ["N", fit.n],
                  ["CFI", fit.cfi.toFixed(3)],
                  ["RMSEA", fit.rmsea.toFixed(3)],
                  ["SRMR", fit.srmr.toFixed(3)],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                    <div className="text-[10px] uppercase tracking-widest text-slate-500">{k}</div>
                    <div className="mt-1 font-mono text-lg text-white">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1550px] px-5 py-6 md:px-8">
        <div className="mb-5 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-400/10 text-sky-300"><Info size={17}/></div>
              <div><div className="text-sm font-semibold">New to SEM?</div><div className="text-xs text-slate-500">A quick guide to the method behind this explorer.</div></div>
            </div>
            <button onClick={()=>setShowGuide(!showGuide)} className="cursor-pointer rounded-full border border-sky-500/30 bg-sky-400/10 px-3 py-2 text-xs font-semibold text-sky-300 hover:bg-sky-400/15">{showGuide ? "Hide guide" : "Show SEM guide"}</button>
          </div>
          {showGuide && <div className="mt-4 grid gap-3 border-t border-sky-500/10 pt-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3"><div className="text-[10px] font-semibold uppercase tracking-wider text-sky-300">SEM</div><p className="mt-1 text-xs leading-5 text-slate-400"><b className="text-slate-200">Structural Equation Modeling</b> tests relationships among latent constructs and their observed indicators in one model.</p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3"><div className="text-[10px] font-semibold uppercase tracking-wider text-sky-300">CB-SEM</div><p className="mt-1 text-xs leading-5 text-slate-400">This is <b className="text-slate-200">covariance-based SEM</b>, not PLS-SEM. The model is evaluated against the observed covariance structure and overall fit.</p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3"><div className="text-[10px] font-semibold uppercase tracking-wider text-sky-300">MLR</div><p className="mt-1 text-xs leading-5 text-slate-400"><b className="text-slate-200">Maximum Likelihood Robust</b> is the estimator used for the final model, providing robust inference when normality assumptions are not ideal.</p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3"><div className="text-[10px] font-semibold uppercase tracking-wider text-sky-300">Std. β</div><p className="mt-1 text-xs leading-5 text-slate-400">A standardized path coefficient shows the modelled direction and relative magnitude of an association. <b className="text-slate-200">It is not a causal effect.</b></p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3"><div className="text-[10px] font-semibold uppercase tracking-wider text-sky-300">Latent variable</div><p className="mt-1 text-xs leading-5 text-slate-400">An ellipse represents a construct inferred from multiple observed indicators, shown as rectangles in the model diagram.</p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3"><div className="text-[10px] font-semibold uppercase tracking-wider text-sky-300">p-value</div><p className="mt-1 text-xs leading-5 text-slate-400">Here, p-values assess evidence against a zero path in the fitted model. <b className="text-slate-200">p &lt; .05</b> is used as the displayed significance threshold.</p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3"><div className="text-[10px] font-semibold uppercase tracking-wider text-sky-300">Model fit</div><p className="mt-1 text-xs leading-5 text-slate-400">CFI, TLI, RMSEA and SRMR describe how well the <b className="text-slate-200">model as a whole</b> reproduces the observed data.</p></div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3"><div className="text-[10px] font-semibold uppercase tracking-wider text-amber-300">Study boundary</div><p className="mt-1 text-xs leading-5 text-slate-400">This is a <b className="text-slate-200">cross-sectional</b> model. Statistical association, significance or good fit does not by itself establish causality.</p></div>
          </div>}
        </div>

        <InterpretiveSummary onOpen={(id)=>{ const p=paths.find(x=>x.id===id); if(p) setDetail({kind:"path",item:p}); }} />

        <div className="mb-5 flex flex-wrap items-center gap-2">
          {([["model","Full model"],["structural","Structural"],["measurement","Measurement"],["journey","Model journey"],["evidence","Evidence"]] as [Tab,string][]).map(([id,label])=>
            <button key={id} onClick={()=>setTab(id)} className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${tab===id ? "border-sky-400/50 bg-sky-400/10 text-sky-300":"border-slate-800 bg-slate-900 text-slate-400 hover:text-white"}`}>{label}</button>
          )}
          <div className="ml-auto flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs">
            <SlidersHorizontal size={13} className="text-slate-500"/>
            <span className="text-slate-500">Coefficient</span>
            <button onClick={()=>setStd(!std)} className="font-mono text-sky-300">{std ? "Std. β" : "Estimate"}</button>
          </div>
        </div>

        {tab==="journey" ? <Journey onOpen={(key)=>setDetail({kind:"journey",key})}/> : tab==="evidence" ? <EvidenceExplorer onOpen={(id)=>{ const p=paths.find(x=>x.id===id); if(p) setDetail({kind:"path",item:p}); }}/> :
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0b111c]">
            <div className="flex flex-col gap-3 border-b border-slate-800 px-5 py-4 md:flex-row md:items-center md:justify-between">
              <div><div className="text-sm font-semibold">Locked final model · conventional SEM notation</div><div className="mt-1 text-xs text-slate-500">Click any ellipse, rectangle, directed path or covariance. Dashed purple curve = residual covariance.</div></div>
              <div className="flex flex-wrap gap-3 text-[10px] uppercase tracking-wider text-slate-500">
                <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-sky-400"/> p &lt; .05</span>
                <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-slate-600"/> p ≥ .05</span>
                <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-violet-400"/> covariance</span>
              </div>
            </div>
            <div className="overflow-auto">
              <SEMCanvas tab={tab} std={std} detail={detail} onDetail={setDetail}/>
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
        <style jsx global>{`
          /* Daylight theme: remap the entire explorer surface coherently. */
          .cursor-pointer { cursor: pointer !important; }\n          .sem-light {
            color-scheme: light;
          }
          .sem-light .text-slate-100 { color:#0f172a !important; }
          .sem-light .text-slate-200 { color:#1e293b !important; }
          .sem-light .text-slate-300 { color:#334155 !important; }
          .sem-light .text-slate-400 { color:#475569 !important; }
          .sem-light .text-slate-500 { color:#64748b !important; }
          .sem-light .text-slate-600 { color:#64748b !important; }
          .sem-light .text-white { color:#0f172a !important; }

          .sem-light .bg-slate-950 { background:#ffffff !important; }
          .sem-light .bg-slate-950\/50 { background:#f8fafc !important; }
          .sem-light .bg-slate-950\/40 { background:#f8fafc !important; }
          .sem-light .bg-slate-950\/30 { background:#f1f5f9 !important; }
          .sem-light .bg-slate-900 { background:#f8fafc !important; }
          .sem-light .bg-slate-900\/60 { background:#f1f5f9 !important; }
          .sem-light .bg-slate-900\/50 { background:#f8fafc !important; }
          .sem-light .bg-slate-800 { background:#e2e8f0 !important; }
          .sem-light .bg-slate-800\/80 { background:rgba(241,245,249,.95) !important; }

          .sem-light .border-slate-800 { border-color:#cbd5e1 !important; }
          .sem-light .border-slate-700 { border-color:#cbd5e1 !important; }
          .sem-light .border-slate-600 { border-color:#94a3b8 !important; }

          .sem-light .border-sky-500\/20 { border-color:#bae6fd !important; }
          .sem-light .border-sky-400\/50 { border-color:#7dd3fc !important; }
          .sem-light .border-sky-500\/30 { border-color:#7dd3fc !important; }
          .sem-light .bg-sky-500\/5 { background:#f0f9ff !important; }
          .sem-light .bg-sky-400\/10 { background:#e0f2fe !important; }
          .sem-light .bg-sky-500\/10 { background:#e0f2fe !important; }
          .sem-light .text-sky-500 { color:#0369a1 !important; }
          .sem-light .text-sky-400 { color:#0284c7 !important; }
          .sem-light .text-sky-300 { color:#0369a1 !important; }

          .sem-light .border-emerald-500\/20 { border-color:#a7f3d0 !important; }
          .sem-light .bg-emerald-500\/5 { background:#ecfdf5 !important; }
          .sem-light .text-emerald-300 { color:#047857 !important; }

          .sem-light .border-amber-500\/20 { border-color:#fde68a !important; }
          .sem-light .bg-amber-500\/5 { background:#fffbeb !important; }
          .sem-light .text-amber-300 { color:#b45309 !important; }

          .sem-light .bg-violet-500\/5 { background:#f5f3ff !important; }
          .sem-light .border-violet-500\/20 { border-color:#ddd6fe !important; }
          .sem-light .text-violet-300 { color:#6d28d9 !important; }

          .sem-light .hover\\:bg-slate-800:hover { background:#e2e8f0 !important; }
          .sem-light .hover\\:text-white:hover { color:#0f172a !important; }

          .sem-light .bg-\\[\\#0b111c\\] { background:#ffffff !important; }
          .sem-light .bg-\\[\\#101827\\] { background:#f8fafc !important; }

          /* SVG / model diagram */
          .sem-light svg { background:#ffffff !important; }
          .sem-light svg > rect:first-child { fill:#ffffff !important; }
          .sem-light svg ellipse { fill:#f8fafc !important; stroke:#64748b !important; }
          .sem-light svg rect { fill:#ffffff !important; }
          .sem-light svg text[fill="#f8fafc"] { fill:#0f172a !important; }
          .sem-light svg text[fill="#cbd5e1"] { fill:#334155 !important; }
          .sem-light svg text[fill="#94a3b8"] { fill:#64748b !important; }
          .sem-light svg text[fill="#475569"] { fill:#64748b !important; }
          .sem-light svg text[fill="#64748b"] { fill:#64748b !important; }
          .sem-light svg text[fill="#a78bfa"] { fill:#7c3aed !important; }
          .sem-light svg path[stroke="#64748b"] { stroke:#94a3b8 !important; }
          .sem-light svg path[stroke="#a78bfa"] { stroke:#7c3aed !important; }
        `}</style>
    </div>
  );
}

type NodeBox = { x:number;y:number; w:number;h:number };
const latent: Record<string,NodeBox> = {
  motivation:{x:120,y:390,w:170,h:70}, prolong:{x:350,y:300,w:180,h:70},
  kurang:{x:580,y:180,w:175,h:70}, physical:{x:820,y:105,w:175,h:70},
  mental:{x:820,y:300,w:175,h:70}, unsafe:{x:1090,y:205,w:185,h:70}
};
const obs: Record<string,NodeBox> = {
  CFS_4:{x:500,y:80,w:92,h:34}, CFS_5:{x:610,y:55,w:92,h:34}, CFS_6:{x:720,y:35,w:92,h:34}, CFS_7:{x:830,y:25,w:92,h:34},
  CFS_8:{x:995,y:385,w:92,h:34}, CFS_9:{x:1100,y:405,w:92,h:34}, CFS_10:{x:1205,y:425,w:92,h:34}, CFS_11:{x:1310,y:445,w:92,h:34},
  CFS_1:{x:755,y:5,w:92,h:34}, CFS_2:{x:850,y:0,w:92,h:34}, CFS_3:{x:945,y:10,w:92,h:34},
  P_sleepy:{x:240,y:175,w:108,h:34}, P_napped:{x:355,y:145,w:108,h:34}, P_month:{x:470,y:125,w:108,h:34},
  Tj_mng:{x:25,y:505,w:115,h:34}, Umur:{x:150,y:525,w:95,h:34},
  Letih_RLR:{x:1160,y:85,w:112,h:34}, Letih_bwk_laju:{x:1285,y:110,w:125,h:34}, Letih_ubah_tbt:{x:1320,y:195,w:125,h:34}, Crash_hist:{x:1285,y:300,w:112,h:34}
};

function nodeCenter(n:NodeBox){return {x:n.x+n.w/2,y:n.y+n.h/2};}
function edgePoint(a:NodeBox,b:NodeBox){
  const ac=nodeCenter(a), bc=nodeCenter(b), dx=bc.x-ac.x, dy=bc.y-ac.y;
  const scale=Math.min((a.w/2)/Math.max(Math.abs(dx),1),(a.h/2)/Math.max(Math.abs(dy),1));
  const s={x:ac.x+dx*scale,y:ac.y+dy*scale};
  const scale2=Math.min((b.w/2)/Math.max(Math.abs(dx),1),(b.h/2)/Math.max(Math.abs(dy),1));
  const e={x:bc.x-dx*scale2,y:bc.y-dy*scale2};
  return {s,e};
}
function markerId(p:SemPath){return p.beta<0?"arrow-neg":p.p<.05?"arrow-pos":"arrow-muted";}

function SEMCanvas({tab,std,detail,onDetail}:{tab:Tab;std:boolean;detail:Detail;onDetail:(d:Detail)=>void}){
  const showStructural=tab!=="measurement";
  const displayLabelMap = new Map(constructs.flatMap(c=>c.indicators.map(i=>[i.id,i.label])));
  const indicatorEdges=[
    ["kurang","CFS_4"],["kurang","CFS_5"],["kurang","CFS_6"],["kurang","CFS_7"],
    ["mental","CFS_8"],["mental","CFS_9"],["mental","CFS_10"],["mental","CFS_11"],
    ["physical","CFS_1"],["physical","CFS_2"],["physical","CFS_3"],
    ["prolong","P_sleepy"],["prolong","P_napped"],["prolong","P_month"],
    ["motivation","Tj_mng"],["motivation","Umur"],["motivation","Crash_hist"],
    ["unsafe","Letih_RLR"],["unsafe","Letih_bwk_laju"],["unsafe","Letih_ubah_tbt"],["unsafe","Crash_hist"]
  ];
  const loadingMap=new Map(constructs.flatMap(c=>c.indicators.map(i=>[c.id+"|"+i.id,i.loading])));
  const constructMap=new Map(constructs.map(c=>[c.id,c]));
  return <svg viewBox="0 0 1450 610" className="min-w-[1180px] w-full bg-[#0b111c] select-none" role="img" aria-label="Interactive structural equation model diagram">
    <defs>
      <marker id="arrow-pos" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8"/></marker>
      <marker id="arrow-neg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#fb7185"/></marker>
      <marker id="arrow-muted" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b"/></marker>
      <marker id="arrow-load" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8"/></marker>
      <marker id="cov-start" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 10 0 L 0 5 L 10 10" fill="none" stroke="#a78bfa" strokeWidth="1.5"/></marker>
      <marker id="cov-end" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 0 L 10 5 L 0 10" fill="none" stroke="#a78bfa" strokeWidth="1.5"/></marker>
    </defs>
    <rect width="1450" height="610" fill="#0b111c"/>
    {showStructural && paths.map(p=>{
      const a=latent[p.from],b=latent[p.to]; const {s,e}=edgePoint(a,b);
      const mx=(s.x+e.x)/2,my=(s.y+e.y)/2;
      const d=`M ${s.x} ${s.y} Q ${mx} ${my+(p.from==="motivation"?35:-25)} ${e.x} ${e.y}`;
      const col=pathColor(p);
      return <g key={p.id} onClick={()=>onDetail({kind:"path",item:p})} className="cursor-pointer">
        <path d={d} fill="none" stroke="transparent" strokeWidth="16"/>
        <path d={d} fill="none" stroke={col} strokeWidth={p.p<.05?2.7:1.5} strokeOpacity={p.p<.05?.95:.55} markerEnd={`url(#${markerId(p)})`}/>
        <text x={mx} y={my-7} fill={col} fontSize="12" textAnchor="middle" fontFamily="ui-monospace">{std?fmt(p.beta):fmt(p.estimate)}</text>
      </g>
    })}
    {indicatorEdges.map(([cid,iid])=>{
      const a=latent[cid],b=obs[iid]; if(!a||!b)return null;
      const {s,e}=edgePoint(a,b); const loading=loadingMap.get(cid+"|"+iid) ?? 0; const isCross=iid==="Crash_hist";
      return <g key={cid+"-"+iid} onClick={()=>onDetail({kind:"construct",item:constructMap.get(cid)!})} className="cursor-pointer">
        <path d={`M ${s.x} ${s.y} L ${e.x} ${e.y}`} fill="none" stroke="#64748b" strokeWidth="1.2" markerEnd="url(#arrow-load)"/>
        <text x={(s.x+e.x)/2} y={(s.y+e.y)/2-4} fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="ui-monospace">{loading.toFixed(3)}</text>
        {isCross && cid==="motivation" && <text x={(s.x+e.x)/2+5} y={(s.y+e.y)/2+12} fill="#c084fc" fontSize="8">cross-loading</text>}
      </g>
    })}
    <g onClick={()=>onDetail({kind:"covariance"})} className="cursor-pointer">
      <path d="M 1270 102 C 1375 20, 1430 80, 1385 135" fill="none" stroke="#a78bfa" strokeWidth="2.2" strokeDasharray="6 5" markerStart="url(#cov-start)" markerEnd="url(#cov-end)"/>
      <path d="M 1270 102 C 1375 20, 1430 80, 1385 135" fill="none" stroke="transparent" strokeWidth="14"/>
      <text x="1365" y="55" fill="#a78bfa" fontSize="10" textAnchor="middle">~~ .469</text>
    </g>
    {Object.entries(obs).map(([id,n])=><g key={id} onClick={()=>{
      const matches=constructs.flatMap(c=>c.indicators.map(i=>({...i,construct:c.label}))).filter(i=>i.id===id);
      if(matches[0]) onDetail({kind:"indicator",item:matches[0]});
    }} className="cursor-pointer">
      <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="3" fill="#101827" stroke={id==="Crash_hist"?"#c084fc":"#475569"} strokeWidth="1.5"/>
      <text x={n.x+n.w/2} y={n.y+21} fill="#cbd5e1" fontSize="9.5" textAnchor="middle">{displayLabelMap.get(id) ?? id}</text>
    </g>)}
    {Object.entries(latent).map(([id,n])=>{
      const c=constructMap.get(id)!; const selected=detail?.kind==="construct"&&detail.item.id===id;
      return <g key={id} onClick={()=>onDetail({kind:"construct",item:c})} className="cursor-pointer">
        <ellipse cx={n.x+n.w/2} cy={n.y+n.h/2} rx={n.w/2} ry={n.h/2} fill="#121b2a" stroke={selected?"#38bdf8":"#64748b"} strokeWidth={selected?2.5:1.8}/>
        <text x={n.x+n.w/2} y={n.y+31} fill="#f8fafc" fontSize="12" fontWeight="600" textAnchor="middle">{c.label}</text>
        <text x={n.x+n.w/2} y={n.y+49} fill="#64748b" fontSize="9" textAnchor="middle">R² {c.r2?.toFixed(3)}</text>
      </g>
    })}
    <text x="25" y="35" fill="#475569" fontSize="10" fontFamily="ui-monospace">LATENT VARIABLES</text>
    <text x="25" y="55" fill="#475569" fontSize="10">ellipses</text>
    <text x="1120" y="575" fill="#475569" fontSize="10">N = 689 · MLR · 57 parameters</text>
  </svg>;
}

function InterpretiveSummary({onOpen}:{onOpen:(id:string)=>void}){
  return <section className="mb-5 rounded-2xl border border-slate-800 bg-[#0b111c] p-5">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-2xl">
        <div className="text-[10px] font-mono uppercase tracking-[.2em] text-sky-400">Interpretive layer · v0.5</div>
        <h2 className="mt-2 text-xl font-semibold">What does the final model say?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          The final MLR SEM does not treat “fatigue” as a single undifferentiated exposure. Three fatigue-related paths can be read differently: some show statistically significant positive associations with Unsafe Riding, while others do not.
        </p>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-xs text-slate-500">
        <span className="font-semibold text-slate-300">N = 689</span><br/>
        MLR · final SEM
      </div>
    </div>

    <div className="mt-5 grid gap-2 md:grid-cols-5">
      {directUnsafeInterpretation.map(item => {
        const significant=item.status==="significant";
        return <button key={item.id} onClick={()=>onOpen(item.id)} className={`w-full rounded-xl border p-3 text-left transition hover:border-sky-400/40 ${significant?"border-sky-500/20 bg-sky-500/5":"border-slate-800 bg-slate-950/30"}`}>
          <div className="flex items-start justify-between gap-2">
            <div className="text-xs font-semibold text-slate-200">{item.label}</div>
            <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider ${significant?"bg-sky-400/10 text-sky-300":"bg-slate-800 text-slate-500"}`}>{significant?"Sig.":"n.s."}</span>
          </div>
          <div className="mt-3 font-mono text-sm text-sky-300">β = {item.beta.toFixed(3)}</div>
          <div className="mt-1 font-mono text-[10px] text-slate-500">p {pLabel(item.p)}</div>
          <p className="mt-2 text-[11px] leading-5 text-slate-500">{item.message}</p>
        </button>;
      })}
    </div>

    <div className="mt-4 flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/30 p-4 text-xs leading-5 text-slate-500 md:flex-row md:items-center">
      <span className="font-semibold text-slate-300">Reading rule:</span>
      <span>β shows the standardized direction and magnitude; p indicates the strength of statistical evidence against a zero direct association. Neither establishes causality in this cross-sectional model.</span>
    </div>
  </section>
}

function DetailPanel({detail,std,onClose}:{detail:Detail;std:boolean;onClose:()=>void}){
  return <aside className="min-h-[520px] rounded-2xl border border-slate-800 bg-[#0b111c] p-5">
    {!detail ? <div className="flex h-full min-h-[480px] flex-col items-center justify-center text-center"><Route className="text-slate-700" size={34}/><h3 className="mt-4 font-semibold text-slate-300">Explore the model</h3><p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">Select a path, construct, or covariance. The panel will explain the statistic and its interpretation.</p></div> :
    <div>
      <div className="mb-5 flex items-start justify-between gap-4"><div><div className="text-[10px] uppercase tracking-[.2em] text-sky-400">{detail.kind}</div><h3 className="mt-1 text-xl font-semibold">{detail.kind==="path"?`${({motivation:"Motivation",prolong:"Prolonged fatigue",kurang:"Low Energy",physical:"Physical fatigue",mental:"Mental fatigue",unsafe:"Unsafe riding"} as Record<string,string>)[detail.item.from] ?? detail.item.from} → ${({motivation:"Motivation",prolong:"Prolonged fatigue",kurang:"Low Energy",physical:"Physical fatigue",mental:"Mental fatigue",unsafe:"Unsafe riding"} as Record<string,string>)[detail.item.to] ?? detail.item.to}`:detail.kind==="construct"?detail.item.label:detail.kind==="indicator"?detail.item.label:"Residual covariance"}</h3></div><button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-white"><X size={16}/></button></div>
      {detail.kind==="path" && <PathDetail p={detail.item} std={std}/>}
      {detail.kind==="construct" && <ConstructDetail c={detail.item}/>}
      {detail.kind==="indicator" && <IndicatorDetailPanel i={detail.item}/>}
      {detail.kind==="covariance" && <CovarianceDetail/>}
      {detail.kind==="journey" && <JourneyDetail keyName={detail.key}/>}
    </div>}
  </aside>
}

function PathDetail({p,std}:{p:SemPath;std:boolean}){
  const significant=p.p<.05;
  const labelMap:Record<string,string> = {
    motivation:"Motivation",
    prolong:"Prolonged fatigue",
    kurang:"Low Energy",
    physical:"Physical fatigue",
    mental:"Mental fatigue",
    unsafe:"Unsafe riding"
  };
  const fromLabel=labelMap[p.from] ?? p.from;
  const toLabel=labelMap[p.to] ?? p.to;
  return <div>
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">Modelled relationship</div>
      <div className="mt-1 text-lg font-semibold text-white">{fromLabel} <span className="text-slate-600">→</span> {toLabel}</div>
    </div>

    <div className="mt-3 grid grid-cols-2 gap-2">
      <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
        <div className="text-[10px] uppercase tracking-wider text-slate-500">{std?"Std. β":"Estimate"}</div>
        <div className="mt-1 font-mono text-lg text-sky-300">{std?fmt(p.beta):fmt(p.estimate)}</div>
      </div>
      <div className={`rounded-xl border p-3 ${significant?"border-sky-500/20 bg-sky-500/5":"border-slate-800 bg-slate-950/50"}`}>
        <div className="text-[10px] uppercase tracking-wider text-slate-500">p-value</div>
        <div className="mt-1 font-mono text-lg text-white">{pLabel(p.p)}</div>
      </div>
    </div>

    <div className={`mt-4 rounded-xl border p-4 ${significant?"border-sky-500/20 bg-sky-500/5":"border-slate-800 bg-slate-950/30"}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold">{significant?"Evidence of a statistically significant association":"No statistically significant direct association"}</div>
        <span className={`rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-wider ${significant?"bg-sky-400/10 text-sky-300":"bg-slate-800 text-slate-400"}`}>{significant?"p < .05":"p ≥ .05"}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{p.interpretation}</p>
    </div>

    <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
      <div className="text-xs font-semibold text-emerald-300">How to read this</div>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        {significant
          ? `A positive standardized coefficient means higher levels of ${fromLabel} are associated with higher ${toLabel} scores in this model.`
          : `The estimated direct association between ${fromLabel} and ${toLabel} was not statistically significant in this model.`}
      </p>
    </div>

    <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
      <div className="text-xs font-semibold text-amber-300">Important distinction</div>
      <p className="mt-2 text-xs leading-5 text-slate-400">
        This is a cross-sectional SEM. A statistically significant path describes a modelled association; it does not by itself establish causality.
      </p>
    </div>

    <div className="mt-5 border-t border-slate-800 pt-4">
      <div className="text-xs font-semibold text-slate-300">About the displayed statistics</div>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        Standardized structural coefficients use <span className="font-mono text-slate-300">Std.all</span>. The direct-path interpretation above follows the finalized MLR results. Detailed SE, z and confidence-interval fields will only be shown here when their corresponding MLR values are encoded in the explorer.
      </p>
    </div>
  </div>
}

function IndicatorDetailPanel({i}:{i:IndicatorDetail}){
  return <div>
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">Observed indicator</div>
      <div className="mt-1 text-2xl font-semibold">{i.label}</div>
      <div className="mt-1 font-mono text-[10px] text-slate-600">{i.id}</div>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-2">
      <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3"><div className="text-[10px] uppercase tracking-wider text-slate-500">Std. loading</div><div className="mt-1 font-mono text-sm text-sky-300">{i.loading.toFixed(3)}</div></div>
      <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3"><div className="text-[10px] uppercase tracking-wider text-slate-500">p</div><div className="mt-1 font-mono text-sm text-white">{i.p}</div></div>
    </div>
    <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/30 p-4 text-xs leading-5 text-slate-500">Measured indicator of <span className="text-slate-300">{i.construct}</span>. The internal variable code is retained for traceability to the source SEM output.</div>
  </div>
}

function ConstructDetail({c}:{c:Construct}){
 return <div><div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"><div className="text-xs uppercase tracking-wider text-slate-500">Explained variance</div><div className="mt-1 text-3xl font-semibold">{c.r2?.toFixed(3)}</div><p className="mt-2 text-xs text-slate-500">R² for this endogenous latent construct.</p></div><div className="mt-4"><div className="mb-2 text-xs font-semibold text-slate-300">Indicators & standardized loadings</div>{c.indicators.map(i=><div key={i.id} className="flex items-center justify-between border-b border-slate-800 py-2.5"><div><div className="text-sm text-slate-300">{i.label}</div><div className="font-mono text-[10px] text-slate-600">{i.id}</div></div><div className="text-right"><div className={`font-mono text-sm ${i.loading<0?"text-rose-300":"text-sky-300"}`}>{i.loading.toFixed(3)}</div><div className="text-[10px] text-slate-600">p {i.p}</div></div></div>)}</div><div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/30 p-4 text-xs leading-5 text-slate-500">{c.note}</div></div>
}

function CovarianceDetail(){ return <div><div className="grid grid-cols-2 gap-2">{[["Std. covariance",covariance.standardized.toFixed(3)],["Estimate",covariance.estimate.toFixed(3)],["SE",covariance.se.toFixed(3)],["z",covariance.z.toFixed(3)],["p",covariance.p],["95% CI",`[${covariance.ci[0].toFixed(3)}, ${covariance.ci[1].toFixed(3)}]`]].map(([k,v])=><div key={k} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3"><div className="text-[10px] uppercase tracking-wider text-slate-500">{k}</div><div className="mt-1 font-mono text-sm">{v}</div></div>)}</div><div className="mt-4 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4"><div className="text-xs font-semibold text-violet-300">Why are these two indicators allowed to covary?</div><p className="mt-2 text-sm leading-6 text-slate-400">{covariance.note}</p></div></div> }

function EvidenceExplorer({onOpen}:{onOpen:(id:string)=>void}){
  const [selected,setSelected]=useState("prolong-unsafe");
  const item=directUnsafeInterpretation.find(x=>x.id===selected) ?? directUnsafeInterpretation[0];
  const path=paths.find(x=>x.id===item.id)!;
  const sourceConstruct=({
    "prolong-unsafe":"prolong",
    "motivation-unsafe":"motivation",
    "mental-unsafe":"mental",
    "physical-unsafe":"physical",
    "kurang-unsafe":"kurang",
  } as Record<string,string>)[item.id];
  const construct=constructs.find(x=>x.id===sourceConstruct)!;
  const related=paths.filter(x=>x.from===sourceConstruct || x.to===sourceConstruct).filter(x=>x.id!==path.id).slice(0,4);
  const significant=item.status==="significant";
  return <section className="rounded-2xl border border-slate-800 bg-[#0b111c] p-6 md:p-8">
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-sky-400"><Info size={16}/><span className="text-xs font-mono uppercase tracking-widest">Evidence explorer · v0.7</span></div>
        <h2 className="mt-3 text-2xl font-semibold">Follow one result through the model.</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">Start with a direct association and trace the evidence around it: the structural coefficient, the measurement indicators, the surrounding model relationships, and the overall model fit.</p>
      </div>
      <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 px-4 py-3 text-xs text-slate-400"><span className="font-semibold text-sky-300">Evidence chain</span><br/>Result → measurement → model context</div>
    </div>

    <div className="mt-6 flex flex-wrap gap-2">
      {directUnsafeInterpretation.map(x=><button key={x.id} onClick={()=>setSelected(x.id)} className={`cursor-pointer rounded-full border px-3 py-2 text-xs font-semibold transition ${selected===x.id ? "border-sky-400/60 bg-sky-400/10 text-sky-300" : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-600"}`}>
        {x.label}
      </button>)}
    </div>

    <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
      <div className={`rounded-2xl border p-5 ${significant ? "border-sky-500/20 bg-sky-500/5" : "border-slate-800 bg-slate-950/30"}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><div className="text-[10px] uppercase tracking-[.18em] text-slate-500">01 · Structural evidence</div><h3 className="mt-2 text-xl font-semibold">{item.label} → Unsafe riding</h3></div>
          <span className={`rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-wider ${significant ? "bg-sky-400/10 text-sky-300" : "bg-slate-800 text-slate-400"}`}>{significant ? "Statistically significant" : "Not statistically significant"}</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4"><div className="text-[10px] uppercase tracking-wider text-slate-500">Std. β</div><div className="mt-1 font-mono text-2xl text-sky-300">{item.beta.toFixed(3)}</div></div><div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4"><div className="text-[10px] uppercase tracking-wider text-slate-500">p-value</div><div className="mt-1 font-mono text-2xl text-slate-100">{pLabel(item.p)}</div></div></div>
        <p className="mt-4 text-sm leading-6 text-slate-400">{item.message}</p>
        <button onClick={()=>onOpen(item.id)} className="mt-4 cursor-pointer inline-flex items-center gap-2 text-xs font-semibold text-sky-300 hover:text-sky-200">Open full path detail <ChevronRight size={14}/></button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-5">
        <div className="text-[10px] uppercase tracking-[.18em] text-slate-500">02 · Measurement evidence</div>
        <h3 className="mt-2 text-lg font-semibold">{construct.label}</h3>
        <p className="mt-1 text-xs leading-5 text-slate-500">The structural result sits on top of a measured latent construct. These are the indicators represented in the locked measurement model.</p>
        <div className="mt-4 space-y-2">{construct.indicators.map(i=><div key={i.id} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/30 px-3 py-2"><span className="text-xs text-slate-300">{i.label}</span><span className="font-mono text-xs text-sky-300">λ {i.loading.toFixed(3)}</span></div>)}</div>
      </div>
    </div>

    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-5">
        <div className="text-[10px] uppercase tracking-[.18em] text-slate-500">03 · Structural context</div>
        <h3 className="mt-2 text-lg font-semibold">Other relationships involving {construct.label}</h3>
        <div className="mt-4 space-y-2">{related.map(x=><button key={x.id} onClick={()=>onOpen(x.id)} className="group flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-3 text-left hover:border-sky-500/30"><span className="text-xs text-slate-300">{({motivation:"Motivation",prolong:"Prolonged fatigue",kurang:"Low Energy",physical:"Physical fatigue",mental:"Mental fatigue",unsafe:"Unsafe riding"} as Record<string,string>)[x.from] ?? x.from} → {({motivation:"Motivation",prolong:"Prolonged fatigue",kurang:"Low Energy",physical:"Physical fatigue",mental:"Mental fatigue",unsafe:"Unsafe riding"} as Record<string,string>)[x.to] ?? x.to}</span><span className={`font-mono text-xs ${x.p<.05 ? "text-sky-300" : "text-slate-500"}`}>β {x.beta.toFixed(3)} · p {pLabel(x.p)}</span></button>)}</div>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-5">
        <div className="text-[10px] uppercase tracking-[.18em] text-slate-500">04 · Model context</div>
        <h3 className="mt-2 text-lg font-semibold">Does the overall model fit the data?</h3>
        <div className="mt-4 grid grid-cols-2 gap-2">{[["CFI",fit.cfi.toFixed(3)],["TLI",fit.tli.toFixed(3)],["RMSEA",fit.rmsea.toFixed(3)],["SRMR",fit.srmr.toFixed(3)]].map(([k,v])=><div key={k} className="rounded-xl border border-slate-800 bg-slate-950/30 p-3"><div className="text-[10px] uppercase tracking-wider text-slate-500">{k}</div><div className="mt-1 font-mono text-lg text-slate-100">{v}</div></div>)}</div>
        <p className="mt-4 text-xs leading-5 text-slate-500">Model fit describes the adequacy of the fitted SEM as a whole. It does not make an individual path causal or statistically significant.</p>
      </div>
    </div>

    <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-5 text-slate-400"><span className="font-semibold text-amber-300">Important:</span> this explorer connects evidence already encoded in the locked final model. It does not imply that strong measurement loadings prove the structural relationship, nor that overall model fit proves a causal mechanism.</div>
  </section>
}

function Journey({onOpen}:{onOpen:(key:string)=>void}){
  const items=[
    {key:"initial",num:"01",phase:"Concept",title:"Fatigue was first treated as two things",tag:"Initial hypothesis",summary:"The starting model treated motorcycle fatigue as a simple physical + mental construct.",why:"A straightforward conceptual model.",result:"The data later showed that this framing was too coarse."},
    {key:"measurement",num:"02",phase:"Measurement",title:"The questionnaire told a different story",tag:"CFA review",summary:"The original 2-factor M-CFQ structure did not fit adequately.",why:"The measurement model was reconsidered rather than forced to fit.",result:"A 3-factor structure separated Low Energy, Mental Fatigue and Physical Fatigue."},
    {key:"structural",num:"03",phase:"Structural model",title:"Fatigue became a network, not a single score",tag:"SEM",summary:"The final model retained distinct fatigue dimensions and directional relationships.",why:"This allowed direct associations with Unsafe Riding to be examined separately.",result:"The final MLR SEM was estimated with N = 689 and 57 parameters."},
    {key:"interpretation",num:"04",phase:"Interpretation",title:"Three direct associations stood out",tag:"Final result",summary:"Prolonged fatigue, Motivation and Mental fatigue showed statistically significant positive direct associations with Unsafe Riding.",why:"Physical Fatigue and Low Energy did not show statistically significant direct associations.",result:"Fatigue can be interpreted as differentiated dimensions rather than one undivided exposure."},
    {key:"locked",num:"05",phase:"Research artifact",title:"The model became explorable",tag:"Interactive evidence",summary:"The locked final SEM is presented as an interactive research artifact.",why:"Constructs, indicators, paths and covariance can be explored directly.",result:"Evidence, interpretation and methodological caveats remain visible together."}
  ];
  return <section className="rounded-2xl border border-slate-800 bg-[#0b111c] p-6 md:p-8">
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div><div className="flex items-center gap-2 text-sky-400"><Route size={16}/><span className="text-xs font-mono uppercase tracking-widest">Model journey · v0.6</span></div><h2 className="mt-3 text-2xl font-semibold">How the model evolved from an idea into evidence.</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">The reasoning trail behind the locked model—what changed, why it changed, and what that meant for interpretation.</p></div>
      <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 px-4 py-3 text-xs text-slate-400"><span className="font-semibold text-sky-300">Research principle</span><br/>Let the data challenge the starting hypothesis.</div>
    </div>
    <div className="relative mt-8"><div className="absolute left-[18px] top-4 bottom-4 hidden w-px bg-slate-800 md:block"/><div className="space-y-3">
      {items.map(item=><button key={item.key} onClick={()=>onOpen(item.key)} className="group relative flex w-full cursor-pointer flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-5 text-left transition hover:-translate-y-0.5 hover:border-sky-500/30 hover:bg-slate-900/60 md:flex-row md:items-start md:gap-6">
        <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sky-500/30 bg-slate-900 font-mono text-[10px] font-semibold text-sky-300">{item.num}</div>
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-mono uppercase tracking-[.18em] text-slate-500">{item.phase}</span><span className="rounded-full bg-sky-400/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-sky-300">{item.tag}</span></div><h3 className="mt-2 text-base font-semibold text-slate-100 group-hover:text-sky-300">{item.title}</h3><p className="mt-1 text-sm leading-6 text-slate-400">{item.summary}</p><div className="mt-4 grid gap-3 md:grid-cols-2"><div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3"><div className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">Why it mattered</div><div className="mt-1 text-xs leading-5 text-slate-500">{item.why}</div></div><div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3"><div className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">What changed</div><div className="mt-1 text-xs leading-5 text-slate-500">{item.result}</div></div></div></div>
        <ChevronRight className="hidden shrink-0 text-slate-700 transition group-hover:translate-x-1 group-hover:text-sky-400 md:block" size={18}/>
      </button>)}
    </div></div>
    <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-5 text-slate-400"><span className="font-semibold text-amber-300">Locked-model boundary:</span> this journey explains the final SEM. It does not silently merge later sensitivity analyses or alternative models whose numerical output is not encoded here.</div>
  </section>
}

function JourneyDetail({keyName}:{keyName:string}){ const map:Record<string,string>={initial:"The conceptual starting point was to treat motorcycle fatigue as physical + mental fatigue.",measurement:"CFA showed that the 2-factor M-CFQ structure was inadequate. The locked measurement model separates Low Energy (items 4–7), Mental Fatigue (8–11), and Physical Fatigue (1–3).",locked:"The locked final SEM uses N=689, ML estimation, 57 parameters, six latent constructs, the Crash History cross-loading, and Letih_RLR ~~ Letih_bwk_laju."}; return <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm leading-6 text-slate-400">{map[keyName] ?? "Model specification note."}</div> }

function StatCard({label,value,sub}:{label:string;value:string;sub:string}){return <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"><div className="text-[10px] uppercase tracking-[.18em] text-slate-500">{label}</div><div className="mt-2 font-mono text-sm text-slate-100">{value}</div><div className="mt-2 text-xs leading-5 text-slate-500">{sub}</div></div>}