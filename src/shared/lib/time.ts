const MS_IN_DAY = 86_400_000

function startOfDay(timestamp: number) {
  const date = new Date(timestamp)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

export function isSameDay(left: number, right: number) {
  return startOfDay(left) === startOfDay(right)
}

export function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp)
}

export function formatListDate(timestamp: number, now = Date.now()) {
  const day = startOfDay(timestamp)
  const today = startOfDay(now)

  if (day === today) {
    return formatTime(timestamp)
  }

  if (day === today - MS_IN_DAY) {
    return 'Вчера'
  }

  const sameYear = new Date(timestamp).getFullYear() === new Date(now).getFullYear()

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : { year: 'numeric' }),
  }).format(timestamp)
}

export function formatDayLabel(timestamp: number, now = Date.now()) {
  const day = startOfDay(timestamp)
  const today = startOfDay(now)

  if (day === today) {
    return 'Сегодня'
  }

  if (day === today - MS_IN_DAY) {
    return 'Вчера'
  }

  const sameYear = new Date(timestamp).getFullYear() === new Date(now).getFullYear()

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    ...(sameYear ? {} : { year: 'numeric' }),
  }).format(timestamp)
}
