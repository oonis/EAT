const express = require('express')
const router = express.Router()

console.log('\t\tStarting route: /prefs')

router.get('/', function (req, res, next) {
  res.render('preferences', {
    user: req.user
  })
})

module.exports = router
