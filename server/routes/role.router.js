const role = require('../controllers/role.controller');

module.exports = function(app) {
  // Cross access

  // Routes
  app.route('/api/role/form').get(role.loadRoleForm);
  app.route('/api/role/form/:roleId').get(role.loadRoleForm);
  app.route('/api/role/search').get(role.searchRole);
  app
    .route('/api/role/')
    .get(role.roleList)
    .post(role.createRole);
  app
    .route('/api/role/:roleId')
    .get(role.readRole)
    .put(role.updateRole)
    .delete(role.deleteRole);

  // Entity catch middleware
  app.param('roleId', role.roleByID);
};
