import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { useRouter } from 'expo-router'
import LeafMedLogo from './LeafMedLogo'

const Header = () => {
  const router = useRouter()

  const handleProfilePress = () => {
    router.push('/profile')
  }

  return (
    <View style={styles.container}>
      <LeafMedLogo />
      <TouchableOpacity onPress={handleProfilePress} style={styles.profileIconContainer}>
        <Image
          source={require('../../../assets/images/home/ape.jpg')}
          style={styles.profileIcon}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  profileIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  profileIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
})

export default Header
