module.exports = function (app) {
	'use strict'
	let http = require('http'),
		url = require('url');

	app.all('/ips', function (req, res) {
		console.log("as");
	});
	app.all('*', function (req, res) {
		let ph = url.parse(req.url),
			options = {
				port: ph.port,
				hostname: ph.hostname,
				method: req.method,
				path: ph.path,
				headers: req.headers
			},
			proxyRequest = http.request(options),
			ipcontrol = require('./auth.js');

		req = ipcontrol(req);

		proxyRequest.on('response', function (proxyResponse) {
			proxyResponse.on('data', function (chunk) {
				res.write(chunk, 'binary');
			});
			proxyResponse.on('end', function () {
				res.end()
			});
			res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
		});
		req.on('data', function (chunk) {
			proxyRequest.end(chunk, 'binary');
		});
		req.on('end', function () {
			proxyRequest.end();
			req.end();
		});
		req.on('error', function () {
			console.error("Req error: \n");
			proxyRequest.end();
			req.end();
		});
	});
	return app;
}