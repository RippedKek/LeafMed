import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Header from './components/Home/Header'
import SearchBar from './components/Home/SearchBar'
import RecommendedRequests from './components/Home/RecommendedRequests'
import Feed from './components/Home/Feed'
import BottomNav from './components/Home/BottomNav'

export default function HomePage() {
  const insets = useSafeAreaInsets()

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
          <View style={styles.searchWrapper}>
            <SearchBar />
          </View>
          <RecommendedRequests />
          <View style={styles.feedWrapper}>
            <Feed />
          </View>
        </ScrollView>
        <BottomNav />
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
  searchWrapper: {
    marginBottom: 30,
  },
  feedWrapper: {
    marginTop: 30,
  },
})
