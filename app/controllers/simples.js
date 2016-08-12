var router = require('express').Router();
var db = require('../models')

module.exports = function(app) {
	app.use('/', router)
}

router.get('/', function(req, res) {
	db.Series.findAll().then(function(series) {
		console.log(series)
		res.render('index', {
			series: series
		});
	})
});