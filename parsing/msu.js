const request = require('request')
const cheerio = require('cheerio')
const paternal = require('node-paternal')

const process = function (cb) {
  console.log('Grabbing MSU menu')
  const postURL = 'https://eatatstate.msu.edu'
  const requestData = {
    uri: postURL,
    agentOptions: {
      rejectUnauthorized: false
    }
  }

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

      for (let timeSlot in timeKeys) {
        results[timeSlot] = []
        let finalURL = hallURL + '?field_mealtime_target_id=' + timeKeys[timeSlot]
        functions.push(function (callback) {
          let hallParams = {
            uri: finalURL,
            agentOptions: {
              rejectUnauthorized: false
            }
          }
          request(hallParams, function (errors, responses, bodys) {
            // STEP 2: Get all meals for this hall
            let itemsAtHall = []
            let thing = cheerio.load(bodys)
            thing('.meal-course > .field-content > .columns').each(function (e, element) {
              let innerText = thing(this).text()

              if (innerText.indexOf('Contains:') !== -1) {
                return true
              }

              let brokenText = innerText.trim().split('\n')
              let itemName = ''
              let cases = null
              let itemTags = []
              if (brokenText.length === 2) {
                itemName = brokenText[0]
                cases = brokenText[1].split(',')
                for (let i in cases) {
                  itemTags.push(cases[i].trim())
                }
              } else if (brokenText.length === 1 && brokenText[0] !== '') {
                // We have no special tags to insert
                itemName = brokenText[0]
              } else {
                return true
              }

              // Awful fix to ignore this weird bug
              if (itemName.trim().length === 0) {
                return true
              }

              itemsAtHall.push({name: itemName, tags: itemTags})
            })
            if (itemsAtHall.length !== 0) {
              let hallName = thing('#block-eatatstate-page-title > .rhs-block-content').text().trim()
              results[timeSlot].push({
                name: hallName,
                menu: itemsAtHall
              })
            }

            callback()
          })
        })
      }
    })

    // We need to run processHall(url) on each url, then return cb!
    paternal.seriesPattern(
      functions,
      function () {
        cb(null, results)
      })
  })
}

module.exports = {
  parse: process
}
