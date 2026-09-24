import { useChatStore } from '@/entities/chat'
import { useAuth } from '@/features/auth'
import { StartChatForm } from '@/features/start-chat'
import { formatPhone } from '@/shared/lib/phone'
import { formatListDate } from '@/shared/lib/time'
import { Avatar } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Logo } from '@/shared/ui/logo'
import styles from './ChatSidebar.module.css'

export function ChatSidebar() {
  const { credentials, logout } = useAuth()
  const { chats, activeChat, selectChat } = useChatStore()

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Logo size={28} />
          <div>
            <p className={styles.title}>MAX</p>
            <p className={styles.instance}>{credentials?.idInstance}</p>
          </div>
        </div>
        <Button variant="ghost" onClick={logout}>
          Выйти
        </Button>
      </header>

      <div className={styles.create}>
        <StartChatForm />
      </div>

      <ul className={styles.list}>
        {chats.length === 0 ? (
          <li className={styles.empty}>Создайте чат по номеру телефона</li>
        ) : (
          chats.map((chat) => (
            <li key={chat.id}>
              <button
                type="button"
                className={[
                  styles.item,
                  activeChat?.id === chat.id ? styles.active : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => selectChat(chat.id)}
              >
                <Avatar name={chat.phone} />
                <span className={styles.meta}>
                  <span className={styles.row}>
                    <span className={styles.phone}>{formatPhone(chat.phone)}</span>
                    {chat.lastMessageAt ? (
                      <time className={styles.time}>{formatListDate(chat.lastMessageAt)}</time>
                    ) : null}
                  </span>
                  <span className={styles.preview}>{chat.lastMessage ?? 'Нет сообщений'}</span>
                </span>
              </button>
            </li>
          ))
        )}
      </ul>
    </aside>
  )
}
