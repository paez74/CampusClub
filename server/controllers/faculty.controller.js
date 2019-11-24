const SuccessEnums = require('../lib/enums/success');

const facultyLogic = require('../logics/faculty.logic');
const departmentLogic = require('../logics/department.logic');

/**
 * faculty middleware
 */
exports.facultyByID = function(req, res, next, id) {
  dbcontext.initTransaction(
    () => {
      return facultyLogic.getById(id, res);
    },
    req,
    res,
    next
  );
};

/**
 * Create a faculty
 */
exports.createFaculty = function(req, res) {
  dbcontext.initTransaction(
    () => {
      var faculty = req.body;
      var link = '';
      return facultyLogic.create(faculty, link);
    },
    req,
    res
  );
};

/**
 * Show the current faculty
 */
exports.readFaculty = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return res.locals.faculty ? res.locals.faculty.toJSON() : {};
    },
    req,
    res
  );
};

/**
 * Update a faculty
 */
exports.updateFaculty = function(req, res) {
  const old_faculty = res.locals.faculty;
  const faculty = req.body;
  var link = '';
  dbcontext.initTransaction(
    () => {
      return facultyLogic.update(faculty, old_faculty, link);
    },
    req,
    res
  );
};

/**
 * Delete a faculty
 */
exports.deleteFaculty = function(req, res) {
  var faculty = res.locals.faculty;
  var link = '';

  dbcontext.initTransaction(
    () => {
      return facultyLogic.delete(faculty, link);
    },
    req,
    res
  );
};

/**
 * List of faculties
 */
exports.facultyList = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return facultyLogic.list();
    },
    req,
    res
  );
};

/**
 * Load faculty form
 */
exports.loadFacultyForm = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return facultyLogic.loadForm(res.locals.faculty);
    },
    req,
    res
  );
};

/**
 * Search faculties by filter
 */
exports.searchFaculty = function(req, res) {
  const search = req.query;
  dbcontext.initTransaction(
    () => {
      return facultyLogic.search(search);
    },
    req,
    res
  );
};

/**
 * Cross access request
 */
exports.departmentList = function(req, res) {
  var additionalWhere = [];

  dbcontext.initTransaction(
    () => {
      return departmentLogic.list(additionalWhere);
    },
    req,
    res
  );
};
