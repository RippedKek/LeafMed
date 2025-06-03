import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import Header from './components/Home/Header'
import BottomNav from './components/Home/BottomNav'

interface HerbInfo {
  [key: string]: string | string[]
}

export default function Result() {
  const router = useRouter()
  const [modalVisible, setModalVisible] = useState(false)
  const [herbInfo, setHerbInfo] = useState<HerbInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { imageUri, croppedImageUri, label, target, isMatch } =
    useLocalSearchParams<{
      imageUri: string
      croppedImageUri: string
      label: string
      target?: string
      isMatch?: string
    }>()

  const getHerbInfo = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://192.168.0.116:8000/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ herb: label }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.userMessage || 'Failed to fetch herb information'
        )
      }

      const data = await response.json()

      if (!data.info) {
        throw new Error('No information available for this herb')
      }

      setHerbInfo(data.info)
      setModalVisible(true)
    } catch (error: any) {
      console.error('Error fetching herb info:', error)
      setHerbInfo({
        error:
          error.message ||
          'Failed to load herb information. Please try again later.',
      })
      setModalVisible(true)
    } finally {
      setIsLoading(false)
    }
  }

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
          <TouchableOpacity
            style={styles.moreInfoButton}
            onPress={getHerbInfo}
            disabled={isLoading}
          >
            <Ionicons
              name='information-circle-outline'
              size={20}
              color='#DCECDC'
            />
            <Text style={styles.moreInfoText}>
              {isLoading ? 'Loading...' : 'Learn More'}
            </Text>
          </TouchableOpacity>
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

      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name='close' size={24} color='#2f4f2d' />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {herbInfo ? (
                Object.entries(herbInfo).map(([key, value]) => (
                  <View key={key} style={styles.infoSection}>
                    <Text style={styles.infoLabel}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </Text>
                    <Text style={styles.infoText}>
                      {Array.isArray(value) ? value.join(', ') : value}
                    </Text>
                  </View>
                ))
              ) : (
                <ActivityIndicator size='large' color='#2f4f2d' />
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
  moreInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2f4f2d',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 16,
  },
  moreInfoText: {
    fontSize: 16,
    color: '#DCECDC',
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(47, 79, 45, 0.1)',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f4f2d',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    maxHeight: '90%',
  },
  infoSection: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2f4f2d',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
})
