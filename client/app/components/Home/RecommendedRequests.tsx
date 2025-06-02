import React, { useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Pressable } from 'react-native'
import { Feather } from '@expo/vector-icons'

const dummyData = [
  {
    id: '1',
    title: 'Turmeric',
    sciName: 'Curcuma longa',
    description: 'Recommended For: Inflammation, Joint Pain, and Immunity Support',
    image: require('../../../assets/images/home/turmeric.webp'),
  },
  {
    id: '2',
    title: 'Neem',
    sciName: 'Azadirachta indica',
    description: 'Recommended For: Skin Issues (Eczema) + Blood Purification',
    image: require('../../../assets/images/home/neem.jpg'),
  },
]

type Item = {
  id: string
  title: string
  sciName: string
  description: string
  image: any
}

const RecommendedRequests = () => {
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
      <View style={styles.imageWrapper}>
        <TouchableOpacity onPress={() => openModal(item.image)}>
          <Image source={item.image} style={styles.image} />
        </TouchableOpacity>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.sciName}>{item.sciName}</Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="share" size={20} color="#2F4F2D" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.knowMoreButton}>
          <Text style={styles.knowMoreText}>know more</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View>
      <Text style={styles.heading}>Recommended Requests</Text>
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
        animationType="fade"
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
  buttonsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 15,
    left: 15,
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: '#BFD9C4',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  knowMoreButton: {
    backgroundColor: '#BFD9C4',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  knowMoreText: {
    fontWeight: 'bold',
    color: '#2F4F2D',
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