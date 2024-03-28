import React, { useEffect, useState } from 'react'

// 設定背景顏色；捲動到哪裡時出現
export default function GoToTop({ backgroundColor }) {
  const [showBottom, setShowBottom] = useState(false)

  // gototop
  const handleScroll = () => {
    if (window.scrollY > 100) {
      setShowBottom(true)
    } else {
      setShowBottom(false)
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const gotoTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
  return (
    <>
      <div
        className={`gototop ${showBottom ? 'd-block' : 'd-none'}`}
        onClick={gotoTop}
      >
        <i className="bi bi-arrow-up-short"></i>
      </div>

      {/* style */}
      <style jsx>{`
        .gototop {
          position: fixed;
          bottom: 50px;
          right: 30px;
          width: 60px;
          height: 60px;
          background-color: ${backgroundColor};
          color: #013c64;
          border-radius: 30px;
          text-align: center;
          line-height: 60px;
          cursor: pointer;
        }
        .gototop:hover,
        .gototop:hover {
          color: #ff9720;
        }
        .bi {
          font-size: 50px;
        }
      `}</style>
    </>
  )
}
