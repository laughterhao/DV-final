import React, { useEffect, useState } from 'react'
import styles from '../styles.module.scss'
import Image from 'next/image'
import Swal from 'sweetalert2'
import { useCouponHas } from '@/hooks/use-couponHasData'
import usePagination from '@/hooks/use-pagination'
import Pagination from '../pagination'
import LoaderPing from '@/components/post/loaderPing'

export default function Form() {
  const { couponHas, authID, setCouponHas } = useCouponHas()
  const [inputCode, setInputCode] = useState('')
  const [errorText, setErrorText] = useState(false)

  // 初始化可使用的優惠券
  const initCoupon = couponHas.filter((coupon) => coupon.valid === 1)
  const [coupon, setCoupon] = useState([])

  // 控制分頁
  const { currentPage, pageItem, handlePage, getPageNumbers } = usePagination(
    coupon,
    6
  )
  const [isSecondary, setIsSecondary] = useState(true)

  const [isLoading, setIsLoading] = useState(true)

  const input = (e) => {
    e.preventDefault()
    const inputValue = e.target.value.toLocaleUpperCase()
    e.target.value = ''
    setInputCode(inputValue)
  }

  // 點擊按鈕把資料傳給後端領取優惠卷
  const submitBtn = async (inputCode, authID) => {
    try {
      // 如果沒有輸入文字顯示錯誤
      if (inputCode === '') {
        setErrorText(true)
        return
      }

      // 連接API
      const url = 'http://localhost:3005/api/coupon'
      const response = await fetch(url, {
        method: 'post',
        headers: {
          //設定 HTTP 請求標頭，告訴伺服器發送的資料是 JSON 格式
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          inputCode,
          authID,
        }),
      })
      const results = await response.json()
      // console.log(results)
      if (results.status === 'success') {
        // 領取優惠卷成功後重新讀取會員的有的優惠卷
        const url = `http://localhost:3005/api/coupon/${authID}`
        await fetch(url, {
          method: 'get',
        })
          .then((response) => {
            return response.json()
          })
          .then((results) => {
            setCouponHas(results)
          })
          .catch(() => {
            console.log('error')
          })
        // 領取成功視窗
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '領取成功',
          showConfirmButton: false,
          timer: 1500,
        })
      } else if (results.status === 'existed') {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: '已領取過',
          showConfirmButton: false,
          timer: 1500,
        })
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: '領取失敗',
          showConfirmButton: false,
          timer: 1500,
        })
      }
    } catch {
      console.log('連線失敗')
    }
  }

  // 點擊顯示可使用的優惠券
  const handleCouponValid = (validNum) => {
    const validCoupon = couponHas.filter((coupon) => coupon.valid === validNum)
    setCoupon(validCoupon)
    setIsSecondary(validNum === 1)
  }

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  // 抓到資料後把資料設定進去coupon
  useEffect(() => {
    setCoupon(initCoupon)
  }, [couponHas])

  return (
    <>
      <div className={`col-sm-8 p-0 rounded-end ${styles['form-container']}`}>
        <div className="container my-4">
          <div className="accordion">
            <div className="accordion-header">
              <h2 className="fw-medium fs-5 d-flex py-3 m-0">優惠券</h2>
            </div>
            <div className={` container `}>
              <div
                className={` px-4 ${styles.errorBlock} ${
                  errorText ? 'd-block' : 'd-none'
                }`}
              >
                <p className="p-0">error：請輸入優惠碼！</p>
              </div>
            </div>
            <div className="accordion-body">
              {/* 篩選＆搜尋，要再調整 */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <button
                    type="button"
                    className={`btn btn-sm ${
                      isSecondary ? 'text-secondary' : ''
                    }`}
                    onClick={() => {
                      handleCouponValid(1)
                    }}
                  >
                    可使用
                  </button>
                  |
                  <button
                    type="button"
                    className={`btn btn-sm ${
                      !isSecondary ? 'text-secondary' : ''
                    }`}
                    onClick={() => {
                      handleCouponValid(0)
                    }}
                  >
                    已失效
                  </button>
                </div>
                <div className="d-flex justify-content-end">
                  <input
                    type="text"
                    className="form-control w-50 h-50 me-2"
                    value={inputCode}
                    onChange={(e) => {
                      input(e)
                    }}
                    placeholder="輸入優惠碼..."
                  />

                  <button
                    className={`btn btn-sm btn-outline-secondary ${styles['hover-style']}`}
                    onClick={() => {
                      submitBtn(inputCode, authID)
                    }}
                  >
                    領取
                  </button>
                </div>
              </div>
              <div className="mb-5">
                {isLoading ? (
                  <LoaderPing />
                ) : (
                  <>
                    <div
                      className={`row g-3 position-relative ${styles['card-list']}`}
                    >
                      {/* 之後改用map */}
                      {pageItem.length <= 0 ? (
                        <span
                          className={`fs-4 my-5 ${styles.none}`}
                          style={{ color: '#b4b4b4' }}
                        >
                          尚無資料
                        </span>
                      ) : (
                        pageItem.map((v) => {
                          return (
                            <div
                              className={`col-12 col-md-6 ${styles.card}`}
                              key={v.id}
                            >
                              <div className=" d-flex border border-info rounded p-3 h-100">
                                <div
                                  className={`rounded ${styles.avatar} flex-shrink-0 me-3`}
                                >
                                  <Image
                                    src="/images/coupons/turtle.jpg"
                                    alt="turtle"
                                    fill
                                  />
                                </div>
                                <div className="right flex-grow-1">
                                  <h4 className="fs-6">{v.coupon_name}</h4>
                                  <p className={`${styles.rule}`}>
                                    {v.coupon_rule_content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                    <div className="mt-5">
                      <Pagination
                        currentPage={currentPage}
                        handlePage={handlePage}
                        getPageNumbers={getPageNumbers}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
