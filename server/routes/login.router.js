var login = require('../controllers/login.controller');
var moduleName = 'login';
var path = '/api/' + moduleName;

module.exports = function(app) {
  app.route(path + '/').post(login.login);

  app.route(path + '/generatepassword').put(login.generatePassword);
};
