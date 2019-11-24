const Sequelize = require('sequelize');
const StringDecoder = require('string_decoder').StringDecoder;
const ErrorEnums = require('../lib/enums/error');
const utils = require('../utils/utils');
const facultyValidation = require('../validations/faculty.validation');

var faculty = dbcontext.sequelize.define(
  'faculty',
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
    },
    rank: {
      type: Sequelize.STRING,
      allowNull: false
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
          await facultyValidation.onDeleteValidations(entity);
        } else {
          facultyValidation.isFormComplete(entity);
          await facultyValidation.onSaveValidations(entity);
        }
      },

      beforeDestroy: async (entity, options) => {
        await facultyValidation.onDeleteValidations(entity);
      }
    },
    validate: {
      allRequiredFieldsAreFilled() {
        const requiredFields = ['rank'];
        if (utils.isAnyFieldNullOrEmpty(this, requiredFields)) {
          throw new ErrorEnums.Enums.IncompleteFrom();
        }
      },
      validations() {}
    },
    freezeTableName: true,
    tableName: 'faculty'
  }
);

dbcontext.faculty = faculty;

faculty.belongsTo(dbcontext.user, { as: 'createdBy', constraints: false });
faculty.belongsTo(dbcontext.user, { as: 'updatedBy', constraints: false });
