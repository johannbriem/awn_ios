import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://supabase.com/dashboard/project/ahjxirfaryfpansbpjii';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoanhpcmZhcnlmcGFuc2JwamlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMzMzNjcsImV4cCI6MjA2MzYwOTM2N30.B7KoIKiNgTbrelPJ8aUgKKVIZglTm_FSyN6QKU9yruQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
