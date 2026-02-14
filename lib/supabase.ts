
import { createClient } from '@supabase/supabase-js';

// Vercel handles process.env during build. 
// For browser environments, these are typically replaced by the bundler.
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("CRITICAL: Supabase URL or Key is missing. Check Vercel Environment Variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
