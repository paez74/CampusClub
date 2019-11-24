var multer = require('multer');
var upload = multer({
	limits: { fieldSize: 25 * 1024 * 1024 }
});
const fileStorage = require('../controllers/fileStorage.controller');

module.exports = function(app) {
	// Routes
	app
		.route('/api/fileStorage/')
		.post(upload.none(), fileStorage.createFileStorage);
	app
		.route('/api/fileStorage/image/:fileStorageId')
		.get(fileStorage.requestImage);
	app
		.route('/api/fileStorage/info/:fileStorageInfoId')
		.get(fileStorage.readFileStorage);
	app
		.route('/api/fileStorage/:fileStorageId')
		.get(fileStorage.readFileStorage)
		.put(upload.none(), fileStorage.updateFileStorage)
		.delete(fileStorage.deleteFileStorage);

	// Entity catch middleware
	app.param('fileStorageId', fileStorage.fileStorageByID);
	app.param('fileStorageInfoId', fileStorage.fileStorageInfoByID);
};
