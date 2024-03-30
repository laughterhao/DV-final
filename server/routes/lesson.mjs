import express from 'express'
import multer from 'multer'
import db from '../db.mjs'

const router = express.Router()

// 引入.env檔
import 'dotenv/config.js'
const secretKey = process.env.SECRET_KEY

const app = express()
const upload = multer()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// get list
router.get('/getlist', async function (req, res, next) {
  try {
    let [lesson] = await db.execute('SELECT * FROM `lesson`')
    res.json(lesson)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// get id
router.get('/getlist/:id', async function (req, res, next) {
  try{
    const lid = req.params.id
    let [lesson] = await db.execute('SELECT * FROM `lesson` WHERE id = ?', [lid])
    res.json(lesson)
  }catch (error){
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

//get star
router.get('/getstar/:id', async function (req, res, next) {
  try{
    const Sid = req.params.id
    let [star] = await db.execute('SELECT star.id, star.score ,star.comment ,users.name FROM star JOIN users ON star.user_id = users.uid WHERE lesson_id = ? ', [Sid])
    res.json(star)
  }catch (error){
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/fav/:id', async function (req, res, next) {
  try {    
    const userState = req.query.userState
    const id = req.params.id
    const [result] = await db.execute('SELECT * FROM `collect` WHERE user_id=? AND lesson_id =?',[userState, id])
    res.json( result )
  } catch (err) {
    console.error('Error executing query', err.stack)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/upFav/:id', async function (req, res, next) {
  try{
    const Sid = req.params.id
    const userState = req.body.userState.toString()
    const fav = req.body.fav
    console.log(fav)
    let [chfav] = await db.execute('UPDATE collect SET state = ? WHERE user_id = ? AND lesson_id = ?', [fav,userState, Sid ])
    res.json(chfav)
  }catch (error){
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})


// change fav
router.post('/postfav/:id', async function (req, res, next) {
  try{
    const Sid = req.params.id
    const userState = req.body.userState.toString()
    let [chfav] = await db.execute('INSERT into collect (user_id, lesson_id, state) VALUES (?, ?, 1)', [userState, Sid,])
    res.json(chfav)
  }catch (error){
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

//get preoder_date
router.post('/orderdate', async function (req, res, next) {
    try {
      const lesson_id = req.body.id
      let [date] = await db.execute(
        "SELECT preorder_date, MAX(CASE WHEN preorder_time LIKE '%AM%' THEN 1 ELSE 0 END) as AM, MAX(CASE WHEN preorder_time LIKE '%PM%' THEN 1 ELSE 0 END) as PM FROM order_time WHERE lesson_id = ? GROUP BY preorder_date",
        [lesson_id],
      )
      res.json(date)
    } catch (err) {
      console.error(err)
      res.status(500).send('Server error')
    }
})

router.post('/order-time', async function (req, res, next) {
  const { lesson_id, order_time, timedetail } = req.body
  try {
    const result = await db.execute(
      'INSERT INTO order_time (lesson_id, preorder_date, preorder_time) VALUES (?, ?, ?)',
      [parseInt(lesson_id), order_time, timedetail],
    )
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/time', async function (req, res, next) {
  try {
    const result = await db.execute(
      "SELECT preorder_date,CASE WHEN SUM(preorder_time LIKE '%AM%') = 0 THEN 'AM' ELSE NULL END AS AM,CASE WHEN SUM(preorder_time LIKE '%PM%') = 0 THEN 'PM' ELSE NULL END AS PM FROM order_time GROUP BY preorder_date",
      // [parseInt(lesson_id), order_time, time],
    )
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})
export default router
