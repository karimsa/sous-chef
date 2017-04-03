require('babel-register')

const fs = require('fs')
const dir = require('path').resolve(__dirname, 'sample-img', 'meals')
const { close } = require('../query')
const Meal = require('../../meal')
const uid = 3

let target = 0
let completed = 0

fs.readdir(dir, (err, files) => {
  if (err) throw err
  else {
    target = files.length

    ;(async function () {
      for (let file of files) {
        let item = file.substr(0, file.length - 4)

        await Meal.updatePhoto(
          item,
          fs.readFileSync(dir + '/' + file, 'base64')
        )

        console.log('Uploaded %s.', file.substr(0, file.length - 4))
      }
    }())
      .then(() => process.exit(0))
      .catch(err => console.log(err.stack || err.message || err))
  }
})