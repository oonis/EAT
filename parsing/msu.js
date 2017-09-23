var request = require('request')
var cheerio = require('cheerio')
const Scraper = require('./scraper')

const process = function (cb) {
  var postURL = 'https://eatatstate.msu.edu'

  request({
    uri: postURL,
    agentOptions: {
      rejectUnauthorized: false
    }
  }, function (error, response, body) {
    if (error) { throw error }
    var $ = cheerio.load(body)
    var allHalls = []
    $('.dining-menu-name').each(function (i, elem) {
      var currentHallUrl = $(this).find('a').attr('href')
      if (currentHallUrl.indexOf('/menu/') !== 0) {
        // MSU makes it so if it isn't a hall it doesn't have /menu/
        return true // Not a hall so we don't care
      }
      var hallURL = postURL + currentHallUrl
      allHalls.push(hallURL)
    })
    var scrape = new Scraper(allHalls)
    scrape.scrapeSites().then(console.log).catch(
      function (err) {
        throw err
      }
    )
  })
}
function processHall (url) {

}

module.exports = {
  parse: process
}
