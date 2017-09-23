var request = require("request");
var cheerio = require("cheerio");
const processPage = function(postURL) {
    request({
        uri: postURL,
        agentOptions: {
            rejectUnauthorized: false
        }
      }, function(error, response, body) {
            var $ = cheerio.load(body);
            var vals = $('.meal-title').map(function(i, el) {
                // this === el
                return $(this).text()+"\n";
            }).get().join(' ');
            return;
      });

}

module.exports = {
    processPage : processPage
}