/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Chat } from '@/entities/chat/model/types'
import type { Message } from '@/entities/message'
import { createId } from '@/shared/lib/id'
import { normalizePhone } from '@/shared/lib/phone'

type ChatContextValue = {
  chats: Chat[]
  activeChat: Chat | null
  messages: Message[]
  createChat: (phone: string) => void
  selectChat: (chatId: string) => void
  sendMessage: (text: string) => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([])
  const [messagesByChatId, setMessagesByChatId] = useState<Record<string, Message[]>>({})
  const [activeChatId, setActiveChatId] = useState<string | null>(null)

  const value = useMemo<ChatContextValue>(() => {
    const activeChat = chats.find((chat) => chat.id === activeChatId) ?? null

    return {
      chats,
      activeChat,
      messages: activeChatId ? (messagesByChatId[activeChatId] ?? []) : [],
      createChat(phone) {
        const chatId = normalizePhone(phone)
        const existing = chats.find((chat) => chat.id === chatId)

        if (existing) {
          setActiveChatId(existing.id)
          return
        }

        const nextChat: Chat = { id: chatId, phone: chatId }
        setChats((prev) => [nextChat, ...prev])
        setActiveChatId(chatId)
      },
      selectChat(chatId) {
        setActiveChatId(chatId)
      },
      sendMessage(text) {
        if (!activeChatId) {
          return
        }

        const message: Message = {
          id: createId(),
          chatId: activeChatId,
          text,
          direction: 'outgoing',
          timestamp: Date.now(),
        }

        setMessagesByChatId((prev) => ({
          ...prev,
          [activeChatId]: [...(prev[activeChatId] ?? []), message],
        }))
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === activeChatId
              ? { ...chat, lastMessage: text, lastMessageAt: message.timestamp }
              : chat,
          ),
        )
      },
    }
  }, [activeChatId, chats, messagesByChatId])

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChatStore() {
  const context = useContext(ChatContext)

  if (!context) {
    throw new Error('useChatStore must be used within ChatProvider')
  }

  return context
}
