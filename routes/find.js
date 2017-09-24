const express = require('express')
const router = express.Router()

const sort = require('../parsing/sort').sort

console.log('\t\tStarting route: /')

const parsers = {
  msu: require('../parsing/msu').parse,
  uom: require('../parsing/uom').parse
}

router.get('/:category', function (req, res, next) {
  let category = req.params.category
  let key = category.toLowerCase()

  let parser = parsers[key]
  if (parser) {
    parser(function (err, results) {
      if (err) { throw err }

      // Blindly sort if they are logged in
      if (req.user) { sort(results, null) }

      res.render('find', {
        user: req.user,
        category: category,
        results: results
      })
    })
  } else {
    next()
  }
})

module.exports = router
