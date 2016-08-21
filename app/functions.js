var bcrypt = require('bcryptjs');
var Q = require('q');
var config = require('../config/config.js'); //config file contains all tokens and other private info
var db = require('./models');

console.log('allurp')

//used in local-signup strategy
exports.localReg = function (email, password) {
	console.log('herpderp')
	x - y;
	var deferred = Q.defer();
	var hash = bcrypt.hashSync(password, 8);
	var user = {
		"email": email,
		"password": hash,
	}
	//check if email is already assigned in our database
	db.User.findOne({
		where: {
			email: email
		}
	}).then(function(user) { //case in which user already exists in db
		if (user) {
			console.log('email already exists');
			deferred.resolve(false); //email already exists
		} else {
			console.log('email is free for use');
			db.User.create({
				email: email,
				password: password,
				fname: fname,
				lname: lname,
				phone: phone
			}).save()
			.then(function () {
				console.log("USER: " + user);
				deferred.resolve(user);
			})
			.fail(function (err) {
				console.log("PUT FAIL:" + err.body);
				deferred.reject(new Error(err.body));
			});
		}
	});

	return deferred.promise;
};

//check if user exists
		//if user exists check if passwords match (use bcrypt.compareSync(password, hash); // true where 'hash' is password in DB)
			//if password matches take into website
	//if user doesn't exist or password doesn't match tell them it failed
exports.localAuth = function (email, password) {
	console.log('herpderp')
	var deferred = Q.defer();

	db.User.findOne({
		where: {
			email: email
		}
	})
	.then(function (user){
		if (user) {
			console.log("FOUND USER");
			var hash = user.password;
			console.log(hash);
			console.log(bcrypt.compareSync(password, hash));
			if (bcrypt.compareSync(password, hash)) {
				console.log('Passwords match')
				deferred.resolve(user.body);
			} else {
				console.log("PASSWORDS NOT MATCH");
				deferred.resolve(false);
			}
		} else {
			console.log("COULD NOT FIND USER IN DB FOR SIGNIN");
			deferred.resolve(false);
		}
	});

	return deferred.promise;
}