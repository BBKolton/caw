var router = require('express').Router();
var db = require('../models');

module.exports = function(app) {
	app.use('/', router)
};