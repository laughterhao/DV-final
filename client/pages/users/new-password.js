import React from 'react'
import styles from './styles.module.scss'

import { useRouter } from 'next/router'

// Alert
import { Toaster } from 'react-hot-toast'
import { notify } from '@/hooks/use-alert'
export default function Reset() {
  const router = useRouter()

  const updatePWD = async (e) => {
    e.preventDefault()
    const user = new FormData(e.target)
    const email = localStorage.getItem('email')
    user.append('email', email)
    const url = `http://localhost:3005/api/reset-password`
    await fetch(url, {
      method: 'PUT',
      body: user,
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((result) => {
        const { status, msg } = result
        if (result.status === 'success') {
          notify(msg, status)
          router.push('/users/login')
        }
      })
      .catch((err) => console.log(err.msg))
  }
  return (
    <>
      <main className={`${styles['main-style']}`}>
        <div className="d-flex justify-content-center mt-5">
          <div className={`${styles['card-style']} ${styles['card-layout']}`}>
            {/* chrome會有一個自動填入的input功能，但無法修改其樣式，之後還是選用純色做背景較合適 */}
            <form onSubmit={updatePWD}>
              <h2 className="text-center">建立新密碼</h2>
              <div className={`mb-3 ${styles['input-style']}`}>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="密碼"
                />
                <label htmlFor="password">密碼</label>
              </div>
              <div className={`mb-3 ${styles['input-style']}`}>
                <input
                  type="password"
                  name="repassword"
                  id="repassword"
                  placeholder="確認密碼"
                />
                <label htmlFor="repassword">確認密碼</label>
              </div>
              {/* END */}
              <button className={`fs-5 fw-medium ${styles.btn}`}>送出</button>
            </form>
          </div>
        </div>
      </main>
      <Toaster />
    </>
  )
}
