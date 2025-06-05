import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Share,
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

const db = getFirestore(app)

interface HerbInfo {
  [key: string]: string | string[]
}

const defaultImage = require('../../../assets/images/home/turmeric.webp')

const RecommendedRequests = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedHerb, setSelectedHerb] = useState<HerbInfo | null>(null)
  const [herbs, setHerbs] = useState<HerbInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image source={defaultImage} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.sciName}>{item.scientificName || ''}</Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description} numberOfLines={3}>
            {item.description || ''}
          </Text>
          {Array.isArray(item.properties) && item.properties.length > 0 && (
            <Text style={styles.properties} numberOfLines={2}>
              Properties: {item.properties.join(', ')}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.iconButton]}
          onPress={() => handleShare(item)}
        >
          <Feather name='share' size={20} color='#2F4F2D' />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.knowMoreButton]}
          onPress={() => {
            setSelectedHerb(item)
            setModalVisible(true)
          }}
        >
          <Text style={styles.knowMoreText}>know more</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading herbs...</Text>
      </View>
    )
  }

  return (
    <View>
      <Text style={styles.heading}>Recommended Requests</Text>
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
    </View>
  )
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F4F2D',
    marginBottom: 8,
    textDecorationLine: 'underline',
    marginLeft: 20,
  },
  listContainer: {
    paddingLeft: 12,
  },
  card: {
    backgroundColor: '#DCECDC',
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
    color: '#1B3B2D',
  },
  sciName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1B3B2D',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#2F4F2D',
    lineHeight: 20,
  },
  properties: {
    fontSize: 14,
    color: '#2F4F2D',
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
    backgroundColor: '#BFD9C4',
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
    color: '#2F4F2D',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#2F4F2D',
    fontSize: 16,
  },
})

export default RecommendedRequests
