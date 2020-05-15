const path = require('path')
const fs = require('fs')
const mongoose = require('mongoose')
const express = require('express')
const exphbs  = require('express-handlebars')
const homeRoutes = require('./routes/home')
const coursesRoutes = require('./routes/courses')
const addRoutes = require('./routes/add')
const cardRoutes = require('./routes/card')
const User = require('./models/user')
const PORT = process.env.PORT || 3000

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


app.use(async (req, res, next) => {
  req.user =  await User.findById('5ebe7c9f2382741bc4ca3c62')
  next()
})
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoutes)
app.use('/courses', coursesRoutes)
app.use('/add', addRoutes)
app.use('/card', cardRoutes)

async function init() {
  await fs.readFile(
    path.join(__dirname, 'db.txt'),
    'utf-8',
    async (err, data) => {
      if (err) throw err
      await mongoose.connect(data, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      })
      const condidate = await User.findOne()
      if (!condidate) {
        const user = new User({
          name: 'Admin',
          email: 'admin@admin.ru',
          cart: {
            items: []
          }
        })
        user.save()
      }
    }
  )  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

init()