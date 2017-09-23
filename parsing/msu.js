const request = require('request')
const cheerio = require('cheerio')
const Q = require('q')

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

    let allHalls = [] // Each hall is a function

    // Propegate list. This is synchronous.
    let $ = cheerio.load(body)
    $('.dining-menu-name').each(function (i, elem) {
      var currentHallUrl = $(this).find('a').attr('href')
      if (currentHallUrl.indexOf('/menu/') !== 0) {
        // MSU makes it so if it isn't a hall it doesn't have /menu/
        return true // Not a hall so we don't care
      }
      let hallURL = postURL + currentHallUrl
      allHalls.push(hallURL)
    })

    // We need to run processHall(url) on each url, then return cb!

    console.log('Allhalls: ' + allHalls)
    Q.resolve(allHalls)
    .then(getDeferredResult)
    .then(function(data) {
      console.log(data)
    })
  })
}

function getDeferredResult (a) {
  return (function (items) {
    var deferred

    // end
    if (items.length === 0) {
      return Q.resolve(true)
    }

    deferred = Q.defer()

    // any async function (setTimeout for now will do, $.ajax() later)
    setTimeout(function () {
      var a = items[0]
      console.log(a)
      // pop one item off the array of workitems
      deferred.resolve(items.splice(1))
    }, 600)

    return deferred.promise.then(getDeferredResult)
  }(a))
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
