const generic = require('./generic')

const parsefunc = function() {
  // Shaw
  generic.processPage('https://eatatstate.msu.edu/menu/The%20Vista%20at%20Shaw',
                      process_shaw);
}

function process_shaw(err,window) {
  if(err) { throw err; }
}

module.exports = {
  parse: parsefunc
}
