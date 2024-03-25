import React from 'react'
import { FaShoppingCart, FaRegTrashAlt } from 'react-icons/fa'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import styles from './cart.module.scss'
import Image from 'next/image'
import Link from 'next/link'

import { useCart } from '@/hooks/cart'

export default function Cart() {
  const { items, updateItemQty, increment, decrement, removeItem } = useCart()

  const MySwal = withReactContent(Swal)

  //刪除通知
  const notifySA = (name, id, detail, isProduct) => {
    console.log(detail)
    MySwal.fire({
      icon: 'question',
      title: <>{`確認要刪除${name}嗎?`}</>,
      showConfirmButton: true,
      confirmButtonText: '確認',
      showDenyButton: true,
      denyButtonText: `取消`,
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: '已成功刪除!',
          icon: 'success',
        })
        removeItem(id, detail, isProduct)
      }
    })
  }

  return (
    <div className="container">
      <div className={`${styles.sectionName} d-flex`}>
        <FaShoppingCart size={20} color="#013C64" />
        <h5 className={`ms-2 ${styles.span}`}>{items.length}項商品</h5>
      </div>
      <table>
        <thead>
          <tr>
            <th className="col text-start">商品資料</th>
            <th className="col-2">商品價格</th>
            <th className="col-2">數量</th>
            <th className="col-2">小計</th>
            <th className="col-1 col-sm-2"></th>
          </tr>
        </thead>
        <tbody>
          {items ? (
            items.map((item, i) => {
              const {
                product_id,
                lesson_id,
                price,
                num,
                name,
                discount_price,
                product_detail,
                order_time,
                timedetail,
                category,
                pimg,
                limg,
              } = item
              const id = product_id || lesson_id
              const detail = product_detail || order_time + ' ' + timedetail
              const img = pimg || limg
              const isProduct = !!item.product_id
              const totalPrice = discount_price
                ? discount_price * num
                : price * num
              const imgUrl = isProduct
                ? `/images/product/images/${category}/${id}/${img}`
                : `/images/lesson/${img}`
              const url = isProduct ? `/product/${id}` : `/lesson/${id}`
              return (
                <tr key={i}>
                  <td>
                    <div className="d-flex">
                      <Image src={imgUrl} alt="t" width={100} height={100} />
                      <div className="ms-2">
                        <Link href={url}>
                          <h5 className="fw-bold text-start">{name}</h5>
                        </Link>
                        <p className={`${styles.imperceptible} text-start`}>
                          {detail}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {discount_price ? (
                      <>
                        <h5 className={`fw-bold ${styles.discounted}`}>
                          NT${discount_price}
                        </h5>
                        <p
                          className={`${styles.imperceptible}  text-decoration-line-through`}
                        >
                          NT${price}
                        </p>
                      </>
                    ) : (
                      <>
                        <h5 className="fw-bold">NT${price}</h5>
                      </>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`${styles.btnLight}`}
                      onClick={() => {
                        decrement(id, detail, isProduct)
                      }}
                    >
                      <i className="bi bi-dash-lg"></i>
                    </button>
                    <input
                      type="text"
                      className={`w-25 text-center input${i}`}
                      value={num}
                      onChange={(e) => {
                        updateItemQty(
                          id,
                          detail,
                          parseInt(e.target.value),
                          isProduct
                        )
                      }}
                    />
                    <button
                      type="button"
                      className={`${styles.btnLight}`}
                      onClick={() => {
                        increment(id, detail, isProduct)
                      }}
                    >
                      <i className="bi bi-plus-lg"></i>
                    </button>
                  </td>
                  <td>
                    <p className={`price${i}`}>NT${totalPrice}</p>
                  </td>
                  <td>
                    <FaRegTrashAlt
                      size={20}
                      onClick={() => notifySA(name, id, detail, isProduct)}
                      style={{ cursor: 'pointer', color: '#aaa' }}
                    />
                  </td>
                </tr>
              )
            })
          ) : (
            <></>
          )}
        </tbody>
      </table>
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

        input {
          background-color: #f8f9fa;
          border: 0;
        }

        table {
          width: 100%;
        }

        tr {
          border-bottom: 1px solid black;
        }

        td,
        th {
          padding-top: 1rem;
          padding-bottom: 1rem;
          text-align: center;
        }
        @media screen and (max-width: 576px) {
          h5 {
            font-size: 1rem;
          }
          p {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  )
}
