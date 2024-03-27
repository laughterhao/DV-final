// [tag].js
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PostCard from '@/components/post/postCard'
import Loading from '@/components/layout/loading/loading'
import BackButton from '@/components/post/backButton'
import Link from 'next/link'
import { Container } from 'react-bootstrap'

export default function TagPost() {
  const router = useRouter()
  const [tag, setTag] = useState('')
  const [postList, setPostList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getPost = async (tagValue) => {
    try {
      const res = await fetch(`http://localhost:3005/api/post/tags/${tagValue}`)
      const data = await res.json()
      setPostList(data)
      if (Array.isArray(data)) {
        // 設定到狀態

        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      }
    } catch (e) {
      console.error('Error fetching data from the server:', e)
    }
  }

  useEffect(() => {
    // 出現值我們再跟伺服器要資料
    console.log(router.query)
    if (router.isReady) {
      // 如果isReady是true 確保能得到 query的值
      const { tags } = router.query
      console.log(tags)

      getPost(tags)
      setTag(tags)
    }
  }, [router.isReady])

  const loader = <Loading />

  const display = (
    <div>
      <Container className="mt-4">
        <div className="mb-4">
          <Link href="/post">
            <BackButton />
          </Link>
        </div>
        <div className="mb-4">
          <h3>標籤 包含: {tag} 的文章</h3>
        </div>

        {Array.isArray(postList) && postList.length > 0 ? (
          <PostCard postList={postList} />
        ) : (
          <div className="not-found">
            <h1>= 沒有該標籤</h1>
          </div>
        )}
      </Container>
      <style jsx>{`
        .not-found {
          display: flex;
          justify-content: center;
          height: 60vh;
        }
      `}</style>
    </div>
  )

  return <>{isLoading ? loader : display}</>
}
