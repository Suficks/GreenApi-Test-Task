import styles from './Avatar.module.css'

const COLORS = ['#5b7cfa', '#7b61ff', '#3aa0ff', '#6d8bff', '#8a6cff']

type AvatarProps = {
  name: string
}

export function Avatar({ name }: AvatarProps) {
  const initials = name.slice(-2)
  const color = COLORS[name.length % COLORS.length]

  return (
    <span className={styles.avatar} style={{ backgroundColor: color }}>
      {initials}
    </span>
  )
}
