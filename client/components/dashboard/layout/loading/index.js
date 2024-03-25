import React from 'react'
import styles from './styles.module.scss'

export default function Loading() {
  return (
    <div className={styles['lds-ellipsis']}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}
