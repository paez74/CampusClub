const studentfrom = require('../controllers/studentfrom.controller');

module.exports = function(app) {
  // Cross access

  // Routes
  app.route('/api/studentfrom/form').get(studentfrom.loadStudentfromForm);
  app
    .route('/api/studentfrom/form/:studentfromId')
    .get(studentfrom.loadStudentfromForm);
  app.route('/api/studentfrom/search').get(studentfrom.searchStudentfrom);
  app
    .route('/api/studentfrom/')
    .get(studentfrom.studentfromList)
    .post(studentfrom.createStudentfrom);
  app
    .route('/api/studentfrom/:studentfromId')
    .get(studentfrom.readStudentfrom)
    .put(studentfrom.updateStudentfrom)
    .delete(studentfrom.deleteStudentfrom);

  // Entity catch middleware
  app.param('studentfromId', studentfrom.studentfromByID);
};
