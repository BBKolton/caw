var router = require('express').Router();
var db = require('../models');

module.exports = function(app) {
	app.use('/', router)
};

//For each model, construct its REST API
for (prop in db) {
	if (prop.toLowerCase() != "sequelize") {
		constructRestApi(router, prop);
	}
}

router.get('/api/requester', function(req, res) {
	res.render('requester');
});


//constructs the REST API for a given model
function constructRestApi(router, model) {
	var url = model.toLowerCase();

	//for get requests with a specific ID
	router.get('/api/'+ url +'/:id', function(req, res) {
		db[model].findById(req.params.id)
		.then(function(mod) {
			res.json(mod);
		});
	});

	//for get requests of a whole model
	router.get('/api/'+ url, function(req, res) {
		db[model].findAll()
		.then(function(mod) {
			res.json(mod);
		})
	})

	//for post requests to a whole model
	router.post('/api/'+ url, function(req, res) {
		db[model].create(popInstanceFields(model, req))
		.then(function() {
			res.status(200).end();
		}).catch(function(e) {
			res.status(500).end();
		})
	})

	//for put/update requests to a specific id
	router.put('/api/'+ url +'/:id', function(req, res) {
		db[model].findById(req.params.id)
		.then(function(mod) {
			mod.update(popInstanceFields(model, req))
			.then(function() {
				res.status(200);
			}).catch(function(e) {
				res.status(304).end(e);
			});
		});
	});

	//for delete requests to a specific id
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

//find and return all attributes of a given model
function popInstanceFields(model, req) {
	var vals = {};
	for (attr in db[model].attributes) {
		console.log(attr)
		vals[attr] = req.body[attr];
	}
	console.log(vals);
	return vals;
}