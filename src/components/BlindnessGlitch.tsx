'use client';

import React, { useState } from 'react';

export default function BlindnessGlitch() {
  const [mode, setMode] = useState<'ideal' | 'novice'>('ideal');
  const [hoveredHazard, setHoveredHazard] = useState<string | null>(null);

  // Hazards dictionary mapping to the SAGAT/MRSAA queries in Table 1
  const hazards = [
    { id: 'taxi', name: 'Taxi Pulling Out', x: '72%', y: '42%', desc: 'A vehicle preparing to change lanes into your path, causing an immediate conflict.' },
    { id: 'bike', name: 'Bicyclist Against Traffic', x: '15%', y: '55%', desc: 'A high-risk static/moving obstruction traveling the wrong way up your lane.' },
    { id: 'sign', name: 'Blind Junction Sign', x: '82%', y: '20%', desc: 'Crucial advisory warning indicating an upcoming unsignalized cross-intersection.' },
    { id: 'oil', name: 'Emergency Lane Spill', x: '45%', y: '78%', desc: 'A slick mechanical surface patch occupying your primary trail-braking line.' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-zinc-100 shadow-2xl">
      
      {/* Header Info */}
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Interactive Spatial Simulation</span>
        <h3 className="text-2xl font-black text-white mt-1">ENTRY 1.1: THE VISUAL PERCEPTION MATRIX</h3>
        <p className="text-zinc-400 text-sm mt-1">
          Toggle between what you think you see versus the raw cognitive reality proved by real-world Malaysian telemetry data.
        </p>
      </div>

      {/* --- Mode Toggle Controls --- */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setMode('ideal')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold tracking-wide text-xs uppercase transition border ${
            mode === 'ideal'
              ? 'bg-sky-500/10 border-sky-500 text-sky-400'
              : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'
          }`}
        >
          🔮 Ideal Consciousness (100% Sight)
        </button>
        <button
          onClick={() => setMode('novice')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold tracking-wide text-xs uppercase transition border ${
            mode === 'novice'
              ? 'bg-rose-500/10 border-rose-500 text-rose-500 animate-pulse'
              : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'
          }`}
        >
          🛞 Novice Youth Reality (20.0% Perception)
        </button>
      </div>

      {/* --- Main Simulation Window --- */}
      <div className="relative w-full aspect-video bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden group select-none">
        
        {/* Synthetic Highway T-Junction Vector Grid */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute w-full h-1 bg-zinc-700 top-1/2 transform -translate-y-1/2" />
          <div className="absolute w-full h-1 border-t border-dashed border-zinc-500 top-2/3" />
          <div className="absolute w-1/3 h-full border-r border-zinc-700 right-1/4 top-0" />
        </div>

        {/* Dynamic Blackout Filter Layer simulating the 80% Blindness Glitch */}
        {mode === 'novice' && (
          <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-[6px] pointer-events-none z-10 transition-all duration-300 flex items-center justify-center">
            <div className="text-center p-4 max-w-sm">
              <span className="text-3xl font-black text-rose-500 tracking-tighter">80.0% BLINDNESS</span>
              <p className="text-zinc-500 text-xs mt-1">
                Data shows youth brains fail to process 4 out of 5 critical hazards developing on the open road.
              </p>
            </div>
          </div>
        )}

        {/* Interactive Hazard Elements */}
        {hazards.map((hazard) => {
          // Check if this specific element slips past the novice filter loop
          const isVisibleInNoviceMode = hazard.id === 'taxi'; // Only 1 out of 4 is visible (~25%)

          return (
            <div
              key={hazard.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-lg cursor-pointer transition-all duration-300 ${
                mode === 'novice' && !isVisibleInNoviceMode ? 'opacity-0 scale-50 pointer-events-none' : 'z-20'
              }`}
              style={{ left: hazard.x, top: hazard.y }}
              onMouseEnter={() => setHoveredHazard(hazard.id)}
              onMouseLeave={() => setHoveredHazard(null)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg transition ${
                hoveredHazard === hazard.id ? 'bg-amber-400 text-black scale-125 ring-4 ring-amber-400/30' : 'bg-zinc-800 text-white border border-zinc-700'
              }`}>
                ⚠️
              </div>
            </div>
          );
        })}

        {/* Center Target Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 border border-zinc-800 rounded-full px-4 py-1.5 text-[10px] font-mono tracking-widest text-zinc-400 z-30 pointer-events-none">
          YOUR FRONT WHEEL AXIS // PACING AT 92 KM/H
        </div>
      </div>

      {/* --- Dynamic Data Feed Output Panel --- */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 min-h-[90px] flex flex-col justify-center">
        {hoveredHazard ? (
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">Threat Detected</span>
            <h4 className="text-sm font-bold text-white mt-0.5">
              {hazards.find(h => h.id === hoveredHazard)?.name}
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              {hazards.find(h => h.id === hoveredHazard)?.desc}
            </p>
          </div>
        ) : (
          <div className="text-center text-zinc-500 text-xs py-2 font-mono">
            {mode === 'ideal' 
              ? '✦ HOVER YOUR MOUSE OVER THE WARNING ICONS TO SCAN THE ENVIRONMENT ✦' 
              : '🚨 THE COGNITIVE MATRIX HAS SATURATED. NOTICE HOW 3 CRITICAL THREATS COMPLETELY DISAPPEARED.'}
          </div>
        )}
      </div>
      
    </div>
  );
}