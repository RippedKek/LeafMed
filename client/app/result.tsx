import { View, StyleSheet, Text, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import Header from './components/Home/Header'
import BottomNav from './components/Home/BottomNav'
import { Ionicons } from '@expo/vector-icons'

export default function ResultPage() {
  const { imageUri, label, confidence } = useLocalSearchParams()
  const confidencePercent = Number(confidence) * 100

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header />
      <View style={styles.content}>
        <Image
          source={{ uri: imageUri as string }}
          style={styles.image}
          resizeMode='contain'
        />
        <View style={styles.resultContainer}>
          <Ionicons name='leaf' size={40} color='#2f4f2d' />
          <Text style={styles.title}>Plant Identified!</Text>
          <Text style={styles.plantName}>{label as string}</Text>
          <Text style={styles.confidence}>
            Confidence: {confidencePercent.toFixed(1)}%
          </Text>
        </View>
      </View>
      <BottomNav />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCECDC',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  image: {
    width: '100%',
    height: '50%',
    borderRadius: 12,
    marginBottom: 20,
  },
  resultContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 12,
    width: '100%',
  },
  title: {
    fontSize: 24,
    color: '#2f4f2d',
    fontWeight: '600',
    marginTop: 10,
  },
  plantName: {
    fontSize: 32,
    color: '#2f4f2d',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  confidence: {
    fontSize: 18,
    color: '#2f4f2d',
    marginTop: 10,
    opacity: 0.8,
  },
})
