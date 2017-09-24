/**
 * Sorts by preferences.
 */
const sort = function (data, preferences) {
  for (let timeslot in data) {
    let venues = data[timeslot]
    let venueScores = {}

    // Score each venue.
    for (let venue in venues) {
      let items = venues[venue]
      let itemScores = {}
      let totalScore = 0

      for (let item in items) {
        let score = 0
        let itemTags = items[item]

        if (item.toLowerCase().trim() === 'onion rings') {
          score = 10
        } else if (itemTags.includes('vegan')) {
          score = 3
        } else if (itemTags.includes('vegetarian')) {
          score = 2
        } else {
          score = 0.5
        }

        itemScores[item] = score
        totalScore += score

        console.log(score + ' - ' + item + ':' + itemTags)
      }

      // Sort the items

      console.log(totalScore + ' - ' + venue)
      venueScores[venue] = totalScore
    }

    // Sort the venues

  }
}

module.exports = {
  sort: sort
}
