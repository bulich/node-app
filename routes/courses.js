const {Router} = require('express')
const router = Router()
const Course = require('../models/course')

router.get('/', async (req, res) => {
  const courses = await Course.find().lean()
  res.render('courses', {
    title: 'Курсы',
    isCourses: true,
    courses
  })
})

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id).populate('userId', 'name email').lean()
  res.render('course', {
    title: 'Курс ' + course.title,
    isCourses: true,
    course,

  })
})

router.post('/edit/', async (req, res) => {
  const {id} = req.body
  delete req.body.id
  await Course.findByIdAndUpdate(id, req.body)
  res.redirect('/courses')
})

router.get('/edit/:id', async (req, res) => {
  if (!req.query.allow) return res.redirect('/')
  const course = await Course.findById(req.params.id).lean()
  res.render('course-edit', {
    title: 'Курс ' + course.title,
    isCourses: true,
    course
  })
})

router.post('/remove/', async (req, res) => {
  await Course.deleteOne({_id: req.body.id})
  res.redirect('/courses')
})


module.exports = router