var _               = require('underscore'),
    cheerio         = require('cheerio')
    request         = require('request'),
    firestore       = require('firebase-admin'),
    serviceAccount  = require("./serviceAccountKey.json");
    workerpool      = require('workerpool'),
    supervisorUrl   = 'http://localhost:3000/framer';
    counter         = 0

firestore.initializeApp({
	credential: firestore.credential.cert(serviceAccount)
  });

var db           = firestore.firestore(),
    hostUrl      = "https://framer.cloud/";

function init(error, response, body) {
    if (response) {
        var body_ = cheerio.load(body);
        var title = body_('head > title').text();
        console.log(counter++, response.statusCode, response.request.uri.href, title);
        if (response.statusCode == 200) {
            console.log("Found");
            firestore.firestore().collection("valid").doc(title).set({
                id: counter,
                title: title,
                link: response.request.uri.href
            });
        };
    }
    else {
        // nextSock5();
        console.log(error.code);
    };
    sendRequest(supervisorUrl);
}

function callback(error, response, body) {
    if (response) {
        if (response.statusCode == 200) {
            projectId = body
            var requestOptions = {
                url: hostUrl + projectId,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWAppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
                }
            }
            request(requestOptions, init);
        };
    }
    else {
      // nextSock5();
      console.log(error.code);
    };
  }
  
function sendRequest(destination){
    var options = {
        url: destination,
        headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWAppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
    }
}
request(options, callback);
};

sendRequest(supervisorUrl);
  