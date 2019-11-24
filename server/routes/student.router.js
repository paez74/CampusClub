const student = require('../controllers/student.controller');

module.exports = function(app) {
  // Cross access
  app.route('/api/student/departmentlist').get(student.departmentList);
  app.route('/api/student/campusClublist').get(student.campusClubList);

  // Routes
  app.route('/api/student/form').get(student.loadStudentForm);
  app.route('/api/student/form/:studentId').get(student.loadStudentForm);
  app.route('/api/student/search').get(student.searchStudent);
  app
    .route('/api/student/')
    .get(student.studentList)
    .post(student.createStudent);
  app
    .route('/api/student/:studentId')
    .get(student.readStudent)
    .put(student.updateStudent)
    .delete(student.deleteStudent);

  // Entity catch middleware
  app.param('studentId', student.studentByID);
};
