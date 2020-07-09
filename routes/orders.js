const {Router} = require('express')
const router = Router()
const Order = require('../models/orders')
const auth = require('../middleware/auth.js')

router.get('/', auth, async (req, res) => {
  const order = await Order.find({
    'user.userId': req.user._id
  }).populate('user.userId')
  res.render('orders', {
    title: 'Заказы',
    isOrders: true,
    orders: order.map(o => {
      return {
        ...o._doc,
      }
    })
  })
})

router.post('/', auth, async (req, res) => {
  const user = await req.user
    .populate('cart.items.courseId')
    .execPopulate()

  const courses = user.cart.items.map(i => ({
    count: i.count,
    course: {...i.courseId._doc}
  }))

  const order = new Order({
    user: {
      name: req.user.name,
      userId: req.user
    },
    courses: courses
  })

  await order.save()
  await req.user.clearCart();

  res.redirect('/orders')

})


module.exports = router