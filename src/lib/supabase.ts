import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your-supabase-project-url');
};

// Type-safe database query helper
export type Tables = {
  organisations: 'organisations';
  users: 'users';
  applications: 'applications';
  facts: 'facts';
  intake_sections: 'intake_sections';
  intake_questions: 'intake_questions';
  regulatory_sources: 'regulatory_sources';
  regulatory_statements: 'regulatory_statements';
  policy_modules: 'policy_modules';
  policies: 'policies';
  diagrams: 'diagrams';
  business_plans: 'business_plans';
  fca_form_answers: 'fca_form_answers';
  bundle_packs: 'bundle_packs';
  fca_correspondence: 'fca_correspondence';
  audit_log: 'audit_log';
};
