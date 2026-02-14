
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
 * यह गूगल के 'lh3' इंफ्रास्ट्रक्चर का उपयोग करता है जो सबसे विश्वसनीय है।
 */
export const convertDriveLink = (url: string): string => {
  if (!url) return '';
  
  // अगर लिंक पहले से बदला जा चुका है तो वापस न बदलें
  if (url.includes('googleusercontent.com/d/')) return url;

  if (url.includes('drive.google.com')) {
    // फाइल ID निकालने के लिए एडवांस Regex (handle /file/d/ID/view, ?id=ID, etc.)
    const fileIdMatch = url.match(/\/d\/(.+?)([/?#]|$)/) || url.match(/id=(.+?)([&#]|$)/);
    
    if (fileIdMatch && fileIdMatch[1]) {
      // यह फॉर्मेट सीधा इमेज स्ट्रीम करता है जिससे CORS की समस्या नहीं आती
      return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
    }
  }
  return url;
};
