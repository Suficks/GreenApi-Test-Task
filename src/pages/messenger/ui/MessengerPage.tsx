import { ChatSidebar } from '@/widgets/chat-sidebar'
import { ChatWindow } from '@/widgets/chat-window'
import styles from './MessengerPage.module.css'

export function MessengerPage() {
  return (
    <main className={styles.page}>
      <ChatSidebar />
      <ChatWindow />
    </main>
  )
}
