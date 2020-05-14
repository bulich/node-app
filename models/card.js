const path = require('path')
const fs = require('fs')
const Courses = require('./course')

const dirname = path.join(__dirname, "..", "data", "card.json")

class Card {
  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        dirname,
        'utf-8',
        (err, data) => {
          if (err) reject(err)
          resolve(JSON.parse(data))
        }
      )
    })
  }
  static async add(id) {
    let courses = await Card.fetch()
    const condidate = courses.courses.findIndex(item => item.id == id)
    if (~condidate) {
      courses.courses[condidate].count++
    } else {
      courses.courses.push({
        id,
        count: 1
      })
    }
    const course = await Courses.getById(id) 
    courses.price += +course.price
    return new Promise((resolve, reject) => {
      fs.writeFile(
        dirname,
        JSON.stringify(courses),
        (err, data) => {
          if (err) reject(err)
          resolve()
        }
      )
    })
  }
  static async remove(id) {
    let courses = await Card.fetch()
    const condidate = courses.courses.findIndex(item => item.id == id)
    if (courses.courses[condidate].count === 1) {
      courses.courses = courses.courses.filter(item => item.id != id)
    } else {
      courses.courses[condidate].count -= 1
    }
    const course = await Courses.getById(id) 
    courses.price -= +course.price
    return new Promise((resolve, reject) => {
      fs.writeFile(
        dirname,
        JSON.stringify(courses),
        (err, data) => {
          if (err) reject(err)
          resolve(courses)
        }
      )
    })
  }
}

module.exports = Card