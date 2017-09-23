const processPage = function(postURL, func) {
    try {
        jsdom.env({
            done: func,
            url: postURL
        });
    } catch(jsDomError) {
        throw jsDomError;
    }
}

module.exports = {
    processPage : processPage
}