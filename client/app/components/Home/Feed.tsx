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
import { useTheme } from '../../context/ThemeContext'

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
  const { theme } = useTheme()
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState<any>(null)

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

  const openModal = (image: any) => {
    setSelectedImage(image)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedImage(null)
  }

  const renderItem = ({ item }: { item: Item }) => (
    <View style={[styles.card, { backgroundColor: currentColors.backgroundColor }]}>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: currentColors.textColor }]}>{item.title}</Text>
        <Text style={[styles.sciName, { color: currentColors.textColor }]}>{item.sciName}</Text>
        <View style={styles.descriptionContainer}>
          <Text style={[styles.description, { color: currentColors.textColor }]}>{item.description}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => openModal(item.image)} style={styles.imageWrapper}>
        <Image source={item.image} style={styles.image} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.askAIButton, { backgroundColor: currentColors.buttonBackground }]}>
        <MaterialCommunityIcons name='star-four-points' size={20} color={currentColors.buttonTextColor} />
        <Text style={[styles.askAIText, { color: currentColors.buttonTextColor }]} >ask AI</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View>
      <Text style={[styles.heading, { color: currentColors.textColor }]}>Feed</Text>
      <FlatList
        data={dummyData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      <Modal visible={modalVisible} transparent animationType='fade' onRequestClose={closeModal}>
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
