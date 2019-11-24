/**
 * User authentication library
 */

const jwt = require('jsonwebtoken');
const _ = require('underscore');
const config = require('./config');
const ErrorEnums = require('./enums/error');

let routeAuth = {};

const isAllowed = (req, res, next) => {
	const route = req.path.split('/');
	route.shift();

	const pathIsException = _.some(config.exceptionPaths, (x) => {
		return req.path.match(x) ? req.path.match(x)[0] : false;
	});

	if (pathIsException) {
		next();
		return;
	}

	const entity = route[1];
	const action = req.method;

	const token = getToken(req);

	if (!token) {
		next(new ErrorEnums.Enums.CredentialError());
		return;
	}

	const decodedToken = jwt.decode(token);

	if (!decodedToken || !decodedToken.userId) {
		next(new ErrorEnums.Enums.CredentialError());
		return;
	}

	const userId = decodedToken.userId;
	const authorization = getUserRoleAuthorization(userId, res);

	let permission = '';

	if (otherPermissionPaths.includes(`${entity}`)) {
		permission = [`${entity}`];
	} else if (entity === 'report') {
		permission = [`${route[2]}Report`];
	} else if (action === 'GET') {
		permission = [
			`${entity}Read`,
			`${entity}Create`,
			`${entity}Update`,
			`${entity}Delete`
		];
	} else if (action === 'POST') {
		permission = [`${entity}Create`];
	} else if (action === 'PUT') {
		permission = [`${entity}Update`];
	} else if (action === 'DELETE') {
		permission = [`${entity}Delete`];
	}

	authorization
		.then((currentUser) => {
			res.locals.currentUser = {
				user: currentUser.user,
				userId: userId,
				auth: currentUser.auth
			};
			if (_.some(permission, (x) => currentUser.auth[x])) {
				next();
			} else if (!!freePermissionsPaths.find((x) => req.path.includes(x))) {
				next();
			} else {
				next(new ErrorEnums.Enums.CredentialError());
			}
		})
		.catch(next);
};

const getUserRoleAuthorization = (userId) => {
	return dbcontext.user
		.findOne({
			attributes: ['username', 'email'],
			where: {
				deleted: false,
				id: userId
			},
			include: [
				{
					model: dbcontext.role,
					through: 'userrole',
					as: 'roles',
					where: {
						active: true
					},
					required: false
				}
			]
		})
		.then((user) => {
			if (user == null) {
				throw new ErrorEnums.Enums.UserNotFound();
			}
			const roles = user.roles;
			const condensedRole = {};
			if (user.roles[0]) {
				Object.keys(roles[0].dataValues).forEach((x) => {
					condensedRole[x] = _.some(roles, function(role) {
						return role[x];
					});
				});
			}
			return new Promise((resolve) =>
				resolve({ user: user, auth: condensedRole })
			);
		});
};

const getToken = (req) => {
	const tokenHeader = req.headers.authorization;

	if (!tokenHeader) {
		return null;
	}

	const token = tokenHeader.split(' ');

	if (token[0] !== 'Bearer') {
		return null;
	}

	return token[1];
};

routeAuth.isAllowed = isAllowed;

let otherPermissionPaths = [];

const setOtherPermissionsPaths = function(pathsArray) {
	otherPermissionPaths = pathsArray;
};

routeAuth.setOtherPermissionsPaths = setOtherPermissionsPaths;

let freePermissionsPaths = [];

const setFreePermissionsPaths = function(pathsArray) {
	freePermissionsPaths = pathsArray;
};

routeAuth.setFreePermissionsPaths = setFreePermissionsPaths;

module.exports = routeAuth;
