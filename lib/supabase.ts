
import { createClient } from '@supabase/supabase-js';

// Access variables from process.env (Vercel injects these at build time for many setups)
// Fallback to empty string to prevent constructor crash
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase configuration is missing. Please ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in Vercel settings.");
}

// Create client with fallback handling
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
