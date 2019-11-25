const Sequelize = require('sequelize');
const StringDecoder = require('string_decoder').StringDecoder;
const ErrorEnums = require('../lib/enums/error');
const utils = require('../utils/utils');
const studentfromValidation = require('../validations/studentfrom.validation');

var studentfrom = dbcontext.sequelize.define(
  'studentfrom',
  {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    hooks: {
      afterFind(response, options) {},

      //Password encryption
      beforeSave: async (entity, options) => {
        for (var property in entity.dataValues) {
          if (entity.dataValues[property] && entity.dataValues[property].trim) {
            entity.dataValues[property] = entity.dataValues[property].trim();
          }
        }
        if (entity.deleted) {
          await studentfromValidation.onDeleteValidations(entity);
        } else {
          await studentfromValidation.onSaveValidations(entity);
        }
      },

      beforeDestroy: async (entity, options) => {
        await studentfromValidation.onDeleteValidations(entity);
      }
    },
    validate: {
      validations() {}
    },
    freezeTableName: true,
    tableName: 'studentfrom'
  }
);

dbcontext.studentfrom = studentfrom;

studentfrom.belongsTo(dbcontext.user, { as: 'createdBy', constraints: false });
studentfrom.belongsTo(dbcontext.user, { as: 'updatedBy', constraints: false });

dbcontext.studentfrom.isHierarchy({ onDelete: 'CASCADE' }).sync();
