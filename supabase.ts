import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] as string;
    }
    const meta = (import.meta as any);
    if (meta && meta.env && meta.env[`VITE_${key}`]) {
      return meta.env[`VITE_${key}`];
    }
    return '';
  } catch (e) {
    return '';
  }
};

const SUPABASE_URL_DEFAULT = 'https://kwkzyoppaxgvxeufgpqc.supabase.co';
const SUPABASE_KEY_DEFAULT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3a3p5b3BwYXhndnhldWZncHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNTIzNDgsImV4cCI6MjA4NjYyODM0OH0.NQcTG-I151yTYGCV288CkwTT2t7vBGjfPj-z_JNQvmA';

// ISP Block Bypass: प्रॉक्सी का उपयोग करें
const getSupabaseUrl = () => {
  const envUrl = getEnv('SUPABASE_URL');
  if (envUrl) return envUrl;

  if (typeof window !== 'undefined') {
    return window.location.origin + '/supabase-proxy';
  }

  return SUPABASE_URL_DEFAULT;
};

const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY') || SUPABASE_KEY_DEFAULT;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return !!supabaseUrl && supabaseUrl.startsWith('https://') && !supabaseUrl.includes('missing');
};

export const convertDriveLink = (url: string): string => {
  if (!url) return '';
  if (url.includes('googleusercontent.com/d/')) return url;
  if (url.includes('drive.google.com')) {
    const fileIdMatch = url.match(/\/d\/(.+?)([/?#]|$)/) || url.match(/id=(.+?)([&#]|$)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
    }
  }
  return url;
};