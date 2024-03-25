import React, { useState, useEffect } from 'react'
import Link from 'next/link'

import CartStep from '@/components/cart/cart-step'
import { useUsingCoupon } from '@/hooks/use-usingCoupon'
import { useCart } from '@/hooks/cart'
import { useAuth } from '@/hooks/auth'

import styles from './cart.module.scss'

export default function Order({ orderId }) {
  const { removeUsingCoupon } = useUsingCoupon()
  const { cart, clearCart } = useCart()
  const { auth } = useAuth()
  const { usingCoupon } = useUsingCoupon()

  const [order, setOrder] = useState(null)
  const [orderDetail, setOrderDetail] = useState(null)

  const [coupon, setCoupon] = useState(null)

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:3005/api/order/order-detail?orderId=${orderId}`
        )
        const result = await response.json()
        setOrderDetail(result)
      } catch (error) {
        console.error('Error fetching order detail:', error)
      }
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `http://localhost:3005/api/order/order?orderId=${orderId}`
        )
        const [result] = await response.json()
        setOrder(result)
        setCoupon(JSON.parse(result.used_coupon))
      } catch (error) {
        console.error('Error fetching order:', error)
      }
    }

    const addOrderTime = async () => {
      for (const i of cart.items) {
        try {
          await fetch('http://localhost:3005/api/lesson/order-time', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(i),
          })
        } catch (error) {
          console.error('Error fetching order:', error)
        }
      }
    }

    const couponUsed = async () => {
      try {
        if (usingCoupon) {
          const url = 'http://localhost:3005/api/coupon/'
          const data = {
            userID: auth.id,
            couponID: usingCoupon.id,
          }
          const response = await fetch(url, {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
          const result = await response.json()
          console.log(result)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchOrderDetail()
    fetchOrder()
    addOrderTime()
    couponUsed()
    clearCart()
    removeUsingCoupon()
  }, [])

  return (
    <div className="container">
      <CartStep step={3} />
      <div className="container">
        <div className={`w-100 ${styles.sectionName} text-center`}>
          <h5 className={`${styles.span}`}>訂單資訊</h5>
        </div>
        <div className={`row ${styles.row}`}>
          <p className="col fw-bold">訂單編號</p>
          <p className="col text-end">{orderId}</p>
        </div>
        <div className={`row ${styles.row} fw-bold`}>
          <p className="col-6">商品明細</p>
          <p className="col">數量</p>
          <p className="col  text-end">小計</p>
        </div>
        {orderDetail &&
          orderDetail.map((item, i) => {
            const { name, num, price } = item
            const singleItemsPrice = price * num
            return (
              <div className={`row ${styles.row}`} key={i}>
                <p className="col-6 fw-bold">{name}</p>
                <p className="col">{num}</p>
                <p className="col text-end">NT${singleItemsPrice}</p>
              </div>
            )
          })}
        <hr />
        <div className={`row ${styles.row}`}>
          <div className="col-sm-7 col-10"></div>
          <p className="col fw-bold">運費</p>
          <p className="col fw-bold text-end">NT$ {cart.deliveryFee}</p>
        </div>
        {coupon && (
          <div className={`row ${styles.row}`}>
            <div className="col-sm-7 col-10"></div>
            <p className="col fw-bold">優惠</p>
            <p className="col fw-bold text-end">-NT$ {coupon.discount}</p>
          </div>
        )}
        <div className={`row ${styles.row}`}>
          <div className="col-sm-7 col-10"></div>
          <p className="col fw-bold">合計</p>
          <p className="col fw-bold text-end">
            NT$ {order && order.total_price}
          </p>
        </div>
        <div className="text-end my-3">
          <Link href="../">
            <button type="button" className={`btn nextStepBtn text-white px-5`}>
              <h5 className="fw-bold py-1 px-3">返回商場</h5>
            </button>
          </Link>
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
        .nextStepBtn {
          background-color: #ff9720;
        }
      `}</style>
    </div>
  )
}
