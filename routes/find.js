const express = require('express')
const router = express.Router()

const sort = require('../parsing/sort').sort

console.log('\t\tStarting route: /')

const cache = require('../parsing/caching')
const parsers = {
  msu: require('../parsing/msu').parse,
  uom: require('../parsing/uom').parse
}

router.get('/:category', function (req, res, next) {
  let category = req.params.category
  let date = new Date().toDateString()

  let information = cache.get(category, date)
  if (information) {
    if (req.user) { sort(information, null) }
    res.render('find', {
      user: req.user,
      category: category,
      results: information
    })
  } else {
    let parser = parsers[category.toLowerCase()]
    if (parser) {
      parser(function (err, results) {
        if (err) { throw err }

        // Add it to the cache
        cache.set(category, date, results)

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
  }
})

module.exports = router
