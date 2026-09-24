import { useState, type FormEvent } from 'react'
import { useAuth } from '@/features/auth/model/auth-store'
import { createGreenApiClient } from '@/shared/api/green-api'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import styles from './LoginForm.module.css'

const STATE_HINTS: Record<string, string> = {
  notAuthorized: 'Инстанс не авторизован. Подключите MAX в кабинете GREEN-API',
  blocked: 'Аккаунт MAX заблокирован',
  starting: 'Инстанс запускается, попробуйте через минуту',
  pendingPassword: 'Нужен пароль двухфакторной авторизации',
}

export function LoginForm() {
  const { login } = useAuth()
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextId = idInstance.trim()
    const nextToken = apiTokenInstance.trim()

    if (!nextId || !nextToken) {
      setError('Заполните оба поля')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const api = createGreenApiClient({
        idInstance: nextId,
        apiTokenInstance: nextToken,
      })
      const state = await api.getStateInstance()
      const instanceState = state?.stateInstance

      if (!instanceState) {
        setError('Не удалось проверить инстанс')
        return
      }

      if (instanceState !== 'authorized' && instanceState !== 'suspended') {
        setError(STATE_HINTS[instanceState] ?? `Статус инстанса: ${instanceState}`)
        return
      }

      login({ idInstance: nextId, apiTokenInstance: nextToken })
    } catch {
      setError('Неверные данные инстанса или ошибка GREEN-API')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        name="idInstance"
        label="idInstance"
        placeholder="Например, 1101234567"
        value={idInstance}
        onChange={(event) => {
          setIdInstance(event.target.value)
          setError('')
        }}
        autoComplete="off"
      />
      <Input
        name="apiTokenInstance"
        label="apiTokenInstance"
        placeholder="Токен инстанса"
        value={apiTokenInstance}
        onChange={(event) => {
          setApiTokenInstance(event.target.value)
          setError('')
        }}
        autoComplete="off"
      />
      {error ? <p className={styles.error}>{error}</p> : null}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Проверка...' : 'Войти'}
      </Button>
    </form>
  )
}
