module.exports = function (req) {
	'use strict'
	let session = req.session,
		ip = req.connection.remoteAddress,
		ips = session.ips || [];
	if (!ips[ip]) {
		ips[ip] = true;
		req.session.ips = ips;
		console.log(`Connection from ${ip}`)
	}
	return req;
}
