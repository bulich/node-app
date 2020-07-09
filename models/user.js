const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          defualt: 1
        },
        courseId: {
          type: Schema.Types.ObjectId,
          ref: 'Course',
          required: true
        }
      }
    ] 
  }
})

UserSchema.methods.addToCart = function(courseId) {
  const items = [...this.cart.items]
  const index = items.findIndex(c => c.courseId.toString() == courseId)
  if (index >= 0) {
    items[index].count++
  } else {
    items.push({
      courseId: courseId,
      count: 1
    })
  }
  this.cart = {items}
  return this.save()
}

UserSchema.methods.removeFromCart = function(id) {
  let items = [...this.cart.items]
  const index = items.findIndex(c => c.courseId.toString() == id)
    if (items[index].count > 1) {
      items[index].count--
    } else {
     items =  items.filter(c => c.courseId.toString() != id)
    }
  this.cart = {items}
  return this.save()
}

UserSchema.methods.clearCart = function() {
  this.cart = {items: []}
  return this.save()
}

module.exports = model('User', UserSchema)