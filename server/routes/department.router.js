const department = require('../controllers/department.controller');

module.exports = function(app) {
  // Cross access

  // Routes
  app.route('/api/department/form').get(department.loadDepartmentForm);
  app
    .route('/api/department/form/:departmentId')
    .get(department.loadDepartmentForm);
  app.route('/api/department/search').get(department.searchDepartment);
  app
    .route('/api/department/')
    .get(department.departmentList)
    .post(department.createDepartment);
  app
    .route('/api/department/:departmentId')
    .get(department.readDepartment)
    .put(department.updateDepartment)
    .delete(department.deleteDepartment);

  // Entity catch middleware
  app.param('departmentId', department.departmentByID);
};
