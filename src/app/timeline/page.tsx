"use client";
import React from 'react';
import Link from 'next/link';

interface Milestone {
  date: string;
  title: string;
  description: string;
}

export default function TimelinePage() {
  // Chronological R&D dataset directly mapped from historical records
  const milestones: Milestone[] = [
    {
      date: 'NOV 2019', // 
      title: 'MCAS IDEATION', // 
      description: 'The first concept and ideation of a retrofittable pre-collision warning system was conceived with the aim to prevent crashes involving motorcyclists, especially those who ride small-engine motorcycles.', // [cite: 81]
    },
    {
      date: 'JAN 2020', // [cite: 83]
      title: 'FIRST MCAS PROTOTYPE (ULTRASONIC SENSOR)', // [cite: 83]
      description: 'The first working prototype with automated audio, visual, and phone-call alert functions was completed utilizing low-cost initial sensor configurations.', // [cite: 84]
    },
    {
      date: 'JUNE 2020', // [cite: 85]
      title: 'FIRST LIDAR FITMENT ONTO A MOTORCYCLE', // [cite: 85]
      description: 'The first fitment of MCAS on an actual motorcycle was carried out. Significant progress was made in testing the integration of GPS modules, GSM modules, and the MCAS system for distance-based alert activation on a 2007 100cc Honda motorcycle using a 12m LIDAR sensor.', // [cite: 86, 87]
    },
    {
      date: 'FEB 2021', // [cite: 89]
      title: 'SUCCESSFUL FIELD DEMONSTRATION & MEDIA RELEASE', // [cite: 89]
      description: 'A field demonstration of the MCAS prototype was successfully conducted for MIROS top management in a controlled environment, proving the system\'s ability to detect objects and activate alerts automatically. MIROS released an official media statement to announce the innovation to the public.', // [cite: 90, 91, 92]
    },
    {
      date: 'NOV 2021', // [cite: 93]
      title: 'FILING OF PATENT FOR MCAS TECHNOLOGIES', // [cite: 93]
      description: 'The Malaysian Institute of Road Safety Research (MIROS) officially filed a patent application for MCAS technologies on November 11, 2021, under patent application number PI2021006604.', // 
    },
    {
      date: 'MAY 2022', // [cite: 96]
      title: 'LAUNCH OF PILOT RETROFIT PROJECT', // [cite: 96]
      description: 'Following a successful collaboration agreement with PLUS Malaysia Berhad to co-fund the project, the official launch of a pilot project to retrofit motorcycles used by commuting workers in Malaysia with the MCAS system was announced to the public.', // [cite: 96, 97]
    },
    {
      date: 'AUG 2022', // [cite: 98]
      title: 'FIRST FITMENT ONTO A SPORTBIKE MODEL', // [cite: 98]
      description: 'The engineering team successfully expanded the hardware configuration compatibility and retrofitted the MCAS system onto a 2015 Yamaha FZ150i sportbike model.', // [cite: 99]
    },
    {
      date: 'OCT 2022', // [cite: 100]
      title: 'FIRST PARTICIPANT FLEET INSTALLATION', // [cite: 100]
      description: 'A 2004 Yamaha Ego 115 cc scooter was the first active participant motorcycle model successfully installed with the operational MCAS system within the public field testing pilot project.', // [cite: 101]
    }
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Action Header */}
        <div className="mb-12">
          <Link href="/" className="text-sm text-sky-400 hover:text-sky-300 font-medium transition-colors flex items-center gap-2">
            ← Back to Home
          </Link>
        </div>

        {/* Page Titles */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-sky-400 mb-4">OUR JOURNEY SO FAR</h1> {/* [cite: 77] */}
          <p className="text-slate-400 max-w-xl mx-auto">
            The historical timeline of the milestones, technological breakthroughs, and strategic deployments driving the MCAS ecosystem.
          </p>
        </div>

        {/* Timeline Component Layout */}
        <div className="relative border-l border-slate-800 ml-4 md:ml-32 pl-6 md:pl-8 space-y-12">
          {milestones.map((milestone, index) => (
            <div key={index} className="relative group">
              
              {/* Timeline Bullet Point Node */}
              <div className="absolute -left-[31px] md:-left-[39px] top-1 bg-sky-500 rounded-full w-4 h-4 border-4 border-[#090d16] group-hover:scale-125 transition-transform" />

              {/* Date Marker (Responsive Positioning) */}
              <div className="md:absolute md:-left-40 md:top-0 md:w-28 md:text-right font-mono text-xs font-bold tracking-widest text-sky-500 mb-1 md:mb-0">
                {milestone.date}
              </div>

              {/* Content Card Body */}
              <div className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-xl hover:border-slate-700 transition-colors shadow-xl">
                <h3 className="text-lg font-bold text-slate-100 mb-2 tracking-tight">
                  {milestone.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed font-normal">
                  {milestone.description}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* Final Statement / Closing Callout */}
        <div className="mt-20 border-t border-slate-900 pt-10 text-center">
          <p className="text-xs font-mono tracking-widest text-slate-500 uppercase">
            Malaysian Institute of Road Safety Research (MIROS) • Patent Pending
          </p>
        </div>

      </div>
    </div>
  );
}