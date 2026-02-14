
import { createClient } from '@supabase/supabase-js';

/**
 * ब्राउज़र में 'process.env' सीधे उपलब्ध नहीं होता है।
 * यह फ़ंक्शन सुरक्षित तरीके से Vercel या अन्य एनवायरनमेंट से कीज़ उठाता है।
 */
const getSafeEnv = (key: string): string => {
  try {
    // 1. चेक करें कि क्या process.env मौजूद है (बिल्ड टाइम के लिए)
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] as string;
    }
  } catch (e) {}

  try {
    // 2. चेक करें कि क्या ग्लोबल विंडो ऑब्जेक्ट में है (रनटाइम के लिए)
    if ((window as any)._ENV_ && (window as any)._ENV_[key]) {
      return (window as any)._ENV_[key];
    }
  } catch (e) {}

  return '';
};

const supabaseUrl = getSafeEnv('SUPABASE_URL');
const supabaseAnonKey = getSafeEnv('SUPABASE_ANON_KEY');

// यदि कीज़ नहीं मिलती हैं तो कंसोल में स्पष्ट एरर दिखाएं
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("SUPABASE CONFIG MISSING: कृपया Vercel सेटिंग्स में SUPABASE_URL और SUPABASE_ANON_KEY डालें।");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
