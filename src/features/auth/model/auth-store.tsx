/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { InstanceCredentials } from '@/entities/instance'
import { readStorage, removeStorage, writeStorage } from '@/shared/lib/storage'

const STORAGE_KEY = 'greenapi.instance'

type AuthContextValue = {
  credentials: InstanceCredentials | null
  login: (credentials: InstanceCredentials) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentials] = useState<InstanceCredentials | null>(() =>
    readStorage<InstanceCredentials>(STORAGE_KEY),
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      credentials,
      login(next) {
        writeStorage(STORAGE_KEY, next)
        setCredentials(next)
      },
      logout() {
        removeStorage(STORAGE_KEY)
        setCredentials(null)
      },
    }),
    [credentials],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
