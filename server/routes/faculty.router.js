const faculty = require('../controllers/faculty.controller');

module.exports = function(app) {
  // Cross access
  app.route('/api/faculty/departmentlist').get(faculty.departmentList);

  // Routes
  app.route('/api/faculty/form').get(faculty.loadFacultyForm);
  app.route('/api/faculty/form/:facultyId').get(faculty.loadFacultyForm);
  app.route('/api/faculty/search').get(faculty.searchFaculty);
  app
    .route('/api/faculty/')
    .get(faculty.facultyList)
    .post(faculty.createFaculty);
  app
    .route('/api/faculty/:facultyId')
    .get(faculty.readFaculty)
    .put(faculty.updateFaculty)
    .delete(faculty.deleteFaculty);

  // Entity catch middleware
  app.param('facultyId', faculty.facultyByID);
};
