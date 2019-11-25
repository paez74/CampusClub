const SuccessEnums = require('../lib/enums/success');

const studentfromLogic = require('../logics/studentfrom.logic');

/**
 * studentfrom middleware
 */
exports.studentfromByID = function(req, res, next, id) {
  dbcontext.initTransaction(
    () => {
      return studentfromLogic.getById(id, res);
    },
    req,
    res,
    next
  );
};

/**
 * Create a studentfrom
 */
exports.createStudentfrom = function(req, res) {
  dbcontext.initTransaction(
    () => {
      var studentfrom = req.body;
      var link = '';
      return studentfromLogic.create(studentfrom, link);
    },
    req,
    res
  );
};

/**
 * Show the current studentfrom
 */
exports.readStudentfrom = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return res.locals.studentfrom ? res.locals.studentfrom.toJSON() : {};
    },
    req,
    res
  );
};

/**
 * Update a studentfrom
 */
exports.updateStudentfrom = function(req, res) {
  const old_studentfrom = res.locals.studentfrom;
  const studentfrom = req.body;
  var link = '';
  dbcontext.initTransaction(
    () => {
      return studentfromLogic.update(studentfrom, old_studentfrom, link);
    },
    req,
    res
  );
};

/**
 * Delete a studentfrom
 */
exports.deleteStudentfrom = function(req, res) {
  var studentfrom = res.locals.studentfrom;
  var link = '';

  dbcontext.initTransaction(
    () => {
      return studentfromLogic.delete(studentfrom, link);
    },
    req,
    res
  );
};

/**
 * List of studentfroms
 */
exports.studentfromList = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return studentfromLogic.list();
    },
    req,
    res
  );
};

/**
 * Load studentfrom form
 */
exports.loadStudentfromForm = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return studentfromLogic.loadForm(res.locals.studentfrom);
    },
    req,
    res
  );
};

/**
 * Search studentfroms by filter
 */
exports.searchStudentfrom = function(req, res) {
  const search = req.query;
  dbcontext.initTransaction(
    () => {
      return studentfromLogic.search(search);
    },
    req,
    res
  );
};

/**
 * Cross access request
 */
