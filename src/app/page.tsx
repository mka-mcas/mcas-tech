"use client";
import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import PressSection from '@/components/PressSection';

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(true);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('leads_subscribers').insert({ email });
      if (!error) setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`
        min-h-screen transition-colors duration-300
        ${
          darkMode
            ? 'bg-[#070b12] text-white'
            : 'bg-stone-50 text-zinc-900'
        }
    `}
    >
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          
          <h1 className="text-xs font-mono tracking-widest text-sky-500 uppercase mb-3">
            MALAYSIAN INSTITUTE OF ROAD SAFETY RESEARCH
          </h1>
          
          <h2
            className={`
              text-4xl md:text-6xl font-black tracking-tight uppercase
              max-w-4xl mx-auto leading-tight mb-6
              ${
                darkMode
                  ? 'text-white'
                  : 'text-zinc-900'
              }
           `}
        >
            REVOLUTIONIZING SAFETY FOR MOTORCYCLISTS {/* [cite: 1] */}
          </h2>
          
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-12">
            Experience a significant shift in the status quo with a groundbreaking motorcycle safety technology {/* [cite: 2] */} featuring advanced collision avoidance, LIDAR-enabled edge perception, and telemetry arrays.
          </p>

          <div className="flex justify-center mb-8">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="
                px-4 py-2 rounded-xl border text-xs uppercase tracking-wider
                bg-white text-black border-zinc-300
                hover:bg-zinc-100 transition-all
              "
            >
             {darkMode ? '☀️ Daylight Mode' : '🌙 Dark Mode'}
            </button>
          </div>
          
          {/* Symmetrical 3-Button Action Cluster */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-3xl mx-auto">
            <a 
              href="http://localhost:3000/auth/login" 
              className="w-full sm:w-auto bg-sky-500 hover:bg-sky-400 text-black font-semibold px-6 py-3 rounded-lg transition-all text-center text-xs uppercase tracking-wider"
            >
              Launch Research Dashboard
            </a>
            
            <Link 
              href="/about" 
              className="w-full sm:w-auto bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-medium px-6 py-3 rounded-lg transition-all text-center text-xs uppercase tracking-wider"
            >
              Our Story & Genesis
            </Link>
            
            <Link 
              href="/timeline" 
              className="w-full sm:w-auto bg-slate-950 border border-transparent text-slate-400 hover:text-slate-200 font-medium px-6 py-3 rounded-lg transition-all text-center text-xs uppercase tracking-wider"
            >
              View Historical Milestones
            </Link>
          </div>

        </div>
      </section>

      {/* Vision & Sustainable Mobility Grid */}
      <section className="py-20 border-t border-slate-900/60 bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="bg-slate-900/40 border border-slate-800/80 p-8 rounded-2xl">
            <h3 className="text-xs font-mono tracking-widest text-sky-500 uppercase mb-2">Our Vision</h3>
            <h4 className="text-2xl font-black text-white mb-4">STAY AHEAD OF THE CURVE {/* [cite: 4] */}</h4>
            <p className="text-slate-400 font-light text-sm md:text-base leading-relaxed">
              "Our vision is to be the most innovative and user-focused innovator of two-wheeler safety solutions, empowering individuals and communities to build a more sustainable mobility." {/* [cite: 5] */}
            </p>
          </div>
          
          <div className="bg-slate-900/40 border border-slate-800/80 p-8 rounded-2xl">
            <h3 className="text-xs font-mono tracking-widest text-sky-500 uppercase mb-2">Impact Core</h3>
            <h4 className="text-2xl font-black text-white mb-4">SUSTAINABLE MOBILITY FOR ALL {/* [cite: 6] */}</h4>
            <p className="text-slate-400 font-light text-sm md:text-base leading-relaxed">
              Safety is the foundation of sustainability. In countries with high motorcycle ridership, prioritizing the safety of this vulnerable road user group undoubtedly has a significant impact on societal well-being and overall sustainable living. {/* [cite: 7] */}
            </p>
          </div>

        </div>
      </section>

      {/* Core Technology Pillars */}
      <section className="py-20 border-t border-slate-900/40">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <h2 className="text-xs font-mono tracking-widest text-sky-500 uppercase mb-2">Technical Specifications</h2>
            <h3 className="text-3xl font-black text-white">PERCEPTION ENABLED TECHNOLOGY {/* [cite: 34] */}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-6 bg-slate-900/20 border border-slate-900 rounded-xl">
              <h4 className="font-bold text-white mb-3 uppercase tracking-wide text-sm text-sky-400">THE SEEING MOTORCYCLE {/* [cite: 36] */}</h4>
              <p className="text-slate-400 text-sm font-light leading-relaxed">
                Using groundbreaking LIDAR sensor and GPS technology, MCAS is a valuable asset for any rider. It’s two-wheelers riding reimagined. {/* [cite: 37] */}
              </p>
            </div>
            
            <div className="p-6 bg-slate-900/20 border border-slate-900 rounded-xl">
              <h4 className="font-bold text-white mb-3 uppercase tracking-wide text-sm text-sky-400">REAL-TIME DATA PROCESSING {/* [cite: 8] */}</h4>
              <p className="text-slate-400 text-sm font-light leading-relaxed">
                This perception-enabled motorcycle safety technology uses real-time information to provide riders with accurate and up-to-date information about hazards on the road thus establishing a vehicle-to-environment communication to warn riders of hazards that they may not be able to see. {/* [cite: 9] */}
              </p>
            </div>
            
            <div className="p-6 bg-slate-900/20 border border-slate-900 rounded-xl">
              <h4 className="font-bold text-white mb-3 uppercase tracking-wide text-sm text-sky-400">RIDER-CENTERED DESIGN {/* [cite: 38] */}</h4>
              <p className="text-slate-400 text-sm font-light leading-relaxed">
                Adoption of design-thinking and rider-centered approach are absolute must to minimize user rejection and potentially retrofit MCAS on millions of active motorcycles already on the road. {/* [cite: 39] */}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Telemetry Matrix */}
      <section className="py-20 border-t border-slate-900/40 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <h2 className="text-xs font-mono tracking-widest text-sky-500 uppercase mb-2">Field Telemetry Logs</h2>
            <h3 className="text-3xl font-black text-white">MCAS IN NUMBERS {/* [cite: 13] */}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl flex flex-col justify-between">
              <p className="text-slate-300 text-sm italic font-light leading-relaxed mb-6">
                "For me, the risk of a collision mainly involved a car swerving onto my path suddenly and when a motorcycle suddenly braked ahead of me when filtering through traffic. The MCAS visual and audio alerts help me to anticipate these hazards and react safely." {/* [cite: 14] */}
              </p>
              <div className="flex justify-between items-center border-t border-slate-800 pt-4">
                <span className="font-bold text-sm text-white">Fauzi Hussin {/* [cite: 15] */}</span>
                <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-1 rounded">32,000 km / 620 hrs {/* [cite: 16] */}</span>
              </div>
            </div>
            
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl flex flex-col justify-between">
              <p className="text-slate-300 text-sm italic font-light leading-relaxed mb-6">
                "I was riding along the emergency lane of a multi-lane highway on a long trip. The sun was very intense, and I was starting to feel drowsy. Suddenly, I was startled by the sound of the MCAS audio alert. I realized that I had drifted off and was about to fall asleep. There was a pickup truck veering onto my path. I slammed on my brakes to avoid a collision." {/* [cite: 17] */}
              </p>
              <div className="flex justify-between items-center border-t border-slate-800 pt-4">
                <span className="font-bold text-sm text-white">Hazazi Saidpudin {/* [cite: 18] */}</span>
                <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-1 rounded">800 km / 20 hrs {/* [cite: 19] */}</span>
              </div>
            </div>
            
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl flex flex-col justify-between">
              <p className="text-slate-300 text-sm italic font-light leading-relaxed mb-6">
                "My experience with MCAS has given me the awareness and exposure to where and when hazards typically occur on the road. I used to ride really fast and lane split and filter to get ahead of traffic. Now, I find myself more cautious and careful." {/* [cite: 20] */}
              </p>
              <div className="flex justify-between items-center border-t border-slate-800 pt-4">
                <span className="font-bold text-sm text-white">Izhar Abd Ghafar {/* [cite: 21] */}</span>
                <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-1 rounded">2,600 km / 70 hrs {/* [cite: 22] */}</span>
              </div>
            </div>
            
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl flex flex-col justify-between">
              <p className="text-slate-300 text-sm italic font-light leading-relaxed mb-6">
                "As a food delivery rider, I ride my motorcycle at least 100 kilometers every day. I often ride in mixed traffic, weaving in and out of lanes. This puts me at risk of a collision, especially when cars change lanes without signaling. What I like most about MCAS is its ability to detect and warn me of potential collision hazards early on." {/* [cite: 26] */}
              </p>
              <div className="flex justify-between items-center border-t border-slate-800 pt-4">
                <span className="font-bold text-sm text-white">Syafiq Azahari {/* [cite: 27] */}</span>
                <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-1 rounded">950 km / 40 hrs {/* [cite: 28] */}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Media Showcase Row */}
      <PressSection />

      {/* Lead Capture Footer Form */}
      <section className="py-24 border-t border-slate-900 bg-black/40">
        <div className="max-w-md mx-auto px-6 text-center">
          
          <h3 className="text-2xl font-black text-white uppercase mb-2">INDUSTRY PLAYERS.. {/* [cite: 29] */}</h3>
          <h4 className="text-xs font-mono text-sky-500 uppercase tracking-widest mb-4">Be part of the journey.. {/* [cite: 30] */}</h4>
          
          <p className="text-slate-400 text-sm font-light leading-relaxed mb-8">
            Our future plan is to make MCAS available and affordable for all motorcyclists. {/* [cite: 31] */} With your help, we can bring this innovative product to market and make a real difference in sustainable mobility. {/* [cite: 32] */}
          </p>
          
          {submitted ? (
            <p className="text-emerald-400 font-medium text-xs font-mono bg-emerald-500/10 py-3 rounded-lg border border-emerald-500/20 uppercase tracking-wide">
              ✓ Thank you for subscribing!
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address" 
                required
                disabled={loading}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500 text-slate-200 disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={loading}
                className="bg-sky-500 hover:bg-sky-400 text-black text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Subscribe'}
              </button>
            </form>
          )}

        </div>
      </section>

    </main>
  );
}