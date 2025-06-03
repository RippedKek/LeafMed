import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter, usePathname } from 'expo-router'

const BottomNav = () => {
  const router = useRouter()
  const pathname = usePathname()

  const isSelected = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  const getItemStyle = (path: string): StyleProp<ViewStyle> => {
    return isSelected(path)
      ? [styles.navItem, styles.selectedNavItem]
      : styles.navItem
  }

  const getTextStyle = (path: string): StyleProp<TextStyle> => {
    return isSelected(path)
      ? [styles.label, styles.selectedLabel]
      : styles.label
  }

  const getIconColor = (path: string) => {
    return isSelected(path) ? '#1a3019' : '#2F4F2D'
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={getItemStyle('/')}
        onPress={() => router.push('/')}
      >
        <Feather name='home' size={24} color={getIconColor('/')} />
        <Text style={getTextStyle('/')}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={getItemStyle('/scan')}
        onPress={() => router.push('/scan')}
      >
        <MaterialCommunityIcons
          name='barcode-scan'
          size={24}
          color={getIconColor('/scan')}
        />
        <Text style={getTextStyle('/scan')}>Scan</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={getItemStyle('/chat')}
        onPress={() => router.push('/chat')}
      >
        <Feather
          name='message-circle'
          size={24}
          color={getIconColor('/chat')}
        />
        <Text style={getTextStyle('/chat')}>Ask AI</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={getItemStyle('/profile')}
        onPress={() => router.push('/profile')}
      >
        <Feather name='user' size={24} color={getIconColor('/profile')} />
        <Text style={getTextStyle('/profile')}>Profile</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  selectedNavItem: {
    backgroundColor: 'rgba(47, 79, 45, 0.1)',
  },
  label: {
    fontSize: 13,
    color: '#2F4F2D',
    marginTop: 6,
  },
  selectedLabel: {
    color: '#1a3019',
    fontWeight: '600',
  },
})

export default BottomNav
