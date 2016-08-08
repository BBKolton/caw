var router = require('express').Router();
var db = require('../models');

module.exports = function(app) {
	app.use('/', router)
};

for (prop in db) {
	if (prop.toLowerCase() != "sequelize") {
		constructApi(router, prop);
	}
}

router.get('/api/requester', function(req, res) {
	res.render('requester');
});


function constructApi(router, model) {
	var url = model.toLowerCase();

	router.get('/api/'+ url +'/:id', function(req, res) {
		db[model].findById(req.params.id)
		.then(function(mod) {
			res.json(mod);
		});
	});

	router.post('/api/'+ url, function(req, res) {

		console.log('posted area')
		console.log(req.body)

		db[model].create(popInstanceFields(model, req))
		.then(function() {
			res.status(200).end();
		}).catch(function(e) {
			res.status(500).end();
		})
	})

	router.put('/api/'+ url +'/:id', function(req, res) {
		db[model].findById(req.params.id)
		.then(function(mod) {
			mode.update(popInstanceFields(model, req))
			.then(function() {
				res.status(200);
			}).catch(function(e) {
				res.status(304).end(e);
			});
		});
	});

	router.delete('/api/'+ url +'/:id', function(req, res) {
		db[model].findById(req.params.id).then(function(mod) {
			if (mod) {
				mod.destroy();
				res.status(200).end();
			} else {
				res.status(404).end();
			}
		});
	});
}

function popInstanceFields(model, req) {
	var vals = {};
	for (attr in db[model].attributes) {
		console.log(attr)
		vals[attr] = req.body[attr];
	}
	console.log(vals);
	return vals;
}