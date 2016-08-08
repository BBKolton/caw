// var User = require('./users');

module.exports = function(sequelize, DataTypes) {

	var Instructor = sequelize.define('Instructor', {
		description: 'LONGTEXT'
	}, {
		paranoid: true
	})

	return Instructor;
}