
import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
  try {
    // 1. Try Local Storage first (for user-configured setup)
    const localValue = localStorage.getItem(`SB_${key}`);
    if (localValue) return localValue;

    // 2. Try process.env
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] as string;
    }
    
    // 3. Try Vite/Meta
    const meta = (import.meta as any);
    if (meta && meta.env && meta.env[`VITE_${key}`]) {
      return meta.env[`VITE_${key}`];
    }
  } catch (e) {}
  return '';
};

export const saveSupabaseConfig = (url: string, key: string) => {
  localStorage.setItem('SB_SUPABASE_URL', url);
  localStorage.setItem('SB_SUPABASE_ANON_KEY', key);
  window.location.reload(); // Reload to apply changes
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem('SB_SUPABASE_URL');
  localStorage.removeItem('SB_SUPABASE_ANON_KEY');
  window.location.reload();
};

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY');

export const isSupabaseConfigured = () => {
  return !!supabaseUrl && supabaseUrl.startsWith('https://') && !supabaseUrl.includes('missing-url');
};

export const supabase = createClient(
  supabaseUrl || 'https://missing-url.supabase.co',
  supabaseAnonKey || 'missing-key'
);
