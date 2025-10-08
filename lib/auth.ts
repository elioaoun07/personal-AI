import Constants from 'expo-constants';
import { getSession } from './supabase';

/**
 * Get the current user ID from Supabase session
 * Falls back to dev user ID from env if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession();
  
  if (session?.user?.id) {
    return session.user.id;
  }
  
  // Fallback to dev user from .env
  return Constants.expoConfig?.extra?.EXPO_PUBLIC_DEV_USER_ID || null;
}

/**
 * Synchronous version - gets dev user ID from env
 * Use this for non-async contexts
 */
export function getDevUserId(): string | null {
  return Constants.expoConfig?.extra?.EXPO_PUBLIC_DEV_USER_ID || null;
}

/**
 * Check if a user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}
