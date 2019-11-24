const SuccessEnums = require('../lib/enums/success');

const campusClubLogic = require('../logics/campusClub.logic');

/**
 * campusClub middleware
 */
exports.campusClubByID = function(req, res, next, id) {
  dbcontext.initTransaction(
    () => {
      return campusClubLogic.getById(id, res);
    },
    req,
    res,
    next
  );
};

/**
 * Create a campusClub
 */
exports.createCampusClub = function(req, res) {
  dbcontext.initTransaction(
    () => {
      var campusClub = req.body;
      var link = '';
      return campusClubLogic.create(campusClub, link);
    },
    req,
    res
  );
};

/**
 * Show the current campusClub
 */
exports.readCampusClub = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return res.locals.campusClub ? res.locals.campusClub.toJSON() : {};
    },
    req,
    res
  );
};

/**
 * Update a campusClub
 */
exports.updateCampusClub = function(req, res) {
  const old_campusClub = res.locals.campusClub;
  const campusClub = req.body;
  var link = '';
  dbcontext.initTransaction(
    () => {
      return campusClubLogic.update(campusClub, old_campusClub, link);
    },
    req,
    res
  );
};

/**
 * Delete a campusClub
 */
exports.deleteCampusClub = function(req, res) {
  var campusClub = res.locals.campusClub;
  var link = '';

  dbcontext.initTransaction(
    () => {
      return campusClubLogic.delete(campusClub, link);
    },
    req,
    res
  );
};

/**
 * List of campusClubs
 */
exports.campusClubList = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return campusClubLogic.list();
    },
    req,
    res
  );
};

/**
 * Load campusClub form
 */
exports.loadCampusClubForm = function(req, res) {
  dbcontext.initTransaction(
    () => {
      return campusClubLogic.loadForm(res.locals.campusClub);
    },
    req,
    res
  );
};

/**
 * Search campusClubs by filter
 */
exports.searchCampusClub = function(req, res) {
  const search = req.query;
  dbcontext.initTransaction(
    () => {
      return campusClubLogic.search(search);
    },
    req,
    res
  );
};

/**
 * Cross access request
 */
