import { useMemo, useEffect, useState } from 'react'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/router'

import Star from '@/components/product/star/star'
import { FaRegCommentDots } from 'react-icons/fa'

export default function Switch({
  name,
  imgDetails,
  id,
  category,
  detail,
  rating,
  setRating,
}) {
  const [isSwitchOn, setIsSwitchOn] = useState(false)

  const handleSwitchToggle = () => {
    setIsSwitchOn(!isSwitchOn)
  }

  //新增評論
  const router = useRouter()
  const { pid } = router.query
  const [score, setScore] = useState(0)
  const [comment, setComment] = useState('')
  const [allComments, setAllComments] = useState([])
  const {
    auth: { id: user_id },
  } = useAuth()

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(
        `http://localhost:3005/api/product/comment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            score,
            comment,
            user_id,
            product_id: pid,
          }),
        }
      )
      if (response.ok) {
        // console.log('送出評價成功')
        const response = await fetch(
          `http://localhost:3005/api/product/can-comment?pid=${id}&mid=${user_id}`
        )
        const data = await response.json()
        setCanComment(data)
        try {
          const response = await fetch(
            `http://localhost:3005/api/product/comment?pid=${id}`,
            {
              method: 'GET',
            }
          )
          console.log('response', response)
          if (response.ok) {
            const data = await response.json()
            setAllComments(data)
            console.log(data)
          }
        } catch (err) {
          console.error('送出評價失敗：', err)
        }
      } else {
        console.error('送出評價失敗')
      }
    } catch (err) {
      console.error('送出評價失敗：', err)
    }
  }

  const [canComment, setCanComment] = useState(false)

  useEffect(() => {
    const fetchCanComment = async () => {
      try {
        const response = await fetch(
          `http://localhost:3005/api/product/can-comment?pid=${id}&mid=${user_id}`
        )
        if (response.ok) {
          const data = await response.json()
          setCanComment(data)
        }
      } catch (err) {
        console.error('Error fetching data:', err)
      }
    }
    fetchCanComment()
  }, [id, user_id])

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await fetch(
          `http://localhost:3005/api/product/comment?pid=${id}`,
          {
            method: 'GET',
          }
        )
        // console.log('response', response)
        if (response.ok) {
          const data = await response.json()
          console.log(data)
          setAllComments(data)
          // console.log(data)
        }
      } catch (err) {
        // console.error('送出評價失敗：', err)
      }
    }
    fetchComment()
  }, [id])

  const averageScore = useMemo(() => {
    let totalScore = 0
    allComments.forEach((comment) => {
      totalScore = totalScore + comment.score
    })
    const average = totalScore / allComments.length
    const formattedScore = average.toFixed(1)
    return formattedScore
  }, [allComments])

  return (
    <div className="mt-4">
      {/* 轉換按鈕 -- 商品介紹/評價 */}
      <div className="form-check form-switch d-flex justify-content-end">
        <div className="switch text-center m-2">
          <input
            className="switch-checkbox"
            id="switchID"
            type="checkbox"
            name="switch-checkbox"
            checked={isSwitchOn}
            onChange={handleSwitchToggle}
          />
          <label className="switch-label" for="switchID">
            <span className="switch-txt" turnOn="細節" turnOff="評價"></span>
            <span className="switch-Round-btn"></span>
          </label>
        </div>
      </div>
      {isSwitchOn && (
        <div>
          {/* 顯示顧客評價 */}
          <h3 className="text-center my-2">顧客評價</h3>
          {canComment ? (
            <div className="container">
              <form action="post" onSubmit={handleCommentSubmit}>
                <div className="form-group">
                  <label
                    className="mx-2 my-1"
                    for="exampleFormControlTextarea1"
                  >
                    來為 <span className="comment-product-name">{name}</span>{' '}
                    評價吧 <FaRegCommentDots className="FaRegCommentDots" />
                  </label>
                  <Star
                    rating={score}
                    setRating={setScore}
                    type="number"
                    id="score"
                    required
                  />
                  <textarea
                    className="form-control my-1 border-2"
                    id="comment"
                    value={comment}
                    rows="3"
                    placeholder="請說明使用此商品的體驗"
                    required
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary d-flex btn-comment"
                >
                  送出評價
                </button>
              </form>
            </div>
          ) : null}

          {/* 用戶評價 */}
          <div className="d-flex align-items-center justify-content-center">
            <div className="mt-2">
              {allComments.map((data) => (
                <Comment key={data.id} data={data} />
              ))}
            </div>
          </div>
        </div>
      )}
      {!isSwitchOn && (
        <div>
          {/* 顯示商品細節 */}
          <h3 className="text-center my-2">商品介紹</h3>

          {/* 商品介紹 */}
          <div className="row mt-2 mx-2 my-5">
            <div className="col-sm-12">
              <p className="text-center my-3 font-weight-light">
                <p
                  className="p-3"
                  dangerouslySetInnerHTML={{
                    __html: detail.replace(/\n/g, '<br>'),
                  }}
                ></p>
              </p>
              <div className="img-container">
                {imgDetails.map((imgDetail) => {
                  return (
                    <div key={imgDetail}>
                      <div className="p-2 my-2 custom-image-container">
                        <img
                          className="my-2"
                          src={`/images/product/images/${category}/${id}/${imgDetail}`}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      <br />
      <br />
      <style>{`    
      .comment-product-name{
        font-size: 20px;
        font-weight: bold;
      }
      .btn-comment {
          background-color: #265475;
          margin: 18px auto;
          border-radius: 100px;
          padding: 10px 20px;
        }
      .custom-image-container {
          margin: 0 auto;
          max-width: 600px;
          max-height: 480px;
        }
        .custom-image-container img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .content {
          height: 80px;
        }
        .avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          overflow: hidden;
          margin: 15px;
        }
        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .switch {
          /*設定開關鈕的長寬*/
          position: relative;
          width: 79px;
          height: 30px;
          line-height: 30px;
        }
        .switch-checkbox {
          position: absolute;
          display: none;
        }
        .switch-label {
          display: block;
          overflow: hidden;
          cursor: pointer;
          border-radius: 20px;
        }
        .switch-txt {
          display: block;
          width: 200%;
          margin-left: -100%;
          transition: margin 0.3s ease-in 0s;
        }
        .switch-txt::before,
        .switch-txt::after {
          display: block;
          float: right;
          width: 50%;
          font-size: 13px;
          color: #fff;
          font-weight: bold;
          box-sizing: border-box;
        }
        /*開關鈕底色(開啟時)*/
        .switch-txt::after {
          content: attr(turnOn);
          padding-left: 19px;
          background: #ff9720;
          color: #fff;
          text-align: left;
        }
        /*開關鈕底色(關閉時)*/
        .switch-txt::before {
          content: attr(turnOff);
          padding-right: 19px;
          background: #265475;
          color: #fff;
          text-align: right;
        }
        /*開關鈕的顏色與大小*/
        .switch-Round-btn {
          position: absolute;
          display: block;
          width: 18px;
          height: 18px;
          margin: 6px 5px;
          background: #fff;
          top: 0;
          bottom: 0;
          right: 50px;
          border-radius: 15px;
          transition: all 0.3s ease-in 0s;
        }
        .switch-checkbox:checked + .switch-label .switch-txt {
          margin-left: 0;
        }
        .switch-checkbox:checked + .switch-label .switch-Round-btn {
          right: 0;
        }
      `}</style>
    </div>
  )
}

const Comment = ({ data, commentDate, setRating }) => {
  //處理評論時間
  const formattedDateTime = useMemo(() => {
    const timestamp = data.created_at
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    const hours = ('0' + date.getHours()).slice(-2)
    const minutes = ('0' + date.getMinutes()).slice(-2)
    const seconds = ('0' + date.getSeconds()).slice(-2)
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    // return `${year}-${month}-${day}`
  }, [data.created_at])

  //姓名處理
  const name = data.name
  const nameLength = name.length
  const processedName =
    nameLength <= 1 ? name : name.charAt(0) + '＊' + name.substring(2)

  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <div className="avatar d-none d-sm-block">
        {/* <img src={`http://localhost:3005/avatar/${data.avatar}`} alt="..." /> */}
        {data.avatar ? (
          <img src={`http://localhost:3005/avatar/${data.avatar}`} alt="..." />
        ) : (
          <img src="/images/product/user-img/default.png" alt="..." />
        )}
      </div>
      <div className="content">
        <h6>{processedName + '   ' + formattedDateTime}</h6>
        <Star rating={data.score} setRating={() => {}} />
        <p>{data.comment}</p>
      </div>
    </div>
  )
}
