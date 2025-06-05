import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import Header from './components/Home/Header'
import BottomNav from './components/Home/BottomNav'
import { useUser } from '@clerk/clerk-expo'
import { useChat } from './context/ChatContext'
import {
  useUserStore,
  PinnedRemedy,
  State,
  Action,
  useFirebaseSync,
} from './hooks/useFirebaseSync'
import { useTheme } from './context/ThemeContext'

interface Message {
  text: string
  isUser: boolean
  aiResponse?: {
    disease: string
    ingredients: Array<{
      name: string
      usage: string
    }>
  }
}

interface ChatResponse {
  disease: string
  ingredients: Array<{
    name: string
    usage: string
  }>
}

export default function Chat() {
  const HOST = process.env.EXPO_PUBLIC_HOST
  const PORT = process.env.EXPO_PUBLIC_BACKEND_PORT
  const router = useRouter()
  const { isLoaded, user } = useUser()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)
  const { messages, setMessages, clearChat } = useChat()
  const addPinnedRemedy = useUserStore(
    (state: State & Action) => state.addPinnedRemedy
  )
  const pinnedRemedies = useUserStore(
    (state: State & Action) => state.pinnedRemedies
  )
  useFirebaseSync()
  const { theme } = useTheme()


  const lightThemeColors = {
    backgroundColor: '#DCECDC',
    textColor: '#2F4F2D',
    aiMessageBackground: '#FFFFFF',
    userMessageBackground: '#2F4F2D',
    userTextColor: '#FFFFFF',
  }

  const darkThemeColors = {
    backgroundColor: '#000000',
    textColor: '#BFD9C4',
    aiMessageBackground: '#1B3B2D',
    userMessageBackground: '#BFD9C4',
    userTextColor: '#2F4F2D',
  }

  const currentColors = theme === 'light' ? lightThemeColors : darkThemeColors

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setMessages((prev: Message[]) => [
      ...prev,
      { text: userMessage, isUser: true },
    ])
    setIsLoading(true)

    try {
      const response = await fetch(`http://${HOST}:${PORT}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.userMessage || 'Failed to get response')
      }

      const data: ChatResponse = await response.json()
      setMessages((prev: Message[]) => [
        ...prev,
        {
          text: '',
          isUser: false,
          aiResponse: {
            disease: data.disease,
            ingredients: data.ingredients,
          },
        },
      ])
    } catch (error: any) {
      console.error('Error:', error)
      setMessages((prev: Message[]) => [
        ...prev,
        {
          text:
            error.message || 'Sorry, I encountered an error. Please try again.',
          isUser: false,
        },
      ])
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }

  const handlePin = async (aiResponse: {
    disease: string
    ingredients: Array<{ name: string; usage: string }>
  }) => {
    if (!user) {
      console.error('No user found')
      return
    }

    try {
      const newPinnedRemedy: PinnedRemedy = {
        disease: aiResponse.disease,
        ingredients: aiResponse.ingredients,
        dateAdded: new Date().toISOString(),
      }
      await addPinnedRemedy(user.id, newPinnedRemedy)
    } catch (error) {
      console.error('Error pinning remedy:', error)
    }
  }

  if (!isLoaded) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: currentColors.backgroundColor }]}>
        <ActivityIndicator size='large' color={currentColors.textColor} />
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.backgroundColor }]} edges={['top', 'bottom']}>
      <Header />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.scrollContent}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.length === 0 ? (
            <View style={styles.welcomeContainer}>
              <Ionicons name='leaf' size={60} color={currentColors.textColor} />
              <Text style={[styles.greeting, { color: currentColors.textColor }]}>
                Hello, {user?.firstName || 'Guest'}
              </Text>
              <Text style={[styles.welcomeTitle, { color: currentColors.textColor }]}>Welcome to LeafMed AI!</Text>
              <Text style={[styles.welcomeText, { color: currentColors.textColor }]}>
                Describe your symptoms, and I'll suggest herbal remedies that
                might help.
              </Text>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={styles.newChatButton}
                onPress={clearChat}
              >
                <Ionicons name='add-circle-outline' size={20} color={currentColors.textColor} />
                <Text style={[styles.newChatText, { color: currentColors.textColor }]}>New Chat</Text>
              </TouchableOpacity>
              {messages.map((message, index) => (
                <View
                  key={index}
                  style={[
                    styles.messageWrapper,
                    message.isUser ? styles.userMessage : styles.aiMessage,
                    { backgroundColor: message.isUser ? currentColors.userMessageBackground : currentColors.aiMessageBackground }
                  ]}
                >
                  {message.isUser ? (
                    <Text style={[styles.messageText, styles.userText, { color: currentColors.userTextColor }]}>
                      {message.text}
                    </Text>
                  ) : message.aiResponse ? (
                    <View style={styles.aiResponseContainer}>
                      <View style={styles.aiResponseHeader}>
                        <Text style={[styles.diseaseText, { color: currentColors.textColor }]}>
                          {message.aiResponse.disease}
                        </Text>
                        {message.aiResponse.disease !==
                          'Only symptoms are allowed' && (
                          <TouchableOpacity
                            onPress={() => {
                              console.log('Pin button pressed') // Debug log
                              handlePin(message.aiResponse!)
                            }}
                            style={styles.pinButton}
                            activeOpacity={0.6}
                          >
                            <MaterialCommunityIcons
                              name='pin'
                              size={24}
                              color={currentColors.textColor}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      <Text style={[styles.ingredientsLabel, { color: currentColors.textColor }]}>
                        Recommended herbs:
                      </Text>
                      {message.aiResponse.ingredients.map((ingredient, idx) => (
                        <View key={idx} style={styles.ingredientContainer}>
                          <TouchableOpacity
                            style={[styles.ingredientButton, { backgroundColor: theme === 'dark' ? 'rgba(142, 146, 142, 0.1)' : 'rgba(47, 79, 45, 0.1)', }]}
                            onPress={() =>
                              router.push({
                                pathname: '/scan',
                                params: { target: ingredient.name },
                              })
                            }
                          >
                            <Text style={[styles.ingredientName, { color: currentColors.textColor }]}>
                              • {ingredient.name}
                            </Text>
                            <Ionicons
                              name='scan-outline'
                              size={16}
                              color={currentColors.textColor}
                              style={styles.scanIcon}
                            />
                          </TouchableOpacity>
                          <Text style={[styles.usageText, { color: currentColors.textColor }]}>
                            {ingredient.usage}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={[styles.messageText, styles.aiText]}>
                      {message.text}
                    </Text>
                  )}
                </View>
              ))}
            </>
          )}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={currentColors.textColor} size='small' />
              <Text style={[styles.loadingText, { color: currentColors.textColor }]}>Analyzing symptoms...</Text>
            </View>
          )}
        </ScrollView>
        <View style={[styles.inputContainer, { backgroundColor: currentColors.backgroundColor, borderTopColor: theme === 'dark' ? '#666' : 'rgba(0, 0, 0, 0.1)' }]}>
          <TextInput
            style={[styles.input, { backgroundColor: theme === 'dark' ? '#2F4F2D' : '#fff', color: theme === 'dark' ? '#BFD9C4' : '#000' }, isLoading && styles.inputDisabled]}
            value={input}
            onChangeText={setInput}
            placeholder={
              isLoading ? 'Please wait...' : 'Describe your symptoms...'
            }
            placeholderTextColor={theme === 'dark' ? '#BFD9C4' : '#666'}
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: theme === 'dark' ? '#BFD9C4' : '#2f4f2d' },
              (!input.trim() || isLoading) && styles.disabledButton,
            ]}
            onPress={sendMessage}
            disabled={!input.trim() || isLoading}
          >
            <Ionicons
              name='send'
              size={24}
              color={theme === 'dark' ? '#2F4F2D' : (input.trim() && !isLoading ? '#fff' : 'rgba(255, 255, 255, 0.5)')}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <BottomNav />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  greeting: {
    fontSize: 18,
    marginTop: 12,
    marginBottom: 4,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  messageWrapper: {
    maxWidth: '85%',
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2f4f2d',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    width: '85%',
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#2f4f2d',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
  },
  inputDisabled: {
    opacity: 0.7,
  },
  aiResponseContainer: {
    width: '100%',
  },
  aiResponseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  diseaseText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  ingredientsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  ingredientContainer: {
    marginBottom: 8,
  },
  ingredientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(47, 79, 45, 0.1)',
  },
  ingredientName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  usageText: {
    fontSize: 12,
    marginLeft: 24,
    marginTop: 2,
    fontStyle: 'italic',
  },
  scanIcon: {
    marginLeft: 8,
    opacity: 0.7,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  newChatText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  pinButton: {
    padding: 4,
    zIndex: 1,
  },
})
