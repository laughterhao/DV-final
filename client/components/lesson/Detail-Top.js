import React from 'react'
import ImgSlider from './ImgSlider'
import SliderTest from './sliderTest'
import { Container, Row, Col } from 'react-bootstrap'
import { GiRoundStar } from 'react-icons/gi'
import { FaHeart } from 'react-icons/fa'

export default function DetailTop() {
  return (
    <>
      <Container>
        <Row>
          <Col lg={7}>
            <figure className="">
              <ImgSlider></ImgSlider>
              {/* <SliderTest></SliderTest> */}
            </figure>
          </Col>
          <Col lg={5}>
            <Row>
              <Col lg={12} style={{ hight: '10rem' }}>
                <div className="fs-4 fw-bold">課程說明</div>
                <p className="fs-5 mt-3">
                  學習自由潛水的生理學與呼吸法，深度與壓力的關係，認識自由潛水裝備，自由潛水規則，自由潛水安全與救援
                  （潛水暈厥 BO 與身體失控顫抖 LMC），自由潛水與環境保護等。
                  練習肢體拉伸呼吸調節，正確的水面呼吸和恢復呼吸方法，耳部壓力平衡（法蘭佐耳壓平衡），
                  鴨式入水 / 身體姿勢 / 踢腿方式，潛伴制度和模擬救援。
                </p>
                <div
                  className="btn border rounded-pill me-1 text-white"
                  style={{ backgroundColor: '#265475' }}
                >
                  # 水肺潛水
                </div>
                <div
                  className="btn border rounded-pill"
                  style={{ color: '#265475' }}
                >
                  #自由潛水
                </div>
                <div className="fs-5 text-danger mt-3">NT$1,500</div>
              </Col>
              <Col lg={12}>
                <div className="d-flex justify-content-between mt-3">
                  <div className="fs-4 d-flex align-items-center">
                    {/* ---引入資料庫內的 star--- */}
                    <GiRoundStar />
                    <GiRoundStar />
                    <GiRoundStar />
                    <GiRoundStar />
                    <GiRoundStar />
                    <span className="fs-6 ps-3">評論</span>
                  </div>
                  <div className="align-self-center">
                    <FaHeart className="fs-4" />
                  </div>
                </div>
              </Col>
              <div className="btn btn-warning mt-3" type="button">
                立即預約
              </div>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}