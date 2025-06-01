import { useFonts } from 'expo-font'
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useOAuth } from '@clerk/clerk-expo'
import { useCallback } from 'react'
import * as WebBrowser from 'expo-web-browser'

const { width, height } = Dimensions.get('window')

WebBrowser.maybeCompleteAuthSession()

export default function SignInScreen() {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

  const [fonts] = useFonts({
    Otomanopee: require('../../assets/fonts/OtomanopeeOne-Regular.ttf'),
    Montserrat: require('../../assets/fonts/Montserrat-Regular.ttf'),
  })

  const onGooglePress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow()

      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId })
      }
    } catch (err) {
      console.error('OAuth error:', err)
    }
  }, [startOAuthFlow])

  if (!fonts) {
    return null
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/welcome/plantation-1.jpg')}
        style={styles.background}
        resizeMode='cover'
      />
      <SafeAreaView style={styles.overlay}>
        {/* Title */}
        <Text style={styles.logo}>LeafMed</Text>

        {/* Headline */}
        <View style={styles.centerContent}>
          <Text style={styles.headline}>
            <Text style={styles.muted}>HERBAL{'\n'}</Text>
            <Text style={styles.bold}>REMEDIES{'\n'}</Text>
            <Text style={styles.muted}>MADE{'\n'}</Text>
            <Text style={styles.bold}>SIMPLE</Text>
          </Text>

          {/* Description */}
          <Text style={styles.description}>
            Your smart guide to herbal healing: find cures, identify plants, and
            save remedies.
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={onGooglePress}>
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width,
    height,
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  logo: {
    fontFamily: 'Otomanopee',
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: 'flex-end',
    marginTop: 20,
    marginRight: 20,
  },
  centerContent: {
    marginLeft: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
  },
  headline: {
    fontSize: 34,
    color: '#fff',
    fontWeight: 'bold',
    lineHeight: 44,
  },
  muted: {
    fontSize: 30,
    fontWeight: '300',
    color: '#fff',
  },
  bold: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    color: '#fff',
    marginTop: 20,
    fontSize: 20,
    lineHeight: 22,
    maxWidth: '90%',
    fontFamily: 'Montserrat',
  },
  button: {
    backgroundColor: '#DFF2E1',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    alignSelf: 'flex-end',
    marginBottom: 30,
    marginRight: 20,
  },
  buttonText: {
    fontSize: 20,
    color: '#1B4332',
    fontWeight: '600',
  },
})
