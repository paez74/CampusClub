const SuccessEnums = require('../lib/enums/success');

const departmentLogic = require('../logics/department.logic');

/**
 * department middleware
 */
exports.departmentByID = function(req, res, next, id) {
  dbcontext.initTransaction(
    () => {
      return departmentLogic.getById(id, res);
    },
    req,
    res,
    next
  );
};

/**
 * Create a department
 */
exports.createDepartment = function(req, res) {
  dbcontext.initTransaction(
    () => {
      var department = req.body;
      var link = '';
      return departmentLogic.create(department, link);
    },
    req,
    res
  );
};

/**
 * Show the current department
 */
exports.readDepartment = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return res.locals.department ? res.locals.department.toJSON() : {};
    },
    req,
    res
  );
};

/**
 * Update a department
 */
exports.updateDepartment = function(req, res) {
  const old_department = res.locals.department;
  const department = req.body;
  var link = '';
  dbcontext.initTransaction(
    () => {
      return departmentLogic.update(department, old_department, link);
    },
    req,
    res
  );
};

/**
 * Delete a department
 */
exports.deleteDepartment = function(req, res) {
  var department = res.locals.department;
  var link = '';

  dbcontext.initTransaction(
    () => {
      return departmentLogic.delete(department, link);
    },
    req,
    res
  );
};

/**
 * List of departments
 */
exports.departmentList = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return departmentLogic.list();
    },
    req,
    res
  );
};

/**
 * Load department form
 */
exports.loadDepartmentForm = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return departmentLogic.loadForm(res.locals.department);
    },
    req,
    res
  );
};

/**
 * Search departments by filter
 */
exports.searchDepartment = function(req, res) {
  const search = req.query;
  dbcontext.initTransaction(
    () => {
      return departmentLogic.search(search);
    },
    req,
    res
  );
};

/**
 * Cross access request
 */
