
import { createClient } from '@supabase/supabase-js';

/**
 * यह फ़ंक्शन Vercel के Environment Variables से डेटा उठाता है।
 * यह 15,000+ यूज़र्स के लिए ग्लोबल कनेक्शन सुनिश्चित करता है।
 */
const getEnv = (key: string): string => {
  try {
    // Vercel / Production Environment
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] as string;
    }
    
    // Vite / Development Environment
    const meta = (import.meta as any);
    if (meta && meta.env && meta.env[`VITE_${key}`]) {
      return meta.env[`VITE_${key}`];
    }
    
    // Local Fallback (Only for initial setup diagnostics)
    return localStorage.getItem(`SB_${key}`) || '';
  } catch (e) {
    return '';
  }
};

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY');

export const isSupabaseConfigured = () => {
  return !!supabaseUrl && supabaseUrl.startsWith('https://');
};

// Global instance for all 15,000 users
export const supabase = createClient(
  supabaseUrl || 'https://missing.supabase.co',
  supabaseAnonKey || 'missing-key'
);

// Helper to save for Admin debugging only
export const saveDebugConfig = (url: string, key: string) => {
  localStorage.setItem('SB_SUPABASE_URL', url);
  localStorage.setItem('SB_SUPABASE_ANON_KEY', key);
  window.location.reload();
};
