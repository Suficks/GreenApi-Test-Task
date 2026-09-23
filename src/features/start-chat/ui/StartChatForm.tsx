import { useState, type FormEvent } from 'react'
import { useChatStore } from '@/entities/chat'
import { isValidPhone } from '@/shared/lib/phone'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import styles from './StartChatForm.module.css'

export function StartChatForm() {
  const { createChat } = useChatStore()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isValidPhone(phone)) {
      setError('Введите номер телефона')
      return
    }

    createChat(phone)
    setPhone('')
    setError('')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        name="phone"
        placeholder="Номер телефона"
        value={phone}
        onChange={(event) => {
          setPhone(event.target.value)
          setError('')
        }}
        error={error}
        inputMode="tel"
        autoComplete="off"
      />
      <Button type="submit">Создать чат</Button>
    </form>
  )
}
