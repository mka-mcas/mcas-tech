'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

interface Hotspot {
  id: string;
  top: string;    // Percentage from top of page image
  left: string;   // Percentage from left of page image
  width: string;  // Width of target zone
  height: string; // Height of target zone
  title: string;
  explanation: string;
}

interface VisualPage {
  pageNumber: number;
  imageSrc: string;
  title: string;
  subtitle: string;
  hotspots: Hotspot[];
}

// Coordinate maps aligned directly with the book pages
const visualKitabData: VisualPage[] = [
  {
    pageNumber: 21, // Chapter 1 start page
    imageSrc: "/images/kitab/page-21.png", 
    title: "Chapter 1: At-Tauhid",
    subtitle: "The foundational objective of creation",
    hotspots: [
      {
        id: "ch1-v1",
        top: "33%", 
        left: "15%",
        width: "70%",
        height: "8%",
        title: "The Purpose of Existence",
        explanation: "Reflecting on Issue #1 from the chapter text: The profound purpose behind creating both Jinn and mankind is exclusively dedicated to establishing conscious dependency and worship of Allah Alone."
      },
      {
        id: "ch1-v2",
        top: "43%",
        left: "15%",
        width: "70%",
        height: "10%",
        title: "The Universal Mission",
        explanation: "Reflecting on Issue #4 & #5: Every community across historical timelines received a Messenger with the identical core directive—to affirm Tauhid and explicitly reject Taghut (false objects of worship)."
      }
    ]
  },
  {
    pageNumber: 27, // Chapter 2 start page
    imageSrc: "/images/kitab/page-27.png",
    title: "Chapter 2: Superiority of Tauhid",
    subtitle: "The weight of monotheism on the cosmic scale",
    hotspots: [
      {
        id: "ch2-v1",
        top: "35%",
        left: "10%",
        width: "80%",
        height: "12%",
        title: "The Absolute Metric of Safety",
        explanation: "Reflecting on Issue #4 from your text: True protection and guidance are strictly bound to maintaining a pure faith that is never contaminated or compromised by major or minor Shirk."
      }
    ]
  }
];

export default function InteractiveVisualReader() {
  const { user } = useAuth();
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  // 🛡️ Guard Gate remains intact
  if (!user) {
    return (
      <div className="min-h-screen bg-[#060911] text-zinc-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center shadow-2xl">
          <span className="text-4xl block mb-3">🔒</span>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Private Access Restricted</h2>
          <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
            This workspace houses private research content pipelines. Access is locked until your profile permissions are explicitly updated.
          </p>
        </div>
      </div>
    );
  }

  const currentPage = visualKitabData[activePageIndex];

  return (
    <div className="min-h-screen bg-[#070a13] text-zinc-100 pt-[80px]">
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- Left Panel: Interactive Visual Map Console (7 Columns) --- */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between bg-zinc-950 p-4 border border-zinc-900 rounded-xl">
            <div className="flex gap-2">
              {visualKitabData.map((page, idx) => (
                <button
                  key={page.pageNumber}
                  onClick={() => { setActivePageIndex(idx); setSelectedHotspot(null); }}
                  className={`py-1.5 px-3 rounded-lg text-xs font-mono font-bold transition-all ${
                    activePageIndex === idx ? 'bg-sky-500 text-black' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'
                  }`}
                >
                  PAGE {page.pageNumber}
                </button>
              ))}
            </div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Asset Mode: High-Res Raster Snapshots
            </span>
          </div>

          {/* Interactive Document Viewport Wrapper */}
          <div className="relative bg-zinc-950 rounded-2xl border border-zinc-800 p-4 flex justify-center shadow-2xl overflow-hidden group">
            <div className="relative w-full max-w-xl aspect-[1/1.5]">
              
              {/* The Absolute Core Snapshot Image Asset */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={currentPage.imageSrc} 
                alt={currentPage.title}
                className="w-full h-full object-contain rounded-lg pointer-events-none select-none shadow-md"
              />

              {/* Absolute Overlay Coordinate Map Nodes */}
              {currentPage.hotspots.map((hotspot) => (
                <button
                  key={hotspot.id}
                  onClick={() => setSelectedHotspot(hotspot)}
                  style={{
                    top: hotspot.top,
                    left: hotspot.left,
                    width: hotspot.width,
                    height: hotspot.height,
                  }}
                  className={`absolute rounded transition-all duration-200 border cursor-pointer ${
                    selectedHotspot?.id === hotspot.id
                      ? 'bg-sky-500/10 border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.3)] animate-pulse'
                      : 'bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20 hover:border-amber-400/60'
                  }`}
                  title="Click to process text node mapping"
                />
              ))}

            </div>
          </div>
        </div>

        {/* --- Right Panel: Analytical Breakdown Terminal (5 Columns) --- */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 h-full flex flex-col justify-between min-h-[400px]">
            
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-400 block mb-1">
                Diagnostic Console // Layer 03
              </span>
              <h3 className="text-xl font-black text-white tracking-tight uppercase">
                {currentPage.title}
              </h3>
              <p className="text-zinc-500 text-xs mt-1 border-b border-zinc-900 pb-4">
                {currentPage.subtitle}
              </p>

              {/* Dynamic Coordinate Output Terminal View */}
              {selectedHotspot ? (
                <div className="mt-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="inline-block bg-sky-500/10 border border-sky-500/30 px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400">
                    ✦ Target Lock: {selectedHotspot.title}
                  </div>
                  <h4 className="text-base font-bold text-zinc-200 mt-2">
                    Textbook Insights Contextualization:
                  </h4>
                  <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                    {selectedHotspot.explanation}
                  </p>
                </div>
              ) : (
                <div className="mt-12 text-center max-w-xs mx-auto text-zinc-600">
                  <span className="text-3xl block mb-2">🎯</span>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    No Target Zone Active
                  </h5>
                  <p className="text-[11px] mt-1 text-zinc-500 leading-normal">
                    Click directly onto any highlighted verse or text block on the left manuscript page image to process its specific contextual textbook breakdown.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Informational Bottom Banner */}
            <div className="bg-zinc-900/40 border border-zinc-800/60 p-4 rounded-xl mt-6">
              <p className="text-[10px] font-mono text-zinc-500 leading-relaxed uppercase">
                Note: Image snapshots protect sacred Arabic diacritics perfectly against client browser typesetting crashes while keeping user notes highly accessible.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}