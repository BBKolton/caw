module.exports = function(sequelize, DataTypes) {

	var Series = sequelize.define('Series', {
		name: DataTypes.STRING, 
		description: DataTypes.TEXT('long')
	}, {
		classMethods: { associate: function(models) {
			Series.belongsTo(models.Category)
		}},
		paranoid: true
	})

	return Series;
}