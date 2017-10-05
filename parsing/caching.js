const assert = require('assert')

const cache = {}

/**
 * Set information for a specific day and category.
 */
const set = function (category, day, information) {
  if (!cache[day]) { cache[day] = {} }
  let dayC = cache[day]
  assert(dayC)

  dayC[category] = information
}

/**
 * Get information from a specific catagory on a specific day.
 */
const get = function (category, day) {
  let d = cache[day]
  return d ? d[category] : null
}

/**
 * Clean out information more than 7 days old.
 */
const clean = function () {
  console.log('The old ways have been purged')
}

module.exports = {
  get: get,
  set: set,
  clean: clean
}
