"use client";
import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#070b12] text-slate-300 py-16 px-6 md:py-24">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation Top */}
        <div className="mb-16">
          <Link href="/" className="text-sm text-sky-400 hover:text-sky-300 font-medium transition-colors flex items-center gap-2">
            ← Return to Corporate Home
          </Link>
        </div>

        {/* Section Header */}
        <header className="mb-16">
          <h1 className="text-xs font-mono tracking-widest text-sky-500 uppercase mb-3">The Genesis of Innovation</h1>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
            Our Journey
          </h2>
          <div className="h-1 w-20 bg-sky-500 mt-6 rounded-full" />
        </header>

        {/* Article Body Content */}
        <div className="space-y-12 text-base md:text-lg font-light leading-relaxed text-slate-300">
          
          {/* Paragraph 1: The Discovery Loop */}
          <p>
            The story of MCAS is a shining example of what can be achieved through perseverance and motivation to make positive impact within the communities. It all began when two researchers from the Malaysian Institute of Road Safety Research (MIROS) were reviewing a database of the MIROS's naturalistic motorcycle riding research project. They came across an event that involved a near-crash between a motorcycle and a car. The event involved a colleague of them who was riding the motorcycle on a high-speed multilane highway when a car suddenly changed lanes onto his path without signaling. Fortunately, he was able to steer out of the harm's way in the nick of time, but the researchers realized that it could have easily been a lot worse.
          </p>

          {/* Timely Image 1: The Dashcam Near-Miss Snapshot */}
          <div className="my-8 group">
            <div className="bg-slate-950 p-2 border border-slate-900 rounded-2xl overflow-hidden shadow-2xl transition-all group-hover:border-slate-800">
              <img 
                src="/about/near-crash.png" 
                alt="MIROS Naturalistic Riding Database Near-Crash Event Log" 
                className="w-full h-auto rounded-xl filter contrast-110 object-cover"
              />
            </div>
            <p className="mt-3 text-xs font-mono text-slate-500 text-center tracking-wide uppercase">
              Figure 1.0: Live telemetry and dashcam extraction of the high-speed multi-lane highway incident log.
            </p>
          </div>

          {/* Paragraph 2: The Ideation & Out-of-Pocket Prototyping */}
          <p>
            This close call sparked an idea in their mind: what if there was a motorcycle technology that could detect potential collisions and alert the rider (and a potential collision partner) in advance? This idea grew into MCAS, a revolutionary pre-collision warning system for two-wheelers. With its advanced sensors and algorithms, MCAS has since become a game-changer in motorcycle safety research in Malaysia, helping motorcyclists avoid potential collision and stay safe on the roads. The two researchers, Ts. Alhapiz and Tc. Hazazi started the MCAS project with low-cost ultrasonic sensors, with a limited range of just 4 meters, and a MYR 400 training fee to learn Arduino.
          </p>

          <p>
            The team pressed on, driven by their passion for improving motorcycle safety. They poured countless hours into self-learning, software coding, hardware integration, motorcycle fabrication and field testing. Finally, in January 2020, they completed the first MCAS prototype. But that was only the beginning.
          </p>

          {/* THE LEGENDARY PENCIL CASE BREAKOUT SECTION */}
          <div className="my-12 bg-gradient-to-b from-slate-900/80 to-slate-950 border border-amber-500/20 rounded-2xl p-6 md:p-8 shadow-xl">
            <h3 className="text-xs font-mono tracking-widest text-amber-400 uppercase mb-4 flex items-center gap-2">
              <span>⚡</span> Resourceful Engineering Highlight
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-sm md:text-base font-normal text-slate-200 leading-relaxed mb-4">
                  <strong>This is no ordinary case.</strong> This pencil case means a lot to us. In it we put our main electronics during the prototype stage when we were trying to pitch for MCAS budget proposal approval.
                </p>
                <p className="text-sm md:text-base font-light text-slate-400 italic">
                  "Looking back, it is clear to us that the team's quick instinct to use whatever resources are available is the key to overcome challenges to run this project."
                </p>
              </div>
              
              <div className="bg-black/40 p-1.5 border border-slate-800 rounded-xl overflow-hidden">
                <img 
                  src="/about/pencil-case.png" 
                  alt="The Original MCAS Pencil Case Prototype Sandbox" 
                  className="w-full h-auto rounded-lg shadow-inner object-cover"
                />
              </div>
            </div>
          </div>

          {/* Paragraph 3: Upgrading the Sensors */}
          <p>
            The team was encouraged by the promising progress of the first prototype, so they invested in a 12-meter range LIDAR. They then challenged themselves with a 40-meter range LIDAR. In December 2020, they successfully secured funding for a higher-range LIDAR sensor before embarking on the arduous journey of testing the prototype on the road, working tirelessly to refine and perfect the system.
          </p>

          {/* Paragraph 4: Scaling into PROSPECT & The Corporate Pilot Program */}
          <p>
            In May 2022, the project, then had grown into a full-fledge research project called <span className="text-white font-normal">Project for Research on Powered Two-Wheeler Crash Evasion Technology (PROSPECT)</span>, achieved another milestone when MIROS formalized a collaboration with <span className="text-white font-normal">PLUS Malaysia Berhad</span> to initiate a pilot project to install MCAS on actual motorcycles used by commuting motorcyclists in Malaysia.
          </p>

          {/* Timely Image 2: The PROSPECT Field Installation */}
          <div className="my-8 group">
            <div className="bg-slate-950 p-2 border border-slate-900 rounded-2xl overflow-hidden shadow-2xl transition-all group-hover:border-slate-800">
              <img 
                src="/about/prospect-pilot.png" 
                alt="MCAS Field Fitment and Installation during PROSPECT Pilot" 
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
            <p className="mt-3 text-xs font-mono text-slate-500 text-center tracking-wide uppercase">
              Figure 2.0: System field setup, track calibration, and hardware installation onto a participant fleet vehicle.
            </p>
          </div>

          {/* Paragraph 5: Inspiring Conclusion */}
          <p className="text-xl font-light text-slate-200 border-l-2 border-sky-500/50 pl-6 italic my-12 bg-slate-900/20 py-4 pr-4 rounded-r-xl">
            The story of MCAS is a testament to the power of innovation and the spirit of never giving up on a dream.
          </p>

        </div>

        {/* Footer Accent */}
        <footer className="mt-24 border-t border-slate-900 pt-8 text-center">
          <p className="text-xs font-mono tracking-widest text-slate-600 uppercase">
            Malaysian Institute of Road Safety Research (MIROS) • All Rights Reserved
          </p>
        </footer>

      </div>
    </div>
  );
}