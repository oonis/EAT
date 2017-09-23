const express = require('express')
const router = express.Router()

const msuParse = require('../parsing/msu').parse

console.log('\t\tStarting route: /')

router.get('/:category', function (req, res, next) {
  let category = req.params.category
  if (category.toLowerCase() === 'msu') {
    msuParse(function (err, results) {
      if (err) { throw err }
      res.render('find', {
        user: req.user,
        category: category,
        results: results
      })
    })
  } else if (category.toLowerCase() === 'uom') {
    const results = {
      Breakfast: {
        Shaw: {
          'Brocoli': [ 'vegan', 'vegetarian' ],
          'Beef Tips': [ 'beef' ]
        }
      },
      Lunch: {
        Shaw: {
          'lol': [ 'vegetarian' ]
        }
      },
      Dinner: {
        Shaw: {
        }
      },
      Latenight: {
        Shaw: {
        }
      }
    }

    res.render('find', {
      user: req.user,
      category: category,
      results: results
    })
  } else {
    next()
  }
})

module.exports = router
