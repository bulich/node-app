const {Router} = require('express')
const router = Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

router.get('/login', async (req, res) => {
  res.render('login', {
    title: 'Войти',
    isLogin: true,
    error: req.flash('error')
  })
})

router.get('/logout', async (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/auth/login#login')
  })
})

router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body
    const candidate = await User.findOne({email})

    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password)
      if (areSame) {
        req.session.user =  candidate
        req.session.isAuthenticated = true
        req.session.save(err => {
          if (err) throw err
          res.redirect('/')
        })
      } else {
        req.flash('error', 'Неправильный пароль')
        res.redirect('/auth/login')
      }
    } else {
      req.flash('error', 'Пользователь не найден')
      res.redirect('/auth/login')
    }
  } catch (err) {
    console.log(err)
  }
})


router.post('/register', async (req, res) => {
  try {
    const {remail:email, name, rpassword:password, confirm:repeat} = req.body
    const candidate = await User.findOne({email})

    if (candidate) {
      req.flash('error', 'Email занят')
      res.redirect('/auth/login')
    } else {
      const hashPass = await bcrypt.hash(password, 10)
      const user = new User({
        email, name, password: hashPass, cart: {
          items: []
        }
      })
      await user.save()
      res.redirect('/auth/login')
    }
  } catch (err) {
    console.log(err)
  }
})

module.exports = router