const express = require('express')
const path = require('path')
const app = express()

console.log('Launching server...')

// Configure environment
console.log('\tConfiguring environment...')
require('dotenv').config()
const port = process.env.PORT || 5000
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
      callbackURL: 'http://127.0.0.1:5000/auth/google/callback',
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

// Routes
console.log('\tConfiguring views/routes...')
app.set('views', path.resolve(__dirname, 'views'))

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

// Database
let database = require('mongodb').MongoClient
database.connect('mongodb://'+process.env.DB_USER+':'+process.env.DB_PASSWORD+'@ds159497.mlab.com:59497/eat')
app.set('db', database)

// Close database on exit
process.on('exit', function () {
  console.log('Closing db')
  // CLOSE DATABASE
})

// Start server
console.log('\tStarting!')
app.listen(port)