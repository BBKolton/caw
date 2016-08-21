var router = require('express').Router();
var db = require('../models');

module.exports = function(app) {
	app.use('/', router)
};

router.all('/view*', function(req, res, next) {
	if (!req.user) {
		return res.redirect('/login')
	} else if (req.user.level < 3) {
		return res.render('error', {
			t: 'insufficient privileges',
			d: 'You are not authorized to view this page'
		})
	} else {
		next();
	}
})

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
		getId(req, function(row) {
			if (!row) 
				res.status(404).end()
			else
				res.json(row);
		});
	});

	router.get('/view/'+ url +'/:id', function(req, res) {
		getId(req, function(row) {
			if (!row) {
				res.render('error', {
					t: 'Not Found', 
					d: 'The requested id could not be located'
				})
			} else {
				res.render('rowviewer', {row: row.dataValues, name: url});
			}
		})
	});

	function getId(req, callback) {
		db[model].findById(req.params.id)
		.then(function(row) {
			callback(row)
		});
	}

	//for get requests of a whole model
	router.get('/api/'+ url, function(req, res) {
		getModel(req, function(mod) {
			if (!mod) {
				res.send(404).end();
			} else {
				res.json(mod)
			}
		});
	});

	router.get('/view/'+ url, function(req, res) {
		getModel(req, function(mod) {
			if (mod.length == 0) {
				res.render('modelviewer', {model: null, name: url, fields: db[model].attributes})
			} else {
				if (!mod.dataValues) mod.dataValues = mod;
				console.log(db[model].attributes)
				res.render('modelviewer', {model: mod, name: url, fields: db[model].attributes})
			}
		});
	});

	function getModel(req, callback) {
		db[model].findAll()
		.then(function(mod) {
			callback(mod);
		});
	}

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
				res.status(200).end();
			}).catch(function(e) {
				res.status(304).end();
			});
		});
	});

	//for delete requests to a specific id
	router.delete('/api/'+ url +'/:id', function(req, res) {
		db[model].findById(req.params.id).then(function(mod) {
			if (mod) {
				mod.destroy().then(function() {
					
					res.status(200).end();
				});
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
		vals[attr] = req.body[attr];
	}
	console.log(vals)
	return vals;
}

router.all('/api/:err', function(req, res) {
	res.render('error', {
		t: 'Unknown API',
		d: 'Could not find an API with the name ' + req.params.err
	})
})

	router.all('/view/:err', function(req, res) {
	res.render('error', {
		t: 'Unknown View',
		d: 'Could not find a view with the name ' + req.params.err
	})
})