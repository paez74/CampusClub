var Sequelize = require('sequelize');

var dbUpdateHistory = dbcontext.sequelize.define('dbUpdateHistory', {
	id: {
		type: Sequelize.UUID,
		allowNull: false,
		defaultValue: Sequelize.UUIDV1,
		primaryKey: true
	},
	version: {
		type: Sequelize.STRING,
		allowNull: false
	},
	executed: {
		type: Sequelize.DATE,
		allowNull: false,
		defaultValue: Sequelize.NOW
	},
	success: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

dbcontext.dbUpdateHistory = dbUpdateHistory;
