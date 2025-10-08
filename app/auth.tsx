import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { supabase, signIn, getCurrentUser, getSession } from '../lib/supabase';

export default function AuthScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL;
  const devUserId = Constants.expoConfig?.extra?.EXPO_PUBLIC_DEV_USER_ID;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    const currentSession = await getSession();
    setUser(currentUser);
    setSession(currentSession);
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    const { data, error } = await signIn(email, password);

    if (error) {
      Alert.alert('Sign In Error', error.message);
      console.error('Sign in error:', error);
    } else {
      Alert.alert('Success', 'Signed in successfully!');
      await checkAuth();
    }
    setLoading(false);
  };

  const testConnection = async () => {
    try {
      const { data, error } = await supabase.from('tasks').select('count');
      if (error) {
        Alert.alert('Connection Test Failed', error.message);
        console.error('Connection test error:', error);
      } else {
        Alert.alert('Connection Test', 'Successfully connected to Supabase!');
        console.log('Connection test result:', data);
      }
    } catch (err) {
      Alert.alert('Connection Test Failed', String(err));
      console.error('Connection test exception:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Supabase Authentication</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuration</Text>
          <Text style={styles.label}>Supabase URL:</Text>
          <Text style={styles.value}>{supabaseUrl || 'Not configured'}</Text>
          
          <Text style={styles.label}>Dev User ID:</Text>
          <Text style={styles.value}>{devUserId || 'Not configured'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Session</Text>
          {user ? (
            <>
              <Text style={styles.label}>User ID:</Text>
              <Text style={styles.value}>{user.id}</Text>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{user.email}</Text>
            </>
          ) : (
            <Text style={styles.value}>Not authenticated</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sign In</Text>
          
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="your-email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={testConnection}>
            <Text style={styles.buttonText}>Test Connection</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={checkAuth}>
            <Text style={styles.buttonText}>Refresh Auth Status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.helpTitle}>⚠️ Setup Instructions</Text>
          <Text style={styles.helpText}>
            1. Go to your Supabase project dashboard{'\n'}
            2. Go to Settings → API{'\n'}
            3. Copy your Project URL (should be https://xxx.supabase.co){'\n'}
            4. Copy your anon/public key{'\n'}
            5. Update your .env file with correct values{'\n'}
            6. Restart the app with: pnpm start{'\n'}
            7. Sign in with your Supabase account credentials
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  backButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#ff9500',
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
