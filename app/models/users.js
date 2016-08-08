module.exports = function(sequelize, DataTypes) {

	var User = sequelize.define('User', {
		fname: DataTypes.STRING,
		lname: DataTypes.STRING,
		email: DataTypes.STRING,
		phone: DataTypes.STRING,
		password: DataTypes.STRING,
		level: DataTypes.REAL
	}, {
		paranoid: true
	});

	return User;
}