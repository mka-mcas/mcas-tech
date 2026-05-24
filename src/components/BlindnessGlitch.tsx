'use client';

import React, { useState } from 'react';

export default function BlindnessGlitch() {
  const [mode, setMode] = useState<'ideal' | 'novice'>('ideal');
  const [hoveredHazard, setHoveredHazard] = useState<string | null>(null);

  // Precision percentage coordinates mapped exactly over your custom image assets
  const hazards = [
    { 
      id: 'bike', 
      num: '1',
      name: 'Bicyclist Against Traffic', 
      x: '20.2%', // Perfectly centers over the bicycle front wheel/headlight
      y: '60.5%', 
      color: 'border-rose-500 text-rose-400 bg-rose-950/90',
      pingColor: 'bg-rose-500',
      desc: 'Static/moving obstruction traveling illegally against traffic directly inside your lane transition path[cite: 1].' 
    },
    { 
      id: 'taxi', 
      num: '2',
      name: 'Taxi Lane-Change Collision Vector', 
      x: '58.0%', // Perfectly centers over the yellow taxi roof light
      y: '58.5%', 
      color: 'border-amber-500 text-amber-400 bg-amber-950/90',
      pingColor: 'bg-amber-500',
      desc: 'Vehicle cutting across lanes. Conflicts like this have an odds ratio of 7.8 for inducing immediate near-crashes[cite: 1].' 
    },
    { 
      id: 'sign', 
      num: '3',
      name: 'Blind Intersection Warning Sign', 
      x: '93.2%', // Perfectly centers over the yellow T-junction road sign
      y: '48.0%', 
      color: 'border-sky-500 text-sky-400 bg-sky-950/90',
      pingColor: 'bg-sky-400',
      desc: 'Critical administrative roadmap marker indicating a high-risk unsignalized merging zone up ahead[cite: 1].' 
    },
    { 
      id: 'oil', 
      num: '4',
      name: 'Emergency Lane Mechanical Slick', 
      x: '11.5%', // Perfectly centers directly on the wet pavement patch
      y: '78.5%', 
      color: 'border-red-500 text-red-400 bg-red-950/90',
      pingColor: 'bg-red-500',
      desc: 'Slick friction trap occupying the shoulder lane. Running over this destroys your contact patch stability instantly[cite: 1].' 
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto my-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-zinc-100 shadow-2xl">
      
      {/* Simulation Control Interface Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">Spatial Threat Matrix</span>
          <h3 className="text-2xl font-black text-white mt-0.5 tracking-tight">ENTRY 1.1: COGNITIVE PERCEPTION TESTING</h3>
        </div>
        
        {/* Toggle Controls */}
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 self-start sm:self-center">
          <button
            onClick={() => setMode('ideal')}
            className={`py-1.5 px-4 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all duration-200 ${
              mode === 'ideal' ? 'bg-sky-500 text-black shadow-lg font-black' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Ideal Consciousness
          </button>
          <button
            onClick={() => setMode('novice')}
            className={`py-1.5 px-4 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all duration-200 ${
              mode === 'novice' ? 'bg-rose-600 text-white shadow-lg font-black' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Novice Reality (20.0%)
          </button>
        </div>
      </div>

      {/* --- Image Stage Canvas Window --- */}
      <div className="relative w-full aspect-video bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden select-none shadow-2xl">
        
        {/* The New High-Res Background Image Asset */}
        <img 
          src="/images/hazards.png" 
          alt="Malaysian Street Road Hazards Night Simulation" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* --- Cognitive Tunneling Blackout Mask Layer --- */}
        {mode === 'novice' && (
          <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-[6px] pointer-events-none z-10 transition-all duration-500 flex items-center justify-center">
            <div className="text-center p-6 bg-black/60 border border-zinc-900 rounded-2xl max-w-xs shadow-2xl animate-in fade-in zoom-in-95 duration-300">
              <span className="text-2xl font-black text-rose-500 tracking-tighter block">SITUATIONAL BLACKOUT</span>
              <p className="text-zinc-500 text-[11px] mt-2 leading-normal font-medium">
                Research data confirms that young novice riders fail to perceive 3 out of 4 critical environment threat vectors simultaneously[cite: 1].
              </p>
            </div>
          </div>
        )}

        {/* --- Absolute Coordinate-Mapped Markers --- */}
        {hazards.map((hazard) => {
          // Novice filter mapping constraint: Only the central vehicle (taxi) remains visible
          const isVisibleInNoviceMode = hazard.id === 'taxi';

          return (
            <div
              key={hazard.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                mode === 'novice' && !isVisibleInNoviceMode ? 'opacity-0 scale-50 pointer-events-none' : 'z-20'
              }`}
              style={{ left: hazard.x, top: hazard.y }}
              onMouseEnter={() => setHoveredHazard(hazard.id)}
              onMouseLeave={() => setHoveredHazard(null)}
            >
              {/* Pulsing Target Radar Glow */}
              <span className={`absolute -inset-3 rounded-full opacity-40 animate-ping duration-1000 ${hazard.pingColor}`} />
              
              {/* Dynamic Number Target Bubble Button */}
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono font-black text-xs shadow-2xl transition-all duration-200 cursor-pointer ${hazard.color} ${
                hoveredHazard === hazard.id ? 'scale-125 border-amber-400 bg-amber-400 text-black font-black' : ''
              }`}>
                {hazard.num}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Dynamic Telemetry Diagnostic Output Dashboard Panel --- */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 mt-4 min-h-[96px] flex flex-col justify-center shadow-inner">
        {hoveredHazard ? (
          <div className="animate-in fade-in duration-150">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">🚨 Active Threat Vectors Scanned</span>
            <h4 className="text-sm font-black text-white mt-0.5">
              {hazards.find(h => h.id === hoveredHazard)?.name}
            </h4>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-medium">
              {hazards.find(h => h.id === hoveredHazard)?.desc}
            </p>
          </div>
        ) : (
          <div className="text-center text-zinc-500 text-xs py-2 font-mono uppercase tracking-wider">
            {mode === 'ideal' 
              ? '✦ Hover your mouse pointer directly over the flashing target bubbles to parse threat logs ✦' 
              : '⚠️ System Failure: Your level 1 perception has dropped to 20.0%. Critical targets are unrendered[cite: 1].'}
          </div>
        )}
      </div>
      
    </div>
  );
}