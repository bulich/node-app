const path = require('path')
const fs = require('fs')
const mongoose = require('mongoose')
const express = require('express')
const exphbs  = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const MongoStore = require('connect-mongodb-session')(session)
const homeRoutes = require('./routes/home')
const coursesRoutes = require('./routes/courses')
const addRoutes = require('./routes/add')
const cardRoutes = require('./routes/card')
const ordersRoutes = require('./routes/orders')
const authsRoutes = require('./routes/auth')
const PORT = process.env.PORT || 3000
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const util = require('util');
const { get } = require('http')
const readFile = util.promisify(fs.readFile);
const DB = "mongodb+srv://bulat:sPO9YGL7ut1l8uAG@cluster0-ehqcv.mongodb.net/shop";

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

const store = new MongoStore({
  collection: 'sessions',
  uri: DB
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: store
}))
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)
app.use('/', homeRoutes)
app.use('/courses', coursesRoutes)
app.use('/add', addRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authsRoutes)

async function init() {
  await mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

init()