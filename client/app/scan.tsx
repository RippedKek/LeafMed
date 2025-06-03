import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
  Animated,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import { useState, useRef, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import Header from './components/Home/Header'
import BottomNav from './components/Home/BottomNav'
import * as FileSystem from 'expo-file-system'

export default function ScanPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState<'detect' | 'predict' | null>(
    null
  )
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const bounceAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start()

      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start()
    } else {
      bounceAnim.setValue(0)
      fadeAnim.setValue(1)
    }
  }, [isLoading])

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
      setCroppedImage(null)
    }
  }

  const handleRetake = () => {
    setSelectedImage(null)
    setCroppedImage(null)
  }

  const handleConfirm = async () => {
    if (!selectedImage) return

    try {
      setIsLoading(true)
      setLoadingStage('detect')

      const base64Image = await FileSystem.readAsStringAsync(selectedImage, {
        encoding: FileSystem.EncodingType.Base64,
      })

      // First call v2/detect
      const detectResponse = await fetch(
        'http://192.168.0.115:5000/v2/detect',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64Image,
          }),
        }
      )

      if (!detectResponse.ok) {
        throw new Error('Failed to detect leaf')
      }

      const detectResult = await detectResponse.json()

      if (!detectResult.leaf_detected) {
        router.push({
          pathname: '/error',
          params: {
            imageUri: selectedImage,
          },
        })
        return
      }

      setCroppedImage(`data:image/jpeg;base64,${detectResult.cropped_leaf}`)

      // Then call v2/predict
      setLoadingStage('predict')
      const predictResponse = await fetch(
        'http://192.168.0.115:5000/v2/predict',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: detectResult.cropped_leaf,
          }),
        }
      )

      if (!predictResponse.ok) {
        throw new Error('Failed to get prediction')
      }

      const predictResult = await predictResponse.json()

      router.push({
        pathname: '/result',
        params: {
          imageUri: selectedImage,
          croppedImageUri: `data:image/jpeg;base64,${detectResult.cropped_leaf}`,
          label: predictResult.label,
        },
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
      setLoadingStage(null)
    }
  }

  const LoadingOverlay = () => (
    <View style={styles.loadingOverlay}>
      <Animated.View
        style={[
          styles.loadingContent,
          {
            transform: [
              {
                translateY: bounceAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                }),
              },
            ],
          },
        ]}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <Ionicons name='leaf' size={60} color='#2f4f2d' />
        </Animated.View>
        <Text style={styles.loadingText}>
          {loadingStage === 'detect'
            ? 'Detecting Leaf...'
            : 'Analyzing Leaf...'}
        </Text>
        <ActivityIndicator
          size='large'
          color='#2f4f2d'
          style={{ marginTop: 20 }}
        />
      </Animated.View>
    </View>
  )

  if (!selectedImage) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Header />
        <View style={styles.content}>
          <Ionicons name='leaf' size={80} color='#2f4f2d' />
          <Text style={styles.title}>Ready to scan your medicinal plant?</Text>
          <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
            <Text style={styles.buttonText}>PICK IMAGE</Text>
          </TouchableOpacity>
        </View>
        <BottomNav />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header />
      <View style={styles.previewContainer}>
        <Image
          source={{ uri: croppedImage || selectedImage }}
          style={styles.preview}
          resizeMode='contain'
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleRetake}
            style={styles.actionButton}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Rechoose</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleConfirm}
            style={[styles.actionButton, isLoading && styles.disabledButton]}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {croppedImage ? 'Analyze Leaf' : 'Detect Leaf'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {isLoading && <LoadingOverlay />}
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
  },
  title: {
    fontSize: 24,
    color: '#2f4f2d',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
    fontWeight: '600',
  },
  pickButton: {
    backgroundColor: '#2f4f2d',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  preview: {
    width: '100%',
    height: '80%',
    borderRadius: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    gap: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2f4f2d',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(220, 236, 220, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContent: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 20,
    color: '#2f4f2d',
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
})
