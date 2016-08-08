var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var config = require('../../config/config');
var db = {};
var colors = require('colors');

console.log('\nLoading Models...')

//connect to the database
var sequelize = config.sequelize();

fs.readdirSync(__dirname).filter(function (file) {
	//return all files in the directory besides this one
	return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(function (file) {
	var model = sequelize['import'](path.join(__dirname, file));
	db[model.name] = model;
	console.log('Successfully Imported '.green + file)
});

Object.keys(db).forEach(function (modelName) {
	if ('associate' in db[modelName]) {
		db[modelName].associate(db);
		console.log('Successfully Associated '.yellow + modelName + 's');
	}
});

db.sequelize = sequelize; //the instance
db.Sequelize = Sequelize; //the constructor

console.log('Models Loaded \n')

module.exports = db;
