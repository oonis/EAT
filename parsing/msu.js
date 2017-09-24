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
    let results = {}

    // STEP 1: Get all of the halls
    let $ = cheerio.load(body)
    $('.dining-menu-name').each(function (i, elem) {
      let currentHallUrl = $(this).find('a').attr('href')
      if (currentHallUrl.indexOf('/menu/') !== 0) {
        return true // Not a hall so we don't care
      }

      let hallURL = postURL + currentHallUrl
      const timeKeys = {
        'Breakfast': 192,
        'Lunch': 190,
        'Dinner': 191,
        'Latenight': 232
      }

      for (let key in timeKeys) {
        results[key] = {}
        let finalURL = hallURL + '?field_mealtime_target_id=' + timeKeys[key]
        functions.push(function (callback) {
          let hallParams = {
            uri: finalURL,
            agentOptions: {
              rejectUnauthorized: false
            }
          }
          request(hallParams, function (errors, responses, bodys) {
            // STEP 2: Get all meals for this hall
            let itemsAtHall = {}
            let thing = cheerio.load(bodys)
            thing('.meal-course > .field-content > .columns').each(function (e, element) {
              let itemHTML = thing(this).html()
              let firstClose = itemHTML.indexOf('>')
              let firstOpen = itemHTML.indexOf('<', firstClose)
              let itemName = itemHTML.substring(firstOpen, firstClose+1)

              // Awful, quick, fix to ignore this
              if(itemName.indexOf('Contains:')!== -1) {
                return true
              }

              // Awful fix to ignore this weird bug
              if(itemName.trim().length == 0) {
                return true
              }

              let itemTags = []

              if (itemHTML.toLowerCase().indexOf('vegan') !== -1) { 
                itemTags.push('vegan') 
              } else if (itemHTML.toLowerCase().indexOf('vegetarian') !== -1) {
                 itemTags.push('vegetarian') 
              }
              if (itemHTML.toLowerCase().indexOf('msu beef') !== -1) { itemTags.push('beef') }
              if (itemHTML.toLowerCase().indexOf('msu pork') !== -1) { itemTags.push('pork') }

              itemsAtHall[itemName] = itemTags
            })
            let hallName = thing('#block-eatatstate-page-title > .rhs-block-content').text().trim()
            console.log('Finished fetching ' + key + ' for ' + hallName)
            results[key][hallName] = itemsAtHall
            callback()
          })
        })
      }
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
