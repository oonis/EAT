var request = require('request')
var cheerio = require('cheerio')
const processPage = function (postURL, callback) {
  request({
    uri: postURL,
    agentOptions: {
      rejectUnauthorized: false
    }
  }, function (error, response, body) {
    if (error) { throw error }
    var $ = cheerio.load(body)
    var vals = $('.meal-title').map(function (i, el) {
                // this === el
      return $(this).text() + '\n'
    }).get().join(' ')
    callback(vals)
  })
}

module.exports = {
  processPage: processPage
}
