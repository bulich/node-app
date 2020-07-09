const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth.js')

router.get('/', auth, async (req, res) => {
  const card = await req.user.populate('cart.items.courseId').execPopulate()
  res.render('card', {
    title: 'Корзина',
    isCard: true,
    card: mappedCard(card.cart.items),
    price: computeCardPrice(card.cart.items)
  })
})

router.post('/add', auth, async (req, res) => {
await req.user.addToCart(req.body.id)
res.redirect('/card')
})

router.delete('/remove/:id', auth, async (req, res) => {
  await req.user.removeFromCart(req.params.id)
  res.redirect('/card#')
})

function computeCardPrice(cart) {
  return cart.reduce((total, item) => {
    return total += item.courseId.price * item.count
  }, 0)
}

function mappedCard(cart) {
  return cart.map((item) => ({
    id: item.courseId._id,
    price: item.courseId.price,
    title: item.courseId.title,
    count: item.count
  }))
}

module.exports = router