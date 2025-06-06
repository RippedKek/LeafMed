import React from 'react'
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { Slot, Stack } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { ChatProvider } from './context/ChatContext'
import { useFonts } from 'expo-font'
import { useFirebaseSync } from './hooks/useFirebaseSync'

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key)
    } catch (err) {
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  },
}

const RootLayoutContent = () => {
  useFirebaseSync()
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Slot />
    </Stack>
  )
}

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

  const [fontsLoaded] = useFonts({
    Montserrat: require('../assets/fonts/Montserrat-Regular.ttf'),
    Otomanopee: require('../assets/fonts/OtomanopeeOne-Regular.ttf'),
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    LibreBaskervilleRegular: require('../assets/fonts/LibreBaskerville-Regular.ttf'),
    LibreBaskervilleBold: require('../assets/fonts/LibreBaskerville-Bold.ttf'),
    LibreBaskervilleItalic: require('../assets/fonts/LibreBaskerville-Italic.ttf'),
  })

  if (!publishableKey) {
    throw new Error(
      'Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY - Please add it to your .env file'
    )
  }

  if (!fontsLoaded) {
    return null
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ChatProvider>
          <RootLayoutContent />
        </ChatProvider>
      </ClerkLoaded>
    </ClerkProvider>
  )
}
