import express from 'express'
import transporter from '../configs/email.mjs'
import db from '../db.mjs'
import multer from 'multer'
import 'dotenv/config.js'

const router = express.Router()
const update = multer()

/* 寄送email的路由 */
router.post('/send', update.none(), async (req, res, next) => {
  const { userEmail } = req.body
  const [[userData]] = await db.execute(
    'SELECT * FROM `users` WHERE `email` = ?', [userEmail]
  )
  const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  if (userData) {
    // email內容
    const mailOptions = {
      from: `"DiVING"<${process.env.SMTP_TO_EMAIL}>`,
      to: userData.email,
      subject: 'DiVING團隊 - 忘記密碼認證信',
      text: `你好， \r\n以下為你的驗證碼，請妥善保管。\r\n${randomNumber}\r\n\r\nDiVING開發團隊\r\n敬上`,
    }

    // 寄送
    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        // 失敗處理
        return res.status(400).json({ status: 'error', msg: err })
      } else {
        // 成功回覆的json
        return res.json({ status: 'success', data: randomNumber })
      }
    })
  } else {
    return res.status(401).json({ status: 'error', msg: '查無此信箱，請再輸入一次' })
  }
})

export default router
