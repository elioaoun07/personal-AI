import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Tasks & Calendar App</Text>
      <Text style={styles.description}>
        A blazing-fast, offline-first task manager with natural language input, smart lists, and local notifications.
      </Text>
      
      <Text style={styles.sectionTitle}>Key Features:</Text>
      <Text style={styles.feature}>✅ Natural language Quick Add</Text>
      <Text style={styles.feature}>✅ Smart lists (Overdue, Today, Week, Timeless)</Text>
      <Text style={styles.feature}>✅ Swipe actions (Complete, Snooze, Reschedule)</Text>
      <Text style={styles.feature}>✅ Recurring tasks with RRULE</Text>
      <Text style={styles.feature}>✅ Local notifications with actions</Text>
      <Text style={styles.feature}>✅ Offline-first SQLite storage</Text>
      <Text style={styles.feature}>✅ Calendar view with date filtering</Text>
      <Text style={styles.feature}>✅ Subtasks & tags</Text>
      
      <View style={styles.linksContainer}>
        <Link href="/" style={styles.link} asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>← Tasks</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/calendar" style={styles.link} asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>📅 Calendar</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/dev')}>
          <Text style={styles.buttonText}>🛠️ Dev Tools</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Built with Expo + React Native + TypeScript + SQLite + Zustand
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  feature: {
    fontSize: 15,
    color: '#555',
    marginBottom: 8,
    textAlign: 'left',
  },
  linksContainer: {
    marginTop: 32,
    width: '100%',
    gap: 12,
  },
  link: {
    width: '100%',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 32,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});