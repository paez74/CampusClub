const SuccessEnums = require('../lib/enums/success');
const ErrorEnums = require('../lib/enums/error');

const fileStorageLogic = require('../logics/fileStorage.logic');

/**
 * fileStorage middleware
 */
exports.fileStorageByID = function(req, res, next, id) {
	dbcontext.initTransaction(() => {
		return fileStorageLogic.getById(id, res);
	}, req, res, next);
};

exports.fileStorageInfoByID = function(req, res, next, id) {
	dbcontext.initTransaction(() => {
		return fileStorageLogic.getInfoById(id,res);
	}, req, res, next);
};

/**
 * Show the current fileStorage
 */
exports.readFileStorage = function(req, res, next) {
	dbcontext.initTransaction(() => {
		return res.locals.fileStorage
		? res.locals.fileStorage.toJSON()
		: {};
	}, req, res);
};

/**
 * request image fileStorage
 */
exports.requestImage = function(req, res, next) {
	const fileStorage = res.locals.fileStorage;

	dbcontext.initTransaction(() => {
		return fileStorageLogic.requestImage(fileStorage);
	},req, res);
};

/**
 * Create a fileStorage
 */
exports.createFileStorage = function(req, res) {
	var cancelRequest = false;

	req.on('close', function(err) {
		cancelRequest = true;
	});

	dbcontext.initTransaction(() => {
		const fileStorage = req.body;
		const results = fileStorageLogic.create(fileStorage);
		if (cancelRequest) {
			throw new ErrorEnums.Enums.ClientClosedRequest();
		}
		return results;
	}, req, res)
};

/**
 * Update a fileStorage
 */
exports.updateFileStorage = function(req, res, next) {
	const cancelRequest = false;

	req.on('close', (err) => {
		cancelRequest = true;
	});

	const old_fileStorage = res.locals.fileStorage;
	const fileStorage = req.body;
	dbcontext.initTransaction(() => {
		const results = fileStorageLogic.update(fileStorage, old_fileStorage);
		if (cancelRequest) {
			throw new ErrorEnums.Enums.ClientClosedRequest();
		}
		return results;
	}, req, res);
};

/**
 * Delete a fileStorage
 */
exports.deleteFileStorage = function(req, res, next) {
	const fileStorage = res.locals.fileStorage;

	dbcontext.initTransaction(() => {
		return fileStorageLogic
			.delete(fileStorage);
	}, req, res);
};

