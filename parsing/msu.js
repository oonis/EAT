const generic = require('./generic')

const parsefunc = function (callback) {
  // Shaw
  generic.processPage(
    'https://eatatstate.msu.edu/menu/The%20Vista%20at%20Shaw',
     processShaw)
}

function processShaw (info) {

}

module.exports = {
  parse: parsefunc
}
