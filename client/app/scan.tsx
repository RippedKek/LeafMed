import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import Header from './components/Home/Header'
import BottomNav from './components/Home/BottomNav'
import * as FileSystem from 'expo-file-system'

export default function ScanPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
    }
  }

  const handleRetake = () => {
    setSelectedImage(null)
  }

  const handleConfirm = async () => {
    if (!selectedImage) return

    try {
      setIsLoading(true)

      const base64Image = await FileSystem.readAsStringAsync(selectedImage, {
        encoding: FileSystem.EncodingType.Base64,
      })

      // Make the API call
      const response = await fetch('http://192.168.0.117:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get prediction')
      }

      const result = await response.json()

      router.push({
        pathname: '/result',
        params: {
          imageUri: selectedImage,
          label: result.label,
          confidence: result.confidence,
        },
      })
    } catch (error) {
      console.error('Error getting prediction:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
          source={{ uri: selectedImage }}
          style={styles.preview}
          resizeMode='contain'
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleRetake}
            style={styles.actionButton}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Choose Another</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleConfirm}
            style={[styles.actionButton, isLoading && styles.disabledButton]}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color='white' />
            ) : (
              <Text style={styles.buttonText}>Use This Image</Text>
            )}
          </TouchableOpacity>
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
})
