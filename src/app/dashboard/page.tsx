'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

// Mock Telemetry Pipeline Feeds (To be wired directly to Supabase realtime triggers later)
const riskTrendData = [
  { name: 'Jan 01', events: 12 },
  { name: 'Jan 05', events: 19 },
  { name: 'Jan 10', events: 15 },
  { name: 'Jan 15', events: 28 },
  { name: 'Jan 20', events: 22 },
  { name: 'Jan 25', events: 34 },
  { name: 'Jan 30', events: 23 },
];

const topRiders = [
  { name: 'Ali', score: 92, status: 'Optimal' },
  { name: 'Ahmad', score: 88, status: 'Stable' },
  { name: 'Hafidz', score: 82, status: 'Stable' },
  { name: 'Kumar', score: 78, status: 'At Risk' },
];

const latestAlerts = [
  { id: 1, time: '10:15', rider: 'Ali', event: 'Hard Braking (LiDAR Delta V)', location: 'KL Central Corridor' },
  { id: 2, time: '10:20', rider: 'John', event: 'TTC < 0.7s (Time-to-Collision)', location: 'Federal Highway km 14' },
  { id: 3, time: '10:25', rider: 'Ahmad', event: 'Sharp Lateral Turn Rate', location: 'Cheras Intersection' },
];

export default function FleetDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Secure Route Guard check
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading || !mounted || !user) {
    return (
      <div className="min-h-screen bg-[#070b12] flex items-center justify-center font-mono text-xs text-slate-500 animate-pulse">
        VALIDATING RESEARCH PRIVILEGES // INITIALIZING TELEMETRY PIPELINE...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-zinc-900 pt-24 pb-12 px-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ─── SYSTEM STATUS BLOCK HEADER ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-600 block">
              MCAS Fleet Telemetry System // LiDAR Active Array
            </span>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight uppercase">
              Research Fleet Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3 bg-white border border-zinc-200 px-4 py-2 rounded-xl shadow-sm text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-zinc-600">FCWS Node Stream: Connected</span>
          </div>
        </div>

        {/* ─── ROW 1: PRIMARY PERFORMANCE KPI METRICS ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Vehicles Attached", value: "12", sub: "LiDAR Hardware Enabled" },
            { label: "Active Field Riders", value: "8", sub: "Simultaneous Live Feeds" },
            { label: "Total Combined Rides", value: "156", sub: "Historical Session Profiles" },
            { label: "Risk Events Today", value: "23", sub: "FCWS Alerts Triggered", critical: true },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">{kpi.label}</div>
              <div className={`text-3xl font-black mt-2 tracking-tight ${kpi.critical ? 'text-rose-600 animate-pulse' : 'text-zinc-900'}`}>
                {kpi.value}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono mt-1">{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* ─── ROW 2: TEMPORAL DISTRIBUTION & LEADERBOARD MATRIX ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Risk Events Over Time Line Chart Panel */}
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-500">Risk Events Over Time</h3>
              <p className="text-xs text-zinc-400">Cumulative weekly frequency profiles of LiDAR conflict events</p>
            </div>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={riskTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} stroke="#e4e4e7" />
                  <YAxis tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} stroke="#e4e4e7" />
                  <Tooltip />
                  <Line type="monotone" dataKey="events" stroke="#0284c7" strokeWidth={3} dot={{ fill: '#0284c7', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Riders Standings Leaderboard Panel */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-500 mb-4">Top Rated Research Cohorts</h3>
              <div className="space-y-3">
                {topRiders.map((rider, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-zinc-400 w-4">{i + 1}.</span>
                      <span className="font-bold text-zinc-700">{rider.name}</span>
                    </div>
                    <div className="flex items-center gap-4 font-mono">
                      <span className="font-black text-zinc-900">{rider.score} pts</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        rider.status === 'Optimal' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        rider.status === 'Stable' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {rider.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-tight mt-4">Metrics calibrated daily on safety indicators</p>
          </div>

        </div>

        {/* ─── ROW 3: GEO-SPATIAL APPARATUS & LIVE LOG ENTRIES ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Spatial Mapping Vector Component Card */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-500 mb-2">Recent Ride Vector</h3>
              <p className="text-xs text-zinc-400 mb-4">Spatial tracking overlay with recorded FCWS conflict coordinates</p>
            </div>
            
            {/* High Contrast Geometric Map Mock Frame matching the wireframe layout approach */}
            <div className="w-full aspect-[4/3] bg-zinc-100 rounded-xl border border-zinc-200 relative overflow-hidden flex items-center justify-center group shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
              <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-dashed bg-zinc-400 border-t-2 border-dashed border-zinc-300 transform -rotate-12" />
              
              {/* Graphical Start Marker Node */}
              <div className="absolute top-[60%] left-[15%] bg-zinc-900 text-white font-mono text-[9px] px-2 py-0.5 rounded uppercase font-bold z-10">Start</div>
              
              {/* Simulated Proximity Probes / Conflict Pins */}
              <div className="absolute top-[52%] left-[40%] w-4 h-4 rounded-full bg-rose-600 border-2 border-white flex items-center justify-center font-bold text-[8px] text-white cursor-help shadow" title="FCWS Alert: TTC < 0.7s">✕</div>
              <div className="absolute top-[48%] left-[60%] w-4 h-4 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center font-bold text-[8px] text-white cursor-help shadow" title="LiDAR Warning: Harsh Braking">⚠️</div>
              
              {/* Graphical End Marker Node */}
              <div className="absolute top-[40%] right-[15%] bg-sky-600 text-white font-mono text-[9px] px-2 py-0.5 rounded uppercase font-bold z-10">End</div>
              
              <span className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase z-10 bg-white/80 px-2 py-1 rounded-lg shadow-sm border border-zinc-200">
                🗺️ Spatial Simulation Canvas
              </span>
            </div>
          </div>

          {/* Real-time Logger Terminal Table Panel */}
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-500 mb-4">Latest Stream Alerts</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-400 font-bold uppercase">
                      <th className="pb-2">Time</th>
                      <th className="pb-2">Rider</th>
                      <th className="pb-2">Event Profile</th>
                      <th className="pb-2 text-right">Coordinate Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-700">
                    {latestAlerts.map((alert) => (
                      <tr key={alert.id} className="hover:bg-zinc-50/60 transition-colors">
                        <td className="py-3 text-zinc-500 font-bold">{alert.time}</td>
                        <td className="py-3 font-bold text-zinc-900">{alert.rider}</td>
                        <td className="py-3 text-rose-600 font-medium">{alert.event}</td>
                        <td className="py-3 text-right text-zinc-400 text-[11px] font-medium">{alert.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <button className="w-full mt-4 border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 py-2.5 rounded-xl font-mono text-xs font-bold transition-all text-zinc-600">
              Query Historical Log Registries
            </button>
          </div>

        </div>

        {/* ─── ROW 4: SEGREGATED METRIC COMPLIANCE BLOCKS ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Rider Performance Summary Metadata Panel */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-4">Mean Cohort Performance Indices</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Global Average Safety Score</span>
                <span className="text-2xl font-black text-zinc-900 font-mono block mt-1">78 / 100</span>
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Mean Harsh Braking Instances</span>
                <span className="text-2xl font-black text-rose-600 font-mono block mt-1">15 / Incident profile</span>
              </div>
            </div>
          </div>

          {/* Aggregated Fleet Status Statistics Block */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-4">Cumulative Fleet Log Matrix</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Total Instrumented Distance</span>
                <span className="text-2xl font-black text-zinc-900 font-mono block mt-1">950 km</span>
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Median Velocity Speed</span>
                <span className="text-2xl font-black text-sky-600 font-mono block mt-1">52 km/h</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}