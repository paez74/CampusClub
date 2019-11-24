const SuccessEnums = require('../lib/enums/success');

const studentLogic = require('../logics/student.logic');
const departmentLogic = require('../logics/department.logic');
const campusClubLogic = require('../logics/campusClub.logic');

/**
 * student middleware
 */
exports.studentByID = function(req, res, next, id) {
  dbcontext.initTransaction(
    () => {
      return studentLogic.getById(id, res);
    },
    req,
    res,
    next
  );
};

/**
 * Create a student
 */
exports.createStudent = function(req, res) {
  dbcontext.initTransaction(
    () => {
      var student = req.body;
      var link = '';
      return studentLogic.create(student, link);
    },
    req,
    res
  );
};

/**
 * Show the current student
 */
exports.readStudent = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return res.locals.student ? res.locals.student.toJSON() : {};
    },
    req,
    res
  );
};

/**
 * Update a student
 */
exports.updateStudent = function(req, res) {
  const old_student = res.locals.student;
  const student = req.body;
  var link = '';
  dbcontext.initTransaction(
    () => {
      return studentLogic.update(student, old_student, link);
    },
    req,
    res
  );
};

/**
 * Delete a student
 */
exports.deleteStudent = function(req, res) {
  var student = res.locals.student;
  var link = '';

  dbcontext.initTransaction(
    () => {
      return studentLogic.delete(student, link);
    },
    req,
    res
  );
};

/**
 * List of students
 */
exports.studentList = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return studentLogic.list();
    },
    req,
    res
  );
};

/**
 * Load student form
 */
exports.loadStudentForm = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return studentLogic.loadForm(res.locals.student);
    },
    req,
    res
  );
};

/**
 * Search students by filter
 */
exports.searchStudent = function(req, res) {
  const search = req.query;
  dbcontext.initTransaction(
    () => {
      return studentLogic.search(search);
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

  additionalWhere = {};
  dbcontext.initTransaction(
    () => {
      return departmentLogic.list(additionalWhere);
    },
    req,
    res
  );
};

exports.campusClubList = function(req, res) {
  var additionalWhere = [];

  additionalWhere = {};
  dbcontext.initTransaction(
    () => {
      return campusClubLogic.list(additionalWhere);
    },
    req,
    res
  );
};
