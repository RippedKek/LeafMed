import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

const ProfileProCard = () => {
  return (
    <LinearGradient
      colors={['#46845b', '#c2fff4']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBorder}
    >
      <View style={styles.card}>
        <LinearGradient
          colors={['#cdffd8', '#94b9ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          <Text style={styles.joinText}>JOIN</Text>
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>LeafMed Pro</Text>
            <MaterialCommunityIcons
              name='star'
              size={13}
              color='#2F4F2D'
              style={styles.icon}
            />
          </View>
          <Text style={styles.priceText}>$1/Month</Text>
          <Text style={styles.featuresText}>No Ads</Text>
          <Text style={styles.featuresText}>&</Text>
          <Text style={styles.featuresText}>Unlimited Scanning</Text>
          <TouchableOpacity style={styles.buyButton}>
            <LinearGradient
              colors={['#8c52ff', '#00bf63']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buyButtonGradient}
            >
              <Text style={styles.buyButtonText}>Buy Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradientBorder: {
    borderRadius: 20,
    padding: 2,
    marginVertical: 20,
  },
  card: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  gradientBackground: {
    width: 220,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#2F4F2D',
    marginBottom: 5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#2F4F2D',
    fontFamily: 'LibreBaskervilleBold',
  },
  icon: {
    marginLeft: 1,
  },
  priceText: {
    fontSize: 16,
    color: '#2F4F2D',
    marginBottom: 10,
  },
  featuresText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2F4F2D',
  },
  buyButton: {
    marginTop: 15,
    borderRadius: 13,
    overflow: 'hidden',
  },
  buyButtonGradient: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
})

export default ProfileProCard
