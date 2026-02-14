
import { createClient } from '@supabase/supabase-js';

// Vercel injects these during the build process
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("CRITICAL ERROR: Supabase URL or Anon Key is missing in Vercel settings.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
