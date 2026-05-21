'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface RiderProfile {
  name: string;
  distance: string;
  hours: string;
  quote: string;
}

const riderProfiles: RiderProfile[] = [
  {
    name: 'Fauzi Hussin',
    distance: '32,000 km',
    hours: '620 hrs',
    quote: 'The MCAS visual and audio alerts help me to anticipate hazards and react safely when cars swerve or vehicles brake suddenly.',
  },
  {
    name: 'Hazazi Saidpudin',
    distance: '800 km',
    hours: '20 hrs',
    quote: 'When starting to feel drowsy on a long trip, I was startled by the audio alert. It saved me from a collision with a drifting pickup truck.',
  },
  {
    name: 'Izhar Abd Ghafar',
    distance: '2,600 km',
    hours: '70 hrs',
    quote: 'My experience with MCAS has given me clear structural exposure to where and when hazards typically occur. I find myself riding much more cautiously now.',
  },
  {
    name: 'Syafiq Azahari',
    distance: '950 km',
    hours: '40 hrs',
    quote: 'As a food delivery rider covering 100km daily in mixed filtering traffic, MCAS detects and warns me of potential collision hazards early on.',
  },
];

export default function Home() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('leads_subscribers')
        .insert([{ email }]);

      if (insertError) {
        setError(insertError.message);
      } else {
        setSubmitted(true);
        setEmail('');
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full bg-white">
      {/* Hero Header Container */}
      <section className="relative w-full px-4 py-24 sm:px-6 lg:px-8 lg:py-32 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              REVOLUTIONIZING SAFETY FOR MOTORCYCLISTS
            </h1>
            <p className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto">
              Experience a significant shift in the status quo with groundbreaking motorcycle safety technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="http://localhost:3000/auth/login"
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Launch Research Dashboard
              </Link>
              <Link
                href="/timeline"
                className="inline-flex items-center justify-center px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                View Historical Milestones
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Sustainable Mobility Grid */}
      <section className="w-full px-4 py-20 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Card */}
            <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Stay Ahead of the Curve
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Our vision is to be the most innovative and user-focused innovator of two-wheeler safety solutions, empowering individuals and communities to build a more sustainable mobility.
              </p>
            </div>

            {/* Right Card */}
            <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-green-600">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Sustainable Mobility For All
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Safety is the foundation of sustainability. In countries with high motorcycle ridership, prioritizing the safety of this vulnerable road user group undoubtedly has a significant impact on societal well-being.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Technology Pillars */}
      <section className="w-full px-4 py-20 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Core Technology Pillars
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg shadow-md">
              <h4 className="text-xl font-bold text-slate-900 mb-4">
                The Seeing Motorcycle
              </h4>
              <p className="text-slate-700">
                Utilizing a groundbreaking LIDAR sensor framework and integrated GPS technology to reimagine two-wheel riding parameters.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-lg shadow-md">
              <h4 className="text-xl font-bold text-slate-900 mb-4">
                Real-Time Perception Infrastructure
              </h4>
              <p className="text-slate-700">
                Uses real-time data tracking to generate predictive hazard vectors, establishing vehicle-to-environment communication to warn riders of conditions they cannot see.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-lg shadow-md">
              <h4 className="text-xl font-bold text-slate-900 mb-4">
                Rider-Centered Design
              </h4>
              <p className="text-slate-700">
                Adopting localized design-thinking loops to minimize user friction, engineered explicitly to retro-fit onto the millions of active motorcycles already on the road.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Telemetry Matrix */}
      <section className="w-full px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              MCAS In Numbers
            </h2>
            <p className="text-slate-300 text-lg">
              Real-world rider telemetry showcasing the impact of MCAS safety technology
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {riderProfiles.map((profile, index) => (
              <div
                key={index}
                className="bg-slate-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h4 className="text-xl font-bold text-white mb-2">
                  {profile.name}
                </h4>
                <div className="space-y-1 mb-4 text-sm text-slate-300">
                  <p>Distance: <span className="font-semibold">{profile.distance}</span></p>
                  <p>Active Time: <span className="font-semibold">{profile.hours}</span></p>
                </div>
                <blockquote className="text-slate-200 italic border-l-4 border-blue-400 pl-4">
                  "{profile.quote}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Lead Capture Form */}
      <section className="w-full px-4 py-20 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 sm:p-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Be Part of Our Journey
            </h2>
            <p className="text-lg text-slate-700 mb-8">
              Our future plan is to make MCAS available and affordable for all motorcyclists. Submit your email to join our network.
            </p>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                {loading ? 'Submitting...' : 'Join Our Network'}
              </button>

              {submitted && (
                <div className="p-4 bg-green-100 text-green-800 rounded-lg text-center">
                  Thank you for subscribing! We'll be in touch soon.
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-100 text-red-800 rounded-lg text-center">
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}