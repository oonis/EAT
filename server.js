const express = require('express')
const path = require('path')
const app = express()

console.log('Launching server...')

// Configure environment
console.log('\tConfiguring environment...')
require('dotenv').config()
const port = process.env.PORT || 5000

// Static files
console.log('\tStatic files...')
app.use(express.static(path.join(__dirname, 'assets')))

// Configure bodyparser
console.log('\tConfiguring modules...')
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Configure view engine
console.log('\tConfiguring view engine...')
app.set('view engine', 'ejs')

// Sessions && Credentials
console.log('\tConfiguring sessions/credentials')
app.use(require('express-session')({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  signed: true
}))

const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy
passport.use(
    new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
      passReqToCallback: true
    }, function (req, accessToken, refreshToken, profile, cb) {
      let id = 'google_' + profile.id
      cb(null, {
        name: profile.name.givenName,
        id: id
      })
    })
)

// Basic user serialization
passport.serializeUser(function (user, cb) {
  cb(null, user)
})
passport.deserializeUser(function (obj, cb) {
  cb(null, obj)
})
app.use(passport.initialize())
app.use(passport.session())

var scheduler = require('node-schedule')

scheduler.scheduleJob('* * 1 * * *', function () {
  // Every hour lets go through and redo all of the menu's
  // Make it start of the day in the future
})

// Routes
console.log('\tConfiguring views/routes...')
app.set('views', path.resolve(__dirname, 'views'))

app.use('/auth', require('./routes/auth'))
app.use('/find', require('./routes/find'))
app.use('/pref', require('./routes/pref'))
app.use('/', require('./routes/homepage'))

// Handle 404
console.log('\tHandling 404')
app.use(function (req, res, next) {
  let err = new Error('Not found')
  err.status = 404
  next(err)
})

// Handle exceptions
console.log('\tHandling exceptions')
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    status: err.status || 500,
    error: err
  })
})

// Handle SIGINT
process.on('SIGINT', function () {
  process.exit()
})

// Start server
console.log('\tStarting!')
app.listen(port)

module.exports = app
