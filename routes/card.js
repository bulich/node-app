const {Router} = require('express')
const router = Router()
const Card = require('../models/card')

router.get('/', async (req, res) => {
  const card = await Card.fetch()
  res.render('card', {
    title: 'Корзина',
    isCard: true,
    card
  })
})

router.post('/add', async (req, res) => {
  const card = await Card.add(req.body.id)
  res.redirect('/card')
})

router.delete('/remove/:id', async (req, res) => {
  const card = await Card.remove(req.params.id)
  res.json(card)
})


module.exports = router