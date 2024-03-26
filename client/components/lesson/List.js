import React, { useContext, Fragment, useState, useEffect } from 'react'
import { DiffCheck } from '@/context/value'
import Image from 'react-bootstrap/Image'
import Link from 'next/link'
import { Row } from 'react-bootstrap'
import { Col } from 'react-bootstrap'
import { FaLocationDot } from 'react-icons/fa6'
import Style from '@/styles/lessonStyle/lesson.module.scss'

export default function List() {
  const api = 'http://localhost:3005/api/lesson'
  // 引入index state textcontent
  const { checkvalue } = useContext(DiffCheck)
  //checkbox 收尋設定
  const ArrLV = checkvalue.filter((item) => item !== false)
  //list 狀態
  const [lesson, setLesson] = useState([])

  const getlessonList = async () => {
    await fetch(`${api}/getlist`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => setLesson(data))
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  useEffect(() => {
    getlessonList()
  }, [])

  const showSelectList = lesson.map((Stag) => {
    console.log(Stag.img.split(',')[0])
    if (
      ArrLV.length === 0 ||
      ArrLV.indexOf(Stag.LV) !== -1 ||
      ArrLV.indexOf(Stag.location) !== -1
    ) {
      return (
        <Fragment key={Stag.id}>
          <Row
            className={`m-2 g-0 shadow-sm rounded bg-white ${Style['bg-hover']}`}
          >
            <Col lg={4} className={`rounded ${Style['hover-none']}`}>
              <div className=" ratio ratio-4x3 h-100">
                <Image
                  className="rounded img-fluid mx-auto d-block"
                  src={`/images/lesson/${Stag.img.split(',')[0] + '.jpg'}`}
                  alt="description"
                />
              </div>
            </Col>
            <Col lg={8} className={`p-3`}>
              <Link className="" href={`/lesson/${Stag.id}`}>
                <Row className={Style['hover-none']}>
                  <Col lg={9} className={`fs-4`} style={{ height: '2rem' }}>
                    <div className="d-flex align-items-center">
                      {Stag.title}
                    </div>
                  </Col>
                  <Col lg={3} className={`${Style['hover-none']} text-end`}>
                    <div className="fs-5">
                      <FaLocationDot className="pe-1" />
                      {Stag.location}
                    </div>
                  </Col>
                </Row>
                <Row className={`${Style['hover-none']} mt-4`}>
                  <Col
                    lg={12}
                    className={`px-3 ${Style['text-area']}`}
                    style={{ height: '3rem' }}
                  >
                    {Stag.content}
                  </Col>
                  <Col lg={12} className="text-end">
                    閱讀更多..
                  </Col>
                </Row>
                <Row className={`${Style['hover-none']} mt-2`}>
                  <Col lg={3}>
                    <div
                      className={`rounded-pill border border-primary-subtle text-center`}
                    >
                      {Stag.tag}
                    </div>
                  </Col>
                  <Col className="text-end">
                    <div className="text-danger">NT$ {Stag.price}/人含裝備</div>
                  </Col>
                </Row>
              </Link>
            </Col>
          </Row>
        </Fragment>
      )
    }
  })
  return <>{showSelectList}</>
}
