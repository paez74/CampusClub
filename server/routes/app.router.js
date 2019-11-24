var appController = require('../controllers/app.controller');
var moduleName = 'app';
var path = '/api/' + moduleName;

module.exports = function(app) {
	app.route(path + '/getMyUser').get(appController.getMyUser);

	app.route(path + '/version').get(appController.getVersion);
};
