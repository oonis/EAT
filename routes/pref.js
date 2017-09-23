const express = require('express')
const router = express.Router()

console.log('\t\tStarting route: /')

router.get('/', function (req, res, next) {
  res.render('homepage', {
    user: req.user
  })
})

module.exports = router
