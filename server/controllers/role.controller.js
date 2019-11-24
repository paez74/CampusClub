const SuccessEnums = require('../lib/enums/success');

const roleLogic = require('../logics/role.logic');

/**
 * role middleware
 */
exports.roleByID = function(req, res, next, id) {
  dbcontext.initTransaction(
    () => {
      return roleLogic.getById(id, res);
    },
    req,
    res,
    next
  );
};

/**
 * Create a role
 */
exports.createRole = function(req, res) {
  dbcontext.initTransaction(
    () => {
      var role = req.body;
      var link = '';
      return roleLogic.create(role, link);
    },
    req,
    res
  );
};

/**
 * Show the current role
 */
exports.readRole = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return res.locals.role ? res.locals.role.toJSON() : {};
    },
    req,
    res
  );
};

/**
 * Update a role
 */
exports.updateRole = function(req, res) {
  const old_role = res.locals.role;
  const role = req.body;
  var link = '';
  dbcontext.initTransaction(
    () => {
      return roleLogic.update(role, old_role, link);
    },
    req,
    res
  );
};

/**
 * Delete a role
 */
exports.deleteRole = function(req, res) {
  var role = res.locals.role;
  var link = '';

  dbcontext.initTransaction(
    () => {
      return roleLogic.delete(role, link);
    },
    req,
    res
  );
};

/**
 * List of roles
 */
exports.roleList = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return roleLogic.list();
    },
    req,
    res
  );
};

/**
 * Load role form
 */
exports.loadRoleForm = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return roleLogic.loadForm(res.locals.role);
    },
    req,
    res
  );
};

/**
 * Search roles by filter
 */
exports.searchRole = function(req, res) {
  const search = req.query;
  dbcontext.initTransaction(
    () => {
      return roleLogic.search(search);
    },
    req,
    res
  );
};

/**
 * Cross access request
 */
