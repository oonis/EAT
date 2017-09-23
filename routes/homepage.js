const express = require('express')
const router = express.Router()

console.log('\t\tStarting route: /')

router.get('/', function (req, res, next) {
  res.render('homepage', {
    user: req.user
  })
})

router.get('/about', function (req, res, next) {
  res.render('about', {
    user: req.user
  })
})

router.get('/privacy', function (req, res, next) {
  res.render('privacy', {
    user: req.user
  })
})

module.exports = router
