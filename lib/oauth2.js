'use strict'

const express = require('express')

const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy

function extractProfile (profile) {
  let imageUrl = ''
  if (profile.photos && profile.photos.length) {
    imageUrl = profile.photos[0].value
  }
  return {
    id: profile.id,
    displayName: profile.displayName,
    image: imageUrl
  }
}

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
  accessType: 'offline'
}, (accessToken, refreshToken, profile, cb) => {
  cb(null, extractProfile(profile))
}))

passport.serializeUser((user, cb) => {
  cb(null, user)
})
passport.deserializeUser((obj, cb) => {
  cb(null, obj)
})

const router = express.Router()

function authRequired (req, res, next) {
  if (!req.user) {
    req.session.oauth2return = req.originalUrl
    return res.redirect('/auth/login')
  }
  next()
}

function addTemplateVariables (req, res, next) {
  res.locals.profile = req.user
  res.locals.login = `/auth/login?return=${encodeURIComponent(req.originalUrl)}`
  res.locals.logout = `/auth/logout?return=${encodeURIComponent(req.originalUrl)}`
  next()
}

router.get(
  '/auth/login',

  (req, res, next) => {
    if (req.query.return) {
      req.session.oauth2return = req.query.return
    }
    next()
  },

  passport.authenticate('google', { scope: ['email', 'profile'] })
)

router.get(
  '/auth/google/callback',

  passport.authenticate('google'),

  (req, res) => {
    const redirect = req.session.oauth2return || '/'
    delete req.session.oauth2return
    res.redirect(redirect)
  }
)

router.get('/auth/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = {
  extractProfile: extractProfile,
  router: router,
  required: authRequired,
  template: addTemplateVariables
}
