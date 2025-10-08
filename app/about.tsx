import { View, Text, StyleSheet } from 'react-native'
import { Link } from 'expo-router'

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About This App</Text>
      <Text style={styles.description}>
        This is a modern React Native application built with the latest and most stable technologies.
      </Text>
      
      <Text style={styles.sectionTitle}>Key Features:</Text>
      <Text style={styles.feature}>✅ Cross-platform (iOS & Android)</Text>
      <Text style={styles.feature}>✅ TypeScript for type safety</Text>
      <Text style={styles.feature}>✅ File-based routing</Text>
      <Text style={styles.feature}>✅ Modern UI components</Text>
      <Text style={styles.feature}>✅ Smooth animations</Text>
      <Text style={styles.feature}>✅ Efficient state management</Text>
      
      <Link href="/" style={styles.link}>
        <Text style={styles.linkText}>← Back to Home</Text>
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
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  feature: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    textAlign: 'left',
  },
  link: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#34C759',
    borderRadius: 8,
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})