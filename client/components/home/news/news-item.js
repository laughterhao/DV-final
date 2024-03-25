import { useRef, useEffect } from 'react'
import styles from './news-item.module.scss'
import Link from 'next/link'

export default function NewsItem({
  content = {},
  isFocused = 0,
  onFocus = () => {},
}) {
  const itemRef = useRef(null) //為了設定item被focus

  // 設定時間的格式
  const option = { month: 'short' }
  const month = new Date(content.created_at).toLocaleString('en-US', option)
  // 在個位數date前面補0
  const date = new Date(content.created_at)
    .getDate()
    .toString()
    .padStart(2, '0')

  useEffect(() => {
    if (isFocused && itemRef.current) {
      itemRef.current.focus()
    }
  })

  return (
    <>
      <Link
        className={` ${
          styles.newsItem
        } d-flex align-items-center  flex-shrink-0 ${
          isFocused ? styles.linkFocus : ''
        }`}
        href={`/event/${content.id}`}
        ref={itemRef}
        tabIndex={isFocused ? 0 : -1}
        onFocus={onFocus}
      >
        <div className={`${styles.day} text-center text-light`}>
          <p className={`${styles.date} fw-bold `}>{date}</p>
          <p className={`${styles.monte} m-0`}>{month}</p>
        </div>
        <div className={` ${styles.newsContent}`}>
          <div className={`mb-2 ${styles.tag}`}>{content.sort}</div>
          <h6 className={`mb-0 ${styles.title}`}>{content.title}</h6>
        </div>
      </Link>
    </>
  )
}
