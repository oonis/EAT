const request = require('request')
const cheerio = require('cheerio')
const paternal = require('node-paternal')

const process = function (cb) {
  const postURL = 'https://eatatstate.msu.edu'
  const requestData = {
    uri: postURL,
    agentOptions: {
      rejectUnauthorized: false
    }
  }
  console.log(requestData)

  request(requestData, function (error, response, body) {
    if (error) { cb(error, null); return }

    let functions = []
    let results = []

    // Propegate list. This is synchronous.
    let $ = cheerio.load(body)
    $('.dining-menu-name').each(function (i, elem) {
      var currentHallUrl = $(this).find('a').attr('href')
      if (currentHallUrl.indexOf('/menu/') !== 0) {
        // MSU makes it so if it isn't a hall it doesn't have /menu/
        return true // Not a hall so we don't care
      }
      let hallURL = postURL + currentHallUrl
      functions.push(function(callback) {

        // DO THE ACTUAL THING
        setTimeout(function() {
          results.push(hallURL)
          callback() // You need to call this when you're done so it does the next thing.
        }, 50)

      })
    })

    // We need to run processHall(url) on each url, then return cb!
    paternal.seriesPattern(
      functions,
      function() {
        console.log(results)
        cb(null, results)
      })
    })
}

/*
function processHall (url) {
  return function (data) {
    var d = Q.defer()
    // Do the shit with the hall
    d.resolve(['haha, there\'s nothing!'])
    return d.promise()
  }
}
*/

module.exports = {
  parse: process
}
