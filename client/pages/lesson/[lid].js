import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/auth'
import ButtonChange from '@/components/lesson/buttonChange'
import GetDetail from '@/components/lesson/getDetail'
import GetComment from '@/components/lesson/getComment'
import UserComment from '@/components/lesson/UserComment'
import DetailTop from '@/components/lesson/detailTop'
import Style from '@/styles/lessonStyle/lesson.module.scss'
// 取得lesson data
export default function Detail() {
  // ---確認是否登入 state---
  const { auth } = useAuth()
  const getUserState = (auth) => {
    if (auth.isAuth) {
      return <UserComment />
    }
    return null // 或者返回一個適當的預設值
  }
  const router = useRouter()
  // ---取得lessonid state---
  const [lessonid, setLessonId] = useState({
    id: '',
    tag: '',
    info: '',
    title: '',
    features: '',
    price: 0,
    content: '',
    processDetail: '',
    time: '',
    LV: '',
    location: '',
    locationDetail: '',
  })
  // ---使用switch---
  const [isChecked, setIsChecked] = useState(true)
  const toggleSwitch = () => {
    setIsChecked(!isChecked)
  }
  // ---連接lesson id API---
  const getlessonListId = async (lid) => {
    const res = await fetch(`http://localhost:3005/api/lesson/getlist/${lid}`)
    const data = await res.json()
    const [lessonObj] = data
    setLessonId(lessonObj)
  }
  //---get fav API
  const [fav, setFav] = useState(false)
  const clickFav = () => {
    setFav(!fav)
  }
  // ---state 同步---
  useEffect(() => {
    if (router.isReady) {
      const { lid } = router.query
      getlessonListId(lid)
    }
  }, [router.isReady, isChecked])
  return (
    <>
      <Container className={`${Style.bg_color} pt-2`}>
        <DetailTop selectData={lessonid} getFav={fav}></DetailTop>
        <hr />
        <Row className="justify-content-end">
          <Col lg={1}>
            <ButtonChange
              switchvalue={{ isChecked, toggleSwitch }}
            ></ButtonChange>
          </Col>
        </Row>
        {!isChecked ? (
          <GetComment selectData={lessonid} />
        ) : (
          <GetDetail selectData={lessonid} />
        )}

        {/* ----comment----- */}
      </Container>
    </>
  )
}
