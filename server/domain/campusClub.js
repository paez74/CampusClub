const Sequelize = require('sequelize');
const StringDecoder = require('string_decoder').StringDecoder;
const ErrorEnums = require('../lib/enums/error');
const utils = require('../utils/utils');
const campusClubValidation = require('../validations/campusClub.validation');

var campusClub = dbcontext.sequelize.define(
  'campusClub',
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
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    locationLatitude: {
      type: Sequelize.DECIMAL(18, 15),
      allowNull: false
    },
    locationLongitude: {
      type: Sequelize.DECIMAL(18, 15),
      allowNull: false
    },
    phone: {
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
          await campusClubValidation.onDeleteValidations(entity);
        } else {
          campusClubValidation.isFormComplete(entity);
          campusClubValidation.isNotUnique(entity);
          await campusClubValidation.onSaveValidations(entity);
        }
      },

      beforeDestroy: async (entity, options) => {
        await campusClubValidation.onDeleteValidations(entity);
      }
    },
    validate: {
      allRequiredFieldsAreFilled() {
        const requiredFields = [
          'name',
          'locationLatitude',
          'locationLongitude',
          'phone'
        ];
        if (utils.isAnyFieldNullOrEmpty(this, requiredFields)) {
          throw new ErrorEnums.Enums.IncompleteFrom();
        }
      },
      validations() {}
    },
    freezeTableName: true,
    tableName: 'campusClub'
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
    const count = await dbcontext.campusClub.count({ where: whereClause });
    if (count > 0) {
      throw new ErrorEnums.Enums.ElementNotUnique().setMessageVars(displays[i]);
    }
  }
}

dbcontext.campusClub = campusClub;

campusClub.belongsTo(dbcontext.user, { as: 'createdBy', constraints: false });
campusClub.belongsTo(dbcontext.user, { as: 'updatedBy', constraints: false });
