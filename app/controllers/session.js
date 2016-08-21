var router = require('express').Router();
var db = require('../models')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(app) {
	app.use('/', router)
	

	// app.post('/login', function(req, res, next) {
	//   passport.authenticate('local-signin', function(err, user, info) {
	//     if (user === false) {
	//       // handle login error ...
	//     } else {
	//       // handle successful login ...
	//     }
	//   })(req, res, next);
	// });


}

router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect('/')
})


// router.all('/login', function(req, res, next) {
// 	if (req.user) {
// 		return res.redirect('/')
// 	} else {
// 		next();
// 	}
// })

// router.all('/register', function(req, res, next) {
// 	if (req.user) {
// 		return res.redirect('/')
// 	} else {
// 		next();
// 	}
// })


router.post('/login', function(req, res, next) {
	console.log(req.body.email)

	passport.authenticate('local-signin', function(err, user, info) {
		if (err || user == false) {
			res.render('login', {
				error: {
					title: 'Invalid Credentials',
					mess: 'The email or password was incorrect'
				}
			})
		} else {
			console.log(user)
			req.login(user, function(err) {
				if (err) {
					return res.render('error', {
						t: 'Unknown error',
						d: err
					})
				}
				res.redirect('/')
			});
		}

	})(req, res, next)
})


router.get('/register', function(req, res) {
	res.redirect('/login');
})

router.post('/register', 
	function(req, res, next) {

		console.log('check 1')
		
		if (req.body['email'] == undefined || req.body['email'].length == 0
		 || req.body['password'] == undefined || req.body['password'].length == 0
		 || req.body['fname'] == undefined || req.body['fname'].length == 0
		 || req.body['lname'] == undefined || req.body['lname'].length == 0
		 || req.body['phone'] == undefined || req.body['phone'].length == 0) {
			return res.render('login', {
				error: {
					title: 'Missing required field',
					mess: 'You did not fill out all of the fields'
				}
			})
		}

		console.log('check 2')

		if (req.body['email'].indexOf('@') == -1) {	
			return res.render('login', {
				error: {
					title: 'Invalid Email',
					mess: 'Your email address is not valid'
				}
			})
		}

		if (req.body['password'].length < 10) {	
			return res.render('login', {
				error: {
					title: 'Invalid Password',
					mess: 'Passwords must be 10 or more characters in length'
				}
			})
		}


		console.log(req.body['phone'])
		req.body['phone'] = req.body['phone'].replace(/[^0-9]/g, '')
		console.log(req.body['phone'])

		if (req.body['phone'].length < 10) {	
			return res.render('login', {
				error: {
					title: 'Invalid Phone',
					mess: 'Please enter your phone number including area code'
				}
			})
		}

		db.User.find({
			where: {email: req.body['email']}
		}).then(function(user) {
			if (user) {
				return res.render('login', {
					error: {
						title: 'Email Exists',
						mess: 'The email you\'ve specified already exists'
					}
				})
			} else {
				return next();
			}
		})
	},
	
	passport.authenticate('local-register', { 
		successRedirect: '/',
		failureRedirect: '/error'
	})
)


router.get('/login', function(req, res) {
	console.log(req.user);
	if (req.user) console.log(req.user)
	res.render('login')
})

