'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Instantiate your secure Supabase bridge mirroring your hook variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export default function LoginPage() {
  const router = useRouter();
  
  // Interactive form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // Execute the direct Supabase authentication pass line
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (data?.user) {
        // Redirect cleanly straight to your private learning console upon verification
        router.push('/reader');
      }
    } catch (err) {
      setErrorMessage('An unexpected system error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060911] text-zinc-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Top Ambient Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
        
        {/* Core Header Section */}
        <div className="text-center mb-8">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-400">
            Secure Entry Interface
          </span>
          <h2 className="text-2xl font-black text-white mt-1 uppercase tracking-tight">
            MCAS Security Control
          </h2>
          <p className="text-zinc-500 text-xs mt-1">
            Input authorized administrator credentials to unlock workspace environments.
          </p>
        </div>

        {/* Dynamic Error Status Readout Display */}
        {errorMessage && (
          <div className="mb-6 border border-rose-900/50 bg-rose-950/20 text-rose-400 text-xs p-3 rounded-lg font-medium leading-relaxed">
            ⚠️ <span className="font-bold">Authentication Refused:</span> {errorMessage}
          </div>
        )}

        {/* Credentials Form Layout Container */}
        <form onSubmit={handleLoginSubmit} className="space-y-5">
          
          {/* Email Vector Processing Entry */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Identity User Email
            </label>
            <input
              type="email"
              required
              disabled={isSubmitting}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@mcas-tech.org"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none focus:border-sky-500/80 transition-all disabled:opacity-40"
            />
          </div>

          {/* Password Vector Entry Field */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Security Access Code
            </label>
            <input
              type="password"
              required
              disabled={isSubmitting}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none focus:border-sky-500/80 transition-all disabled:opacity-40"
            />
          </div>

          {/* Trigger Entry Push Token Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-sky-500 hover:bg-sky-400 disabled:bg-zinc-800 text-black font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-sky-500/10"
            >
              {isSubmitting ? 'Verifying Identity...' : 'Initialize Verification'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}