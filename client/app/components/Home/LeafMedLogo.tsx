import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../context/ThemeContext'

const LeafMedLogo = () => {
  const { theme } = useTheme()

  const lightThemeColors = {
    backgroundColor: '#2F4F2D', // dark green background in light mode (updated)
    textColor: '#FFFFFF', // white text in light mode (updated)
  }

  const darkThemeColors = {
    backgroundColor: '#BFD9C4', // light green background in dark mode (unchanged)
    textColor: '#2F4F2D', // dark green text in dark mode (unchanged)
  }

  const currentColors = theme === 'light' ? lightThemeColors : darkThemeColors

  return (
    <View style={[styles.container, { backgroundColor: currentColors.backgroundColor }]}>
      <Text style={[styles.text, { color: currentColors.textColor }]}>LeafMed</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
  },
})

export default LeafMedLogo
