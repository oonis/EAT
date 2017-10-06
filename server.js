const express = require('express')
const path = require('path')
const app = express()
const passport = require('passport')

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

// OAuth
app.use(passport.initialize())
app.use(passport.session())
app.use(require('./lib/oauth2').router)

// Routes
console.log('\tConfiguring views/routes...')
app.set('views', path.resolve(__dirname, 'views'))

app.use('/find', require('./routes/find'))
app.use('/pref', require('./routes/pref'))
app.use('/', require('./routes/homepage'))

// Handle 404
app.use(function (req, res, next) {
  let err = new Error('Not found')
  err.status = 404
  next(err)
})

// Handle exceptions
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

console.log('\tServer Started!')
app.listen(port)

module.exports = app
