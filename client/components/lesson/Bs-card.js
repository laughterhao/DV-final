import React, { useState, useEffect } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Style from '@/styles/lessonStyle/lesson.module.scss'

import { FaLocationDot } from 'react-icons/fa6'
export default function BsCard() {
  const [lesson, setLesson] = useState([])
  const getlessonList = async () => {
    const res = await fetch('http://localhost:3005/api/lesson/getlist')
    const data = await res.json()
    setLesson(data)
  }
  useEffect(() => {
    getlessonList()
  }, [])
  return (
    <>
      {lesson.map((item, i) => (
        <Col key={i} xs={6} md={6}>
          <Card className="mx-auto mb-2 ">
            <div className="ratio ratio-4x3 h-100">
              <Card.Img
                variant="top"
                src={`/images/lesson/${item.img.split(',')[0] + '.jpg'}`}
                alt="description"
              />
            </div>

            <Card.Body className="d-flex flex-column">
              <Row>
                <Col xs="8">
                  <Card.Title className="fs-6">{item.title}</Card.Title>
                </Col>
                <Col xs="4">
                  <FaLocationDot className=" 1base fs-6" />
                  {item.location}
                </Col>
              </Row>

              <Card.Text className={`${Style['text-area']} fs-6 `}>
                {item.content}
              </Card.Text>
              <Button variant="primary" onClick={() => {}}>
                立即預約
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </>
  )
}
