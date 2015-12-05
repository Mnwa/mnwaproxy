module.exports = function (app) {
	'use strict'
	let http = require('http'),
		url = require('url');

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

		req.session.ips = app.ips || [];
		req = ipcontrol(req);
		app.ips = req.session.ips;
		proxyRequest.on('response', function (proxyResponse) {
			proxyResponse.on('data', function (chunk) {
				res.write(chunk, 'binary');
			});
			proxyResponse.on('end', function () {
				res.end()
			});
			proxyResponse.on('error', function (e) {
				console.error("proxyResponse error: \n%s ", e.message);
				res.end()
			});
			res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
		});
		req.on('data', function (chunk) {
			proxyRequest.write(chunk, 'binary');
		});
		req.on('end', function () {
			proxyRequest.end();
		});
		req.on('error', function (e) {
			console.error("Req error: \n%s ", e.message);
			proxyRequest.end();
		});
	});
	return app;
}
