import React from 'react'
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
import { router, useLocalSearchParams } from 'expo-router'
import Header from './components/Home/Header'
import BottomNav from './components/Home/BottomNav'
import * as FileSystem from 'expo-file-system'

export default function Scan() {
  const HOST = process.env.EXPO_PUBLIC_HOST
  const PORT = process.env.EXPO_PUBLIC_ML_SERVER_PORT
  console.log(HOST, PORT)
  const { target } = useLocalSearchParams<{ target: string }>()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState<'detect' | 'predict' | null>(
    null
  )
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const bounceAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(1)).current
  const [collectedIngredients, setCollectedIngredients] = useState<string[]>([])
  const [scanResult, setScanResult] = useState<{
    disease?: string
    ingredients?: string[]
    matchedTarget?: boolean
  } | null>(null)

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

  const handleScanResult = async (result: any) => {
    if (!result) return

    try {
      setIsLoading(true)
      setLoadingStage('detect')

      if (!selectedImage) return

      const base64Image = await FileSystem.readAsStringAsync(selectedImage, {
        encoding: FileSystem.EncodingType.Base64,
      })

      // First call v2/detect
      const detectResponse = await fetch(`http://${HOST}:${PORT}/v2/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
        }),
      })

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
      const predictResponse = await fetch(`http://${HOST}:${PORT}/v2/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: detectResult.cropped_leaf,
        }),
      })

      if (!predictResponse.ok) {
        throw new Error('Failed to get prediction')
      }

      const predictResult = await predictResponse.json()

      if (target) {
        const isMatch =
          predictResult.label.toLowerCase() === target.toLowerCase()
        if (isMatch && !collectedIngredients.includes(target)) {
          setCollectedIngredients((prev) => [...prev, target])
          setScanResult({
            matchedTarget: true,
            disease: predictResult.label,
            ingredients: predictResult.ingredients,
          })
        }
      } else {
        setScanResult({
          disease: predictResult.label,
          ingredients: predictResult.ingredients,
        })
      }

      router.push({
        pathname: '/result',
        params: {
          imageUri: selectedImage,
          croppedImageUri: `data:image/jpeg;base64,${detectResult.cropped_leaf}`,
          label: predictResult.label,
          target: target || '',
          isMatch: target
            ? String(predictResult.label.toLowerCase() === target.toLowerCase())
            : undefined,
        },
      })
    } catch (error) {
      console.error('Scan error:', error)
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
            onPress={handleScanResult}
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
      {target && (
        <View style={styles.targetContainer}>
          <Text style={styles.targetText}>
            Looking for: <Text style={styles.targetHighlight}>{target}</Text>
          </Text>
          {collectedIngredients.includes(target) && (
            <View style={styles.successContainer}>
              <Ionicons name='checkmark-circle' size={24} color='#2f4f2d' />
              <Text style={styles.successText}>Ingredient collected!</Text>
            </View>
          )}
        </View>
      )}
      {scanResult && (
        <View style={styles.resultContainer}>
          {target ? (
            scanResult.matchedTarget ? (
              <View style={styles.matchContainer}>
                <Text style={styles.matchText}>Match found!</Text>
                <Text style={styles.collectedText}>
                  {target} has been added to your collection
                </Text>
              </View>
            ) : (
              <Text style={styles.noMatchText}>
                This is not {target}. Please try again.
              </Text>
            )
          ) : (
            <>
              <Text style={styles.diseaseText}>{scanResult.disease}</Text>
              {scanResult.ingredients && (
                <>
                  <Text style={styles.ingredientsLabel}>
                    Recommended herbs:
                  </Text>
                  {scanResult.ingredients.map((ingredient, idx) => (
                    <Text key={idx} style={styles.ingredientItem}>
                      • {ingredient}
                    </Text>
                  ))}
                </>
              )}
            </>
          )}
        </View>
      )}
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
  targetContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  targetText: {
    fontSize: 16,
    color: '#2f4f2d',
  },
  targetHighlight: {
    fontWeight: 'bold',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(47, 79, 45, 0.1)',
    padding: 8,
    borderRadius: 8,
  },
  successText: {
    marginLeft: 8,
    color: '#2f4f2d',
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchContainer: {
    alignItems: 'center',
  },
  matchText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2f4f2d',
    marginBottom: 8,
  },
  collectedText: {
    fontSize: 14,
    color: '#2f4f2d',
    textAlign: 'center',
  },
  noMatchText: {
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
  },
  diseaseText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2f4f2d',
    marginBottom: 8,
  },
  ingredientsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2f4f2d',
    marginBottom: 8,
  },
  ingredientItem: {
    fontSize: 14,
    color: '#2f4f2d',
  },
})
