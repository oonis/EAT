/**
 * Sorts by preferences.
 */
const sort = function (data, preferences) {
  for (let timeslot in data) {
    let venues = data[timeslot]

    // Score each venue.
    for (let i = 0; i < venues.length; i++ ) {
      let venue = venues[i]
      let items = venue.menu
      venue.score = 0

      for (let j = 0; j < items.length; j++ ) {
        let item = items[j]
        let score = 0
        let itemTags = item.tags

        if (item.name.toLowerCase().trim() === 'onion rings') {
          score = 10
        } else if (itemTags.includes('vegan')) {
          score = 3
        } else if (itemTags.includes('vegetarian')) {
          score = 2
        } else {
          score = 0.5
        }

        item.score = score
        venue.score += score

        console.log(score + ' - ' + item.name + ':' + item.tags)
      }

      // Sort the items
      items.sort(function(a, b) {
        return b.score - a.score
      })

      console.log(venue.score + ' - ' + venue.name)
    }

    // Sort the venues
    venues.sort(function(a, b) {
      return b.score - a.score
    })
  }
}

module.exports = {
  sort: sort
}
