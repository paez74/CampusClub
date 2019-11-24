const Sequelize = require('sequelize');
const StringDecoder = require('string_decoder').StringDecoder;
const ErrorEnums = require('../lib/enums/error');
const utils = require('../utils/utils');
const departmentValidation = require('../validations/department.validation');

var department = dbcontext.sequelize.define(
  'department',
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
    code: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
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
          await departmentValidation.onDeleteValidations(entity);
        } else {
          departmentValidation.isFormComplete(entity);
          departmentValidation.isNotUnique(entity);
          await departmentValidation.onSaveValidations(entity);
        }
      },

      beforeDestroy: async (entity, options) => {
        await departmentValidation.onDeleteValidations(entity);
      }
    },
    validate: {
      allRequiredFieldsAreFilled() {
        const requiredFields = ['code', 'name'];
        if (utils.isAnyFieldNullOrEmpty(this, requiredFields)) {
          throw new ErrorEnums.Enums.IncompleteFrom();
        }
      },
      validations() {}
    },
    freezeTableName: true,
    tableName: 'department'
  }
);

async function isNotUnique(entity, fields, displays) {
  for (let i = 0; i < fields.length; i++) {
    let whereClause = {
      id: { [Sequelize.Op.not]: entity.id },
      deleted: false
    };
    if (entity[fields[i]] && entity[fields[i]].trim) {
      whereClause[fields[i]] = utils.removeDiacritics(entity[fields[i]].trim());
    }
    const count = await dbcontext.department.count({ where: whereClause });
    if (count > 0) {
      throw new ErrorEnums.Enums.ElementNotUnique().setMessageVars(displays[i]);
    }
  }
}

dbcontext.department = department;

department.belongsTo(dbcontext.user, { as: 'createdBy', constraints: false });
department.belongsTo(dbcontext.user, { as: 'updatedBy', constraints: false });
