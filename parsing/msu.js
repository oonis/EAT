const request = require('request')
const cheerio = require('cheerio')
const paternal = require('node-paternal')
var Item = require('../models/item')

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
    let results = {
      breakfast: {},
      lunch: {},
      dinner: {},
      lateNight: {}
    }

    // STEP 1: Get all of the halls
    let $ = cheerio.load(body)
    $('.dining-menu-name').each(function (i, elem) {
      var currentHallUrl = $(this).find('a').attr('href')
      if (currentHallUrl.indexOf('/menu/') !== 0) {
        return true // Not a hall so we don't care
      }
      let hallURL = postURL + currentHallUrl
      functions.push(function (callback) {
        var hallParams = {
          uri: hallURL,
          agentOptions: {
            rejectUnauthorized: false
          }
        }
        request(hallParams, function (errors, responses, bodys) {
          // STEP 2: Get all meals for this hall
          var thing = cheerio.load(bodys)
          thing('.meal-course > .field-content > .columns').each(function (e, element) {
            var itemHTML = thing(this).html()
            firstClose = itemHTML.indexOf('>')
            firstOpen = itemHTML.indexOf('<',firstClose)
            var itemName = itemHTML.substring(firstOpen+1,firstClose)
            var item = new Item(itemName)
            // This is awful, but I'm tired of this
            if(itemHTML.toLowerCase.indexOf('vegetarian') !== -1) {
              item.options.push('vegetarian')
            }
            if(itemHTML.toLowerCase.indexOf('vegan') !== -1) {
              item.options.push('vegan')
            }
            if(itemHTML.toLowerCase.indexOf('msu beef') !== -1) {
              item.options.push('beef')
            }
            if(itemHTML.toLowerCase.indexOf('msu pork') !== -1) {
              item.options.push('pork')
            }
            results.push(item) 
          })
          callback()
        })
      })
    })

    // We need to run processHall(url) on each url, then return cb!
    paternal.seriesPattern(
      functions,
      function () {
        console.log(results)
        cb(null, results)
      })
  })
}

module.exports = {
  parse: process
}
