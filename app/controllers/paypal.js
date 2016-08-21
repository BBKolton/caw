var paypal = require('paypal-rest-sdk');
var router = require('express').Router();
var db = require('../models');
var config = require('../../config/config')

var mode = 'sandbox' //'sandbox' or 'live'
paypal.configure({
	mode: mode,
	client_id: config.paypal[mode].client,
	client_secret: config.paypal[mode].secret
})

module.exports = function(app) {
	app.use ('/', router);
}

router.all('/paypal*', function(req, res, next) {
	if (!req.user) 
		return res.redirect('/login')
	next();
})

router.get('/paypal/test', function(req, res) {
	console.log('paypal yayyy')
	res.render('paypal')
})

router.post('/paypal/test', function(req, res) {
	console.log('heyooo')
	var create_payment_json = {
	    intent: 'sale',
	    payer: {
	        payment_method: 'credit_card',
	        funding_instruments: [{
	            credit_card: {
	                type: req.body['type'],
	                number: req.body['number'],
	                expire_month: req.body['expire_month'],
	                expire_year: req.body['expire_year'],
	                cvv2: req.body['cvv2'],
	                first_name: req.body['first_name'],
	                last_name: req.body['last_name'],
	                billing_address: {
	                    line1: req.body['line1'],
	                    line2: req.body['line2'],
	                    city: req.body['city'],
	                    state: req.body['state'],
	                    postal_code: req.body['zip'],
	                    country_code: 'US'
	                }
	            }
	        }]
	    },
	    transactions: [{
	        amount: {
	            total: '2',
	            currency: 'USD',
	            details: {
	                subtotal: '1',
	                tax: '1'
	            }
	        },
	        description: 'NEW CAW SITE PAYPALL API TEST.'
	    }]
	};


	console.log('paymwent creation')
	paypal.payment.create(create_payment_json, function (error, payment) {
	    if (error) {
	    	console.log('error?')
	    	console.log(error)
	    	console.log(error.response.details)
	    	res.render('paypal', {errors: error.response.details});
	      //throw error;
	    } else {
        console.log('Create Payment Response');
        console.log(payment);
        db.Order.create({
        	amount: 2,
        	paypalId: 'null-while-in-sandbox',
        	UserId: req.user.id ? req.user.id : '999' // testing again
        }).then(function() {
        	res.render('paypalsuccess')
        })
	    }
	});
})

router.get('/paypal/gettrans')