export function readStorage<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function writeStorage<T>(key: string, value: T) {
  sessionStorage.setItem(key, JSON.stringify(value))
}

export function removeStorage(key: string) {
  sessionStorage.removeItem(key)
}
