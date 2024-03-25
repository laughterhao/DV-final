import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from './styles.module.scss'
import Loading from '@/components/layout/loading/loading'
import { useAuth } from '@/hooks/auth'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const { auth } = useAuth()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [router.isReady, router.pathname, auth])
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <main className="my-3 my-sm-5">
            <div className="container-xl">
              <div
                className={`row justify-content-center m-auto position-relative ${styles['user-container']}`}
              >
                {/* 這裡放管理中心component */}
                {children}
              </div>
            </div>
          </main>
        </>
      )}
    </>
  )
}
