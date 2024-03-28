import express from 'express'
import multer from 'multer'
import db from '../db.mjs'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid';

// middlewares
import checkToken from '../middlewares/checkToken.mjs'

const router = express.Router()

// 引入.env檔
import 'dotenv/config.js'
const secretKey = process.env.SECRET_KEY

const app = express()
const upload = multer()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 登入
router.post('/login', upload.none(), async (req, res) => {
  // 接收client的require
  const { userEmail, userPWD } = req.body
  // 比對db資料
  // 如果比對成功回傳資料，如果失敗則回傳錯誤訊息
  const [[userData]] = await db.execute(
    'SELECT * FROM `users` WHERE `email` = ? AND `password` = ?',
    [userEmail, userPWD]
  )
  if (userData) {
    let token = jwt.sign({
      id: userData.uid,
      userEmail: userData.email,
      userName: userData.name,
      avatar: userData.avatar,
      isGoogle: false,
    }, secretKey, { expiresIn: '1d' })
    res.status(200).json({ status: 'success', msg: '登入成功', token })
  } else {
    res.status(401).json({
      status: "error",
      msg: "帳號或密碼錯誤",
    })
  }
})

// 登出
router.post('/logout', checkToken, (req, res) => {
  let token = req.get("Authorization");
  if (token && token.indexOf("Bearer ") === 0) {
    token = token.slice(7);
  };
  // 如果沒有在名單中，把目前的登出token放入名單中
  // blackList.push(token)
  // 初始化token
  token = jwt.sign({
    id: '',
    userEmail: '',
    userName: '',
    avatar: '',
  }, secretKey, { expiresIn: '-1d' })
  res.status(200).json({
    status: 'success',
    msg: '登出成功',
  })
})

// 常駐登入狀態
router.post('/status', checkToken, async (req, res) => {
  // 可能不止這裡需要解譯過的資料，所以放到checkToken共用
  // 拿解譯過後的token資料過來跟資料庫比對
  const { userEmail, isGoogle } = req.decode
  console.log(req.decode);

  // 之後要把密碼重新編碼後再存入資料庫
  const [[userData]] = await db.execute(
    'SELECT * FROM `users` WHERE `email` = ?',
    [userEmail]
  )

  if (userData && isGoogle) {
    // 重新核發token，前台需重新設置localStorage
    // 目前只有拿這些資料，如果之後需要其他資料就用[password, ..userData]，取出除了密碼以外的資料
    let token = jwt.sign({
      id: userData.uid,
      userEmail: userData.email,
      userName: userData.name,
      avatar: userData.avatar,
      isGoogle: true
    }, secretKey, { expiresIn: '1d' })
    res.status(200).json({
      status: 'success',
      msg: '使用者已登入',
      token
    })
  } else if (userData && !isGoogle) {
    let token = jwt.sign({
      id: userData.uid,
      userEmail: userData.email,
      userName: userData.name,
      avatar: userData.avatar,
      isGoogle: false
    }, secretKey, { expiresIn: '1d' })
    res.status(200).json({
      status: 'success',
      msg: '使用者已登入',
      token
    })
  } else {
    res.status(401).json({
      status: 'error',
      msg: '請重新登入'
    })
  }
})

// 註冊
router.post('/register', upload.none(), async (req, res) => {
  const { userName, userEmail, userPWD } = req.body
  const [[userData]] = await db.execute(
    'SELECT * FROM `users` WHERE `email` = ?',
    [userEmail]
  )
  if (userData) {
    res.status(409).json({
      status: 'error',
      msg: '此帳號已註冊'
    })
    return false
  }

  const uid = uuidv4()
  await db.execute(
    "INSERT INTO `users` (`email`, `password`, `name`, `uid`) VALUES (?, ?, ?, ?);", [userEmail, userPWD, userName, uid]
  )
    .then(() => {
      res.status(200).json({ status: 'success', msg: '註冊成功' })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ status: 'error', msg: '註冊失敗，請再試一次' })
    })
})

// Google登入
router.post('/google-login', async (req, res) => {
  // 接收client的require
  const { displayName, email, photoURL, uid } = req.body
  // 比對db資料
  // 如果比對成功回傳資料，如果失敗則回傳錯誤訊息
  const [[userData]] = await db.execute(
    'SELECT * FROM `users` WHERE `email` = ? AND `uid` = ?',
    [email, uid]
  )
  // 如果有資料則進行登入
  if (userData) {
    let token = jwt.sign({
      id: userData.uid,
      userEmail: userData.email,
      userName: userData.name,
      avatar: userData.avatar,
      isGoogle: true,
    }, secretKey, { expiresIn: '1d' })
    res.status(200).json({ status: 'success', msg: '登入成功', token })
  } else {
    // 如果沒有資料則進行註冊後登入
    await db.execute(
      "INSERT INTO `users` (`name`, `email`, `avatar`, `uid`) VALUES (?, ?, ?, ?);", [displayName, email, photoURL, uid]
    )
      .then(() => {
        let token = jwt.sign({
          id: uid,
          userEmail: email,
          userName: displayName,
          avatar: photoURL,
          isGoogle: true,
        }, secretKey, { expiresIn: '1d' })
        res.status(200).json({ status: 'success', msg: '登入成功', token })
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ status: 'error', msg: '登入失敗，請再試一次' })
      })
  }
})

// Google註冊
// router.post('/google-register', async (req, res) => {
//   const { displayName, email, photoURL, uid } = req.body
//   const [[userData]] = await db.execute(
//     'SELECT * FROM `users` WHERE `google_uid` = ?',
//     [uid]
//   )
//   if (userData) {
//     res.status(409).json({
//       status: 'error',
//       msg: '此帳號已註冊'
//     })
//     return
//   }
//   await db.execute(
//     "INSERT INTO `users` (`name`, `email`, `avatar`, `google_uid`) VALUES (?, ?, ?, ?);", [displayName, email, photoURL, uid]
//   )
//     .then(() => {
//       res.status(200).json({ status: 'success', msg: '註冊成功' })
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({ status: 'error', msg: '註冊失敗，請再試一次' })
//     })
// })

// 讀取profile
router.get('/:id', checkToken, async (req, res) => {
  const uid = req.params.id
  const checkId = req.decode.id

  // 確認授權會員與請求取得的會員資料是否為同一人
  if (checkId !== uid) {
    return res.json({ status: 'error', message: '會員資料存取失敗' })
  }

  const [[userData]] = await db.execute(
    'SELECT * FROM `users` WHERE `uid` = ? ',
    [uid]
  )

  if (userData) {
    res.status(200).json({ status: 'success', userData })
  } else {
    res.status(404).json({ status: 'error', msg: '查無資料' })
  }
})

// 更新profile
router.put('/:id/profile', checkToken, upload.none(), async (req, res) => {
  const uid = req.params.id
  const checkId = req.decode.id
  if (checkId !== uid) {
    return res.status(401).json({ status: 'error', msg: '無法更新會員資料' })
  }
  const { name, birth, email, tel, address, id } = req.body

  // 檢查必填欄位是否有空字串
  if (!id || !name || !email) {
    return res.json({ status: 'error', msg: '缺少必要資料' })
  }

  await db.execute(
    'UPDATE `users` SET `name` = ?,`birth` = ?,`email` = ?,`tel` = ?,`address` = ? WHERE `uid` = ? ',
    [name, birth, email, tel, address, id]
  )
    .then(result => {
      res.status(200).json({ status: 'success', msg: '會員資料更新成功' })
    })
    .catch(err => {
      console.log(err)
      res.status(400).json({ status: 'error', msg: '會員資料更新失敗' })
    })
})

// 更新password
router.put('/:id/password', checkToken, upload.none(), async (req, res) => {
  const uid = req.params.id
  const checkId = req.decode.id
  if (checkId !== uid) {
    return res.status(401).json({ status: 'error', msg: '無法更新會員資料' })
  }
  const { origin, newPWD, id } = req.body
  console.log(req.body);

  // 檢查必填欄位是否有空字串
  if (!id || !newPWD) {
    return res.json({ status: 'error', msg: '缺少必要資料' })
  }

  const [[userData]] = await db.execute(
    'SELECT * FROM users WHERE `uid` = ? AND `password` = ?',
    [id, origin]
  )

  if (userData) {
    await db.execute(
      'UPDATE `users` SET `password` = ? WHERE `uid` = ? AND `password` = ?',
      [newPWD, id, origin]
    )
      .then(result => {
        console.log(result)
        res.status(200).json({ status: 'success', msg: '密碼更新成功，請重新登入' })
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    res.status(400).json({ status: 'error', msg: '舊密碼錯誤，請重新輸入' })
  }
})

// 讀取訂單
router.get('/:id/order', checkToken, async (req, res) => {
  const uid = req.params.id
  const checkId = req.decode.id

  // 確認授權會員與請求取得的會員資料是否為同一人
  if (checkId !== uid) {
    return res.json({ status: 'error', message: '會員資料存取失敗' })
  }


  const [data] = await db.execute(
    'SELECT * FROM `order` WHERE `user_id` = ?',
    [uid]
  )

  const orderData = formatDate(data)
  console.log(orderData);

  if (orderData) {
    res.status(200).json({ status: 'success', orderData })
  } else {
    res.status(404).json({ status: 'error', msg: '查無資料' })
  }
})

// 讀取評論
router.get('/:id/common', checkToken, async (req, res) => {
  const uid = req.params.id
  const checkId = req.decode.id

  // 確認授權會員與請求取得的會員資料是否為同一人
  if (checkId !== uid) {
    return res.json({ status: 'error', message: '會員資料存取失敗' })
  }

  const [userData] = await db.execute(
    'SELECT star.*, CASE WHEN star.lesson_id IS NOT NULL THEN lesson.title ELSE product.name END AS name, CASE WHEN star.lesson_id IS NOT NULL THEN lesson.img ELSE product.img_top END AS img,product.id AS product_id,product.category AS product_category FROM star LEFT JOIN product ON product.id = star.product_id LEFT JOIN lesson ON lesson.id = star.lesson_id WHERE star.user_id = ?', [uid]
  )

  console.log(userData)

  const data = formatDate(userData)

  if (userData) {
    res.status(200).json({ status: 'success', data })
  } else {
    res.status(404).json({ status: 'error', msg: '查無資料' })
  }
})

// 讀取收藏
router.get('/:id/favorite', checkToken, async (req, res) => {
  const uid = req.params.id
  const checkId = req.decode.id

  // 確認授權會員與請求取得的會員資料是否為同一人
  if (checkId !== uid) {
    return res.json({ status: 'error', message: '會員資料存取失敗' })
  }

  const [userData] = await db.execute(
    'SELECT collect.*, CASE WHEN collect.lesson_id IS NOT NULL THEN lesson.title ELSE product.name END AS name, CASE WHEN collect.lesson_id IS NOT NULL THEN lesson.price ELSE product.price END AS price, CASE WHEN collect.lesson_id IS NOT NULL THEN lesson.img ELSE product.img_top END AS img, product.id AS product_id, product.category AS product_category FROM collect LEFT JOIN product ON product.id = collect.product_id LEFT JOIN lesson ON lesson.id = collect.lesson_id WHERE collect.user_id = ? AND state = 1', [uid]
  )

  const data = formatDate(userData)


  if (userData) {
    res.status(200).json({ status: 'success', data })
  } else {
    res.status(404).json({ status: 'error', msg: '查無資料' })
  }
})

// 刪除收藏
router.delete('/:id/delete-fav:pid', checkToken, async (req, res) => {
  const { id, pid } = req.params
  const checkId = req.decode.id

  // 確認授權會員與請求取得的會員資料是否為同一人
  if (checkId !== id) {
    return res.json({ status: 'error', message: '會員資料存取失敗' })
  }

  const [userData] = await db.execute(
    'SELECT * FROM `collect` WHERE `id` = ? AND `user_id` = ?',
    [pid, id]
  )
  if (userData) {
    await db.execute(
      'DELETE FROM `collect` WHERE `id` = ? AND `user_id` = ?', [pid, id]
    )
    res.status(200).json({ status: 'success', msg: '取消收藏成功' })
  } else {
    res.status(400).json({ status: 'success', msg: '取消收藏失敗' })
  }
})

// 重置時間的格式
function formatDate(data) {
  const formatData = []
  data.forEach((item) => {
    console.log(item.created_at);
    const formatDate = moment(item.created_at).format("YYYY-MM-DD HH:mm:ss")
    console.log(formatDate);
    const formatItem = { ...item, created_at: formatDate }
    formatData.push(formatItem)
  })
  return formatData
}

export default router
