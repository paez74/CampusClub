var _ = require('underscore');
const Sequelize = require('sequelize');
const StringDecoder = require('string_decoder').StringDecoder;

/**
 * fileStorage middleware
 */
const getByIdPromise = async (id, res) => {
	const fileStorage = await dbcontext.fileStorage
		.findOne({
			attributes: [
				'id',
				'mime',
				'data',
				'name',
				'createdAt',
				'updatedAt',
				[
					Sequelize.fn(
						'concat',
						Sequelize.col('createdBy.firstName'),
						' ',
						Sequelize.col('createdBy.lastName')
					),
					'createdByString'
				],
				[
					Sequelize.fn(
						'concat',
						Sequelize.col('updatedBy.firstName'),
						' ',
						Sequelize.col('updatedBy.lastName')
					),
					'updatedByString'
				]
			],
			where: {
				id: id
			},
			include: [
				{
					model: dbcontext.user,
					as: 'createdBy',
					attributes: []
				},
				{
					model: dbcontext.user,
					as: 'updatedBy',
					attributes: []
				}
			]
		});
	if (res) res.locals.fileStorage = fileStorage;
	return fileStorage;
}

/**
 * fileStorage middleware
 */
const getInfoByIdPromise = async (id, res) => {
	const fileStorage = await dbcontext.fileStorage
		.findOne({
			attributes: ['id', 'mime', 'name'],
			where: {
				id: id
			}
		});
	if (res) res.locals.fileStorage = fileStorage;
	return fileStorage;
}

/**
 * Create a fileStorage
 */
const createPromise = async (fileStorage) => {
	const fileStorageEntity = await dbcontext.fileStorage
		.create(fileStorage);
		
	var promises = [];
	await Promise.all(promises);

	return {
		id: fileStorageEntity.id
	};
}

/**
 * Update a fileStorage
 */
const updatePromise = async (fileStorage, old_fileStorage) => {
	fileStorage = _.extend(old_fileStorage, fileStorage);

	if (!fileStorage.save) {
		fileStorage = dbcontext.fileStorage.build(fileStorage);
		fileStorage.isNewRecord = false;
	}

	fileStorage = await fileStorage.save();
		
	const promises = [];
	await Promise.all(promises);

	return {
		id: fileStorage.id
	};
}

/**
 * Delete a fileStorage
 */
const deletePromise = async (fileStorage) => {
	fileStorage = await dbcontext.fileStorage.findOne({
		where: { id: fileStorage.id },
	});
	return await fileStorage.destroy({
		force: true
	});
}

/**
 * request an image
 */
const requestMediaFromFile = async (file) => {
	return await new Promise((resolve, reject) => {
		const decoder = new StringDecoder('utf8');
		const data = decoder.write(file.data);

		const base64Data = `data:${file.mime};base64,${data}`;
		resolve(base64Data);
	});
}

// * START - Export modules * //
exports.getById = getByIdPromise

exports.getInfoById = getInfoByIdPromise

exports.create = createPromise

exports.update = updatePromise

exports.delete = deletePromise

exports.requestImage = requestMediaFromFile

// * END - Export modules * //