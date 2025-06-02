import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const BottomNav = () => {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/')}>
        <Feather name='home' size={24} color='#2F4F2D' />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push('/scan')}
      >
        <MaterialCommunityIcons name='barcode-scan' size={24} color='#2F4F2D' />
        <Text style={styles.label}>Scan</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Feather name='message-circle' size={24} color='#2F4F2D' />
        <Text style={styles.label}>Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push('/profile')}
      >
        <Feather name='user' size={24} color='#000' />
        <Text style={styles.label}>Profile</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#DCECDC',
    paddingVertical: 6,
    justifyContent: 'space-around',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    color: '#2F4F2D',
    marginTop: 6,
  },
})

export default BottomNav
