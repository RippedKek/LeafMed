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
import { useTheme } from '../../context/ThemeContext'

const BottomNav = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { theme } = useTheme()

  const lightThemeColors = {
    backgroundColor: '#DCECDC',
    textColor: '#2F4F2D',
    iconColor: '#2F4F2D',
    selectedBackground: 'rgba(47, 79, 45, 0.1)',
    selectedTextColor: '#1a3019',
    selectedIconColor: '#1a3019',
  }

  const darkThemeColors = {
    backgroundColor: '#2F4F2D',
    textColor: '#BFD9C4',
    iconColor: '#BFD9C4',
    selectedBackground: 'rgba(191, 217, 196, 0.2)',
    selectedTextColor: '#DCECDC',
    selectedIconColor: '#DCECDC',
  }

  const currentColors = theme === 'light' ? lightThemeColors : darkThemeColors

  const isSelected = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  const getItemStyle = (path: string): StyleProp<ViewStyle> => {
    return isSelected(path)
      ? [styles.navItem, { backgroundColor: currentColors.selectedBackground }]
      : styles.navItem
  }

  const getTextStyle = (path: string): StyleProp<TextStyle> => {
    return isSelected(path)
      ? [styles.label, { color: currentColors.selectedTextColor, fontWeight: '600' }]
      : [styles.label, { color: currentColors.textColor }]
  }

  const getIconColor = (path: string) => {
    return isSelected(path) ? currentColors.selectedIconColor : currentColors.iconColor
  }

  return (
    <View style={[styles.container, { backgroundColor: currentColors.backgroundColor }]}>
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
  label: {
    fontSize: 13,
    marginTop: 6,
  },
})

export default BottomNav
