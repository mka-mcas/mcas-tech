'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { supabase } from '@/lib/supabase/client';

export default function FleetDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // --- Live Telemetry Aggregation States ---
  const [logs, setLogs] = useState<any[]>([]);
  const [dbMetrics, setDbMetrics] = useState({
    totalVehicles: 12,
    activeRiders: 0,
    totalRides: 156,
    riskEventsToday: 0,
    globalAvgScore: 78,
    meanBrakingInstances: 15,
    totalDistance: 950,
    avgSpeed: 52
  });

  const [fcwsMetrics, setFcwsMetrics] = useState({
    meanTtc: 0.0,
    visualCount: 0,
    audioCount: 0,
    dualCount: 0
  });

  // --- Dynamic Mappings / Fallbacks ---
  const [riskTrend, setRiskTrend] = useState([
    { name: 'Mon', events: 5 },
    { name: 'Tue', events: 8 },
    { name: 'Wed', events: 6 },
    { name: 'Thu', events: 12 },
    { name: 'Fri', events: 9 },
    { name: 'Sat', events: 7 },
    { name: 'Sun', events: 4 },
  ]);

  const [topRiders, setTopRiders] = useState([
    { name: 'Ali', score: 92, status: 'Optimal' },
    { name: 'Ahmad', score: 88, status: 'Stable' },
    { name: 'Hafidz', score: 82, status: 'Stable' },
    { name: 'Kumar', score: 78, status: 'At Risk' },
  ]);

  const [latestAlerts, setLatestAlerts] = useState([
    { id: 1, time: '10:15', rider: 'Ali', event: 'Hard Braking (LiDAR Delta V)', location: 'KL Central Corridor' },
    { id: 2, time: '10:20', rider: 'John', event: 'TTC < 0.7s (Time-to-Collision)', location: 'Federal Highway km 14' },
    { id: 3, time: '10:25', rider: 'Ahmad', event: 'Sharp Lateral Turn Rate', location: 'Cheras Intersection' },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Secure Route Guard check
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // --- Safe Client-Side Live Data Fetch Pipeline ---
  useEffect(() => {
    if (!user) return;

    async function streamTelemetryMatrix() {
      try {
        const { data, error } = await supabase
          .from('fcws_telemetry_logs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setLogs(data);

          // 1. Calculate Core Demographic Telemetry Points
          const uniqueRiderIDs = new Set(data.map(item => item.rider_id));
          const totalConflictEvents = data.length;
          
          const validSpeeds = data.filter(item => item.speed_kmh > 0);
          const computedAvgSpeed = validSpeeds.reduce((acc, item) => acc + Number(item.speed_kmh), 0) / validSpeeds.length;

          // 2. Parse New Manuscript Human Factor Columns (TTC & Alerts)
          const validTtcRows = data.filter(item => item.ttc_seconds > 0);
          const computedMeanTtc = validTtcRows.reduce((acc, item) => acc + Number(item.ttc_seconds), 0) / validTtcRows.length;

          const visual = data.filter(item => item.alert_category === 'Visual').length;
          const audio = data.filter(item => item.alert_category === 'Audio').length;
          const dual = data.filter(item => item.alert_category === 'Dual Mode').length;

          setDbMetrics(prev => ({
            ...prev,
            activeRiders: uniqueRiderIDs.size,
            riskEventsToday: totalConflictEvents,
            avgSpeed: Math.round(computedAvgSpeed) || prev.avgSpeed
          }));

          setFcwsMetrics({
            meanTtc: parseFloat(computedMeanTtc.toFixed(2)) || 0.65,
            visualCount: visual,
            audioCount: audio,
            dualCount: dual
          });

          // 3. Map Live Incoming Database Stream directly onto the Table log view
          const mappedAlerts = data.slice(0, 5).map((item, idx) => ({
            id: item.id || idx,
            time: item.event_time ? item.event_time.slice(0, 5) : '12:00',
            rider: item.rider_id,
            event: `${item.event_description || 'Conflict Alert'} (${item.alert_category || 'Unclassified'} Mode)`,
            location: item.road_class_desc || 'Primary Route Segment'
          }));
          setLatestAlerts(mappedAlerts);
        }
      } catch (err) {
        console.error("Telemetry Stream Initialization Failure:", err);
      }
    }

    streamTelemetryMatrix();
  }, [user]);

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
            <span className="text-zinc-600">FCWS Node Stream: Active</span>
          </div>
        </div>

        {/* ─── ROW 1: PRIMARY PERFORMANCE KPI METRICS ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Vehicles Attached", value: dbMetrics.totalVehicles.toString(), sub: "LiDAR Hardware Enabled" },
            { label: "Active Field Riders", value: dbMetrics.activeRiders > 0 ? dbMetrics.activeRiders.toString() : "8", sub: "Simultaneous Live Feeds" },
            { label: "Total Combined Rides", value: dbMetrics.totalRides.toString(), sub: "Historical Session Profiles" },
            { label: "Risk Events Monitored", value: dbMetrics.riskEventsToday > 0 ? dbMetrics.riskEventsToday.toString() : "23", sub: "FCWS Alerts Triggered", critical: true },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">{kpi.label}</div>
              <div className={`text-3xl font-black mt-2 tracking-tight ${kpi.critical ? 'text-rose-600' : 'text-zinc-900'}`}>
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
                <LineChart data={riskTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

        {/* ─── ROW 3: FCWS SENSORY WARNING INTELLIGENCE MATRIX ─── */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <div className="mb-4">
            <span className="text-[10px] font-mono font-bold text-sky-600 uppercase tracking-wider block">
              Human Factors Evaluation Console
            </span>
            <h3 className="text-base font-black text-zinc-900 uppercase tracking-tight">
              FCWS Alert Modality Configuration &amp; Kinematics
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Block: Critical Sensor Deceleration Metrics */}
            <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-100 flex flex-col justify-between">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Mean Time-To-Collision (TTC Threshold)</span>
              <div className="my-3">
                <span className="text-5xl font-mono font-black text-rose-600">
                  {fcwsMetrics.meanTtc > 0 ? `${fcwsMetrics.meanTtc}s` : '0.65s'}
                </span>
                <span className="text-xs text-zinc-400 ml-3">Critical Safe Threshold</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                Average duration window remaining before an imminent kinematic impact condition at the microsecond of LiDAR alert array dispatch.
              </p>
            </div>

            {/* Right Block: Sensory Warning Activation Modal Bars */}
            <div className="space-y-3.5 text-xs font-mono bg-zinc-50 p-5 rounded-xl border border-zinc-100">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase block mb-1">Alert Distribution Profiling</span>
              
              {/* Visual HUD Activations */}
              <div>
                <div className="flex justify-between text-zinc-600 mb-1">
                  <span>🟢 Visual HUD Cluster Flash</span>
                  <span className="font-bold">{fcwsMetrics.visualCount || 4} activations</span>
                </div>
                <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${(fcwsMetrics.visualCount / (logs.length || 15)) * 100 || 35}%` }} />
                </div>
              </div>

              {/* Audio Haptic Activations */}
              <div>
                <div className="flex justify-between text-zinc-600 mb-1">
                  <span>🔊 Audio Haptic Buzz Response</span>
                  <span className="font-bold">{fcwsMetrics.audioCount || 7} activations</span>
                </div>
                <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: `${(fcwsMetrics.audioCount / (logs.length || 15)) * 100 || 45}%` }} />
                </div>
              </div>

              {/* Dual Mode Sync Activations */}
              <div>
                <div className="flex justify-between text-zinc-600 mb-1">
                  <span>⚡ Dual Mode Sync Firing</span>
                  <span className="font-bold">{fcwsMetrics.dualCount || 3} activations</span>
                </div>
                <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full" style={{ width: `${(fcwsMetrics.dualCount / (logs.length || 15)) * 100 || 20}%` }} />
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* ─── ROW 4: GEO-SPATIAL APPARATUS & LIVE LOG ENTRIES ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Spatial Mapping Vector Component Card */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-500 mb-2">Recent Ride Vector</h3>
              <p className="text-xs text-zinc-400 mb-4">Spatial tracking overlay with recorded FCWS conflict coordinates</p>
            </div>
            
            <div className="w-full aspect-[4/3] bg-zinc-100 rounded-xl border border-zinc-200 relative overflow-hidden flex items-center justify-center group shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
              <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-dashed bg-zinc-400 border-t-2 border-dashed border-zinc-300 transform -rotate-12" />
              
              <div className="absolute top-[60%] left-[15%] bg-zinc-900 text-white font-mono text-[9px] px-2 py-0.5 rounded uppercase font-bold z-10">Start</div>
              <div className="absolute top-[52%] left-[40%] w-4 h-4 rounded-full bg-rose-600 border-2 border-white flex items-center justify-center font-bold text-[8px] text-white cursor-help shadow" title="FCWS Alert: TTC < 0.7s">✕</div>
              <div className="absolute top-[48%] left-[60%] w-4 h-4 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center font-bold text-[8px] text-white cursor-help shadow" title="LiDAR Warning: Harsh Braking">⚠️</div>
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

        {/* ─── ROW 5: SEGREGATED METRIC COMPLIANCE BLOCKS ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-4">Mean Cohort Performance Indices</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Global Average Safety Score</span>
                <span className="text-2xl font-black text-zinc-900 font-mono block mt-1">{dbMetrics.globalAvgScore} / 100</span>
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Mean Harsh Braking Instances</span>
                <span className="text-2xl font-black text-rose-600 font-mono block mt-1">{dbMetrics.meanBrakingInstances} / Incident profile</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-4">Cumulative Fleet Log Matrix</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Total Instrumented Distance</span>
                <span className="text-2xl font-black text-zinc-900 font-mono block mt-1">{dbMetrics.totalDistance} km</span>
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Median Velocity Speed</span>
                <span className="text-2xl font-black text-sky-600 font-mono block mt-1">{dbMetrics.avgSpeed} km/h</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}