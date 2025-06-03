import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import Header from './components/Home/Header'
import BottomNav from './components/Home/BottomNav'
import { Ionicons } from '@expo/vector-icons'

export default function ErrorPage() {
  const { imageUri } = useLocalSearchParams()

  const handleTryAgain = () => {
    router.back()
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Text style={styles.imageLabel}>Your Image</Text>
            <Image
              source={{ uri: imageUri as string }}
              style={styles.image}
              resizeMode='contain'
            />
          </View>
          <View style={styles.errorContainer}>
            <Ionicons name='alert-circle' size={50} color='#e74c3c' />
            <Text style={styles.errorTitle}>No Leaf Detected</Text>
            <Text style={styles.errorText}>
              We couldn't detect a leaf in your image. Here are some tips for
              better results:
            </Text>
            <View style={styles.tipsList}>
              <View style={styles.tipItem}>
                <Ionicons name='checkmark-circle' size={24} color='#2f4f2d' />
                <Text style={styles.tipText}>
                  Ensure the leaf is clearly visible in the frame
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name='checkmark-circle' size={24} color='#2f4f2d' />
                <Text style={styles.tipText}>
                  Place the leaf against a contrasting background
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name='checkmark-circle' size={24} color='#2f4f2d' />
                <Text style={styles.tipText}>
                  Make sure there's good lighting
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name='checkmark-circle' size={24} color='#2f4f2d' />
                <Text style={styles.tipText}>
                  Avoid shadows or glare on the leaf
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.tryAgainButton}
              onPress={handleTryAgain}
            >
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  imageContainer: {
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
    height: 250,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  errorContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    color: '#e74c3c',
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#2f4f2d',
    textAlign: 'center',
    marginBottom: 20,
  },
  tipsList: {
    width: '100%',
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    color: '#2f4f2d',
  },
  tryAgainButton: {
    backgroundColor: '#2f4f2d',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})
