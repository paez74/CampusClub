const person = require('../controllers/person.controller');

module.exports = function(app) {
  // Cross access

  // Routes
  app.route('/api/person/form').get(person.loadPersonForm);
  app.route('/api/person/form/:personId').get(person.loadPersonForm);
  app.route('/api/person/search').get(person.searchPerson);
  app
    .route('/api/person/')
    .get(person.personList)
    .post(person.createPerson);
  app
    .route('/api/person/:personId')
    .get(person.readPerson)
    .put(person.updatePerson)
    .delete(person.deletePerson);

  // Entity catch middleware
  app.param('personId', person.personByID);
};
