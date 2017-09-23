var request = require('request')
var cheerio = require('cheerio')
const Scraper = require('./scraper')

const process = function (cb) {
  var postURL = 'https://eatatstate.msu.edu'

  const request_data = {
      uri: postURL,
      agentOptions: {
        rejectUnauthorized: false
      }
    }

  request(request_data, function (error, response, body) {
    if (error) { cb(error, null); return }

    var allHalls = [] // Each hall is a url

    // Propegate list. This is synchronous.
    var $ = cheerio.load(body)
    $('.dining-menu-name').each(function (i, elem) {
      var currentHallUrl = $(this).find('a').attr('href')
      if (currentHallUrl.indexOf('/menu/') !== 0) {
        // MSU makes it so if it isn't a hall it doesn't have /menu/
        return true // Not a hall so we don't care
      }
      var hallURL = postURL + currentHallUrl
      allHalls.push(hallURL)
    })

    // We need to run processHall(url) on each url, then return cb!

    cb(null, )
  })

}

function processHall (url) {

}

module.exports = {
  parse: process
}
