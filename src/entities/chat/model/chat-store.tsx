/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Chat } from '@/entities/chat/model/types'
import type { InstanceCredentials } from '@/entities/instance'
import type { Message } from '@/entities/message'
import { createGreenApiClient } from '@/shared/api/green-api'
import { extractText, resolveSenderPhone } from '@/shared/api/green-api/notification'
import type { GreenApiNotification } from '@/shared/api/green-api/types'
import { createId } from '@/shared/lib/id'
import { normalizePhone, toApiChatId } from '@/shared/lib/phone'

type ChatContextValue = {
  chats: Chat[]
  activeChat: Chat | null
  messages: Message[]
  isSending: boolean
  sendError: string
  createChat: (phone: string) => void
  selectChat: (chatId: string) => void
  sendMessage: (text: string) => Promise<void>
}

const ChatContext = createContext<ChatContextValue | null>(null)

function upsertChat(chats: Chat[], chat: Chat) {
  const exists = chats.some((item) => item.id === chat.id)

  if (!exists) {
    return [chat, ...chats]
  }

  return chats.map((item) => (item.id === chat.id ? { ...item, ...chat } : item))
}

export function ChatProvider({
  credentials,
  children,
}: {
  credentials: InstanceCredentials
  children: ReactNode
}) {
  const api = useMemo(() => createGreenApiClient(credentials), [credentials])
  const [chats, setChats] = useState<Chat[]>([])
  const [messagesByChatId, setMessagesByChatId] = useState<Record<string, Message[]>>({})
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState('')

  const applyIncoming = useCallback((notification: GreenApiNotification) => {
    if (notification.body.typeWebhook !== 'incomingMessageReceived') {
      return
    }

    const text = extractText(notification.body)
    const chatId = resolveSenderPhone(notification.body.senderData)

    if (!text || !chatId) {
      return
    }

    const timestamp = notification.body.timestamp
      ? notification.body.timestamp * 1000
      : Date.now()
    const message: Message = {
      id: notification.body.idMessage ?? createId(),
      chatId,
      text,
      direction: 'incoming',
      timestamp,
    }

    setMessagesByChatId((prev) => {
      const list = prev[chatId] ?? []

      if (list.some((item) => item.id === message.id)) {
        return prev
      }

      return { ...prev, [chatId]: [...list, message] }
    })
    setChats((prev) =>
      upsertChat(prev, {
        id: chatId,
        phone: chatId,
        lastMessage: text,
        lastMessageAt: timestamp,
      }),
    )
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let stopped = false

    const poll = async () => {
      await api.enableHttpReceive(controller.signal).catch(() => undefined)

      while (!stopped) {
        try {
          const notification = await api.receiveNotification(25, controller.signal)

          if (stopped) {
            return
          }

          if (!notification) {
            continue
          }

          applyIncoming(notification)
          await api.deleteNotification(notification.receiptId, controller.signal)
        } catch (error) {
          if (controller.signal.aborted || stopped) {
            return
          }

          console.error(error)
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
      }
    }

    void poll()

    return () => {
      stopped = true
      controller.abort()
    }
  }, [api, applyIncoming])

  const value = useMemo<ChatContextValue>(() => {
    const activeChat = chats.find((chat) => chat.id === activeChatId) ?? null

    return {
      chats,
      activeChat,
      messages: activeChatId ? (messagesByChatId[activeChatId] ?? []) : [],
      isSending,
      sendError,
      createChat(phone) {
        const chatId = normalizePhone(phone)
        const existing = chats.find((chat) => chat.id === chatId)

        if (existing) {
          setActiveChatId(existing.id)
          return
        }

        setChats((prev) => [{ id: chatId, phone: chatId }, ...prev])
        setActiveChatId(chatId)
      },
      selectChat(chatId) {
        setActiveChatId(chatId)
      },
      async sendMessage(text) {
        if (!activeChatId) {
          return
        }

        setIsSending(true)
        setSendError('')

        try {
          const result = await api.sendMessage(toApiChatId(activeChatId), text)
          const message: Message = {
            id: result?.idMessage ?? createId(),
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
        } catch (error) {
          setSendError(error instanceof Error ? error.message : 'Не удалось отправить')
          throw error
        } finally {
          setIsSending(false)
        }
      },
    }
  }, [activeChatId, api, chats, isSending, messagesByChatId, sendError])

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChatStore() {
  const context = useContext(ChatContext)

  if (!context) {
    throw new Error('useChatStore must be used within ChatProvider')
  }

  return context
}
