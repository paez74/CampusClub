const SuccessEnums = require('../lib/enums/success');

const personLogic = require('../logics/person.logic');

/**
 * person middleware
 */
exports.personByID = function(req, res, next, id) {
  dbcontext.initTransaction(
    () => {
      return personLogic.getById(id, res);
    },
    req,
    res,
    next
  );
};

/**
 * Create a person
 */
exports.createPerson = function(req, res) {
  dbcontext.initTransaction(
    () => {
      var person = req.body;
      var link = '';
      return personLogic.create(person, link);
    },
    req,
    res
  );
};

/**
 * Show the current person
 */
exports.readPerson = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return res.locals.person ? res.locals.person.toJSON() : {};
    },
    req,
    res
  );
};

/**
 * Update a person
 */
exports.updatePerson = function(req, res) {
  const old_person = res.locals.person;
  const person = req.body;
  var link = '';
  dbcontext.initTransaction(
    () => {
      return personLogic.update(person, old_person, link);
    },
    req,
    res
  );
};

/**
 * Delete a person
 */
exports.deletePerson = function(req, res) {
  var person = res.locals.person;
  var link = '';

  dbcontext.initTransaction(
    () => {
      return personLogic.delete(person, link);
    },
    req,
    res
  );
};

/**
 * List of people
 */
exports.personList = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return personLogic.list();
    },
    req,
    res
  );
};

/**
 * Load person form
 */
exports.loadPersonForm = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return personLogic.loadForm(res.locals.person);
    },
    req,
    res
  );
};

/**
 * Search people by filter
 */
exports.searchPerson = function(req, res) {
  const search = req.query;
  dbcontext.initTransaction(
    () => {
      return personLogic.search(search);
    },
    req,
    res
  );
};

/**
 * Cross access request
 */
