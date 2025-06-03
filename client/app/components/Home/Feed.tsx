import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const dummyData = [
  {
    id: '1',
    title: 'Holy Basil (Tulsi)',
    sciName: 'Ocimum tenuiflorum',
    description: 'Recommended For: Stress, Anxiety & Respiratory Health',
    image: require('../../../assets/images/home/basil.webp'),
  },
  {
    id: '2',
    title: 'Holy Basil (Tulsi)',
    sciName: 'Ocimum tenuiflorum',
    description: 'Recommended For: Stress, Anxiety & Respiratory Health',
    image: require('../../../assets/images/home/basil.webp'),
  },
]

type Item = {
  id: string
  title: string
  sciName: string
  description: string
  image: any
}

const Feed = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState<any>(null)

  const openModal = (image: any) => {
    setSelectedImage(image)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedImage(null)
  }

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.card}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.sciName}>{item.sciName}</Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => openModal(item.image)}
        style={styles.imageWrapper}
      >
        <Image source={item.image} style={styles.image} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.askAIButton}>
        <MaterialCommunityIcons
          name='star-four-points'
          size={20}
          color='#2F4F2D'
        />
        <Text style={styles.askAIText}>ask AI</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View>
      <Text style={styles.heading}>Feed</Text>
      <FlatList
        data={dummyData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType='fade'
        onRequestClose={closeModal}
      >
        <Pressable style={styles.modalBackground} onPress={closeModal}>
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
    height: 200,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  imageWrapper: {
    width: 75,
    height: 75,
    borderRadius: 12,
    overflow: 'hidden',
    marginLeft: 10,
    alignSelf: 'flex-start',
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
    flex: 1,
    paddingRight: 10,
  },
  descriptionContainer: {
    maxHeight: 80,
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
  askAIButton: {
    backgroundColor: '#BFD9C4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  askAIText: {
    fontWeight: 'bold',
    color: '#2F4F2D',
    marginLeft: 6,
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

export default Feed
