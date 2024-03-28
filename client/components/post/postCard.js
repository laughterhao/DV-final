import Link from 'next/link'
import React from 'react'
import { Container, Card, Col, Row, Stack } from 'react-bootstrap'
import TagButton from '@/components/post/tagButton'
import { PiUserCircleDuotone, PiCalendarBlankDuotone } from 'react-icons/pi'
import postStyles from './post.module.scss'

export default function PostCard({ postList }) {
  const getTagsArray = (tagsString) => {
    // 檢查 tagsString 是否存在
    if (tagsString) {
      return tagsString.split(',')
    }
    return []
  }

  // html轉為純文字
  function htmlToPlainText(html) {
    var temp = document.createElement('div')
    temp.innerHTML = html
    return temp.textContent || temp.innerText || ''
  }

  return (
    <>
      <Container className="mb-3">
        <Row xs={1} md={2} lg={3} className="g-4">
          {postList.map((v) => (
            <Col key={v.id}>
              <Card className={postStyles['card']}>
                {/* 文章詳細頁連結 設在圖片 */}
                <Link href={`/post/${v.id}`} style={{ textDecoration: 'none' }}>
                  {/* 固定圖片高度 */}
                  <div style={{ height: '200px' }}>
                    <Card.Img
                      variant="top"
                      src={`http://localhost:3005/upload/${v.image}`}
                      style={{ height: '100%', objectFit: 'cover' }}
                    />
                    <span className={postStyles['card-action']}>
                      <svg
                        viewBox="0 0 1024 1024"
                        fill="#000000"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M642.174 504.594c7.99 7.241 7.897 17.58-0.334 24.782L332.62 799.945c-8.867 7.759-9.766 21.236-2.007 30.103 7.758 8.867 21.236 9.766 30.103 2.007l309.221-270.569c27.429-24 27.792-64.127 0.89-88.507L360.992 192.192c-8.73-7.912-22.221-7.248-30.133 1.482-7.912 8.73-7.248 22.222 1.482 30.134l309.833 280.786z"
                          fill=""
                        ></path>
                      </svg>
                    </span>
                  </div>
                </Link>
                <Card.Body className="bg-light">
                  <Card.Subtitle className="mb-2 text-primary ">
                    <PiCalendarBlankDuotone />{' '}
                    {new Date(v.published_at)
                      .toLocaleDateString()
                      .replace(/\//g, '-')}{' '}
                  </Card.Subtitle>

                  <Card.Title className="fw-bold">{v.title}</Card.Title>
                  <div
                    style={{
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      textOverflow: 'ellipsis',
                      WebkitLineClamp: 2, // 要顯示的行數
                      // color: '#0009',
                    }}
                  >
                    {htmlToPlainText(v.content)}
                  </div>

                  <Stack direction="horizontal" gap={2} className="my-2">
                    <div>
                      {getTagsArray(v.tags).map((tag, index) => (
                        <>
                          {/* index會重複 01 012 01  */}
                          <Link
                            // key={`${v.id} + ${index}`.toString()}
                            key={index}
                            href={`/post/tagPost/${tag}`}
                          >
                            {' '}
                            <TagButton
                              //   key={`${index}` + '#'}
                              text={`# ${tag}`}
                            />
                          </Link>

                          {/* {console.log(`${v.id} + ${index}`.toString())} */}
                        </>
                      ))}
                    </div>
                  </Stack>
                  <Card.Subtitle className="mb-2 text-primary text-end">
                    <PiUserCircleDuotone /> {v.name}
                  </Card.Subtitle>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  )
}
