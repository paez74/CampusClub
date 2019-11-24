var notification = require('../controllers/notification.controller');
var moduleName = 'notification';
var path = '/api/' + moduleName;

module.exports = function(app) {
	app
		.route(path )
        .get(notification.list)

    app.route(path + '/')
		.post(notification.create);

	app.route(path + '/unread/').get(notification.unread);

	app
		.route(path +'/read/' + ':notificationId')
		.put(notification.read)
		.delete(notification.delete);

	// Entity catch middleware
	app.param('notificationId', notification.notificationByID);
};
