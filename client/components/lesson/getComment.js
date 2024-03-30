import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Row, Col } from 'react-bootstrap'
import { GiRoundStar } from 'react-icons/gi'
import Image from 'react-bootstrap/Image'
import Style from '@/styles/lessonStyle/star.module.css'

export default function GetComment({ selectData }) {
  const router = useRouter()
  const [star, setStar] = useState(null)
  const pid = selectData.id
  const api = `http://localhost:3005/api/lesson`
  console.log(selectData)
  //取得資料庫 star內容
  const getStar = async (pid) => {
    await fetch(`${api}/getstar/${pid}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        setStar(data)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }
  useEffect(() => {
    // if (router.isReady && pid) {
    getStar(pid)
    // }
  }, [pid])
  console.log(star)
  return (
    <>
      <Row>
        <Col lg={2}>
          {/* <select
            className="form-select form-select-sm"
            value={'ss'}
            onChange={() => {}}
          >
            <option value="評價高到低">評價高到低</option>
            <option value="ss">Open this select menu</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select> */}
        </Col>
      </Row>
      <div className="py-3">
        {star &&
          star.length > 0 &&
          star.map((v, i) => {
            return (
              <Row key={v.id} className="mt-2 p-2 align-items-center gx-0">
                <Col lg={1}>
                  <figure className="mb-0 ">
                    <Image
                      className="img-fluid rounded-circle"
                      style={{ height: '100px', width: '100px' }}
                      src={`/images/users/unknow.jpg`}
                      alt=""
                    />
                  </figure>
                </Col>
                <Col lg={8} className="ps-3">
                  <div>{v.name}</div>
                  {Array(5)
                    .fill(v.score)
                    .map((v, i) => {
                      return (
                        <button className={Style['star-btn']} key={i}>
                          <GiRoundStar
                            className={i < v ? Style['on'] : Style['off']}
                          />
                        </button>
                      )
                    })}
                  <div>{v.comment}</div>{' '}
                </Col>
                <hr className="mt-3" />
              </Row>
            )
          })}
      </div>
    </>
  )
}
