import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    throw new Error('Supabase client can only be used in the browser.');
  }

  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase is not configured for this deployment.');
  }

  client = createClient(supabaseUrl, supabaseAnonKey);
  return client;
}

// Backwards-compatible lazy client: importing this module no longer initializes
// Supabase during Next.js build/prerender. The real client is created on first use
// in the browser.
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, property, receiver) {
    const actualClient = getSupabaseClient();
    return Reflect.get(actualClient, property, receiver);
  },
});

export { getSupabaseClient };
