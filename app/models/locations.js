module.exports = function(sequelize, DataTypes) {

	var Location = sequelize.define('Location', {
		name: DataTypes.STRING,
		description: DataTypes.STRING,
		address: DataTypes.STRING,
		street: DataTypes.STRING,
		city: DataTypes.STRING,
		zip: DataTypes.INTEGER
	})

	return Location;
}