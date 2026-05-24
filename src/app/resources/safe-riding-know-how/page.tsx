import React from 'react';

export default function SafeRidingKnowHow() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 px-6 py-12 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="border-b border-zinc-800 pb-8 mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">MCAS Knowledge Hub</span>
        <h1 className="text-4xl font-black text-white mt-2 tracking-tight">SAFE RIDING KNOW-HOW</h1>
        <p className="text-zinc-400 mt-2 text-lg max-w-3xl">
          Empirical, evidence-based riding directives designed to bypass "street customs" and master cognitive road management.
        </p>
      </div>

      {/* 🛡️ Legal Copyright & Citation Notice */}
      <div className="bg-zinc-950 border-l-4 border-emerald-500 border p-5 rounded-r-xl mb-12 shadow-md">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
          <span>🛡️</span>
          <span>Copyright & Open-Sharing Notice</span>
        </div>
        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
          © {new Date().getFullYear()} MCAS Technology Platform. You are completely free—and highly encouraged—to copy, download, redistribute, and teach the materials found in this section to other riders, motor clubs, and riding schools. However, to maintain scientific integrity, you **must credit this platform by citing MCAS (mcas-tech.org)** whenever these resources are shared or published.
        </p>
      </div>

      {/* Know-How Resource Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Module 1 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Module 01 // Cognitive Mechanics</div>
            <h3 className="text-xl font-bold text-white mb-3">The Three Levels of Situational Awareness</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Master Endsley's classic model adapted to high-speed road dynamics: Level 1 (Perception of critical elements), Level 2 (Comprehension of current reality), and Level 3 (Projection of future threat vectors).
            </p>
          </div>
          <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 px-4 rounded-lg text-xs transition">
            Unlock Module Components →
          </button>
        </div>

        {/* Module 2 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Module 02 // Tactical Execution</div>
            <h3 className="text-xl font-bold text-white mb-3">Intersection Trajectory Appraisal</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Analysis of real-world on-road data reveals that riders frequently speed up through unsignalized junctions without executing full stops or defensive head-checks. Learn the exact scanning protocols to survive mixed-traffic blind spots.
            </p>
          </div>
          <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 px-4 rounded-lg text-xs transition">
            Unlock Module Components →
          </button>
        </div>

        {/* Module 3 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Module 03 // Kinematics</div>
            <h3 className="text-xl font-bold text-white mb-3">Gyroscopic Steering Deflection</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Ditching the body-lean myth. Discover how vehicle mass, wheelbase dimensions, and high-speed caster angles generate intense stabilization patterns that can only be shattered by deliberate, calculated counter-steering torque.
            </p>
          </div>
          <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 px-4 rounded-lg text-xs transition">
            Unlock Module Components →
          </button>
        </div>

        {/* Module 4 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Module 04 // Dynamic Assessment</div>
            <h3 className="text-xl font-bold text-white mb-3">The Hazard Perception Toolkit</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Interactive test portals evaluating real-time decision latencies. Compare your situational scores against national rider benchmarks to see if your brain is falling behind real-world crash threats.
            </p>
          </div>
          <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 px-4 rounded-lg text-xs transition">
            Unlock Module Components →
          </button>
        </div>

      </div>
    </div>
  );
}