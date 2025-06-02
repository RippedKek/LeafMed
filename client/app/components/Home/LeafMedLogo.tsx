import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const LeafMedLogo = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>LeafMed</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2F4F2D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
  },
})

export default LeafMedLogo
