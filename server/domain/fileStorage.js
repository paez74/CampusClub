const Sequelize = require('sequelize');
const StringDecoder = require('string_decoder').StringDecoder;
var ErrorEnums = require('../lib/enums/error');

var fileStorage = dbcontext.sequelize.define(
	'fileStorage',
	{
		id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV1,
			primaryKey: true
		},
		mime: {
			type: Sequelize.STRING
		},
		data: {
			type: Sequelize.BLOB('long')
		},
		name: {
			type: Sequelize.STRING
		}
	},
	{
		hooks: {
			afterFind(response, options) {
				if (response instanceof Array) return;
				const decoder = new StringDecoder('utf8');
				if (response.data) {
					response.data = decoder.write(response.data);
				}
			}
		},
		validate: {}
	}
);

dbcontext.fileStorage = fileStorage;

fileStorage.belongsTo(dbcontext.user, { as: 'createdBy', constraints: false });
fileStorage.belongsTo(dbcontext.user, { as: 'updatedBy', constraints: false });
