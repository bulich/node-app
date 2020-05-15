const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
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

module.exports = model('User', UserSchema)