import { useEffect } from 'react'
import { useRouter } from 'next/router'
import HomeHeader from '@/components/home/header'
import Footer from '@/components/layout/default-layout/footer'
import News from '@/components/home/news'
import Server from '@/components/home/server'
import Products from '@/components/home/products'
import LessonSection from '@/components/home/lesson'
import MapSection from '@/components/home/map'

export default function Index() {
  const router = useRouter()
  const currentPage = router.pathname
  // 改變頁面body的顏色
  useEffect(() => {
    if (currentPage === '/') document.body.style.backgroundColor = '#013c64'
    // 如果跳轉到其他頁面背景不會改變
    return () => {
      document.body.style.backgroundColor = ''
    }
  }, [currentPage])

  return (
    <>
      <HomeHeader />
      <News />
      <Server />
      <LessonSection />
      <Products />
      <MapSection />
    </>
  )
}
