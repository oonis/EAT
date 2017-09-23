var request = require('request')
var rp = require('request-promise')

class Scraper {
  constructor (sites) {
    this.pages = sites
  }

  scrapeSites () {
    return Promise.all(this.pages.map(this.scrapeUrl.bind(this)))
  }

  scrapeUrl (url) {
    return rp(url)
        .then(function (body) {
          return body
        })
        .catch(function (err) {
          throw err
        })
  }
}

module.exports = Scraper
