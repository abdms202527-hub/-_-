
import { createClient } from '@supabase/supabase-js';

/**
 * यह फ़ंक्शन प्राथमिकता के आधार पर URL और Key उठाता है:
 * 1. पहले Environment Variables (Vercel/Production)
 * 2. फिर आपके द्वारा प्रदान किए गए हार्डकोडेड क्रेडेंशियल्स
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
    
    return '';
  } catch (e) {
    return '';
  }
};

// आपकी प्रदान की गई जानकारी यहाँ जोड़ी गई है
const SUPABASE_URL_DEFAULT = 'https://kwkzyoppaxgvxeufgpqc.supabase.co';
const SUPABASE_KEY_DEFAULT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3a3p5b3BwYXhndnhldWZncHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNTIzNDgsImV4cCI6MjA4NjYyODM0OH0.NQcTG-I151yTYGCV288CkwTT2t7vBGjfPj-z_JNQvmA';

const supabaseUrl = getEnv('SUPABASE_URL') || SUPABASE_URL_DEFAULT;
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY') || SUPABASE_KEY_DEFAULT;

export const isSupabaseConfigured = () => {
  // यदि URL 'https://' से शुरू होता है और 'missing' नहीं है, तो यह कॉन्फ़िगर माना जाएगा
  return !!supabaseUrl && supabaseUrl.startsWith('https://') && !supabaseUrl.includes('missing');
};

// 15,000+ यूज़र्स के लिए ग्लोबल इंस्टेंस
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Debug Helper (Admin के लिए)
export const saveDebugConfig = (url: string, key: string) => {
  localStorage.setItem('SB_SUPABASE_URL', url);
  localStorage.setItem('SB_SUPABASE_ANON_KEY', key);
  window.location.reload();
};
