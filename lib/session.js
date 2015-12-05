module.exports = function (app) {
	'use strict'
	let flash = require('express-flash'),
		session = require('express-session'),
		bodyParser = require("body-parser"),
		cookieParser = require('cookie-parser');
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(cookieParser());
	app.use(session({
		secret: 'keyboard cat',
		saveUninitialized: true,
		resave: true,
		proxy: true
	}));
	app.use(flash());
	return app;
}
