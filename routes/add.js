const {Router} = require('express')
const router = Router()
const Course = require('../models/course')
const auth = require('../middleware/auth.js')

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Добавить новый курс',
    isAdd: true
  })
})

router.post('/', auth, async (req, res) => {
  
  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    userId: req.user._id
  })
  try {
    await course.save()
    res.redirect('/courses')
  } catch (err) {
    console.error(err)
  }
})

module.exports = router