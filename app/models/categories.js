module.exports = function(sequelize, DataTypes) {
	var Category = sequelize.define('Category', {
		name: DataTypes.STRING,
		description: DataTypes.TEXT('long')
	}, {
		paranoid: true
	})

	return Category;
}