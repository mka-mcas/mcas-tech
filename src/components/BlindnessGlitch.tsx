'use client';

import React, { useState } from 'react';

export default function BlindnessGlitch() {
  const [mode, setMode] = useState<'ideal' | 'novice'>('ideal');
  const [hoveredHazard, setHoveredHazard] = useState<string | null>(null);

  // Precision mapped hazards based directly on your MRSAA/SAGAT criteria (Table 1)
  const hazards = [
    { 
      id: 'bike', 
      name: 'Bicyclist Against Traffic', 
      x: '18%', 
      y: '62%', 
      color: 'border-rose-500 text-rose-400 bg-rose-950/80',
      pingColor: 'bg-rose-500',
      desc: 'Static/moving obstruction traveling illegally against traffic directly inside your lane transition path.' 
    },
    { 
      id: 'taxi', 
      name: 'Taxi Lane-Change Collision Vector', 
      x: '55%', 
      y: '48%', 
      color: 'border-amber-500 text-amber-400 bg-amber-950/80',
      pingColor: 'bg-amber-500',
      desc: 'Vehicle cutting across lanes. Conflicts like this have an odds ratio of 7.8 for inducing immediate near-crashes.' 
    },
    { 
      id: 'sign', 
      name: 'Blind Intersection Warning Sign', 
      x: '78%', 
      y: '28%', 
      color: 'border-sky-500 text-sky-400 bg-sky-950/80',
      pingColor: 'bg-sky-400',
      desc: 'Critical administrative roadmap marker indicating a high-risk unsignalized merging zone up ahead.' 
    },
    { 
      id: 'oil', 
      name: 'Emergency Lane Mechanical Slick', 
      x: '32%', 
      y: '82%', 
      color: 'border-red-500 text-red-400 bg-red-950/80',
      pingColor: 'bg-red-500',
      desc: 'Slick friction trap occupying the shoulder lane. Running over this destroys your contact patch stability instantly.' 
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-zinc-100 shadow-2xl">
      
      {/* Header Info Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Spatial Threat Overlay</span>
          <h3 className="text-2xl font-black text-white mt-0.5 tracking-tight">ENTRY 1.1: THE VISUAL PERCEPTION MATRIX</h3>
        </div>
        
        {/* State Selection Toggle */}
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 self-start md:self-center">
          <button
            onClick={() => setMode('ideal')}
            className={`py-1.5 px-4 rounded-lg font-bold text-[11px] uppercase tracking-wider transition ${
              mode === 'ideal' ? 'bg-sky-500 text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Ideal Sight
          </button>
          <button
            onClick={() => setMode('novice')}
            className={`py-1.5 px-4 rounded-lg font-bold text-[11px] uppercase tracking-wider transition ${
              mode === 'novice' ? 'bg-rose-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Novice Reality
          </button>
        </div>
      </div>

      {/* --- Perspective Graphical Canvas Window --- */}
      <div className="relative w-full aspect-video bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden select-none">
        
        {/* Native Vector Background Picture System - Simulating a Malaysian Multi-Lane Highway */}
        <svg className="absolute inset-0 w-full h-full text-zinc-800" viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Horizon Line / Sky Cap */}
          <rect width="800" height="180" fill="#05070c" />
          <line x1="0" y1="180" x2="800" y2="180" stroke="#1f2937" strokeWidth="2" />
          
          {/* Asphalt Road Body Base */}
          <path d="M360 180 L440 180 L750 450 L50 450 Z" fill="#0e131f" />
          
          {/* Perspective Lane Dividers */}
          <line x1="380" y1="180" x2="225" y2="450" stroke="#3f3f46" strokeWidth="2" strokeDasharray="8 6" />
          <line x1="420" y1="180" x2="575" y2="450" stroke="#3f3f46" strokeWidth="2" strokeDasharray="8 6" />
          
          {/* Left Emergency Shoulder Lane Borders */}
          <line x1="360" y1="180" x2="50" y2="450" stroke="#e4e4e7" strokeWidth="3" />
          
          {/* T-Junction Breakout Influx Cutout (Right Side Entering Lane) */}
          <path d="M440 180 L490 240 L800 360 L800 450 L750 450 Z" fill="#0b0e17" />
          <line x1="440" y1="180" x2="750" y2="450" stroke="#e4e4e7" strokeWidth="3" strokeDasharray="12 8" />
          
          {/* Stylized Visual Obstruction Element (Truck Blockade Drawing near junction) */}
          <path d="M480 200 L530 200 L560 250 L500 250 Z" fill="#18181b" stroke="#27272a" />
          <text x="502" y="230" fill="#52525b" fontSize="10" fontFamily="monospace" fontWeight="bold">ASSET BLOCK</text>
        </svg>

        {/* --- Dynamic Blackout Overlay Filter for Novice Mode --- */}
        {mode === 'novice' && (
          <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-[5px] pointer-events-none z-10 transition-all duration-500 flex items-center justify-center">
            <div className="text-center p-6 bg-black/40 border border-zinc-900 rounded-2xl max-w-xs shadow-2xl animate-in fade-in zoom-in-95 duration-300">
              <span className="text-2xl font-black text-rose-500 tracking-tighter block">COGNITIVE TUNNELING</span>
              <p className="text-zinc-500 text-[11px] mt-1.5 leading-normal">
                Your brain is running at max processing capacity[cite: 53]. Look how 3 critical environmental threats completely vanished[cite: 111].
              </p>
            </div>
          </div>
        )}

        {/* --- Graphic Mapped Hazard Markers Overlaid over the Canvas --- */}
        {hazards.map((hazard) => {
          // Simulation Filter: Only the central prominent vehicle (the taxi) passes through the Novice SA gap [cite: 17, 110]
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
              {/* Outer Glowing Stroke Ring Animation */}
              <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ backgroundColor: hoveredHazard === hazard.id ? '#fbbf24' : 'transparent' }} />
              <span className={`absolute -inset-2 rounded-full opacity-40 animate-ping ${hazard.pingColor}`} />
              
              {/* Core Warning Target Box Node */}
              <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black text-base shadow-2xl transition-all duration-200 cursor-pointer ${hazard.color} ${
                hoveredHazard === hazard.id ? 'scale-110 ring-4 ring-amber-400/20 border-amber-400 bg-amber-400 text-black' : ''
              }`}>
                {hazard.id === 'bike' && '🚲'}
                {hazard.id === 'taxi' && '🚗'}
                {hazard.id === 'sign' && '🛑'}
                {hazard.id === 'oil' && '⚠️'}
              </div>
            </div>
          );
        })}

        {/* Bottom Cockpit Interface Label */}
        <div className="absolute bottom-4 left-6 flex items-center space-x-2 bg-black/80 border border-zinc-800 rounded-lg px-3 py-1 text-[10px] font-mono tracking-widest text-zinc-500 z-30 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>VELOCITY STEADY: 92 KM/H [cite: 75, 81]</span>
        </div>
      </div>

      {/* --- Dynamic Analytical Output Terminal Feed --- */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 min-h-[96px] flex flex-col justify-center shadow-inner">
        {hoveredHazard ? (
          <div className="animate-in fade-in duration-150">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">🚨 Threat Vector Diagnostic Locked</span>
            <h4 className="text-sm font-black text-white mt-0.5">
              {hazards.find(h => h.id === hoveredHazard)?.name}
            </h4>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              {hazards.find(h => h.id === hoveredHazard)?.desc}
            </p>
          </div>
        ) : (
          <div className="text-center text-zinc-500 text-xs py-2 font-mono uppercase tracking-wider">
            {mode === 'ideal' 
              ? '✦ Move your mouse exactly over the glowing hazard nodes to analyze the telemetry ✦' 
              : '⚠️ Level 1 perception among novice youth is only 20.0%[cite: 118]. The environment has hidden your traps[cite: 111].'}
          </div>
        )}
      </div>
      
    </div>
  );
}