import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { useChatStore } from '@/entities/chat'
import { Button } from '@/shared/ui/button'
import styles from './MessageComposer.module.css'

export function MessageComposer() {
  const { sendMessage, isSending, sendError } = useChatStore()
  const [text, setText] = useState('')

  const submit = async () => {
    const next = text.trim()

    if (!next || isSending) {
      return
    }

    try {
      await sendMessage(next)
      setText('')
    } catch {
      return
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void submit()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void submit()
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <textarea
          className={styles.input}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Сообщение"
          rows={1}
          disabled={isSending}
        />
        {sendError ? <p className={styles.error}>{sendError}</p> : null}
      </div>
      <Button type="submit" disabled={!text.trim() || isSending}>
        {isSending ? '...' : 'Отправить'}
      </Button>
    </form>
  )
}
