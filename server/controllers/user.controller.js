const SuccessEnums = require('../lib/enums/success');

const userLogic = require('../logics/user.logic');
const roleLogic = require('../logics/role.logic');

/**
 * user middleware
 */
exports.userByID = function(req, res, next, id) {
  dbcontext.initTransaction(
    () => {
      return userLogic.getById(id, res);
    },
    req,
    res,
    next
  );
};

/**
 * Create a user
 */
exports.createUser = function(req, res) {
  dbcontext.initTransaction(
    () => {
      var user = req.body;
      var link = '';
      return userLogic.create(user, link);
    },
    req,
    res
  );
};

/**
 * Show the current user
 */
exports.readUser = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return res.locals.user ? res.locals.user.toJSON() : {};
    },
    req,
    res
  );
};

/**
 * Update a user
 */
exports.updateUser = function(req, res) {
  const old_user = res.locals.user;
  const user = req.body;
  var link = '';
  dbcontext.initTransaction(
    () => {
      return userLogic.update(user, old_user, link);
    },
    req,
    res
  );
};

/**
 * Delete a user
 */
exports.deleteUser = function(req, res) {
  var user = res.locals.user;
  var link = '';

  dbcontext.initTransaction(
    () => {
      return userLogic.delete(user, link);
    },
    req,
    res
  );
};

/**
 * List of users
 */
exports.userList = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return userLogic.list();
    },
    req,
    res
  );
};

/**
 * Load user form
 */
exports.loadUserForm = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return userLogic.loadForm(res.locals.user);
    },
    req,
    res
  );
};

/**
 * Search users by filter
 */
exports.searchUser = function(req, res) {
  const search = req.query;
  dbcontext.initTransaction(
    () => {
      return userLogic.search(search);
    },
    req,
    res
  );
};

/**
 * Cross access request
 */
exports.roleList = function(req, res) {
  var additionalWhere = [];

  dbcontext.initTransaction(
    () => {
      return roleLogic.list(additionalWhere);
    },
    req,
    res
  );
};

exports.changePassword = function(req, res) {
  var user = res.locals.user;
  var passwords = req.body;
  dbcontext.initTransaction(
    () => {
      return userLogic.changePassword(user, passwords);
    },
    req,
    res
  );
};
