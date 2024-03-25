import React from 'react'
import Link from 'next/link'
import styles from './index.module.scss'
import MyProduct from './myProduct'

import { useCart } from '@/hooks/cart'

export default function SideCart() {
  const { items, cart } = useCart()

  return (
    <>
      <div
        className={`offcanvas offcanvas-end ${styles.sideCart}`}
        id="offcanvasCart"
        data-bs-scroll={true}
      >
        <div
          className={`offcanvas-header ${styles.title} py-2 px-3 d-flex justify-content-between`}
        >
          <div className={`d-flex justify-content-center`}>
            <i className={`bi bi-bag-fill fs-5 me-2`}></i>
            <p className="m-0 fw-bolder">購物車</p>
          </div>
          {/* 關掉按鈕 */}
          <button
            type="button"
            className={`p-0`}
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            <i className="bi bi-x-lg fs-4"></i>
          </button>
        </div>

        {/* 購買商品列表 */}
        <div className={`offcanvas-body ${styles.myProducts}`}>
          {/* 加入商品後會消失 */}
          <p className={`${styles.text}`}>{!cart && '你的購物車是空的'}</p>

          {items &&
            items.map((item, i) => {
              const {
                name,
                price,
                num,
                discount_price,
                product_detail,
                order_time,
                timedetail,
                product_id,
                lesson_id,
                pimg,
                limg,
                category,
              } = item
              const img = pimg || limg
              const id = product_id || lesson_id
              const detail = product_detail || order_time + ' ' + timedetail
              return (
                <MyProduct
                  key={i}
                  name={name}
                  detail={detail}
                  price={price}
                  discountPrice={discount_price}
                  num={num}
                  index={i}
                  isProduct={item.product_id ? true : false}
                  id={id}
                  img={img}
                  category={category}
                />
              )
            })}
          {/* <MyProduct
            name={'aaa'}
            detail={'bbb'}
            price={500}
            discountPrice={200}
            num={2}
          /> */}
        </div>

        {/* 前往購物車按鈕 */}
        {/* 加入商品後會變成立即結帳 */}

        {/* <Link {{cartData} ? "./cart" : "./product" } href={'./cart'} className={`${styles.cartLink}`}> */}
        <Link
          href={items.length > 0 ? '/cart' : '/product'}
          className={`${styles.cartLink}`}
        >
          {items.length > 0 ? '立即結帳' : '開始購物'}
        </Link>
      </div>
    </>
  )
}
