var http = require('http'),
	express = require('express'),
	app = express(),
	cluster = require('cluster'),
	http = require('http'),
	numCPUs = require('os').cpus().length;


if (cluster.isMaster) {
	for (var i = 0; i < numCPUs + 1; i++) {
		cluster.fork();
	}

	cluster.on('exit', function (worker, code, signal) {
		cluster.fork();
	});
} else {
	app = require('./lib/session.js')(app);
	app = require('./lib/proxy.js')(app);
	var server = require('./lib/server.js')(http, app, 8000);
}