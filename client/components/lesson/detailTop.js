import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import ImgSlider from './ImgSlider'
import { Row, Col } from 'react-bootstrap'
import { FaHeart } from 'react-icons/fa'
import { GiRoundStar } from 'react-icons/gi'
import Style from '@/styles/lessonStyle/star.module.css'
import derailTopStyle from '@/styles/lessonStyle/detailTop.module.scss'
import { useAuth } from '@/hooks/auth'

export default function DetailTop({ selectData }) {
  const [slider, setSlider] = useState({})
  const [star, setStar] = useState({})
  const [fav, setFav] = useState(0)

  const lesson = selectData
  const router = useRouter()
  const { auth } = useAuth()
  // 取得uesr 狀態
  const userState = auth.id
  const pid = selectData.id
  const api = `http://localhost:3005/api/lesson`
  //---get fav API
  const changeFav = async () => {
    if (!auth.id) {
      return router.push('/users/login')
    }
    try {
      const checkResponse = await fetch(
        `${api}/fav/${pid}?userState=${userState}`
      )
      const [exists] = await checkResponse.json()
      if (exists) {
        let newFav = exists.state === 0 ? 1 : 0
        const response = await fetch(`${api}/upFav/${pid}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userState: userState,
            fav: newFav,
          }),
        })
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        setFav(newFav)
      } else {
        const response = await fetch(`${api}/postfav/${pid}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userState: userState,
          }),
        })
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        setFav(1)
      }
      getFav(pid)
    } catch (error) {
      console.error('Error:', error)
    }
  }
  const getFav = async (pid) => {
    await fetch(`${api}/fav/${pid}?userState=${userState}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(([data]) => {
        setFav(data.state)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }
  //取得資料庫 star內容
  const getStar = async (pid) => {
    const res = await fetch(`${api}/getstar/${pid}`)

    const data = await res.json()
    const [starcomment] = data
    setStar(starcomment)
    // await fetch(`${api}/getstar/${pid}`)
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok')
    //     }
    //     return response.json()
    //   })
    //   .then((data) => {
    //     console.log(data);
    //     setStar(data)})
    //   .catch((error) => {
    //     console.error('Error:', error)
    //   })
  }
  // 取課程 星星平均值
  const Starlist = () => {
    if (star) {
      return Array(5)
        .fill(star.score)
        .map((v, i) => {
          return (
            <button className={Style['star-btn']} key={i}>
              <GiRoundStar className={i < v ? Style['on'] : Style['off']} />
            </button>
          )
        })
    } else {
      return [
        Array(5)
          .fill(0)
          .map((v, i) => {
            return (
              <button className={Style['star-btn']} key={i}>
                <GiRoundStar className={i < v ? Style['on'] : Style['off']} />
              </button>
            )
          }),
      ]
    }
  }
  const buttonStyle =
    lesson.tag === '專業科目'
      ? { backgroundColor: 'red' }
      : { backgroundColor: 'green' }
  //轉跳到預約日期
  const goToPreOrder = () => {
    router.push({
      pathname: '/lesson/preOrder',
      query: { lessonId: pid },
    })
  }

  useEffect(() => {
    if (router.isReady && pid) {
      getStar(pid)
    }
  }, [router.isReady, auth, pid])
  useEffect(() => {
    setSlider(pid)
    getFav(pid)
  }, [pid])

  return (
    <>
      <Row>
        <Col lg={7}>
          <figure className="">
            <ImgSlider getSliderID={slider}></ImgSlider>
          </figure>
        </Col>
        <Col lg={5}>
          <Row>
            <Col lg={12} className="">
              <div className={`fs-4 fw-bold ${derailTopStyle['detailbox']}`}>
                課程說明
              </div>
              <p className={`fs-5 lh-lg`}>{lesson.info}</p>
            </Col>
            <div className="d-flex justify-content-between mt-3">
              <div
                className={`text-center btn border rounded-pill me-1 text-white ${
                  buttonStyle == '專業科目' ? 'bg-danger' : 'bg-success'
                } `}
                style={{ buttonStyle }}
              >
                {lesson.tag}
              </div>
              <div className="fs-5 text-end text-danger ">
                NT$ {lesson.price}
              </div>
            </div>
            <Col lg={12}>
              <div className="d-flex justify-content-between mt-3">
                <div className="fs-4 d-flex align-items-center">
                  {/* ---引入資料庫內的 star--- */}
                  {Starlist()}
                  {/* ---引入資料庫內的 star--- */}
                  <span className="fs-6 ps-3">評論</span>
                </div>
                <div className="align-self-center">
                  <button className={Style['star-btn']} onClick={changeFav}>
                    <FaHeart
                      className={`fs-4 $ ${
                        fav === 1 ? Style['good-style'] : Style['off']
                      }`}
                    />
                  </button>
                </div>
              </div>
            </Col>
            <div
              className={`d-grid gap-2 col-12 mx-auto mt-4 ${derailTopStyle['phone-mt']}`}
            >
              <button
                className={`btn ${derailTopStyle['btn-color']} fs-5 `}
                type="button"
                onClick={goToPreOrder}
              >
                立即預約
              </button>
            </div>
          </Row>
        </Col>
      </Row>
    </>
  )
}
