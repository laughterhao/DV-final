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
  (async () => {
    let [lesson] = await db
      .execute('SELECT * FROM `lesson`')
      .catch(() => [undefined])
    res.json(lesson)
  })()
})

// get id
router.get('/getlist/:id',async function (req, res, next) {
  (async () => {
    const lid = req.params.id
    let [lesson] = await db
      .execute('SELECT * FROM `lesson` WHERE id = ?', [lid])
      .catch((err) => {
        console.error(err)
        return [undefined]
      })
    res.json(lesson)
  })()
})

//get star

router.get('/getstar/:id', async function (req, res, next) {
  (async () => {
    const Sid = req.params.id
    let [star] = await db
      .execute(
        'SELECT id,score ,comment FROM star WHERE lesson_id = ? ',
        [Sid],
      )
      .catch((err) => {
        console.error(err)
        return [undefined]
      })
    res.json(star)
  })()
})

router.post('/fav/:id', async (req, res) => {
  const newFav = req.body.fav
  const id = req.params.id
  try {
    // 使用 SQL 語法來更新資料庫中的狀態
    const result = await db.execute(
      'UPDATE collect SET state = ? WHERE lesson_id = ?',
      [newFav, id],
    )
    res.json({ state: newFav })
  } catch (err) {
    console.error('Error executing query', err.stack)
    res.status(500).json({ error: 'Internal server error' })
  }
  // console.log(newFav)
})

// get fav
router.post('/getfav/:id',async function (req, res, next) {
    (async () => {
        const Sid = req.params.id
        const userState = req.query.userState
        let [star] = await db
        .execute('INSERT INTO collect (user_id, lesson_id, state) VALUES (?, ?, 1);', [userState, Sid])
        .catch((err) => {
            console.error(err)
            return [undefined]
        })
        if (star && star.length > 0) {
            const newFavState = star[0];
            if (newFavState) {
                console.log(newFavState.state)
                res.json(newFavState.state)
            } else {
                res.json(null)
            }
        } else {
            res.json(null)
        }
    })();
});

//get preoder_date
router.post('/orderdate', async function (req, res, next) {
  (async () => { 
    try {
      const lesson_id = req.body.id
      console.log(req.body.id)
      let [date] = await db.execute("SELECT preorder_date, MAX(CASE WHEN preorder_time LIKE '%AM%' THEN 1 ELSE 0 END) as AM, MAX(CASE WHEN preorder_time LIKE '%PM%' THEN 1 ELSE 0 END) as PM FROM order_time WHERE lesson_id = ? GROUP BY preorder_date",[lesson_id])
      res.json(date)
    } catch (err) {
      console.error(err)
      res.status(500).send('Server error')
    }
  })()
});

router.post("/order-time", async function (req, res, next) {
  const { lesson_id, order_time,timedetail } = req.body;
  try {
    const result = await db.execute(
      'INSERT INTO order_time (lesson_id, preorder_date, preorder_time) VALUES (?, ?, ?)',
      [parseInt(lesson_id), order_time, timedetail],
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get("/time", async function (req, res, next) {
  // const { lesson_id, order_time,time } = req.body;
  try {
    const result = await db.execute(
      "SELECT preorder_date,CASE WHEN SUM(preorder_time LIKE '%AM%') = 0 THEN 'AM' ELSE NULL END AS AM,CASE WHEN SUM(preorder_time LIKE '%PM%') = 0 THEN 'PM' ELSE NULL END AS PM FROM order_time GROUP BY preorder_date",
      // [parseInt(lesson_id), order_time, time],
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export default router
