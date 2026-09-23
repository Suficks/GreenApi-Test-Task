import styles from './Logo.module.css'

type LogoProps = {
  size?: number
}

export function Logo({ size = 56 }: LogoProps) {
  return (
    <img
      className={styles.logo}
      src="/favicon.svg"
      width={size}
      height={size}
      alt="MAX"
    />
  )
}
