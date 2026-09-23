import { useState, type FormEvent } from 'react'
import { useAuth } from '@/features/auth/model/auth-store'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import styles from './LoginForm.module.css'

export function LoginForm() {
  const { login } = useAuth()
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextId = idInstance.trim()
    const nextToken = apiTokenInstance.trim()

    if (!nextId || !nextToken) {
      setError('Заполните оба поля')
      return
    }

    login({ idInstance: nextId, apiTokenInstance: nextToken })
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
      <Button type="submit">Войти</Button>
    </form>
  )
}
