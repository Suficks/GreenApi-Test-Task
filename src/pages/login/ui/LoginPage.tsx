import { LoginForm } from '@/features/auth'
import wallpaper from '@/shared/styles/wallpaper.module.css'
import { Logo } from '@/shared/ui/logo'
import styles from './LoginPage.module.css'

export function LoginPage() {
  return (
    <main className={`${styles.page} ${wallpaper.root}`}>
      <section className={styles.card}>
        <div className={styles.logo}>
          <Logo />
        </div>
        <h1 className={styles.title}>MAX</h1>
        <p className={styles.subtitle}>Введите данные инстанса GREEN-API</p>
        <LoginForm />
      </section>
    </main>
  )
}
