import React, { createContext, useContext, useState, ReactNode } from 'react'

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

interface ChatContextType {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  clearChat: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])

  const clearChat = () => {
    setMessages([])
  }

  return (
    <ChatContext.Provider value={{ messages, setMessages, clearChat }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
