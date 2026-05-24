'use client';

import React, { useState } from 'react';

export default function InteractiveLagVisualizer() {
  // Speed in km/h controlled by user slider/mouse drag
  const [speed, setSpeed] = useState<number>(92); // Default to Figure 4 speed
  
  // Average perception-reaction time from your paper's parameters
  const reactionTime = 1.5; 

  // Derived calculations
  const speedMetersPerSecond = Math.round((speed * 1000) / 3600 * 10) / 10;
  const lagDistance = Math.round(speedMetersPerSecond * reactionTime * 10) / 10;
  
  // Rough estimate of braking distance based on standard dry asphalt friction (mu = 0.7)
  const brakingDistance = Math.round((Math.pow(speedMetersPerSecond, 2) / (2 * 0.7 * 9.81)) * 10) / 10;
  const totalStoppingDistance = Math.round((lagDistance + brakingDistance) * 10) / 10;

  // Car length metric (approx 4.5m per car)
  const carLengths = Math.round((lagDistance / 4.5) * 10) / 10;

  return (
    <div className="w-full max-w-4xl mx-auto my-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-zinc-100 shadow-2xl">
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Interactive Telemetry Module</span>
        <h3 className="text-2xl font-black text-white mt-1">THE KINETIC LAG CALCULATOR</h3>
        <p className="text-zinc-400 text-sm mt-1">
          Based on real-world test speeds from Figure 4. Drag the throttle slider to visualize your human hardware lag.
        </p>
      </div>

      {/* --- Control Panel Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-zinc-950 p-6 rounded-xl border border-zinc-800">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            Riding Speed (Throttle)
          </label>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-white tracking-tight">{speed}</span>
            <span className="text-zinc-500 font-bold text-sm">KM/H</span>
          </div>
          <input
            type="range"
            min="30"
            max="160"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer mt-4 accent-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            Your Biological Ping
          </label>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-amber-400 tracking-tight">{reactionTime}</span>
            <span className="text-zinc-500 font-bold text-sm">SECONDS (LAG)</span>
          </div>
          <p className="text-xs text-zinc-500 mt-3">Universal baseline for dynamic hazard anticipation.</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            Velocity Vector
          </label>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-sky-400 tracking-tight">{speedMetersPerSecond}</span>
            <span className="text-zinc-500 font-bold text-sm">M/S</span>
          </div>
          <p className="text-xs text-zinc-500 mt-3">Distance eaten alive by your bike every single second.</p>
        </div>
      </div>

      {/* --- Real-Time Visual Track --- */}
      <div className="relative w-full bg-zinc-950 rounded-xl p-6 border border-zinc-800 overflow-hidden mb-6">
        <div className="text-xs font-bold text-zinc-500 uppercase mb-4 tracking-wider">Dynamic Crash Timeline Mapping</div>
        
        {/* Track Line */}
        <div className="relative w-full h-4 bg-zinc-800 rounded-full my-8">
          {/* Lag Zone (Orange) */}
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-l-full transition-all duration-150"
            style={{ width: `${Math.min((lagDistance / totalStoppingDistance) * 100, 100)}%` }}
          />
          {/* Braking Zone (Red) */}
          <div 
            className="absolute top-0 h-full bg-gradient-to-r from-amber-500 to-rose-600 rounded-r-full transition-all duration-150"
            style={{ 
              left: `${(lagDistance / totalStoppingDistance) * 100}%`,
              width: `${(brakingDistance / totalStoppingDistance) * 100}%` 
            }}
          />

          {/* Draggable/Moving Motorcycle Indicator Dot */}
          <div 
            className="absolute -top-3 w-10 h-10 bg-white border-4 border-emerald-500 rounded-full flex items-center justify-center shadow-lg transform -translate-x-1/2 transition-all duration-150 cursor-grab active:cursor-grabbing"
            style={{ left: `${(lagDistance / totalStoppingDistance) * 100}%` }}
          >
            🏍️
          </div>
          
          {/* Sudden Hazard Object Wall */}
          <div className="absolute right-0 -top-4 w-2 h-12 bg-rose-500 animate-pulse rounded-full" />
        </div>

        {/* Labels underneath tracking timeline */}
        <div className="flex justify-between text-xs font-mono text-zinc-500 px-1">
          <div>[0m] Hazard Spawns</div>
          <div className="text-amber-400 text-center font-bold">
            [{lagDistance}m] Physical Lever Compressed
          </div>
          <div className="text-rose-500 text-right font-bold">
            [{totalStoppingDistance}m] Full Stop / Impact
          </div>
        </div>
      </div>

      {/* --- Bottom Analytical Insights --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center space-x-4">
          <div className="text-3xl">🫥</div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wide">Blind Lag Zone</h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              You ride through <span className="text-amber-400 font-bold">{lagDistance} meters</span> ({carLengths} car lengths) completely blind before your brakes even begin to grab.
            </p>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center space-x-4">
          <div className="text-3xl">🛑</div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wide">Total Kinetic Output</h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              To fully bleed off this speed requires a massive <span className="text-rose-400 font-bold">{totalStoppingDistance} meters</span> of completely clear asphalt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}