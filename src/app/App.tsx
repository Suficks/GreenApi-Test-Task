import { ChatProvider } from '@/entities/chat'
import { useAuth } from '@/features/auth'
import { LoginPage } from '@/pages/login'
import { MessengerPage } from '@/pages/messenger'

export function App() {
  const { credentials } = useAuth()

  if (!credentials) {
    return <LoginPage />
  }

  return (
    <ChatProvider credentials={credentials}>
      <MessengerPage />
    </ChatProvider>
  )
}
