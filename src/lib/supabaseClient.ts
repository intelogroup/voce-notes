import { createClient } from '@supabase/supabase-js';

// TODO: Use environment variables instead of hardcoding these values
const supabaseUrl = 'https://bkuowoowlmwranfoliea.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrdW93b293bG13cmFuZm9saWVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMDA4NTQsImV4cCI6MjA2NTc3Njg1NH0.lNbEJRUEOl3nVtRPNqKsJu4w031DHae5bjOxZIFlSpI';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anon key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 