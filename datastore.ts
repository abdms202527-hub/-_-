
import { createClient } from '@supabase/supabase-js';
import { AppState } from './types';
import { INITIAL_DATA } from './constants';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || '';
const STORAGE_KEY = 'temple_app_data_v1'; // Incremented version to clear any old corrupt state

const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

export const getData = async (): Promise<AppState> => {
  // 1. Try to get from localStorage first for immediate results
  const localData = localStorage.getItem(STORAGE_KEY);
  let state: AppState | null = null;

  if (localData) {
    try {
      state = JSON.parse(localData);
    } catch (e) {
      console.error("Local Storage Parse Error:", e);
    }
  }

  // 2. Try to sync from Supabase if available
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('temple_configs')
        .select('config_json')
        .eq('id', 1)
        .maybeSingle();

      if (!error && data?.config_json) {
        const remoteState = data.config_json as AppState;
        // If we have remote state, it becomes the source of truth
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteState));
        return remoteState;
      }
    } catch (e) {
      console.warn("Supabase Fetch Error, using local backup:", e);
    }
  }

  return state || INITIAL_DATA;
};

export const saveData = async (data: AppState) => {
  // CRITICAL: Always save to localStorage immediately
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  // Save to Supabase if available
  if (supabase) {
    try {
      const { error } = await supabase
        .from('temple_configs')
        .upsert({ id: 1, config_json: data });
      
      if (error) throw error;
    } catch (e) {
      console.error("Supabase Save Error:", e);
      throw e; // Re-throw to show error in UI
    }
  }
};

export const checkAdminAuth = (user: string, pass: string): boolean => {
  // Simple auth for demo; in production use proper Supabase Auth
  return user === 'admin' && pass === 'vitthal123';
};
