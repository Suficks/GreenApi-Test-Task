import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { useChatStore } from '@/entities/chat'
import { Button } from '@/shared/ui/button'
import styles from './MessageComposer.module.css'

export function MessageComposer() {
  const { sendMessage } = useChatStore()
  const [text, setText] = useState('')

  const submit = () => {
    const next = text.trim()

    if (!next) {
      return
    }

    sendMessage(next)
    setText('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submit()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea
        className={styles.input}
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Сообщение"
        rows={1}
      />
      <Button type="submit" disabled={!text.trim()}>
        Отправить
      </Button>
    </form>
  )
}
