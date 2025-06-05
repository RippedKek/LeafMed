import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'

const SearchBar = () => {
  const { theme } = useTheme()

  const lightThemeColors = {
    containerBackground: '#DCECDC',
    textColor: '#2F4F2D',
  }

  const darkThemeColors = {
    containerBackground: '#2F4F2D',
    textColor: '#BFD9C4',
  }

  const currentColors = theme === 'light' ? lightThemeColors : darkThemeColors

  return (
    <View style={[styles.container, { backgroundColor: currentColors.containerBackground }]}>
      <TextInput
        placeholder='Search'
        placeholderTextColor={currentColors.textColor}
        style={[styles.input, { color: currentColors.textColor }]}
      />
      <Feather name='search' size={24} color={currentColors.textColor} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#DCECDC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 20,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#2F4F2D',
    marginRight: 8,
  },
})

export default SearchBar
