const Sequelize = require('sequelize');
const StringDecoder = require('string_decoder').StringDecoder;
const ErrorEnums = require('../lib/enums/error');
const utils = require('../utils/utils');
const personValidation = require('../validations/person.validation');

var person = dbcontext.sequelize.define(
  'person',
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
    dob: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.VIRTUAL
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
          await personValidation.onDeleteValidations(entity);
        } else {
          personValidation.isFormComplete(entity);
          await personValidation.onSaveValidations(entity);
        }
      },

      beforeDestroy: async (entity, options) => {
        await personValidation.onDeleteValidations(entity);
      }
    },
    validate: {
      allRequiredFieldsAreFilled() {
        const requiredFields = ['dob', 'firstName', 'lastName'];
        if (utils.isAnyFieldNullOrEmpty(this, requiredFields)) {
          throw new ErrorEnums.Enums.IncompleteFrom();
        }
      },
      validations() {}
    },
    freezeTableName: true,
    tableName: 'person'
  }
);

dbcontext.person = person;

person.belongsTo(dbcontext.user, { as: 'createdBy', constraints: false });
person.belongsTo(dbcontext.user, { as: 'updatedBy', constraints: false });
