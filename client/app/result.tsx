import { View, StyleSheet, Text, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import Header from './components/Home/Header'
import BottomNav from './components/Home/BottomNav'
import { Ionicons } from '@expo/vector-icons'

export default function ResultPage() {
  const { imageUri, croppedImageUri, label } = useLocalSearchParams()

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <View style={styles.imagesContainer}>
            <View style={styles.imageWrapper}>
              <Text style={styles.imageLabel}>Original Image</Text>
              <Image
                source={{ uri: imageUri as string }}
                style={styles.image}
                resizeMode='contain'
              />
            </View>
            <View style={styles.imageWrapper}>
              <Text style={styles.imageLabel}>Detected Leaf</Text>
              <Image
                source={{ uri: croppedImageUri as string }}
                style={styles.image}
                resizeMode='contain'
              />
            </View>
          </View>
          <View style={styles.resultContainer}>
            <Ionicons name='leaf' size={40} color='#2f4f2d' />
            <Text style={styles.title}>Analysis Complete</Text>
            <Text style={styles.diagnosisLabel}>Diagnosis:</Text>
            <Text style={styles.plantName}>{label as string}</Text>
          </View>
        </View>
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
  title: {
    fontSize: 24,
    color: '#2f4f2d',
    fontWeight: '600',
    marginTop: 10,
  },
  diagnosisLabel: {
    fontSize: 18,
    color: '#2f4f2d',
    marginTop: 20,
    opacity: 0.8,
  },
  plantName: {
    fontSize: 28,
    color: '#2f4f2d',
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
})
