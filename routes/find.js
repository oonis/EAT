const express = require('express')
const router = express.Router()

console.log('\t\tStarting route: /')

router.get('/:category', function (req, res, next) {
  res.render('find', {
    user: req.user,
    category: req.params.category
  })
})

module.exports = router
