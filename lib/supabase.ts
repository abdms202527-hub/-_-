
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

const supabaseUrl = getEnv('SUPABASE_URL') || SUPABASE_URL_DEFAULT;
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY') || SUPABASE_KEY_DEFAULT;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return !!supabaseUrl && supabaseUrl.startsWith('https://') && !supabaseUrl.includes('missing');
};

/**
 * Google Drive लिंक्स को Direct Image लिंक्स में बदलने के लिए उन्नत हेल्पर
 */
export const convertDriveLink = (url: string): string => {
  if (!url) return '';
  
  // अगर पहले से डायरेक्ट लिंक है तो कुछ न करें
  if (url.includes('drive.google.com/uc')) return url;

  if (url.includes('drive.google.com')) {
    // विभिन्न ड्राइव फॉर्मेट्स के लिए Regex सुधार
    const fileIdMatch = url.match(/\/d\/(.+?)([/?#]|$)/) || url.match(/id=(.+?)([&#]|$)/);
    
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
    }
  }
  return url;
};
