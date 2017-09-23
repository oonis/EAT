const generic = require('./generic')

const parsefunc = function() {
  // Shaw
  generic.processPage('https://eatatstate.msu.edu/menu/The%20Vista%20at%20Shaw');
}

module.exports = {
  parse: parsefunc
}
