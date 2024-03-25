import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useCart } from '@/hooks/cart'
import DatePicker from '@/components/cart/date-picker'
import toast, { Toaster } from 'react-hot-toast'
import { IoIosAdd } from 'react-icons/io'
import { LuMinus } from 'react-icons/lu'

import Style from '@/styles/lessonStyle/lesson.module.scss'
export default function PreOrder() {
  const api = 'http://localhost:3005/api/lesson'
  const date = new Date().getDate()
  const month = new Date().getMonth() + 1
  const year = new Date().getFullYear()
  const today = `${year}/${month}/${date}`
  const [selectedDate, setSelectedDate] = useState(today)
  const [time, setTime] = useState([])
  const [count, setCount] = useState(1)
  const [ambtn, setAmBtn] = useState(false)
  const [pmbtn, setPmBtn] = useState(false)
  const [timedetail, setTimeDetail] = useState('') //選擇時段的值

  const clickAM = () => {
    const txt = 'AM09:00'
    setTimeDetail(txt)
  }
  const clickPM = () => {
    const txt = 'PM15:00'
    setTimeDetail(txt)
  }
  const handleDateChange = (date) => {
    setSelectedDate(date)
    setTimeDetail('')
  }
  const router = useRouter()
  const { addItem } = useCart()
  const lid = router.query.lessonId
  const [perorder, setPerOrder] = useState(() => {})
  const getOrderTime = async () => {
    try {
      const response = await fetch(`${api}/time`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const [data] = await response.json()
      const selectedDateData = data.find(
        (v) => v.preorder_date === selectedDate
      )
      const newTime = { AM: selectedDateData?.AM, PM: selectedDateData?.PM }
      setTime(newTime)
      setAmBtn(!!newTime.PM)
      setPmBtn(!!newTime.AM)
      return data
    } catch (error) {
      console.error(
        `Failed to fetch data from ${api + '/' + 'orderdate'}: ${error.message}`
      )
      return null
    }
  }
  const getOrderDetail = async () => {
    const res = await fetch(`${api}/getlist/${lid}`)
    const data = await res.json()
    const [newData] = data
    setPerOrder(newData)
  }

  useEffect(() => {
    if (router.isReady) {
      const { lid } = router.query
      getOrderDetail(lid)
    }
  }, [router.isReady])

  useEffect(() => {
    getOrderTime()
  }, [selectedDate])
  useEffect(() => {
    getOrderDetail()
  }, [time])
  const addLesson = (lesson_id, order_time, name, price, limg) => {
    const item = {
      lesson_id,
      order_time,
      timedetail,
      name,
      price,
      num: count,
      limg,
    }
    addItem(item)
    toast.success('已加入購物車')
  }
  return (
    <>
      <div>
        <div className="title col-11 mx-auto mt-3">
          <h1 className="text-center text-sm-start">
            {perorder && perorder.title}
          </h1>
          <h5 className="mt-2">
            您可以在此查看我們的可預約日期，並選取最合適的日期和時間
          </h5>
        </div>
        <div className="row mt-5 date-section">
          <div className="container col-sm-7">
            <div className="d-flex justify-content-between">
              <h4>選擇日期和時間</h4>
              <h6 className="text-black-50">台北標準時間(GMT+8)</h6>
            </div>
            <hr />
            <div className="row">
              <div className="col-sm-6">
                <DatePicker getDate={handleDateChange} perorder={perorder} />
              </div>
              <div className="col-sm-6 time-section">
                <div>你選擇的預約時間:</div>
                <h5>
                  {selectedDate} <sand>{timedetail}</sand>
                </h5>
                <div className="d-flex mt-3">
                  <button
                    disabled={ambtn}
                    type="button"
                    className="btn time-period-btn w-75 active"
                    onClick={() => {
                      clickAM(time)
                    }}
                  >
                    <h5 className="fw-bold py-1">AM</h5>
                  </button>
                  <div className="w-25"></div>
                  <button
                    disabled={pmbtn}
                    type="button"
                    className="btn time-period-btn w-75"
                    onClick={() => {
                      clickPM(time)
                    }}
                  >
                    <h5 className="fw-bold py-1">PM</h5>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-4 detail-section">
            <div className="container">
              <h5>課程細節</h5>
              <div className="mt-3">
                <p>課程名稱: {perorder && perorder.title}</p>
                <p>課程日期:{selectedDate}</p>
                <p>課程時段: {timedetail}</p>
                <p className="fs14">
                  上課地點: {perorder && perorder.locationDetail}
                </p>
                <p className="fs14">價格: {perorder && perorder.price}</p>
                <div className="d-flex align-items-center">
                  <p>人數：</p>

                  <button
                    className={`${Style['btn-none']}`}
                    onClick={() => setCount(count + 1)}
                  >
                    <IoIosAdd className="fs-4" />
                  </button>
                  <p>{count}</p>
                  <button
                    className={`${Style['btn-none']} `}
                    onClick={() => count > 0 && setCount(count - 1)}
                  >
                    <LuMinus className="fs-4" />
                  </button>
                </div>
              </div>
              <hr />
              <button
                type="button"
                className="btn cart-btn w-100"
                onClick={() => {
                  addLesson(
                    lid,
                    selectedDate,
                    perorder.title,
                    perorder.price,
                    `${perorder.img.split(',')[0]}.jpg`
                  )
                }}
              >
                <h5 className="fw-bold py-1">加入購物車</h5>
                <Toaster />
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        p {
          margin: 0;
        }

        .fs14P {
          size: 14px;
        }

        .time-period-btn {
          border: 1px solid #ff9720;
          color: #ff9720;
        }

        .time-period-btn.active {
          background-color: #ff9720;
          color: white;
        }

        .cart-btn {
          background-color: #ff9720;
          color: white;
        }

        @media (max-width: 576px) {
          .date-section {
            margin: 0;
          }

          .detail-section {
            margin-top: 1rem;
            padding-inline: 0;
          }

          .time-section {
            margin-top: 1rem;
          }
        }
      `}</style>
    </>
  )
}
