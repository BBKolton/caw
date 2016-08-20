var fs = require('fs'); //to read files
var path = require('path'); //path manipulation
var http = require('http'); //for rerouting during netid logins
var https = require('https'); //for rerouting during netid logins
var glob = require('glob'); //allows for globbing files by names
var morgan = require('morgan'); //logging software
var colors = require('colors') // color text in console 
var bodyParser = require('body-parser'); //parses json, html, etc to html
var cookieParser = require('cookie-parser'); //no explanation needed
var compress = require('compression'); //compresses files and output to users
var favicon = require('serve-favicon'); //literally oinly serves favicons
var express = require('express'); //the express app framework
var session = require('express-session'); //for user sessions
var passport = require('passport'); //user authentication
var sequelize = require('sequelize'); //ORM for the database
var config = require('./config/config'); //configuration file 
var db = require('./app/models'); //database connections

var app = express(); //let's get started!

app.set('views', 'app/views');
app.set('view engine', 'jade');

//favicon, parsing, compressing, static files, logging
app.use(favicon('public/img/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(compress());
app.use(express.static('public'));
app.use(morgan(':remote-addr :method :url :response-time'));

//session setup
app.use(cookieParser(config.cookieSecret));
app.use(session(config.session));
app.use(passport.initialize());
app.use(passport.session());

//removes evil trailing slashes off of requests for pages. This fixes
//issues with error pages not loading if we're deep in folder
//hierarchies, and simplifies the types of pages we have to look for.
app.use(function removeTrailingSlashes(req, res, next) {
	var url = req.url;
	if (url.substring(url.length- 1, url.length) == '/' && url.length > 1) {
		console.log('removed trailing slash');
		res.redirect(301, url.substring(0, url.length - 1));
	} else {
		next();
	}
});

//grabs all the controllers in the folder, and adds them to the controllers
//list. synchronous function.
console.log('Loading Controllers...')
console.log(config.root + 'app/controllers/*.js')
var controllers = glob.sync(config.root + '/app/controllers/*.js');
controllers.forEach(function assignController(controller) {
	require(controller)(app);
	console.log('Sucessfully Loaded '.green + path.basename(controller));
});
console.log('Controllers Loaded\n')


var httpServer = http.createServer(app);

db.sequelize
	.sync()
	.then(function() {
		// httpsServer.listen(443, function() {
		// 	console.log('https listening on ' + httpsServer.address().port);
		// });
		httpServer.listen(config.port, function() {
			console.log(('HTTP listening on ' + httpServer.address().port).cyan);
		});
	}).catch(function(e) {
		console.log(e)
		throw new Error(e);
	});

