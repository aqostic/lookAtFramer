var _               = require('underscore'),
    cheerio         = require('cheerio')
    request         = require('request'),
    firestore       = require('firebase-admin'),
    serviceAccount  = require("./serviceAccountKey.json");
    workerpool      = require('workerpool'),
    argv            = require('optimist').argv,
    host            = '';
    counter         = 0

firestore.initializeApp({
	credential: firestore.credential.cert(serviceAccount)
  });

if(!_.isString(argv.host)) {
    console.log("Invalid host ID");
    process.exit(0);
}

var db           = firestore.firestore(),
    hostUrl      = "",
    host         = argv.host;

function init(error, response, body) {
    if (response) {
        var body_ = cheerio.load(body);
        var title = body_('head > title').text();
        console.log(counter++, response.statusCode, response.request.uri.href, title);
        if (response.statusCode == 200) {
            console.log("Found");
            firestore.firestore().collection("valid").doc(title + response.request.uri.href).set({
                title: title,
                link: response.request.uri.href
            });
        };
    }
    else {
        // nextSock5();
        // console.log(error.code);
    };
}
var projectId = [];
var i = 0;
function callback(error, response, body) {
    if (response) {
        if (response.statusCode == 200) {
            projectId = body;
            projectId = projectId.replace(/'/g, '"');
            projectId = JSON.parse(projectId);
            // console.log(projectId.length);
            while (i < projectId.length ) {
                // console.log(projectId[i]);
                var requestOptions = {
                    url: hostUrl + projectId[i],
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWAppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
                    }
                }
                request(requestOptions, init);
                i++;
            }
            projectId = [];
            sendRequest(host);
        };
        
    }
    else {
      // nextSock5();
    //   console.log(error.code);
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

sendRequest(host);
// console.log(projectId[1]);

// var requestOptions = {
//     url: hostUrl + projectId,
//     headers: {
//         'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWAppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
//     }
// }
// request(requestOptions, init);
