import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import Header from './components/Home/Header'
import BottomNav from './components/Home/BottomNav'

export default function Result() {
  const router = useRouter()
  const { imageUri, croppedImageUri, label, target, isMatch } =
    useLocalSearchParams<{
      imageUri: string
      croppedImageUri: string
      label: string
      target?: string
      isMatch?: string
    }>()

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header />
      <ScrollView style={styles.content}>
        <View style={styles.imagesContainer}>
          <View style={styles.imageWrapper}>
            <Text style={styles.imageLabel}>Original Image</Text>
            <Image source={{ uri: imageUri }} style={styles.image} />
          </View>
          <View style={styles.imageWrapper}>
            <Text style={styles.imageLabel}>Detected Leaf</Text>
            <Image source={{ uri: croppedImageUri }} style={styles.image} />
          </View>
        </View>
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Scan Result</Text>
          <Text style={styles.resultText}>{label}</Text>
          {target && isMatch === 'false' && (
            <View style={styles.mismatchContainer}>
              <Ionicons name='close-circle' size={24} color='#ff6b6b' />
              <Text style={styles.mismatchText}>
                This is not {target}. Please try scanning a different leaf.
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => router.push('/scan')}
        >
          <Text style={styles.scanButtonText}>SCAN ANOTHER</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCECDC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  imagesContainer: {
    width: '100%',
    marginBottom: 20,
  },
  imageWrapper: {
    marginBottom: 20,
  },
  imageLabel: {
    fontSize: 16,
    color: '#2f4f2d',
    fontWeight: '600',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  resultContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 12,
    width: '100%',
  },
  resultTitle: {
    fontSize: 24,
    color: '#2f4f2d',
    fontWeight: '600',
    marginTop: 10,
  },
  resultText: {
    fontSize: 28,
    color: '#2f4f2d',
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  mismatchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  mismatchText: {
    color: '#ff6b6b',
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  scanButton: {
    backgroundColor: '#2f4f2d',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  scanButtonText: {
    fontSize: 18,
    color: '#DCECDC',
    fontWeight: 'bold',
    textAlign: 'center',
  },
})
