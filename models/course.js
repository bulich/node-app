const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

class Course {
  constructor(title, price, img) {
    this.id = uuidv4()
    this.title = title,
    this.price = price,
    this.img = img
  }

  getCourse() {
    return {
      id: this.id,
      title: this.title,
      price: this.price,
      img: this.img
    }
  }

  save() {
    Course.getAll().then((data) => {
      let courses = data
      courses = [...courses, this.getCourse()]
      return new Promise((resolve, reject) => {
        fs.writeFile(
          path.join(__dirname, "..", "data", "courses.json"),
          JSON.stringify(courses),
          err => {
            if (err) reject(err)
            resolve()
          }
        )
      })
    })    
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, "..", "data", "courses.json"),
        'utf-8',
        (err, content) => {
          if (err) reject(err)
          resolve(JSON.parse(content))
        }
      )
    })
  }

  static async getById(id) {
    let courses = await Course.getAll()
    return courses.find(item => item.id == id)
  }

  static async update(course) {
    let courses = await Course.getAll()
    let index = courses.findIndex(item => item.id == course.id)
    courses[index] = course
    fs.writeFile(
      path.join(__dirname, "..", "data", "courses.json"),
      JSON.stringify(courses),
      err => {
        if (err) reject(err)
      }
    )
  }
}

module.exports = Course