import { useEffect } from 'react';
import { signIn, getSession } from './supabase';
import { Alert } from 'react-native';

/**
 * Auto sign-in helper for development
 * Add this to your app/index.tsx to automatically sign in during development
 */
export function useAutoSignIn() {
  useEffect(() => {
    autoSignIn();
  }, []);

  async function autoSignIn() {
    try {
      // Check if already signed in
      const session = await getSession();
      if (session) {
        console.log('✅ Already signed in as:', session.user.email);
        console.log('   User ID:', session.user.id);
        return;
      }

      console.log('🔐 Not signed in, attempting auto sign-in...');

      // TODO: Replace with your actual credentials
      const DEV_EMAIL = 'your-email@example.com';  // <-- CHANGE THIS
      const DEV_PASSWORD = 'your-password';         // <-- CHANGE THIS

      if (DEV_EMAIL === 'your-email@example.com') {
        console.log('⚠️ Auto sign-in not configured. Update useAutoSignIn.ts with your credentials.');
        return;
      }

      const { data, error } = await signIn(DEV_EMAIL, DEV_PASSWORD);

      if (error) {
        console.error('❌ Auto sign-in failed:', error.message);
        Alert.alert(
          'Sign In Required',
          `Please create an account in Supabase Dashboard:\n\n` +
          `1. Go to Authentication → Users\n` +
          `2. Create user with UUID: 1cb9c50a-2a41-4fb3-8e90-2e270ca28830\n` +
          `3. Update DEV_EMAIL and DEV_PASSWORD in useAutoSignIn.ts`
        );
      } else {
        console.log('✅ Auto signed in as:', data.user?.email);
        console.log('   User ID:', data.user?.id);
        Alert.alert('Success', 'Automatically signed in!');
      }
    } catch (err) {
      console.error('❌ Auto sign-in error:', err);
    }
  }
}
