var express     = require('express'),
    app         = express(),
    server      = require('http').createServer(app),
    port        = 3000,
    argv        = require('optimist').argv,
    _           = require('underscore');
    boost        = 1;

var charsBuffer  = [],
	numbers      = _.range(48, 58),
	alfalow      = _.range(97,123),
    alfacap      = _.range(65,91),
    boost        = argv.boost;

charsBuffer = _.union(alfalow,alfacap);

var string = _.map(charsBuffer,function(dec) {
    return String.fromCharCode(dec);
}).join('');

var permutation = [],
	MIN  = 5,
	MAX  = 5,
	last = _.last(string),
    len  = 0;

function setChar(curr,callback) {
    if(curr >= 0)
        {
            if(permutation[curr] != last)
            {
                permutation[curr] = string[_.indexOf(string,permutation[curr])+1];
                // console.log(permutation);
                callback(permutation); // Value is going on callback
            }
            else
            {
                permutation[curr] = string[0];
                setChar(curr-1, callback);
            }
        }
        else
        {
            len++;
            if(len < MAX)
            {
                permutation[len-1] = string[0];
                callback(permutation); // Value is going on callback
            }
            else
                callback(true); // Value is going on callback
        }
}

function nextPermutation(callback) {
    if(len < MIN)
    {
        for(i=0;i<MIN;i++)
            permutation[i] = string[0];
        len = MIN;
        callback(permutation);
    }
    else
    { 
        setChar(len-1, callback);
    }
}

var url = "aaaaa";
var urlBuffer = []
var urlRange = []

function write() {
	nextPermutation(function(perm) { 
        url = perm.join('');
        console.log(url);
        if(typeof(perm) != 'object') {
			process.exit(0);
		}
		else
		{
            if (urlBuffer.length == 0 || urlBuffer.length < boost) {
                urlBuffer.push(url);
                setImmediate(write);
            }
		};
    });
}

write();
app.get('/link', (req, res) => {
    res.send(urlBuffer);
    urlBuffer = [];
    write();
})

server.listen(3000, function(err) {
    console.log(err, server.address());
});
