import express from 'express'
import multer from 'multer'
import db from '../db.mjs'

// middlewares
import checkToken from '../middlewares/checkToken.mjs'

const router = express.Router()


const app = express()
const upload = multer()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



router.put('/', upload.none(), async (req, res) => {
  const { password, email } = req.body

  await db.execute(
    'UPDATE `users` SET `password` = ? WHERE `email` = ?',
    [password, email]
  )
    .then(result => {
      console.log(result)
      res.status(200).json({ status: 'success', msg: '密碼更新成功，請重新登入' })
    })
    .catch(err => {
      console.log(err)
      res.status(400).json({ status: 'error', msg: '查無使用者，會員資料更新失敗' })
    })
})

export default router
