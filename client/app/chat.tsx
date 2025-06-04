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
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import Header from './components/Home/Header'
import BottomNav from './components/Home/BottomNav'
import { useUser } from '@clerk/clerk-expo'
import { useChat } from './context/ChatContext'

interface Ingredient {
  name: string
  usage: string
}

interface Message {
  text: string
  isUser: boolean
  aiResponse?: {
    disease: string
    ingredients: Ingredient[]
  }
}

interface ChatResponse {
  disease: string
  ingredients: Ingredient[]
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

  if (!isLoaded) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size='large' color='#2f4f2d' />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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
              <Ionicons name='leaf' size={60} color='#2f4f2d' />
              <Text style={styles.greeting}>
                Hello, {user?.firstName || 'Guest'}
              </Text>
              <Text style={styles.welcomeTitle}>Welcome to LeafMed AI!</Text>
              <Text style={styles.welcomeText}>
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
                <Ionicons name='add-circle-outline' size={20} color='#2f4f2d' />
                <Text style={styles.newChatText}>New Chat</Text>
              </TouchableOpacity>
              {messages.map((message, index) => (
                <View
                  key={index}
                  style={[
                    styles.messageWrapper,
                    message.isUser ? styles.userMessage : styles.aiMessage,
                  ]}
                >
                  {message.isUser ? (
                    <Text style={[styles.messageText, styles.userText]}>
                      {message.text}
                    </Text>
                  ) : message.aiResponse ? (
                    <View style={styles.aiResponseContainer}>
                      <Text style={styles.diseaseText}>
                        {message.aiResponse.disease}
                      </Text>
                      <Text style={styles.ingredientsLabel}>
                        Recommended herbs:
                      </Text>
                      {message.aiResponse.ingredients.map((ingredient, idx) => (
                        <View key={idx} style={styles.ingredientContainer}>
                          <TouchableOpacity
                            style={styles.ingredientButton}
                            onPress={() =>
                              router.push({
                                pathname: '/scan',
                                params: { target: ingredient.name },
                              })
                            }
                          >
                            <Text style={styles.ingredientName}>
                              • {ingredient.name}
                            </Text>
                            <Ionicons
                              name='scan-outline'
                              size={16}
                              color='#2f4f2d'
                              style={styles.scanIcon}
                            />
                          </TouchableOpacity>
                          <Text style={styles.usageText}>
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
              <ActivityIndicator color='#2f4f2d' size='small' />
              <Text style={styles.loadingText}>Analyzing symptoms...</Text>
            </View>
          )}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, isLoading && styles.inputDisabled]}
            value={input}
            onChangeText={setInput}
            placeholder={
              isLoading ? 'Please wait...' : 'Describe your symptoms...'
            }
            placeholderTextColor='#666'
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!input.trim() || isLoading) && styles.disabledButton,
            ]}
            onPress={sendMessage}
            disabled={!input.trim() || isLoading}
          >
            <Ionicons
              name='send'
              size={24}
              color={
                input.trim() && !isLoading ? '#fff' : 'rgba(255, 255, 255, 0.5)'
              }
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
    backgroundColor: '#DCECDC',
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCECDC',
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
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  greeting: {
    fontSize: 18,
    color: '#2f4f2d',
    marginTop: 12,
    marginBottom: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    color: '#2f4f2d',
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#2f4f2d',
    textAlign: 'center',
    opacity: 0.8,
  },
  messageWrapper: {
    maxWidth: '80%',
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
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  loadingText: {
    marginLeft: 8,
    color: '#2f4f2d',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#DCECDC',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#2f4f2d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(47, 79, 45, 0.5)',
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    opacity: 0.7,
  },
  aiResponseContainer: {
    width: '100%',
  },
  diseaseText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2f4f2d',
    marginBottom: 8,
  },
  ingredientsLabel: {
    fontSize: 14,
    color: '#2f4f2d',
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
    color: '#2f4f2d',
    fontWeight: '600',
    flex: 1,
  },
  usageText: {
    fontSize: 12,
    color: '#2f4f2d',
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
    backgroundColor: 'rgba(47, 79, 45, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  newChatText: {
    color: '#2f4f2d',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
})
