var request = require('request')
var cheerio = require('cheerio')

const process = function () {
  var postURL = 'https://eatatstate.msu.edu'

  request({
    uri: postURL,
    agentOptions: {
      rejectUnauthorized: false
    }
  }, function (error, response, body) {
    if (error) { throw error }
    var $ = cheerio.load(body)

    $('.dining-menu-name').each(function (i, elem) {
      var currentHallUrl = $(this).find('a').attr('href')
      if (currentHallUrl.indexOf('/menu/') !== 0) {
        // MSU makes it so if it isn't a hall it doesn't have /menu/
        return true // Not a hall so we don't care
      }
      // var hallURL = postURL + currentHallUrl
    })
  })
}

module.exports = {
  parse: process
}
