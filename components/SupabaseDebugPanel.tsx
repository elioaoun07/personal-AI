import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { supabase, getSession } from '../lib/supabase';
import Constants from 'expo-constants';

export function SupabaseDebugPanel() {
  const [status, setStatus] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setLoading(true);
    const result: any = {
      timestamp: new Date().toISOString(),
    };

    // Check config
    result.supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL || 'NOT SET';
    result.hasAnonKey = !!Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    result.devUserId = Constants.expoConfig?.extra?.EXPO_PUBLIC_DEV_USER_ID || 'NOT SET';

    // Check auth session
    try {
      const session = await getSession();
      result.isAuthenticated = !!session;
      result.userEmail = session?.user?.email || 'Not signed in';
      result.userId = session?.user?.id || 'N/A';
    } catch (err) {
      result.authError = String(err);
    }

    // Test database connection
    try {
      const { data, error } = await supabase.from('tasks').select('count', { count: 'exact', head: true });
      
      if (error) {
        result.dbStatus = '❌ ERROR';
        result.dbError = error.message;
        result.dbDetails = error;
      } else {
        result.dbStatus = '✅ CONNECTED';
        result.taskCount = data;
      }
    } catch (err) {
      result.dbStatus = '❌ EXCEPTION';
      result.dbException = String(err);
    }

    // Try to fetch actual tasks
    try {
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('id, title, user_id')
        .limit(5);
      
      if (tasksError) {
        result.tasksError = tasksError.message;
      } else {
        result.tasksSample = tasks;
        result.tasksFound = tasks?.length || 0;
      }
    } catch (err) {
      result.tasksException = String(err);
    }

    setStatus(result);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔍 Supabase Debug Info</Text>
        <TouchableOpacity onPress={checkStatus} style={styles.refreshButton}>
          <Text style={styles.refreshText}>🔄 Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        <ScrollView style={styles.content}>
          <Section title="Configuration">
            <Item label="Supabase URL" value={status.supabaseUrl} />
            <Item label="Has Anon Key" value={status.hasAnonKey ? '✅ Yes' : '❌ No'} />
            <Item label="Dev User ID" value={status.devUserId} />
          </Section>

          <Section title="Authentication">
            <Item 
              label="Status" 
              value={status.isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'} 
            />
            <Item label="Email" value={status.userEmail} />
            <Item label="User ID" value={status.userId} />
            {status.authError && <Item label="Auth Error" value={status.authError} error />}
          </Section>

          <Section title="Database Connection">
            <Item label="Status" value={status.dbStatus} />
            {status.dbError && <Item label="Error" value={status.dbError} error />}
            {status.dbException && <Item label="Exception" value={status.dbException} error />}
          </Section>

          <Section title="Tasks">
            <Item label="Tasks Found" value={String(status.tasksFound || 0)} />
            {status.tasksError && <Item label="Tasks Error" value={status.tasksError} error />}
            {status.tasksSample && status.tasksSample.length > 0 && (
              <View style={styles.tasksList}>
                <Text style={styles.tasksTitle}>Sample Tasks:</Text>
                {status.tasksSample.map((task: any, i: number) => (
                  <Text key={i} style={styles.taskItem}>
                    • {task.title} (user: {task.user_id})
                  </Text>
                ))}
              </View>
            )}
          </Section>

          <Section title="Raw Status">
            <Text style={styles.json}>{JSON.stringify(status, null, 2)}</Text>
          </Section>
        </ScrollView>
      )}
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Item({ label, value, error }: { label: string; value: string; error?: boolean }) {
  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={[styles.value, error && styles.errorValue]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  refreshText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  loading: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
  content: {
    maxHeight: 400,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  item: {
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  value: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
  },
  errorValue: {
    color: '#D0021B',
  },
  tasksList: {
    marginTop: 8,
  },
  tasksTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  taskItem: {
    fontSize: 11,
    color: '#666',
    marginLeft: 8,
  },
  json: {
    fontSize: 10,
    color: '#333',
    fontFamily: 'monospace',
  },
});
