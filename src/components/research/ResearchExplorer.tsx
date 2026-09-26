"use client";

import React, { useEffect, useState } from "react";
import {
  Activity, ArrowRight, BarChart3, BookOpen, CheckCircle2, ChevronRight,
  CircleHelp, FlaskConical, GitBranch, Info, Play, RotateCcw, ShieldCheck,
  SlidersHorizontal, Sparkles, Video, X, ZoomIn, Move
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from "recharts";
import { evidenceLegend, provenance, studyFacts } from "@/data/research-explorer";
import { paperMeta, paperPages, paperSections } from "@/data/research-paper";
import type { LucideIcon } from "lucide-react";

type Tab = "overview" | "paper" | "study" | "methods" | "data" | "simulation" | "framework" | "provenance";

const tabItems: Array<[Tab,string,string]> = [
  ["overview","01","Research"],
  ["paper","02","Paper"],
  ["study","03","Study"],
  ["methods","04","Methods"],
  ["data","05","Data"],
  ["simulation","06","Monte Carlo"],
  ["framework","07","Framework Lab"],
  ["provenance","08","Evidence"]
];

function EvidenceBadge({ kind }: { kind: "observed"|"derived"|"simulated"|"scenario" }) {
  const map = {
    observed: ["Observed","bg-sky-500/10 text-sky-300 border-sky-500/20"],
    derived: ["Derived","bg-emerald-500/10 text-emerald-300 border-emerald-500/20"],
    simulated: ["Simulated","bg-violet-500/10 text-violet-300 border-violet-500/20"],
    scenario: ["Scenario","bg-amber-500/10 text-amber-300 border-amber-500/20"]
  } as const;
  const [label, cls] = map[kind];
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-wider ${cls}`}>{label}</span>;
}

function Card({children, className=""}:{children:React.ReactNode;className?:string}) {
  return <section className={`rounded-2xl border border-slate-800 bg-[#0b111c] ${className}`}>{children}</section>;
}

function Metric({label,value,sub,kind="observed"}:{label:string;value:string;sub:string;kind?:"observed"|"derived"|"simulated"|"scenario"}) {
  return <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
    <div className="flex items-center justify-between gap-2"><span className="text-[9px] font-mono uppercase tracking-wider text-slate-500">{label}</span><EvidenceBadge kind={kind}/></div>
    <div className="mt-2 font-mono text-2xl font-semibold text-white">{value}</div>
    <div className="mt-1 text-[11px] leading-5 text-slate-500">{sub}</div>
  </div>;
}

function clamp(v:number,min:number,max:number){return Math.min(max,Math.max(min,v));}
function normal(rng:()=>number){let u=0,v=0;while(u===0)u=rng();while(v===0)v=rng();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
function mulberry32(seed:number){return function(){let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
function mean(a:number[]){return a.reduce((x,y)=>x+y,0)/a.length;}
function variance(a:number[]){const m=mean(a);return a.reduce((s,x)=>s+(x-m)**2,0)/(a.length-1);}
function welchT(a:number[],b:number[]){const ma=mean(a),mb=mean(b),va=variance(a),vb=variance(b);const se=Math.sqrt(va/a.length+vb/b.length);return se?Math.abs(ma-mb)/se:0;}
function normalPApprox(t:number){return 2*(1-0.5*(1+erf(t/Math.sqrt(2))));}
function erf(x:number){const sign=x<0?-1:1; x=Math.abs(x); const a1=.254829592,a2=-.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=.3275911; const t=1/(1+p*x); return sign*(1-((((a5*t+a4)*t+a3)*t+a2)*t+a1)*t*Math.exp(-x*x));}

export default function ResearchExplorer(){
  const [tab,setTab]=useState<Tab>("overview");
  const [light,setLight]=useState(false);
  return <div className={light ? "research-light min-h-screen bg-slate-50 text-slate-900" : "min-h-screen bg-[#070b12] text-slate-100"}>
    <header className="border-b border-slate-800/80 bg-[#0b101b]/95">
      <div className="mx-auto max-w-[1550px] px-5 pb-6 pt-28 md:px-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[.25em] text-violet-400"><FlaskConical size={14}/> Interactive Research Article</div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Research Explorer</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400 md:text-base">From research question to evidence, measurement, analysis and controlled simulation. Explore the study without changing the locked SEM Explorer.</p>
          </div>
          <button onClick={()=>setLight(!light)} className="self-start rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-slate-500">{light ? "Dark mode" : "Daylight mode"}</button>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-4">
          <Metric label="Experiment 1" value="N = 31" sub="Courier riders · MRRT + HPT + knowledge"/>
          <Metric label="Experiment 2" value="N = 264" sub="Motorcyclists · MRSAA / SA"/>
          <Metric label="Total SA" value="23.2%" sub="Reported mean score"/>
          <Metric label="Framework" value="5 domains" sub="IMSEF-MY action architecture"/>
        </div>
      </div>
    </header>

    <main className="mx-auto max-w-[1550px] px-5 py-6 md:px-8">
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {tabItems.map(([id,num,label])=><button key={id} onClick={()=>setTab(id)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${tab===id ? "border-violet-400/50 bg-violet-400/10 text-violet-300" : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white"}`}><span className="mr-2 font-mono text-[9px] text-slate-600">{num}</span>{label}</button>)}
      </div>
      {tab==="overview" && <Overview onGo={setTab}/>}
      {tab==="paper" && <Paper onGo={setTab}/>}
      {tab==="study" && <Study/>}
      {tab==="methods" && <Methods/>}
      {tab==="data" && <DataExplorer/>}
      {tab==="simulation" && <MonteCarlo/>}
      {tab==="framework" && <FrameworkLab/>}
      {tab==="provenance" && <Provenance/>}
    </main>
    <style jsx global>{`
      .research-light { color-scheme: light; background:#f1f5f9 !important; color:#0f172a !important; }
      .research-light header { background:#ffffff !important; border-color:#cbd5e1 !important; }
      .research-light main { color:#0f172a; }
      .research-light .text-slate-100,.research-light .text-slate-200,.research-light .text-white { color:#0f172a !important; }
      .research-light .text-slate-300 { color:#334155 !important; }
      .research-light .text-slate-400 { color:#475569 !important; }
      .research-light .text-slate-500 { color:#64748b !important; }
      .research-light .text-slate-600 { color:#475569 !important; }
      .research-light .text-violet-300 { color:#6d28d9 !important; }
      .research-light .text-violet-400 { color:#7c3aed !important; }
      .research-light .text-sky-300 { color:#0369a1 !important; }
      .research-light .text-sky-400 { color:#0284c7 !important; }
      .research-light .text-emerald-300 { color:#047857 !important; }
      .research-light .text-emerald-400 { color:#059669 !important; }
      .research-light .text-amber-300 { color:#b45309 !important; }
      .research-light .bg-slate-950\/50,.research-light .bg-slate-950\/40,.research-light .bg-slate-950\/30,.research-light .bg-slate-900 { background:#f8fafc !important; }
      .research-light .bg-\[\#070b12\],.research-light .bg-\[\#0b101b\],.research-light .bg-\[\#090e18\],.research-light .bg-\[\#0b111c\] { background:#ffffff !important; }
      .research-light .border-slate-800,.research-light .border-slate-700 { border-color:#cbd5e1 !important; }
      .research-light .border-violet-500\/20 { border-color:#ddd6fe !important; }
      .research-light .hover\:bg-slate-900:hover { background:#f1f5f9 !important; }
      .research-light .hover\:text-white:hover { color:#0f172a !important; }
      .research-light .recharts-cartesian-grid-horizontal line,.research-light .recharts-cartesian-grid-vertical line { stroke:#cbd5e1 !important; }
      .research-light .recharts-text { fill:#475569 !important; }
    `}</style>
  </div>;
}

const paperFigures = [
  {
    page: 1,
    number: 1,
    caption: "Motorcycle fatalities by rider age group (2017–2021)",
    src: "https://www.researchgate.net/publication/411013459/figure/download/fig1/AS%3A11431282315049030%401785435555525/Motorcycle-fatalities-by-rider-age-group-2017-2021-Source-Authors-analysis-of-Royal.png",
    note: "Original figure image"
  },
  {
    page: 1,
    number: 2,
    caption: "Motorcycle injuries by rider age group (2017–2021)",
    src: "https://www.researchgate.net/publication/411013459/figure/download/fig2/AS%3A11431282315049031%401785435555838/Motorcycle-injuries-by-rider-age-group-2017-2021-Source-Authors-analysis-of-Royal.png",
    note: "Original figure image"
  },
  {
    page: 2,
    number: 3,
    caption: "MRRT Motorcycle instrumentation details",
    src: "https://www.researchgate.net/publication/411013459/figure/download/fig3/AS%3A11431282315049032%401785435556028/MRRT-Motorcycle-instrumentation-details.png",
    note: "Original figure image"
  },
  {
    page: 3,
    number: 4,
    caption: "Screenshot of a sample video clip included in the MRSAA",
    src: "https://www.researchgate.net/publication/411013459/figure/download/fig4/AS%3A11431282315049033%401785435556253/Screenshot-of-a-sample-video-clip-included-in-the-MRSAA.png",
    note: "Original figure image"
  },
  {
    page: 4,
    number: 5,
    caption: "Scores across assessment methods (MRRT, Knowledge, HPT)",
    src: "https://www.researchgate.net/publication/411013459/figure/download/fig5/AS%3A11431282315224649%401785435556695/Scores-across-assessment-methods-MRRT-Knowledge-HPT.png",
    note: "Original figure image"
  },
  {
    page: 6,
    number: 6,
    caption: "Integrated Motorcycle Safety Empowerment Framework for Malaysia (IMSEF-MY)",
    src: null,
    note: "Explore the framework interactively in Framework Lab"
  }
] as const;
function PaperCitation({children,onClick}:{children:React.ReactNode;onClick:()=>void}) {
  return <button type="button" onClick={onClick} title="Jump to full bibliography"
    className="rounded px-0.5 text-violet-700 underline decoration-violet-300 underline-offset-2 transition hover:bg-violet-50 hover:text-violet-900">
    {children}
  </button>;
}

function PaperText({text,onCitation}:{text:string;onCitation:()=>void}) {
  const citationPattern = /(\((?=[^()\n]*(?:19|20)\d{2})[^()\n]+\))/g;
  const isCitation = (part:string) => /^\((?=[^()\n]*(?:19|20)\d{2})[^()\n]+\)$/.test(part);
  const lines=text.split("\n");
  return <div className="whitespace-pre-wrap font-serif">
    {lines.map((line,i)=>{
      const parts=line.split(citationPattern);
      return <React.Fragment key={i}>
        {parts.map((part,j)=>isCitation(part) ? <PaperCitation key={j} onClick={onCitation}>{part}</PaperCitation> : <React.Fragment key={j}>{part}</React.Fragment>)}
        {i < lines.length-1 ? "\n" : null}
      </React.Fragment>;
    })}
  </div>;
}

function FigureZoomModal({figure,onClose}:{figure:typeof paperFigures[number];onClose:()=>void}) {
  const [scale,setScale]=useState(1);
  const [offset,setOffset]=useState({x:0,y:0});
  const [dragging,setDragging]=useState(false);
  const [last,setLast]=useState({x:0,y:0});

  useEffect(()=>{
    setScale(1);
    setOffset({x:0,y:0});
  },[figure.number]);

  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      if(e.key==="Escape") onClose();
      if(e.key==="+" || e.key==="=") setScale(s=>Math.min(4,s+0.25));
      if(e.key==="-" || e.key==="_") setScale(s=>Math.max(0.5,s-0.25));
    };
    window.addEventListener("keydown",onKey);
    return ()=>window.removeEventListener("keydown",onKey);
  },[onClose]);

  const reset=()=>{setScale(1);setOffset({x:0,y:0});};

  return <div className="fixed inset-0 z-[100] bg-slate-950/90 p-4 backdrop-blur-sm md:p-8"
    onWheel={e=>{e.preventDefault();setScale(s=>Math.min(4,Math.max(0.5,s+(e.deltaY<0?.15:-.15))))}}>
    <div className="mx-auto flex h-full max-w-[1500px] flex-col overflow-hidden rounded-2xl border border-slate-700 bg-[#0b101b] shadow-2xl">
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 px-4 py-3">
        <div>
          <div className="text-[9px] font-mono uppercase tracking-[.2em] text-violet-400">Figure {figure.number} · Detail view</div>
          <div className="mt-1 text-sm font-semibold text-white">{figure.caption}</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setScale(s=>Math.max(.5,s-.25))} className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300">−</button>
          <span className="min-w-[52px] text-center font-mono text-[10px] text-slate-400">{Math.round(scale*100)}%</span>
          <button onClick={()=>setScale(s=>Math.min(4,s+.25))} className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300">+</button>
          <button onClick={reset} className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300">Reset</button>
          <button onClick={onClose} aria-label="Close figure" className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:text-white"><X size={16}/></button>
        </div>
      </div>
      <div className="relative min-h-0 flex-1 cursor-grab overflow-hidden bg-[#070b12] active:cursor-grabbing"
        onPointerDown={e=>{setDragging(true);setLast({x:e.clientX,y:e.clientY});e.currentTarget.setPointerCapture(e.pointerId)}}
        onPointerMove={e=>{if(!dragging)return;const dx=e.clientX-last.x,dy=e.clientY-last.y;setOffset(o=>({x:o.x+dx,y:o.y+dy}));setLast({x:e.clientX,y:e.clientY})}}
        onPointerUp={()=>setDragging(false)} onPointerCancel={()=>setDragging(false)}>
        {figure.src ? (
          <img src={figure.src} alt={`Figure ${figure.number}: ${figure.caption}`} draggable={false}
            className="absolute left-1/2 top-1/2 max-h-[82vh] max-w-[92vw] select-none object-contain"
            style={{transform:`translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${scale})`,transformOrigin:"center center"}} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="max-w-3xl rounded-2xl border border-violet-500/20 bg-violet-500/5 p-8 text-center">
              <Move className="mx-auto text-violet-300" size={28}/>
              <h3 className="mt-4 text-xl font-semibold text-white">Figure 6 is now an interactive framework entry point.</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">Use the Framework Lab to explore the five action domains rather than treating the framework as a static picture.</p>
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-slate-800 px-4 py-2 text-[10px] text-slate-500">
        <span className="inline-flex items-center gap-1"><ZoomIn size={12}/> Wheel / + / − to zoom</span>
        <span className="mx-3">·</span>
        <span className="inline-flex items-center gap-1"><Move size={12}/> Drag to move</span>
      </div>
    </div>
  </div>;
}

function PaperFigure({figure,onOpen,onFramework}:{figure:typeof paperFigures[number];onOpen:(figure:typeof paperFigures[number])=>void;onFramework:()=>void}) {
  return <figure className="my-8 rounded-2xl border border-slate-300 bg-white p-3 shadow-sm">
    <div className="mb-2 flex items-center justify-between px-1">
      <span className="text-[9px] font-mono uppercase tracking-[.18em] text-slate-500">Figure {figure.number}</span>
      <span className="text-[9px] font-semibold text-violet-700">{figure.src ? "Click to inspect" : "Open interactive framework"} →</span>
    </div>
    {figure.src ? (
      <button type="button" onClick={()=>onOpen(figure)} className="group block w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        <img src={figure.src} alt={figure.caption} className="mx-auto max-h-[430px] w-auto max-w-full object-contain transition duration-300 group-hover:scale-[1.015]" />
      </button>
    ) : (
      <button type="button" onClick={onFramework} className="w-full rounded-xl border border-violet-200 bg-violet-50 p-5 text-left transition hover:border-violet-300 hover:bg-violet-100">
        <div className="grid gap-3 sm:grid-cols-5">
          {["Pre-Licensing","Licensing","Technology","Exposure Control","Retraining"].map((x,i)=><div key={x} className="rounded-lg border border-violet-200 bg-white p-3 text-center text-[10px] font-semibold text-violet-800"><div className="font-mono text-[9px] text-violet-500">0{i+1}</div>{x}</div>)}
        </div>
        <div className="mt-4 text-center text-[10px] text-violet-700">Integrated Motorcycle Safety Empowerment Framework for Malaysia (IMSEF-MY) · interactive view</div>
      </button>
    )}
    <figcaption className="mt-2 px-1 text-[11px] leading-5 text-slate-600">FIGURE {figure.number}. {figure.caption}. <span className="font-semibold text-violet-700">{figure.note}.</span></figcaption>
  </figure>;
}

function Paper({onGo}:{onGo:(t:Tab)=>void}){
  const [page,setPage]=useState(0);
  const [openFigure,setOpenFigure]=useState<typeof paperFigures[number]|null>(null);
  const [readerPulse,setReaderPulse]=useState(false);
  const total=paperPages.length;
  const current=paperPages[page];
  const readerRef=React.useRef<HTMLDivElement>(null);
  const referencesPage=(paperSections.find(s=>s.id==="references")?.page ?? total)-1;

  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      if(e.key==="ArrowRight") setPage(p=>Math.min(total-1,p+1));
      if(e.key==="ArrowLeft") setPage(p=>Math.max(0,p-1));
    };
    window.addEventListener("keydown",onKey);
    return ()=>window.removeEventListener("keydown",onKey);
  },[total]);

  const jump=(targetPage:number)=>{
    setPage(Math.max(0,Math.min(total-1,targetPage-1)));
    requestAnimationFrame(()=>readerRef.current?.scrollIntoView({behavior:"smooth",block:"start"}));
  };

  const goToReferences=()=>{
    setPage(referencesPage);
    setReaderPulse(true);
    requestAnimationFrame(()=>readerRef.current?.scrollIntoView({behavior:"smooth",block:"start"}));
    window.setTimeout(()=>setReaderPulse(false),1400);
  };

  const evidenceLinks=[
    {label:"23.2% total SA",note:"Observed result",go:"data" as Tab},
    {label:"HPT 49.3%",note:"Observed competency result",go:"data" as Tab},
    {label:"MRSAA / SAGAT",note:"Measurement method",go:"methods" as Tab},
    {label:"Table 3",note:"Cohort comparison",go:"data" as Tab},
    {label:"IMSEF-MY",note:"Framework laboratory",go:"framework" as Tab}
  ];

  const pageFigures=paperFigures.filter(f=>f.page===page);
  const renderPageContent=()=>{
    if(!pageFigures.length) return <PaperText text={current} onCitation={goToReferences}/>;
    const nodes:React.ReactNode[]=[];
    let cursor=0;
    for(const fig of pageFigures){
      const marker=\`FIGURE \${fig.number}. \${fig.caption}\`;
      const at=current.indexOf(marker,cursor);
      if(at<0) continue;
      const before=current.slice(cursor,at).trimEnd();
      if(before) nodes.push(<PaperText key={\`text-\${fig.number}\`} text={before} onCitation={goToReferences}/>);
      nodes.push(<PaperFigure key={\`figure-\${fig.number}\`} figure={fig} onOpen={setOpenFigure} onFramework={()=>onGo("framework")}/>);
      cursor=at+marker.length;
    }
    const after=current.slice(cursor).replace(/^\n\n/,"");
    if(after) nodes.push(<PaperText key="text-final" text={after} onCitation={goToReferences}/>);
    return <>{nodes}</>;
  };

  return <div className="space-y-5" ref={readerRef}>
    <Card className="overflow-hidden">
      <div className="border-b border-slate-800 bg-slate-950/50 p-5 md:p-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[.2em] text-violet-400"><BookOpen size={14}/> Living paper reader</div>
            <h2 className="mt-2 text-2xl font-semibold leading-tight md:text-3xl">{paperMeta.title}</h2>
            <p className="mt-3 text-xs text-slate-500">{paperMeta.journal} · pp. {paperMeta.pages} · DOI {paperMeta.doi}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="rounded-full border border-violet-500/20 bg-violet-500/5 px-3 py-1.5 text-violet-300">Original paper</span>
            <span>Page {page+1} of {total}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr]">
        <aside className="border-b border-slate-800 bg-[#090e18] p-4 lg:border-b-0 lg:border-r">
          <div className="text-[9px] font-mono uppercase tracking-[.2em] text-slate-600">Jump to section</div>
          <div className="mt-3 space-y-1">
            {paperSections.map(s=>{
              const next=paperSections.find(x=>x.page>s.page);
              const active=page+1>=s.page && (!next || page+1<next.page);
              return <button key={s.id} onClick={()=>jump(s.page)} className={`w-full rounded-lg px-3 py-2 text-left text-[11px] transition ${active ? "bg-violet-500/10 text-violet-700" : "text-slate-500 hover:bg-slate-900 hover:text-white"}`}><span className="mr-2 font-mono text-[9px] text-slate-500">{s.page}</span>{s.label}</button>;
            })}
          </div>
          <div className="mt-5 border-t border-slate-800 pt-4">
            <div className="text-[9px] font-mono uppercase tracking-[.2em] text-slate-600">Live evidence</div>
            <div className="mt-3 space-y-2">
              {evidenceLinks.map(x=><button key={x.label} onClick={()=>onGo(x.go)} className="w-full rounded-lg border border-slate-800 bg-slate-950/40 p-2.5 text-left hover:border-violet-500/30"><div className="text-[11px] font-semibold text-violet-300">{x.label}</div><div className="mt-0.5 text-[9px] text-slate-600">{x.note} →</div></button>)}
            </div>
            <button onClick={goToReferences} className="mt-2 w-full rounded-lg border border-dashed border-violet-500/30 bg-violet-500/5 p-2.5 text-left">
              <div className="text-[11px] font-semibold text-violet-300">Full bibliography</div>
              <div className="mt-0.5 text-[9px] text-slate-600">Jump to References →</div>
            </button>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3 md:px-8">
            <button disabled={page===0} onClick={()=>setPage(p=>Math.max(0,p-1))} className="inline-flex items-center gap-2 rounded-lg border border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400 disabled:opacity-30 hover:text-white">← Previous</button>
            <div className="hidden text-[10px] font-mono uppercase tracking-[.18em] text-slate-600 sm:block">Use ← → to turn pages</div>
            <button disabled={page===total-1} onClick={()=>setPage(p=>Math.min(total-1,p+1))} className="inline-flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs font-semibold text-violet-300 disabled:opacity-30">Next →</button>
          </div>
          <div className="h-1 bg-slate-900"><div className="h-full bg-violet-500 transition-all" style={{width:`${((page+1)/total)*100}%`}}/></div>

          <article className={`mx-auto min-h-[720px] max-w-4xl bg-[#fbfaf6] px-6 py-9 text-[14px] leading-7 text-slate-800 shadow-inner md:px-12 md:py-12 lg:px-16 ${readerPulse ? "ring-4 ring-violet-300/60" : ""}`}>
            <div className="mb-8 flex items-center justify-between border-b border-slate-300 pb-3 text-[9px] font-mono uppercase tracking-[.18em] text-slate-400">
              <span>{paperMeta.journal}</span><span>{1584+page+1}</span>
            </div>
            {renderPageContent()}
          </article>

          <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/50 px-5 py-4 md:px-8">
            <button disabled={page===0} onClick={()=>setPage(p=>Math.max(0,p-1))} className="text-xs text-slate-500 hover:text-white disabled:opacity-30">← Previous page</button>
            <span className="font-mono text-[10px] text-slate-600">{page+1} / {total}</span>
            <button disabled={page===total-1} onClick={()=>setPage(p=>Math.min(total-1,p+1))} className="text-xs text-violet-300 hover:text-violet-200 disabled:opacity-30">Next page →</button>
          </div>
        </div>
      </div>
    </Card>

    <Card className="border-violet-500/20 bg-violet-500/5 p-5 md:p-6">
      <div className="flex items-start gap-3"><Sparkles className="mt-0.5 text-violet-300" size={17}/><div><h3 className="font-semibold">The paper is now a gateway, not a dead end.</h3><p className="mt-1 text-sm leading-6 text-slate-400">Read page by page, jump directly to sections, inspect the original figures at high zoom, and click an in-text citation to jump to the bibliography. The reader text is transcribed from the supplied article; interactive outputs remain separately labelled from the published record.</p></div></div>
    </Card>
    {openFigure && <FigureZoomModal figure={openFigure} onClose={()=>setOpenFigure(null)}/>}
  </div>;
}
function Overview({onGo}:{onGo:(t:Tab)=>void}){
  const exploreCards: Array<{title:string; desc:string; target:Tab; Icon:LucideIcon}> = [
    {title:"Explore the study", desc:"Follow participants, instruments, videos and research questions.", target:"study", Icon:Video},
    {title:"Inspect the evidence", desc:"Move from reported statistics to distributions and cohort comparisons.", target:"data", Icon:BarChart3},
    {title:"Test assumptions", desc:"Change sample size, effect, noise and intervention assumptions.", target:"simulation", Icon:FlaskConical}
  ];
  return <div className="space-y-5">
    <Card className="p-6 md:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[.2em] text-violet-400">The idea</div>
          <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Don't just read the paper. Interrogate it.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">This interactive companion separates what was observed in the study from what is derived, simulated or hypothetical. It is designed to let readers follow the evidence chain, experience selected methods, and test how statistical conclusions respond to changed assumptions.</p>
          <div className="mt-6 flex flex-wrap gap-2">{evidenceLegend.map(x=><div key={x.key} className="rounded-xl border border-slate-800 bg-slate-950/30 p-3"><EvidenceBadge kind={x.key}/><div className="mt-2 max-w-[180px] text-[11px] leading-5 text-slate-500">{x.note}</div></div>)}</div>
        </div>
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
          <div className="flex items-center gap-2 text-violet-300"><CircleHelp size={16}/><span className="text-xs font-semibold">Scientific boundary</span></div>
          <p className="mt-3 text-sm leading-6 text-slate-400">The Explorer never changes a published p-value. Instead, it changes the assumptions that generate a new simulated p-value. Simulation is labelled separately from empirical evidence.</p>
          <button onClick={()=>onGo("simulation")} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-violet-400">Open Monte Carlo Lab <ArrowRight size={14}/></button>
        </div>
      </div>
    </Card>
    <div className="grid gap-5 md:grid-cols-3">
      {exploreCards.map(({title, desc, target, Icon}) => (
        <button key={target} onClick={()=>onGo(target)} className="rounded-2xl border border-slate-800 bg-[#0b111c] p-5 text-left hover:border-violet-500/40">
          <Icon className="text-violet-400" size={20}/>
          <h3 className="mt-4 font-semibold">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-violet-300">Open <ChevronRight size={13}/></span>
        </button>
      ))}
    </div>
  </div>;
}

function Study(){
  const measures=[
    {title:"Experiment 1",n:"31",items:["MRRT","Hazard Perception Test","Knowledge test"],detail:"The HPT used 12 video clips displaying 31 real-road motorcycle hazards. MRRT used an instrumented 100 cc Honda Wave over a 6.5 km predefined route."},
    {title:"Experiment 2",n:"264",items:["MRSAA","SA Level 1 · Perception","SA Level 2 · Comprehension","SA Level 3 · Projection"],detail:"Participants viewed rider-perspective clips and answered questions at freeze-frame moments using the SAGAT framework."}
  ];
  return <div className="space-y-5">
    <Card className="p-6 md:p-8">
      <div className="text-[10px] font-mono uppercase tracking-[.2em] text-sky-400">01 · Research design</div>
      <h2 className="mt-2 text-2xl font-semibold">Two experiments. Different windows into rider competency.</h2>
      <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">The study combines practical riding performance, hazard perception, theoretical knowledge and situation awareness rather than treating safe riding as a single competency.</p>
    </Card>
    <div className="grid gap-5 md:grid-cols-2">
      {measures.map((m,i)=><Card key={m.title} className="p-6"><div className="flex items-start justify-between"><div><EvidenceBadge kind="observed"/><h3 className="mt-3 text-xl font-semibold">{m.title}</h3></div><div className="font-mono text-3xl text-sky-300">N={m.n}</div></div><div className="mt-5 space-y-2">{m.items.map(x=><div key={x} className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-300"><CheckCircle2 size={14} className="text-emerald-400"/>{x}</div>)}</div><p className="mt-5 text-sm leading-6 text-slate-500">{m.detail}</p></Card>)}
    </div>
    <Card className="p-6">
      <div className="flex items-center gap-2 text-violet-300"><Video size={17}/><h3 className="font-semibold">Original research materials — ready for the next layer</h3></div>
      <p className="mt-2 text-sm leading-6 text-slate-500">The architecture reserves space for the actual HPT/MRSAA clips, participant instructions, questionnaires, scoring sheets and forms. Public access should follow the original consent, ethics, copyright and data-governance conditions.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{["HPT videos","MRSAA videos","Questionnaires","Scoring / forms"].map(x=><div key={x} className="rounded-xl border border-dashed border-slate-700 p-4 text-xs text-slate-500"><span className="font-semibold text-slate-300">{x}</span><br/>Material slot · access policy to be defined</div>)}</div>
    </Card>
  </div>;
}

function Methods(){
  const levels=[
    ["Level 1","Perception","What did you see?","Taxi / road sign recognition"],
    ["Level 2","Comprehension","What does it mean?","Speed / relationship interpretation"],
    ["Level 3","Projection","What happens next?","Potential collision timing"]
  ];
  return <div className="space-y-5">
    <Card className="p-6 md:p-8"><div className="text-[10px] font-mono uppercase tracking-[.2em] text-emerald-400">02 · Measurement</div><h2 className="mt-2 text-2xl font-semibold">Let the reader experience the measurement logic.</h2><p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">The original paper uses the HPT and MRSAA to access higher-order competencies that conventional knowledge or basic riding tests may not fully reveal.</p></Card>
    <div className="grid gap-4 md:grid-cols-3">{levels.map((x,i)=><div key={x[0]} className="rounded-2xl border border-slate-800 bg-[#0b111c] p-5"><div className="font-mono text-[10px] text-emerald-400">{x[0]}</div><h3 className="mt-2 text-lg font-semibold">{x[1]}</h3><div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4"><div className="text-sm font-semibold text-slate-200">“{x[2]}”</div><div className="mt-2 text-xs leading-5 text-slate-500">{x[3]}</div></div><div className="mt-4 text-[10px] uppercase tracking-wider text-slate-600">Instrument layer</div></div>)}</div>
    <Card className="p-6"><div className="flex items-center gap-2"><ShieldCheck size={17} className="text-emerald-400"/><h3 className="font-semibold">Methodological guardrail</h3></div><p className="mt-2 text-sm leading-6 text-slate-500">An interactive recreation can demonstrate the measurement concept. It should not be described as a validated re-administration of the original instrument unless the original scoring, stimuli and protocol are reproduced under the required conditions.</p></Card>
  </div>;
}

function DataExplorer(){
  const rows=[
    {name:"MRRT",value:68.1,sd:21.7},
    {name:"HPT",value:49.3,sd:13.3},
    {name:"Knowledge",value:54.5,sd:14.2}
  ];
  const sa=[{name:"Younger",value:17.9,n:184},{name:"Older",value:35.3,n:79}];
  return <div className="space-y-5">
    <Card className="p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><div className="text-[10px] font-mono uppercase tracking-[.2em] text-sky-400">03 · Reported results</div><h2 className="mt-2 text-2xl font-semibold">Explore the reported numbers before touching simulation.</h2></div><EvidenceBadge kind="observed"/></div></Card>
    <div className="grid gap-5 xl:grid-cols-2">
      <Card className="p-5"><h3 className="font-semibold">Experiment 1 · competency scores</h3><p className="mt-1 text-xs text-slate-500">Means with reported SD.</p><div className="mt-5 h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={rows}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/><XAxis dataKey="name" tick={{fill:"#94a3b8",fontSize:11}}/><YAxis domain={[0,80]} tick={{fill:"#64748b",fontSize:10}}/><Tooltip contentStyle={{background:"#0b111c",border:"1px solid #334155"}}/><Bar dataKey="value" radius={[6,6,0,0]}>{rows.map((_,i)=><Cell key={i} fill={["#38bdf8","#a78bfa","#34d399"][i]}/>)}</Bar></BarChart></ResponsiveContainer></div></Card>
      <Card className="p-5"><h3 className="font-semibold">Experiment 2 · total SA by cohort</h3><p className="mt-1 text-xs text-slate-500">Reported group means.</p><div className="mt-5 h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={sa}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/><XAxis dataKey="name" tick={{fill:"#94a3b8",fontSize:11}}/><YAxis domain={[0,45]} tick={{fill:"#64748b",fontSize:10}}/><Tooltip contentStyle={{background:"#0b111c",border:"1px solid #334155"}}/><Bar dataKey="value" radius={[6,6,0,0]} fill="#38bdf8"/></BarChart></ResponsiveContainer></div></Card>
    </div>
    <div className="grid gap-3 md:grid-cols-4">
      <Metric label="Age effect" value="17.4 pp" sub="Older minus younger mean SA" kind="derived"/>
      <Metric label="t statistic" value="5.93" sub="Reported group comparison"/>
      <Metric label="Age correlation" value="r = .40" sub="Total SA, p < .001"/>
      <Metric label="Exposure correlation" value="r = .13" sub="Total SA, p = .036"/>
    </div>
  </div>;
}

function MonteCarlo(){
  const [n,setN]=useState(100);
  const [effect,setEffect]=useState(1);
  const [noise,setNoise]=useState(1);
  const [runs,setRuns]=useState(5000);
  const [cohort,setCohort]=useState("observed");
  const [result,setResult]=useState<{hist:{bin:string,count:number}[];power:number;median:number;mean:number;examples:number[]}|null>(null);
  const run=()=>{
    const rng=mulberry32(20260926+n+Math.round(effect*100)+Math.round(noise*10));
    const m1=17.9;
    const m2=17.9+(35.3-17.9)*effect;
    const sd1=16.4*noise,sd2=23.8*noise;
    const total=Math.max(40,n);
    const youngerShare=cohort==="balanced" ? .5 : cohort==="younger-heavy" ? .7 : 184/(184+79);
    const nYounger=Math.max(20,Math.round(total*youngerShare));
    const nOlder=Math.max(20,total-nYounger);
    const values:number[]=[];let sig=0;
    for(let r=0;r<runs;r++){
      const a:number[]=[],b:number[]=[];
      for(let i=0;i<nYounger;i++){a.push(clamp(m1+normal(rng)*sd1,0,100));}
      for(let i=0;i<nOlder;i++){b.push(clamp(m2+normal(rng)*sd2,0,100));}
      const t=welchT(a,b);const p=normalPApprox(t);const diff=mean(b)-mean(a);
      values.push(diff);if(p<.05)sig++;
    }
    const sorted=[...values].sort((a,b)=>a-b);const meanV=mean(values);
    const bins=12;const min=Math.min(...values),max=Math.max(...values);const width=(max-min||1)/bins;
    const counts=Array.from({length:bins},()=>0);
    values.forEach(v=>counts[Math.min(bins-1,Math.floor((v-min)/width))]++);
    setResult({hist:counts.map((c,i)=>({bin:(min+(i+.5)*width).toFixed(1),count:c})),power:sig/runs*100,median:sorted[Math.floor(sorted.length/2)],mean:meanV,examples:values.slice(0,12)});
  };
  return <div className="space-y-5">
    <Card className="p-6 md:p-8"><div className="flex items-start justify-between gap-5"><div><div className="text-[10px] font-mono uppercase tracking-[.2em] text-violet-400">04 · Monte Carlo laboratory</div><h2 className="mt-2 text-2xl font-semibold">Repeat a synthetic version of the cohort comparison.</h2><p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">The original study reported a 17.4-point difference between older and younger riders. This lab does not alter that result. It generates synthetic studies under your selected assumptions and recomputes an approximate two-group test.</p></div><EvidenceBadge kind="simulated"/></div></Card>
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <Card className="p-5"><div className="flex items-center gap-2 text-violet-300"><SlidersHorizontal size={16}/><h3 className="font-semibold">Simulation controls</h3></div>
        <div className="mt-5 space-y-5">
          <label className="block"><div className="flex justify-between text-xs"><span>Total sample size</span><b className="font-mono">{n}</b></div><input type="range" min="20" max="500" value={n} onChange={e=>setN(Number(e.target.value))} className="mt-2 w-full"/></label>
          <label className="block"><div className="flex justify-between text-xs"><span>Assumed effect multiplier</span><b className="font-mono">{effect.toFixed(2)}×</b></div><input type="range" min=".25" max="1.5" step=".05" value={effect} onChange={e=>setEffect(Number(e.target.value))} className="mt-2 w-full"/></label>
          <label className="block"><div className="flex justify-between text-xs"><span>Noise multiplier</span><b className="font-mono">{noise.toFixed(2)}×</b></div><input type="range" min=".5" max="2" step=".05" value={noise} onChange={e=>setNoise(Number(e.target.value))} className="mt-2 w-full"/></label>
          <label className="block"><div className="flex justify-between text-xs"><span>Simulation runs</span><b className="font-mono">{runs.toLocaleString()}</b></div><select value={runs} onChange={e=>setRuns(Number(e.target.value))} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs"><option value="1000">1,000</option><option value="5000">5,000</option><option value="10000">10,000</option></select></label>
          <label className="block"><span className="text-xs">Cohort assumption</span><select value={cohort} onChange={e=>setCohort(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs"><option value="observed">Observed means</option><option value="balanced">Balanced conceptual cohort</option><option value="younger-heavy">Younger-heavy conceptual cohort</option></select></label>
          <button onClick={run} className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-3 text-xs font-bold text-white hover:bg-violet-400"><Play size={14}/> Run {runs.toLocaleString()} synthetic studies</button>
        </div>
      </Card>
      <Card className="p-5">
        {!result ? <div className="flex min-h-[430px] flex-col items-center justify-center text-center"><Activity size={36} className="text-slate-700"/><h3 className="mt-4 font-semibold">No simulation yet</h3><p className="mt-2 max-w-md text-sm leading-6 text-slate-500">Change an assumption and run the lab. The resulting distribution will be clearly labelled as simulated.</p></div> :
        <div>
          <div className="grid gap-3 sm:grid-cols-3"><Metric label="Median difference" value={result.median.toFixed(1)} sub="Synthetic older − younger" kind="simulated"/><Metric label="Mean difference" value={result.mean.toFixed(1)} sub="Across simulated studies" kind="simulated"/><Metric label="p < .05 frequency" value={result.power.toFixed(1)+"%"} sub="Approximate detection frequency" kind="simulated"/></div>
          <div className="mt-5 h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={result.hist}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/><XAxis dataKey="bin" tick={{fill:"#64748b",fontSize:9}}/><YAxis tick={{fill:"#64748b",fontSize:9}}/><Tooltip contentStyle={{background:"#0b111c",border:"1px solid #334155"}}/><Bar dataKey="count" fill="#a78bfa"/></BarChart></ResponsiveContainer></div>
          <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-5 text-slate-500"><b className="text-amber-300">Simulation note:</b> these are synthetic studies generated from reported group means/SDs with an approximate normal-tail p calculation. They are not replications of the original experiment and should not be presented as new empirical evidence.</div>
        </div>}
      </Card>
    </div>
  </div>;
}

function FrameworkLab(){
  const [training,setTraining]=useState(10),[technology,setTechnology]=useState(10),[exposure,setExposure]=useState(5),[retraining,setRetraining]=useState(5);
  const [result,setResult]=useState<{sa:number;hpt:number;spread:number}|null>(null);
  const run=()=>{
    const hpt=clamp(49.3+training,0,100);
    const sa=clamp(23.2+training*.35+technology*.12+exposure*.08+retraining*.10,0,100);
    const spread=Math.sqrt((training**2+technology**2+exposure**2+retraining**2)/4);
    setResult({sa,hpt,spread});
  };
  const controls=[["Hazard-perception training",training,setTraining,30],["Technology assistance",technology,setTechnology,30],["Exposure control",exposure,setExposure,30],["Retraining",retraining,setRetraining,30]] as const;
  return <div className="space-y-5">
    <Card className="p-6 md:p-8"><div className="flex items-start justify-between gap-5"><div><div className="text-[10px] font-mono uppercase tracking-[.2em] text-amber-400">05 · Framework laboratory</div><h2 className="mt-2 text-2xl font-semibold">Rewind the paper: what if the proposed system were implemented?</h2><p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">This is deliberately a scenario model. The coefficients below are not empirical causal effects from the paper; they are transparent demonstration parameters so readers can see how a framework simulator works.</p></div><EvidenceBadge kind="scenario"/></div></Card>
    <div className="grid gap-5 xl:grid-cols-[390px_1fr]">
      <Card className="p-5"><h3 className="font-semibold">Build an intervention scenario</h3><div className="mt-5 space-y-5">{controls.map(([label,value,set,max])=><label key={label} className="block"><div className="flex justify-between text-xs"><span>{label}</span><b className="font-mono">{value}%</b></div><input type="range" min="0" max={max} value={value} onChange={e=>set(Number(e.target.value))} className="mt-2 w-full"/></label>)}<button onClick={run} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-xs font-bold text-slate-950 hover:bg-amber-400"><Sparkles size={14}/> Simulate scenario</button><button onClick={()=>{setTraining(10);setTechnology(10);setExposure(5);setRetraining(5);setResult(null)}} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-xs font-semibold text-slate-400 hover:text-white"><RotateCcw size={14}/> Reset</button></div></Card>
      <Card className="p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5"><div className="text-[10px] font-mono uppercase text-slate-500">Observed baseline</div><div className="mt-3 text-4xl font-mono font-semibold text-white">23.2%</div><div className="mt-1 text-xs text-slate-500">Total SA mean in the study</div></div>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5"><div className="text-[10px] font-mono uppercase text-amber-300">Scenario output</div><div className="mt-3 text-4xl font-mono font-semibold text-white">{result ? result.sa.toFixed(1)+"%" : "—"}</div><div className="mt-1 text-xs text-slate-500">Synthetic framework score under explicit demo assumptions</div></div>
        </div>
        {result && <div className="mt-5 grid gap-4 md:grid-cols-2"><Metric label="Simulated HPT" value={result.hpt.toFixed(1)+"%"} sub="Baseline 49.3% + user-selected training assumption" kind="scenario"/><Metric label="Scenario spread" value={result.spread.toFixed(1)} sub="Simple sensitivity index; not an effect estimate" kind="scenario"/></div>}
        <div className="mt-5 grid gap-3 md:grid-cols-5">{studyFacts.framework.map((x,i)=><div key={x} className="rounded-xl border border-slate-800 bg-slate-950/30 p-3 text-center"><div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-300 font-mono text-xs">{i+1}</div><div className="mt-2 text-[11px] font-semibold">{x}</div></div>)}</div>
        <div className="mt-5 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 text-xs leading-5 text-slate-500"><b className="text-violet-300">Important:</b> the scenario engine is intentionally illustrative in v0.1. Before publication, intervention-effect parameters should be replaced by defensible estimates from experimental, quasi-experimental or other appropriate evidence, with uncertainty propagated through the model.</div>
      </Card>
    </div>
  </div>;
}

function Provenance(){
  return <div className="space-y-5">
    <Card className="p-6 md:p-8"><div className="flex items-center gap-2 text-emerald-300"><GitBranch size={17}/><span className="text-[10px] font-mono uppercase tracking-[.2em]">06 · Evidence provenance</span></div><h2 className="mt-2 text-2xl font-semibold">Every number should tell you where it came from.</h2><p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">This layer is designed to prevent the Explorer from blurring observed findings, calculations and simulations. Later versions can connect each item to a page, table, dataset field, video, form or analysis script.</p></Card>
    <div className="grid gap-3 md:grid-cols-2">{provenance.map(p=><div key={p.id} className="rounded-2xl border border-slate-800 bg-[#0b111c] p-5"><div className="flex items-center justify-between gap-3"><h3 className="font-semibold">{p.title}</h3><EvidenceBadge kind={p.status}/></div><p className="mt-3 text-sm leading-6 text-slate-500">{p.detail}</p><div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-slate-600"><Info size={12}/> Source trace slot · ready for citation binding</div></div>)}</div>
    <Card className="p-5"><div className="flex items-center gap-2"><BookOpen size={16} className="text-sky-400"/><h3 className="font-semibold">Publication boundary</h3></div><p className="mt-2 text-sm leading-6 text-slate-500">The published article remains the immutable scholarly record. This Explorer is the interactive companion. Simulations and scenarios should be versioned and clearly distinguished from the paper's empirical results.</p></Card>
  </div>;
}
