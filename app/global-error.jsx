'use client'
 import styles from '@/app/styles/error.module.css'
export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body className={styles.mainBody}>
        <h2>Something went wrong!</h2>
        <button className={styles.button} onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}