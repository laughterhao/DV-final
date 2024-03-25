import React, { useState } from 'react'
import styles from './styles.module.scss'
import { useRouter } from 'next/router'

export default function Forget() {
  const [errorMsg, setMsg] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [email, setEmail] = useState('')
  const router = useRouter()
  const handleSubmit = (e) => {
    e.preventDefault()
    setMsg('')
    const formData = new FormData(e.target)
    const url = 'http://localhost:3005/api/otp/send'
    fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 'success') {
          localStorage.setItem('email', email)
          localStorage.setItem('otp', result.data)
        } else {
          setMsg('查無此使用者，請確認過後再輸入一次')
        }
      })
      .catch((err) => console.log(err))
  }

  const handleOTP = (e) => {
    setOtpCode(e.target.value)
  }

  const handleSubmitOTP = (e) => {
    e.preventDefault()
    const otp = localStorage.getItem('otp')
    if (otpCode === otp) {
      router.push('/users/new-password')
    } else {
      setMsg('驗證碼錯誤，請在試一次')
    }
  }
  return (
    <>
      <main className={`${styles['main-style']}`}>
        <div className="d-flex justify-content-center mt-5">
          <div className={`${styles['card-style']} ${styles['card-layout']}`}>
            <form onSubmit={handleSubmit}>
              <h2 className="text-center">忘記密碼</h2>
              <p className="small text-center">
                忘記了您的密碼？別擔心！請提供您的電子郵件地址，我們將向您發送一封密碼重置的電子郵件。
              </p>
              <div className={`${styles['input-style']} ${styles.limit}`}>
                <input
                  type="text"
                  name="userEmail"
                  id="userEmail"
                  placeholder="電子郵件"
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }}
                />
                <label htmlFor="userEmail">電子郵件</label>
              </div>
              <button
                className={`small fw-medium ${styles.btn} ms-auto`}
                style={{ width: '100px' }}
              >
                取得驗證碼
              </button>
            </form>
            <form onSubmit={handleSubmitOTP}>
              <div className={`${styles['input-style']} ${styles.limit} mt-3`}>
                <input
                  type="text"
                  name="codeOTP"
                  id="codeOTP"
                  placeholder="驗證碼"
                  onChange={handleOTP}
                />
                <label htmlFor="userEmail">驗證碼</label>
              </div>
              {/* 警示標語 */}
              <div
                className={`fw-medium small text-center text-danger mb-0 ${styles.notify}`}
              >
                {errorMsg}
              </div>
              <button className={`fs-5 fw-medium ${styles.btn}`}>送出</button>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}
