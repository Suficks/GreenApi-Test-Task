import { useEffect, useRef } from 'react'
import { useChatStore } from '@/entities/chat'
import { MessageComposer } from '@/features/send-message'
import { formatPhone } from '@/shared/lib/phone'
import { formatTime } from '@/shared/lib/time'
import wallpaper from '@/shared/styles/wallpaper.module.css'
import { Avatar } from '@/shared/ui/avatar'
import { Logo } from '@/shared/ui/logo'
import styles from './ChatWindow.module.css'

export function ChatWindow() {
  const { activeChat, messages } = useChatStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [messages])

  if (!activeChat) {
    return (
      <section className={styles.empty}>
        <Logo size={64} />
        <p>Выберите чат или создайте новый</p>
      </section>
    )
  }

  return (
    <section className={styles.window}>
      <header className={styles.header}>
        <Avatar name={activeChat.phone} />
        <div>
          <p className={styles.name}>{formatPhone(activeChat.phone)}</p>
          <p className={styles.status}>MAX</p>
        </div>
      </header>

      <div className={`${styles.messages} ${wallpaper.root}`}>
        {messages.length === 0 ? (
          <p className={styles.hint}>Напишите тестовое сообщение</p>
        ) : (
          messages.map((message) => (
            <article
              key={message.id}
              className={[
                styles.bubble,
                message.direction === 'outgoing' ? styles.outgoing : styles.incoming,
              ].join(' ')}
            >
              <p className={styles.text}>{message.text}</p>
              <time className={styles.time}>{formatTime(message.timestamp)}</time>
            </article>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <MessageComposer />
    </section>
  )
}
