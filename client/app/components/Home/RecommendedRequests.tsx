import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Share,
  Modal,
  Pressable,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import {
  getFirestore,
  collection,
  getDocs,
  limit,
  query,
} from '@firebase/firestore'
import { app } from '../../../firebase'
import HerbInfoModal from '../shared/HerbInfoModal'
import { useTheme } from '../../context/ThemeContext'

const db = getFirestore(app)

interface HerbInfo {
  [key: string]: string | string[]
}

const defaultImage = require('../../../assets/images/home/turmeric.webp')

const RecommendedRequests = () => {
  const { theme } = useTheme()
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedHerb, setSelectedHerb] = useState<HerbInfo | null>(null)
  const [herbs, setHerbs] = useState<HerbInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState<any>(null)

  const openImageModal = (image: any) => {
    setSelectedImage(image)
    setImageModalVisible(true)
  }

  const closeImageModal = () => {
    setSelectedImage(null)
    setImageModalVisible(false)
  }
  
  // Added openModal and closeModal to fix errors by aliasing to image modal handlers
  const openModal = openImageModal;
  const closeModal = closeImageModal;

  const lightThemeColors = {
    backgroundColor: '#DCECDC',
    textColor: '#2F4F2D',
    buttonBackground: '#BFD9C4',
    buttonTextColor: '#2F4F2D',
  }

  const darkThemeColors = {
    backgroundColor: '#2F4F2D',
    textColor: '#BFD9C4',
    buttonBackground: '#1B3B2D',
    buttonTextColor: '#DCECDC',
  }

  const currentColors = theme === 'light' ? lightThemeColors : darkThemeColors

  useEffect(() => {
    fetchHerbs()
  }, [])

  const fetchHerbs = async () => {
    try {
      const herbsQuery = query(collection(db, 'herbs'), limit(3))
      const querySnapshot = await getDocs(herbsQuery)
      const herbsList: HerbInfo[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        herbsList.push({
          id: doc.id,
          title: doc.id.charAt(0).toUpperCase() + doc.id.slice(1),
          ...data,
        })
      })

      setHerbs(herbsList)
    } catch (error) {
      console.error('Error fetching herbs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async (herb: HerbInfo) => {
    try {
      const properties = Array.isArray(herb.properties)
        ? herb.properties.join(', ')
        : ''
      const uses = Array.isArray(herb.uses)
        ? herb.uses.map((use) => `• ${use}`).join('\n')
        : ''
      const precautions = Array.isArray(herb.precautions)
        ? herb.precautions.map((p) => `• ${p}`).join('\n')
        : ''

      const shareText = `
        ${herb.title} (${herb.scientificName || ''})

        ${herb.description || ''}

        ${properties ? `Properties:\n${properties}` : ''}

        ${uses ? `Uses:\n${uses}` : ''}

        ${precautions ? `Precautions:\n${precautions}` : ''}`

      await Share.share({
        message: shareText.trim(),
      })
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  const renderItem = ({ item }: { item: HerbInfo }) => (
    <View style={[styles.card, { backgroundColor: currentColors.backgroundColor }]}>
      <TouchableOpacity onPress={() => openModal(item.image || defaultImage)} style={styles.imageWrapper}>
        <Image source={item.image || defaultImage} style={styles.image} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: currentColors.textColor }]}>{item.title}</Text>
        <Text style={[styles.sciName, { color: currentColors.textColor }]}>{item.scientificName || ''}</Text>
        <View style={styles.descriptionContainer}>
          <Text style={[styles.description, { color: currentColors.textColor }]} numberOfLines={3}>
            {item.description || ''}
          </Text>
          {Array.isArray(item.properties) && item.properties.length > 0 && (
            <Text style={[styles.properties, { color: currentColors.textColor }]} numberOfLines={2}>
              Properties: {item.properties.join(', ')}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.iconButton, { backgroundColor: currentColors.buttonBackground }]}
          onPress={() => handleShare(item)}
        >
          <Feather name='share' size={20} color={currentColors.buttonTextColor} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.knowMoreButton, { backgroundColor: currentColors.buttonBackground }]}
          onPress={() => {
            setSelectedHerb(item)
            setModalVisible(true)
          }}
        >
          <Text style={[styles.knowMoreText, { color: currentColors.buttonTextColor }]}>know more</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={modalVisible} transparent animationType='fade' onRequestClose={closeModal}>
        <Pressable style={styles.modalBackground} onPress={closeModal}>
          <Image source={selectedImage} style={styles.modalImage} />
        </Pressable>
      </Modal>
    </View>
  )

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.loadingText, { color: currentColors.textColor }]}>Loading herbs...</Text>
      </View>
    )
  }

  return (
    <View>
      <Text style={[styles.heading, { color: currentColors.textColor }]}>Recommended Requests</Text>
      <FlatList
        data={herbs}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      {selectedHerb && (
        <HerbInfoModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false)
            setSelectedHerb(null)
          }}
          herbInfo={selectedHerb}
          herbName={String(selectedHerb.title)}
        />
      )}
      {/* Image modal popup */}
      <Modal visible={imageModalVisible} transparent animationType='fade' onRequestClose={closeImageModal}>
        <Pressable style={styles.modalBackground} onPress={closeImageModal}>
          <Image source={selectedImage} style={styles.modalImage} />
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textDecorationLine: 'underline',
    marginLeft: 20,
  },
  listContainer: {
    paddingLeft: 12,
  },
  card: {
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginRight: 12,
    width: 280,
    height: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    flexDirection: 'column',
  },
  imageWrapper: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 75,
    height: 75,
    borderRadius: 37.5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    paddingRight: 100,
  },
  descriptionContainer: {
    maxHeight: 120,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  sciName: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  properties: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 15,
    left: 15,
    alignItems: 'center',
    gap: 8,
  },
  button: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  iconButton: {
    width: 40,
  },
  knowMoreButton: {
    paddingHorizontal: 18,
  },
  knowMoreText: {
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '80%',
    height: '60%',
    borderRadius: 12,
  },
})

export default RecommendedRequests
