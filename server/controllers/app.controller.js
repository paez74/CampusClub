var _ = require('underscore');
const version = require('../lib/version');

exports.getMyUser = function(req, res) {
	res.json(res.locals.currentUser);
};

exports.getVersion = function(req, res) {
	res.json(version);
};
