module.exports = function(sequelize, DataTypes) {
	var Registration = sequelize.define('Registration', {}, {
		classMethods: { associate: function(models) {
			Registration.belongsTo(models.User, {onDelete: 'NO ACTION'})
			Registration.belongsTo(models.Section, {onDelete: 'NO ACTION'})
			Registration.belongsTo(models.Order, {onDelete: 'NO ACTION'})
		}}
	});

	return Registration;
}