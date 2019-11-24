const Sequelize = require('sequelize');
const StringDecoder = require('string_decoder').StringDecoder;
const ErrorEnums = require('../lib/enums/error');
const utils = require('../utils/utils');
const studentValidation = require('../validations/student.validation');

var student = dbcontext.sequelize.define(
  'student',
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
    status: {
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
          await studentValidation.onDeleteValidations(entity);
        } else {
          studentValidation.isFormComplete(entity);
          await studentValidation.onSaveValidations(entity);
        }
      },

      beforeDestroy: async (entity, options) => {
        await studentValidation.onDeleteValidations(entity);
      }
    },
    validate: {
      allRequiredFieldsAreFilled() {
        const requiredFields = ['status'];
        if (utils.isAnyFieldNullOrEmpty(this, requiredFields)) {
          throw new ErrorEnums.Enums.IncompleteFrom();
        }
      },
      validations() {}
    },
    freezeTableName: true,
    tableName: 'student'
  }
);

dbcontext.student = student;

student.belongsTo(dbcontext.user, { as: 'createdBy', constraints: false });
student.belongsTo(dbcontext.user, { as: 'updatedBy', constraints: false });
