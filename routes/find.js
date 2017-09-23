const express = require('express')
const router = express.Router()

const msu-parse = require('../parsing/msu').process

console.log('\t\tStarting route: /')

router.get('/:category', function (req, res, next) {

  msu.parse(function(err, result) {
    if (err) { throw err; }
    res.render('find', {
      user: req.user,
      category: req.params.category,
      results: results
    })
  })
})

module.exports = router
