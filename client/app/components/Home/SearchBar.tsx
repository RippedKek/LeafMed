import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'

const SearchBar = () => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search"
        placeholderTextColor="#2F4F2D"
        style={styles.input}
      />
      <Feather name="search" size={24} color="#2F4F2D" />
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
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#2F4F2D',
    marginRight: 8,
  },
})

export default SearchBar
