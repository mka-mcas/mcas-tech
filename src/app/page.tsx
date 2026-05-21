'use client';

import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setErrorMessage('Please enter a valid email address');
      setSubscriptionStatus('error');
      return;
    }

    setSubscriptionStatus('loading');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('leads_subscribers')
        .insert({ email });

      if (error) {
        throw error;
      }

      setSubscriptionStatus('success');
      setEmail('');
      
      // Auto-reset success message after 5 seconds
      setTimeout(() => {
        setSubscriptionStatus('idle');
      }, 5000);
    } catch (err) {
      setSubscriptionStatus('error');
      setErrorMessage('Failed to subscribe. Please try again.');
      console.error('Subscription error:', err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              MCAS
            </div>
            <div className="flex gap-6">
              <Link 
                href="/auth/login" 
                className="text-slate-300 hover:text-slate-100 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/participant" 
                className="text-slate-300 hover:text-slate-100 transition-colors"
              >
                Research
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-8 text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="block text-slate-100">Revolutionizing Safety</span>
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                for Motorcyclists
              </span>
            </h1>
            
            <p className="max-w-3xl mx-auto text-xl text-slate-300 leading-relaxed">
              Advanced collision avoidance systems, LIDAR-enabled edge perception, and intelligent safety telemetry tailored for riders.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/25"
              >
                Get Started
              </Link>
              <Link
                href="/participant"
                className="inline-flex items-center justify-center px-8 py-4 bg-slate-800 text-slate-100 font-semibold rounded-lg border border-slate-700 hover:border-slate-600 hover:bg-slate-700 transition-all"
              >
                Explore Research Modules
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Deep-Tech Specs Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Our Core Capabilities</h2>
            <p className="text-xl text-slate-400">Engineered for the future of two-wheeled safety</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Perception-Enabled Edge Modeling */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 border border-slate-700 hover:border-slate-600 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Perception-Enabled Edge Modeling</h3>
                <p className="text-slate-300 leading-relaxed">
                  High-fidelity situational analysis leveraging compact LIDAR frameworks to track potential safety critical events (SCEs).
                </p>
              </div>
            </div>

            {/* Card 2: Sustainable Smart Mobility */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 border border-slate-700 hover:border-slate-600 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Sustainable Smart Mobility</h3>
                <p className="text-slate-300 leading-relaxed">
                  Protecting vulnerable road users while fostering eco-friendly integration into future smart city transit networks.
                </p>
              </div>
            </div>

            {/* Card 3: Data-Driven Research */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 border border-slate-700 hover:border-slate-600 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Data-Driven Research</h3>
                <p className="text-slate-300 leading-relaxed">
                  Empowering institutions with raw rider analytics, reaction time logging, and fatigue metrics.
                </p>
              </div>
            </div>

            {/* Card 4: Adaptive Hazard Detection */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 border border-slate-700 hover:border-slate-600 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0v2m0-6v-2m0 0V7m0 6h2m-4 0h2m4 0h2m-4 0h-2m4 0v2m-6-2v2m0-4V7a2 2 0 012-2h2a2 2 0 012 2v2m0 4v2m0 0v2m0-6v-2" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Adaptive Hazard Detection</h3>
                <p className="text-slate-300 leading-relaxed">
                  Real-time alert vectors engineered to keep motorcyclists ahead of the curve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Metrics Teaser */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-12 border border-slate-700">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-blue-500/10 to-transparent rounded-full blur-3xl -z-0" />
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-slate-950" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Research Validation</h3>
              </div>
              <p className="text-lg text-slate-200 leading-relaxed">
                Observed a significant drop in Safety Critical Events (SCEs) during our initial 3-month field telemetry assessments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / Lead Capture Form */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Join the Future of Two-Wheeled Safety</h2>
            <p className="text-xl text-slate-400">
              Stay updated on our latest research papers, field testing phases, and hardware announcements.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                disabled={subscriptionStatus === 'loading'}
              />
              <button
                type="submit"
                disabled={subscriptionStatus === 'loading'}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {subscriptionStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>

            {/* Success Message */}
            {subscriptionStatus === 'success' && (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-300 font-medium">Thank you for subscribing!</p>
              </div>
            )}

            {/* Error Message */}
            {subscriptionStatus === 'error' && errorMessage && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-300 font-medium">{errorMessage}</p>
              </div>
            )}
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4 text-slate-100">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/participant" className="hover:text-slate-200 transition-colors">Research</Link></li>
                <li><Link href="#features" className="hover:text-slate-200 transition-colors">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-slate-100">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#about" className="hover:text-slate-200 transition-colors">About</Link></li>
                <li><Link href="#contact" className="hover:text-slate-200 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-slate-100">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#privacy" className="hover:text-slate-200 transition-colors">Privacy</Link></li>
                <li><Link href="#terms" className="hover:text-slate-200 transition-colors">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-slate-100">Social</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-slate-200 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-slate-200 transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm">© 2025 MCAS. All rights reserved.</p>
            <p className="text-slate-500 text-sm mt-4 sm:mt-0">Motorcyclist Collision Avoidance System</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
