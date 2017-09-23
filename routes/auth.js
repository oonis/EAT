const express = require('express')
const passport = require('passport')
const router = express.Router()

/**
 * Redirect from login to our current only login service. Later this will be a
 *  page with multiple options.
 */
router.get('/login', function (req, res) { res.redirect('/auth/google') })

/**
 * Google login service.
 */
router.get('/google',
  function (req, res, next) {
    if (req.query.return) {
      req.session.oauth2return = req.query.return
    }
    next()
  },
  passport.authenticate(
    'google',
    {scope: ['email', 'profile']}
  )
)

/**
 * Google login callback.
 */
router.get('/google/callback',
  passport.authenticate('google'),
  function (req, res) {
    let tmp = req.session.oauth2return
    delete req.session.oauth2return
    res.redirect(tmp || '/')
  }
)

/**
 * Logout.
 */
router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

module.exports = router
