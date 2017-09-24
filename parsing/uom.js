const process = function (cb) {
  const results = {
    Breakfast: [
      {
        name: 'Shaw',
        menu: [
        { name: 'Beef Tips', tags: [ 'beef' ] },
        { name: 'Brocoli', tags: [ 'vegan', 'vegetarian' ] }
        ]
      },
      {
        name: ':O',
        menu: [
        { name: 'Onion Rings', tags: [ 'vegan' ] }
        ]
      }
    ],
    Lunch: [
    ],
    Dinner: [
    ],
    Latenight: [
    ]
  }

  cb(null, results)
}

module.exports = {
  parse: process
}
