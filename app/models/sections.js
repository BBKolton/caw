module.exports = function(sequelize, DataTypes) {

	var Section = sequelize.define('Section', {
		datetext: DataTypes.STRING,
		datestart: DataTypes.DATEONLY,
		dateend: DataTypes.DATEONLY,
		timestart: DataTypes.TIME,
		timeend: DataTypes.TIME,
		price: DataTypes.INTEGER
	}, {
		classMethods: { associate: function(models) {
			Section.belongsTo(models.Series),
			Section.belongsTo(models.Location),
			Section.belongsToMany(models.User, {through: 'Registration'}),
			Section.belongsToMany(models.User, {through: 'SectionsInstructor'})
		}}
	});

	return Section;
}