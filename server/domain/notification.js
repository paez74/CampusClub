var Sequelize = require('sequelize');
var sequelize = dbcontext.sequelize;

var notification = sequelize.define('notification', {
	id: {
		type: Sequelize.UUID,
		primaryKey: true,
		allowNull: false,
		defaultValue: Sequelize.UUIDV1
	},
	title: {
		type: Sequelize.STRING,
		allowNull: false
	},
	content: {
		type: Sequelize.STRING,
		allowNull: false
	},
	link: {
		type: Sequelize.STRING,
		allowNull: false
	},
	read: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
    deleted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
});


dbcontext.notification = notification;

notification.belongsTo(dbcontext.user, { as: 'createdBy' });
notification.belongsTo(dbcontext.user, { as: 'assignedTo' });