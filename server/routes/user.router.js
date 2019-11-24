const user = require('../controllers/user.controller');
const userValidation = require('../validations/user.validation');

module.exports = function(app) {
  // Cross access
  app.route('/api/user/rolelist').get(user.roleList);

  // Routes
  app.route('/api/user/form').get(user.loadUserForm);
  app.route('/api/user/form/:userId').get(user.loadUserForm);
  app.route('/api/user/search').get(user.searchUser);
  app
    .route('/api/user/')
    .get(user.userList)
    .post(user.createUser);
  app
    .route('/api/user/:userId')
    .get(user.readUser)
    .put(user.updateUser)
    .delete(userValidation.isCurrentUser, user.deleteUser);
  app.route('/api/user/changepassword/:userId').patch(user.changePassword);

  // Entity catch middleware
  app.param('userId', user.userByID);
};
