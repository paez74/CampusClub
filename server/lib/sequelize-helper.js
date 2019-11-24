const Sequelize = require('sequelize');

exports.searchHelper = function(whereValues, model) {
	var tableName = model.name;
	var where = [];

	Object.keys(whereValues).forEach((key) => {
		var attribute = model.attributes[key];
		if (attribute) {
			switch (attribute.type.key) {
				case 'BOOLEAN':
					where.push(
						Sequelize.where(
							Sequelize.fn('lower', Sequelize.col(tableName + '.' + key)),
							{
								[Sequelize.Op.eq]: whereValues[key] == 'true' ? true : false
							}
						)
					);
					break;
				case 'DATE':
					if (whereValues[key].startDate) {
						where.push(
							Sequelize.where(Sequelize.col(tableName + '.' + key), {
								[Sequelize.Op.gte]: whereValues[key].startDate
							})
						);
					}
					if (whereValues[key].endDate) {
						where.push(
							Sequelize.where(Sequelize.col(tableName + '.' + key), {
								[Sequelize.Op.lte]: whereValues[key].endDate
							})
						);
					}
				default:
					where.push(
						Sequelize.where(
							Sequelize.fn('lower', Sequelize.col(tableName + '.' + key)),
							{
								[Sequelize.Op.like]: '%' + whereValues[key] + '%'
							}
						)
					);
			}
		}
	});
	return where;
};
