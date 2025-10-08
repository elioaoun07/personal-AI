import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'

// Get Supabase credentials from environment variables
// Expo exposes EXPO_PUBLIC_* variables through Constants.expoConfig.extra
const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY

// Debug logging
console.log('🔍 Supabase Config Debug:');
console.log('  URL:', supabaseUrl);
console.log('  Has Anon Key:', !!supabaseAnonKey);
console.log('  Anon Key (first 20 chars):', supabaseAnonKey?.substring(0, 20));
console.log('  All extra keys:', Object.keys(Constants.expoConfig?.extra || {}));

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ CRITICAL: Supabase credentials not found!');
  console.error('  URL:', supabaseUrl);
  console.error('  Anon Key:', supabaseAnonKey);
  console.error('  Make sure .env file exists and app was restarted');
}

// Validate that we're not using placeholder values
if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
  console.error('❌ CRITICAL: Using placeholder Supabase credentials!');
  console.error('  This means environment variables are not loading correctly');
}

// Create Supabase client
console.log('🚀 Creating Supabase client with:');
console.log('  URL:', supabaseUrl);
console.log('  Key length:', supabaseAnonKey?.length);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
)

console.log('✅ Supabase client created successfully');

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}