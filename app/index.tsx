import { View, Text, StyleSheet } from 'react-native'
import { Link } from 'expo-router'

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your Mobile App!</Text>
      <Text style={styles.subtitle}>
        Built with React Native + Expo + TypeScript
      </Text>
      
      <Text style={styles.techStack}>
        🚀 Modern Tech Stack:
      </Text>
      <Text style={styles.tech}>• Expo Router (file-based navigation)</Text>
      <Text style={styles.tech}>• Tamagui + NativeWind (UI system)</Text>
      <Text style={styles.tech}>• Zustand (state management)</Text>
      <Text style={styles.tech}>• TanStack Query (server state)</Text>
      <Text style={styles.tech}>• React Native Reanimated</Text>
      <Text style={styles.tech}>• Supabase-ready</Text>
      
      <Link href="/about" style={styles.link}>
        <Text style={styles.linkText}>Go to About →</Text>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  techStack: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  tech: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  link: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})