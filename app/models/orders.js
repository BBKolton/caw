module.exports = function(sequelize, DataTypes) {
	var Order = sequelize.define('Order', {
		amount: DataTypes.INTEGER,
		paypalId: DataTypes.TEXT('long')
	}, {
		classMethods: { associate: function(models) {
			Order.belongsTo(models.User)
		}}
	});

	return Order;
}