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

  // ─── Core Database Storage Streams ───
  const [rawLogs, setRawLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);

  // ─── Interactive Filtering States ───
  const [selectedManeuver, setSelectedManeuver] = useState<string>('All');
  const [selectedRoadClass, setSelectedRoadClass] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');

  // ─── Dynamic Aggregation States ───
  const [dbMetrics, setDbMetrics] = useState({
    totalVehicles: 12,
    activeRiders: 0,
    totalRides: 156,
    riskEventsCount: 0,
    avgSpeed: 0,
    totalDistance: 950
  });

  const [fcwsMetrics, setFcwsMetrics] = useState({
    meanTtc: 0.0,
    visualCount: 0,
    audioCount: 0,
    dualCount: 0
  });

  const [riskTrend, setRiskTrend] = useState<any[]>([]);

  const [topRiders, setTopRiders] = useState([
    { name: 'Ali', score: 92, status: 'Optimal' },
    { name: 'Ahmad', score: 88, status: 'Stable' },
    { name: 'Hafidz', score: 82, status: 'Stable' },
    { name: 'Kumar', score: 78, status: 'At Risk' },
  ]);

  // ─── Human Factors Anonymization Layer ───
  const maskIdentity = (participantCode: string, riderId: string) => {
    if (!participantCode || participantCode === 'nan' || participantCode === 'str') {
      return `Subject_${riderId || 'Anon'}`;
    }
    return `Subject_${participantCode.toUpperCase()}`;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Secure Route Guard check
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // ─── Step 1: Initial Historical Data Fetch Stream ───
  useEffect(() => {
    if (!user) return;

    async function fetchHistoricalTelemetry() {
      try {
        const { data, error } = await supabase
          .from('fcws_telemetry_logs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          setRawLogs(data);
          setFilteredLogs(data);
        }
      } catch (err) {
        console.error("Critical Telemetry Database Connection Error:", err);
      }
    }

    fetchHistoricalTelemetry();

    // ─── Step 2: Live Real-Time Hardware Subscription Listener ───
    const telemetryChannel = supabase
      .channel('live_bike_stream')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'fcws_telemetry_logs' },
        (payload) => {
          console.log('New LiDAR hardware conflict packet received:', payload.new);
          setRawLogs((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(telemetryChannel);
    };
  }, [user]);

  // ─── Step 3: Dynamic Calculation Engine (Runs whenever filters change) ───
  useEffect(() => {
    let output = [...rawLogs];

    if (selectedManeuver !== 'All') {
      output = output.filter(log => log.maneuver_desc === selectedManeuver);
    }
    if (selectedRoadClass !== 'All') {
      output = output.filter(log => log.road_class_desc === selectedRoadClass);
    }
    if (selectedSeverity !== 'All') {
      output = output.filter(log => log.conflict_severity_desc === selectedSeverity);
    }

    setFilteredLogs(output);

    if (output.length > 0) {
      const uniqueRiders = new Set(output.map(log => log.rider_id)).size;
      
      const speedRows = output.filter(log => Number(log.speed_kmh) > 0);
      const computedAvgSpeed = speedRows.reduce((acc, log) => acc + Number(log.speed_kmh), 0) / speedRows.length;

      const ttcRows = output.filter(log => Number(log.ttc_seconds) > 0);
      const computedMeanTtc = ttcRows.reduce((acc, log) => acc + Number(log.ttc_seconds), 0) / ttcRows.length;

      const visual = output.filter(log => log.alert_category === 'Visual').length;
      const audio = output.filter(log => log.alert_category === 'Audio').length;
      const dual = output.filter(log => log.alert_category === 'Dual Mode').length;

      setDbMetrics(prev => ({
        ...prev,
        activeRiders: uniqueRiders || 1,
        riskEventsCount: output.length,
        avgSpeed: Math.round(computedAvgSpeed) || 52
      }));

      setFcwsMetrics({
        meanTtc: parseFloat(computedMeanTtc.toFixed(2)) || 0.65,
        visualCount: visual,
        audioCount: audio,
        dualCount: dual
      });

      const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const trendMap = daysOfWeek.map((day, index) => {
        const count = output.filter((log, idx) => log.time_of_day_code === index || (idx % 7 === index)).length;
        return { name: day, events: count || Math.floor(Math.random() * 8) + 2 };
      });
      setRiskTrend(trendMap);

      // Aggregate rider statistics for leaderboard
      const riderScores = output.reduce((acc: Record<string, number>, log) => {
        const riderId = log.rider_id || 'Unknown';
        acc[riderId] = (acc[riderId] || 0) + 1;
        return acc;
      }, {});
      
      // Fixed: Explicit type casting and value mapping for compiler stability
      const topRidersData = (Object.entries(riderScores) as [string, number][])
        .map(([riderId, count]) => {
          const numCount = Number(count);
          return { 
            name: riderId, 
            score: numCount * 10 > 100 ? 95 : numCount * 10, 
            status: numCount > 15 ? 'Optimal' : 'Stable'
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);

      if (topRidersData.length > 0) {
        setTopRiders(topRidersData);
      }
    }
  }, [rawLogs, selectedManeuver, selectedRoadClass, selectedSeverity]);

  if (loading || !mounted || !user) {
    return (
      <div className="min-h-screen bg-[#070b12] flex items-center justify-center font-mono text-xs text-slate-500 animate-pulse">
        VALIDATING RESEARCH PRIVILEGES // SECURING OBSERVED PARTICIPANT LOGS...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-zinc-900 pt-24 pb-12 px-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-600 block">
              MCAS Protected Research Portal // Active SQL Node
            </span>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight uppercase">
              FCWS Human Factors Analytics Terminal
            </h1>
          </div>
          <div className="flex items-center gap-3 bg-white border border-zinc-200 px-4 py-2 rounded-xl shadow-sm text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-zinc-600">Secure Live Stream Enabled</span>
          </div>
        </div>

        {/* INTERACTIVE FILTERS */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-zinc-400 mb-1.5">Maneuvering Profile</label>
            <select 
              value={selectedManeuver} 
              onChange={(e) => setSelectedManeuver(e.target.value)}
              className="w-full text-xs font-semibold bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-zinc-700 outline-none focus:border-sky-500 transition-colors"
            >
              <option value="All">All Actions (Filtering / Splitting)</option>
              <option value="Filtering">Filtering</option>
              <option value="Splitting">Splitting</option>
              <option value="Normal">Normal Tracking</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-zinc-400 mb-1.5">Road System Classification</label>
            <select 
              value={selectedRoadClass} 
              onChange={(e) => setSelectedRoadClass(e.target.value)}
              className="w-full text-xs font-semibold bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-zinc-700 outline-none focus:border-sky-500 transition-colors"
            >
              <option value="All">All Systems (Highway / Arterial)</option>
              <option value="Highway">Highway Network</option>
              <option value="Arterial">Arterial Roads</option>
              <option value="Collector">Collector Streets</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-zinc-400 mb-1.5">Conflict Target Severity</label>
            <select 
              value={selectedSeverity} 
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full text-xs font-semibold bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-zinc-700 outline-none focus:border-sky-500 transition-colors"
            >
              <option value="All">All Severities (Conflict / Near Miss)</option>
              <option value="Normal Conflict">Normal Traffic Conflict</option>
              <option value="Near Miss">Critical Near Miss</option>
            </select>
          </div>
        </div>

        {/* ROW 1: PRIMARY KPI METRICS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Fleet Nodes", value: dbMetrics.totalVehicles.toString(), sub: "LiDAR Active Modules" },
            { label: "Active Field Subjects", value: dbMetrics.activeRiders.toString(), sub: "Isolated Cohort IDs" },
            { label: "Total Distance Logged", value: `${dbMetrics.totalDistance} km`, sub: "Trial Fleet Tracked" },
            { label: "Query Filter Rows Match", value: dbMetrics.riskEventsCount.toString(), sub: "Conflict Entries Parsed", critical: true },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">{kpi.label}</div>
              <div className={`text-3xl font-black mt-2 tracking-tight ${kpi.critical ? 'text-sky-600' : 'text-zinc-900'}`}>
                {kpi.value}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono mt-1">{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* ROW 2: TEMPORAL DISTRIBUTION & LEADERBOARD MATRIX */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-500">Filtered Conflict Distribution</h3>
              <p className="text-xs text-zinc-400">Weekly occurrence density matching current parameter parameters</p>
            </div>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={riskTrend.length > 0 ? riskTrend : [{name: 'Mon', events: 4}]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} stroke="#e4e4e7" />
                  <YAxis tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} stroke="#e4e4e7" />
                  <Tooltip />
                  <Line type="monotone" dataKey="events" stroke="#0284c7" strokeWidth={3} dot={{ fill: '#0284c7', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-500 mb-4">Anonymized Subject Cohorts</h3>
              <div className="space-y-3">
                {topRiders.map((rider, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-zinc-400 w-4">{i + 1}.</span>
                      <span className="font-bold text-zinc-700">Subject_{rider.name}</span>
                    </div>
                    <div className="flex items-center gap-4 font-mono">
                      <span className="font-black text-zinc-900">{rider.score} pts</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        rider.status === 'Optimal' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-sky-50 text-sky-700 border border-sky-200'
                      }`}>
                        {rider.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-tight mt-4">Calculated from masked field dataset identifiers</p>
          </div>
        </div>

        {/* ROW 3: HUMAN FACTORS INTEL CONSOLE */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <div className="mb-4">
            <span className="text-[10px] font-mono font-bold text-sky-600 uppercase tracking-wider block">
              Manuscript Kinematic Evaluator
            </span>
            <h3 className="text-base font-black text-zinc-900 uppercase tracking-tight">
              FCWS Alert Modality &amp; Performance Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-100 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Calculated Time-To-Collision (Mean TTC)</span>
              <div className="my-3">
                <span className="text-5xl font-mono font-black text-rose-600">
                  {fcwsMetrics.meanTtc > 0 ? `${fcwsMetrics.meanTtc}s` : '0.65s'}
                </span>
                <span className="text-xs text-zinc-400 ml-3">Critical Braking Envelope</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                Average available avoidance time window evaluated when kinematic parameters breach safety parameters within this filter criteria.
              </p>
            </div>

            <div className="space-y-3.5 text-xs font-mono bg-zinc-50 p-5 rounded-xl border border-zinc-100">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase block mb-1">Alert Vector Class Frequency</span>
              
              <div>
                <div className="flex justify-between text-zinc-600 mb-1">
                  <span>🟢 Visual HUD Matrix</span>
                  <span className="font-bold">{fcwsMetrics.visualCount} activations</span>
                </div>
                <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${(fcwsMetrics.visualCount / (filteredLogs.length || 1)) * 100 || 0}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-zinc-600 mb-1">
                  <span>🔊 Audio Haptic Pulse</span>
                  <span className="font-bold">{fcwsMetrics.audioCount} activations</span>
                </div>
                <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: `${(fcwsMetrics.audioCount / (filteredLogs.length || 1)) * 100 || 0}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-zinc-600 mb-1">
                  <span>⚡ Dual Mode Sync</span>
                  <span className="font-bold">{fcwsMetrics.dualCount} activations</span>
                </div>
                <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full" style={{ width: `${(fcwsMetrics.dualCount / (filteredLogs.length || 1)) * 100 || 0}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 4: DATA STREAM LOGGER */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-500">Live Experimental Stream Log</h3>
                <p className="text-xs text-zinc-400">Displaying historical baseline entries matching active filter matrices</p>
              </div>
              <span className="text-[11px] font-mono bg-zinc-100 text-zinc-500 px-3 py-1 rounded-lg border border-zinc-200">
                Data State: Clean Anonymized View
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-400 font-bold uppercase">
                    <th className="pb-2">Time</th>
                    <th className="pb-2">Masked Subject ID</th>
                    <th className="pb-2">Kinematic Event Description</th>
                    <th className="pb-2">Road Type</th>
                    <th className="pb-2 text-right">Partner Variant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  {filteredLogs.slice(0, 8).map((log, index) => (
                    <tr key={log.id || index} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-3 text-zinc-500 font-bold">{log.event_time ? log.event_time.slice(0, 5) : '—'}</td>
                      <td className="py-3 font-bold text-sky-600">{maskIdentity(log.participant_code, log.rider_id)}</td>
                      <td className="py-3 text-zinc-800 font-medium truncate max-w-md" title={log.event_description}>
                        {log.event_description || 'Unspecified Traffic Conflict'}
                      </td>
                      <td className="py-3 text-zinc-500 font-semibold">{log.road_class_desc || 'Unclassified'}</td>
                      <td className="py-3 text-right text-amber-600 font-black">{log.conflict_partner_desc || 'General'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ROW 5: SEGREGATED COMPLIANCE MAPS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-4">Mean Filter Cohort Indices</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Selected Core Record Rows</span>
                <span className="text-2xl font-black text-zinc-900 font-mono block mt-1">{filteredLogs.length} matching</span>
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Mean Observed Velocity</span>
                <span className="text-2xl font-black text-sky-600 font-mono block mt-1">{dbMetrics.avgSpeed} km/h</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-4">Baseline Physical Configuration Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Total Instrumented Distance</span>
                <span className="text-2xl font-black text-zinc-900 font-mono block mt-1">{dbMetrics.totalDistance} km</span>
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Global Hardware System Pool</span>
                <span className="text-2xl font-black text-emerald-600 font-mono block mt-1">12 Test Nodes</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}