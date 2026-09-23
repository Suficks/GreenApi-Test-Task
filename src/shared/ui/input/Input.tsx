import type { InputHTMLAttributes } from 'react'
import styles from './Input.module.css'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export function Input({ label, error, id, className, ...props }: InputProps) {
  const inputId = id ?? props.name

  return (
    <label className={styles.field} htmlFor={inputId}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <input
        id={inputId}
        className={[styles.input, error && styles.invalid, className]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {error ? <span className={styles.error}>{error}</span> : null}
    </label>
  )
}
