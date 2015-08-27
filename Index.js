var http = require('http'),
    express = require('express'),
    app = express();


app = require('./lib/session.js')(app);
app = require('./lib/proxy.js')(app);

var server = require('./lib/server.js')(http, app, 8080);