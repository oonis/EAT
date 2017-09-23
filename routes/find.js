const express = require('express')
const router = express.Router()

const msuParse = require('../parsing/msu').parse

console.log('\t\tStarting route: /')

router.get('/:category', function (req, res, next) {
  msuParse(function (err, results) {
    if (err) { throw err }
    res.render('find', {
      user: req.user,
      category: req.params.category,
      results: results
    })
  })
})

module.exports = router
