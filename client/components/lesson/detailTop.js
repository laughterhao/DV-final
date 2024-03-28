import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import ImgSlider from './ImgSlider'
import { Row, Col } from 'react-bootstrap'
import { FaHeart } from 'react-icons/fa'
import { GiRoundStar } from 'react-icons/gi'
import Style from '@/styles/lessonStyle/star.module.css'
import derailTopStyle from '@/styles/lessonStyle/detailTop.module.scss'
import { useAuth } from '@/hooks/auth'

export default function DetailTop({ selectData }) {
  const [slider, setSlider] = useState({})
  const { auth } = useAuth()
  // 取得uesr 狀態
  const userState = auth.id
  const pid = selectData.id
  const api = `http://localhost:3005/api/lesson`
  //---get fav API
  const [fav, setFav] = useState(0)
  function changeFav() {
    setFav((prevFav) => {
      const newFav = prevFav === 0 ? 1 : 0
      // 呼叫資料庫 API
      fetch(`${api}/fav/${pid}`, {
        // 注意這裡的 API 網址可能需要根據你的後端服務來修改
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fav: newFav }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.state)
          if (data.state === 0) {
            console.log(newFav)
            // 如果資料不存在，進行新增的動作
            return fetch(`${api}/getfav/${pid}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userState: userState,
              }),
            })
          } else {
            // 如果資料存在，直接設定 state
            setFav(data)
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
      console.log(newFav)
      return newFav
    })
  }
  function getFav() {
    fetch(`${api}/getfav/${pid}?userState=${userState}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => setFav(data))
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  const router = useRouter()
  const [star, setStar] = useState({})
  const lesson = selectData

  //取得資料庫 star內容
  const getStar = async (pid) => {
    const res = await fetch(`${api}/getstar/${pid}`)

    const data = await res.json()
    const [starcomment] = data
    setStar(starcomment)
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
      query: { lessonId: pid }, // 這裡可以放你想要傳遞的查詢參數
    })
  }
  useEffect(() => {
    if (router.isReady && pid) {
      getStar(pid)
      getFav(pid)
    }
    console.log()
  }, [router.isReady, pid, fav])
  useEffect(() => {
    setSlider(pid)
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
                className={`btn ${derailTopStyle['btn-color']} fs-5 fw-bold`}
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
