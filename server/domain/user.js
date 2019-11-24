const Sequelize = require('sequelize');
const StringDecoder = require('string_decoder').StringDecoder;
const ErrorEnums = require('../lib/enums/error');
const utils = require('../utils/utils');
const bcrypt = require('bcrypt');
const userValidation = require('../validations/user.validation');

var user = dbcontext.sequelize.define(
  'user',
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
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    active: {
      type: Sequelize.BOOLEAN,

      defaultValue: 1
    },
    recoveryCounter: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
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
        if (entity.password && entity.changed('password')) {
          entity.password = entity.hashPassword(entity.password);
        }

        if (entity.passwordConfirm && entity.changed('passwordConfirm')) {
          entity.passwordConfirm = entity.hashPassword(entity.password);
        }

        if (entity.recoveryAnswer && entity.changed('recoveryAnswer')) {
          entity.recoveryAnswer = entity.hashPassword(entity.recoveryAnswer);
        }

        if (entity.changed('active') && entity.active) {
          entity.recoveryCounter = 0;
        }
        if (entity.deleted) {
          await userValidation.onDeleteValidations(entity);
        } else {
          userValidation.isFormComplete(entity);
          userValidation.isNotUnique(entity);
          await userValidation.onSaveValidations(entity);
        }
      },

      beforeDestroy: async (entity, options) => {
        await userValidation.onDeleteValidations(entity);
      }
    },
    validate: {
      allRequiredFieldsAreFilled() {
        const requiredFields = ['username', 'email'];
        if (utils.isAnyFieldNullOrEmpty(this, requiredFields)) {
          throw new ErrorEnums.Enums.IncompleteFrom();
        }
      },
      validations() {}
    },
    freezeTableName: true,
    tableName: 'user'
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
    const count = await dbcontext.user.count({ where: whereClause });
    if (count > 0) {
      throw new ErrorEnums.Enums.ElementNotUnique().setMessageVars(displays[i]);
    }
  }
}

user.prototype.hashPassword = function(password) {
  return bcrypt.hashSync(password, 10);
};

user.prototype.authenticate = function(password) {
  var user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, function(err, result) {
      if (result) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

dbcontext.user = user;

user.belongsTo(dbcontext.user, { as: 'createdBy', constraints: false });
user.belongsTo(dbcontext.user, { as: 'updatedBy', constraints: false });
