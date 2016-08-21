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
var LocalStrategy = require('passport-local').Strategy;
var funct = require('./app/functions');
var bcrypt = require('bcryptjs');
//var oauth2 = require('./config/oauth2')

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
app.use(session({
	secret: config.session.secret,
}));


app.use(passport.initialize());
app.use(passport.session());

//serialize and deserialize the user's session
passport.serializeUser(function(user, done) {
	done(null, user);
});
 
passport.deserializeUser(function(user, done) {
		done(null, user);
});


passport.use('local-signin', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	session: true, 
	passReqToCallback: true
},
function(req, email, password, done) {
	console.log('logging in user...')
	db.User.findOne({
		where: {
			email: email
		}
	}).then(function(user) {
		console.log(user)
		if (user) {
			console.log('found user!')
			if (bcrypt.compareSync(password, user.password)) {
				console.log('correct password!')
				return done(null, user);
			} else {
				console.log('wrong password')
				return done(null, false);
			}
		}
		console.log('no user found')
		return done(null, false);
	})
}));


passport.use('local-register', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		session: true, 
		passReqToCallback: true
	},
	function(req, email, password, done) {
		email = email.trim();
		console.log('registering user...')
		db.User.findOne({
			where: {
				email: email
			}
		}).then(function(user) {
			console.log(user)
			if (user) {
				console.log('found user!')
				return done(null, false)
			}
			var salt = bcrypt.genSaltSync(10);
			var hash = bcrypt.hashSync(password, salt)
			db.User.create({
				email: email, 
				password: hash, 
				fname: req.body.fname,
				lname: req.body.lname,
				phone: req.body.phone,
				level: 1
			}).then(function(user) {
				console.log('user saved!')
				return done(null, user)
			})
		})
	}
));







var oauthserver = require('oauth2-server');
app.oauth = oauthserver({
	model: {},
	grants: ['password'],
	debug: true
});

app.all('/oauth/auth', function(req, res) {
	console.log(req.body)
}, app.oauth.grant())

app.get('/secret', app.oauth.authorise(), function(req, res) {
	res.send('super secret wololo')
})

app.use(app.oauth.errorHandler());






// //set up passport
// passport.use('local-signin', new LocalStrategy({    
// 	usernameField: 'email',
//     passwordField: 'password',
//     session: true
//   },
//   function(username, password, done) {
//   		console.log('hurrdurr please')
//   		console.log(username + password)
//     db.User.findOne({
//     	where: {
//     	 email: username 
//     	}
//     }).then(function (err, user) {
//     	console.log(user)
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       if (!user.verifyPassword(password)) { return done(null, false); }
//       return done(null, user);
//     });
//   }
// ));


// 	passport.use('local-signup', new LocalStrategy({
// 		// by default, local strategy uses username and password, we will override with email
// 		usernameField : 'email',
// 		passwordField : 'password',
// 		passReqToCallback : true // allows us to pass back the entire request to the callback
// 	},
// 	function(req, email, password, done) {

// 		// asynchronous
// 		// User.findOne wont fire unless data is sent back
// 		process.nextTick(function() {

// 		// find a user whose email is the same as the forms email
// 		// we are checking to see if the user trying to login already exists
// 		db.User.findOne({
// 			where: {email: email }
// 			}, function(err, user) {
// 			// if there are any errors, return the error
// 			if (err)
// 				return done(err);

// 			// check to see if theres already a user with that email
// 			if (user) {
// 				return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
// 			} else {

// 				// if there is no user with that email
// 				// create the user
// 				var newUser            = new User();

// 				// set the user's local credentials
// 				newUser.local.email    = email;
// 				newUser.local.password = newUser.generateHash(password);

// 				// save the user
// 				newUser.save(function(err) {
// 					if (err)
// 						throw err;
// 					return done(null, newUser);
// 				});
// 			}

// 		});    

// 		});

// 	}));



// console.log(passport)



// passport.use('local-signin', new LocalStrategy(
//   {passReqToCallback : true}, //allows us to pass back the request to the callback
//   function(req, username, password, done) {
//   	console.log('ping server.js singin and signup')
//     funct.localAuth(username, password)
//     .then(function (user) {
//       if (user) {
//         console.log("LOGGED IN AS: " + user.username);
//         req.session.success = 'You are successfully logged in ' + user.username + '!';
//         done(null, user);
//       }
//       if (!user) {
//         console.log("COULD NOT LOG IN");
//         req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
//         done(null, user);
//       }
//     })
//     .fail(function (err){
//       console.log(err.body);
//     });
//   }
// ));
// // Use the LocalStrategy within Passport to register/"signup" users.
// passport.use('local-signup', new LocalStrategy(
//   {passReqToCallback : true}, //allows us to pass back the request to the callback
//   function(req, username, password, done) {
//   	console.log('ping server.js singin and signup')
//     funct.localReg(req.body.email, req.body.password)
//     .then(function (user) {
//       if (user) {
//         console.log("REGISTERED: " + user.username);
//         req.session.success = 'You are successfully registered and logged in ' + user.username + '!';
//         done(null, user);
//       }
//       if (!user) {
//         console.log("COULD NOT REGISTER");
//         req.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
//         done(null, user);
//       }
//     })
//     .fail(function (err){
//       console.log(err.body);
//     });
//   }
// ));




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

//404 page
app.use(function(req, res, next) {
	res.status(404).render('error', {
		t: 'The requested page could not be found!',
		d: req.url + ' was not listed on this server :('
	})
})

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

