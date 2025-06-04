import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Modal } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Header from './components/Home/Header'
import SearchBar from './components/Home/SearchBar'
import RecommendedRequests from './components/Home/RecommendedRequests'
import Feed from './components/Home/Feed'
import BottomNav from './components/Home/BottomNav'
import ProfileProCard from './components/ProfileProCard'
import { LinearGradient } from 'expo-linear-gradient'

export default function HomePage() {
  const insets = useSafeAreaInsets()
  const [modalVisible, setModalVisible] = useState(false)

  const openModal = () => setModalVisible(true)
  const closeModal = () => setModalVisible(false)

  return (
    <View
      style={[
        styles.safeArea,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.container}>
        <Header />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.joinButton} onPress={openModal}>
            <LinearGradient
              colors={['#8c52ff', '#00bf63']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.joinButtonGradient}
            >
              <Text style={styles.joinButtonText}>
                JOIN LeafMed Pro
                <Text style={styles.starIcon}> ✨</Text>
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={styles.searchWrapper}>
            <SearchBar />
          </View>
          <RecommendedRequests />
          <View style={styles.feedWrapper}>
            <Feed />
          </View>
        </ScrollView>
        <BottomNav />

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeModal}
          onDismiss={closeModal}
          statusBarTranslucent={true}
        >
          <TouchableOpacity style={styles.modalPopup} activeOpacity={1} onPressOut={closeModal}>
            <View style={styles.modalOverlay} />
            <ProfileProCard />
          </TouchableOpacity>
        </Modal>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#DCECDC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F9F6',
  },
  scrollContent: {
    paddingTop: 10,
    paddingHorizontal: 0,
    paddingBottom: 80,
  },
  joinButton: {
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'LibreBaskervilleBold',
    textAlign: 'center',
    lineHeight: 36,
    includeFontPadding: false,
    paddingTop: 0,
    paddingBottom: 0,
    height: 36,
    textAlignVertical: 'center',
  },
  starIcon: {
    fontSize: 18,
    marginLeft: 4,
  },
  joinButtonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 19,
  },
  searchWrapper: {
    marginBottom: 30,
  },
  feedWrapper: {
    marginTop: 30,
  },
  modalPopup: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 100,
    position: 'relative',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: -1,
  },
  closeIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: '#2F4F2D',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
})
