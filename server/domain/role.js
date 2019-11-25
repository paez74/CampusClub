const Sequelize = require('sequelize');
const StringDecoder = require('string_decoder').StringDecoder;
const ErrorEnums = require('../lib/enums/error');
const utils = require('../utils/utils');
const roleValidation = require('../validations/role.validation');

var role = dbcontext.sequelize.define(
  'role',
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
    },
    description: {
      type: Sequelize.STRING
    },
    active: {
      type: Sequelize.BOOLEAN,

      defaultValue: true
    },
    facultyCreate: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    facultyRead: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    facultyUpdate: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    facultyDelete: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    studentfromCreate: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    studentfromRead: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    studentfromUpdate: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    studentfromDelete: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    studentCreate: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    studentRead: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    studentUpdate: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    studentDelete: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    personCreate: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    personRead: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    personUpdate: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    personDelete: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    roleCreate: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    roleRead: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    roleUpdate: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    roleDelete: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    userCreate: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    userRead: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    userUpdate: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    userDelete: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    campusClubCreate: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    campusClubRead: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    campusClubUpdate: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    campusClubDelete: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    departmentCreate: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    departmentRead: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    departmentUpdate: {
      type: Sequelize.BOOLEAN,

      defaultValue: false
    },
    departmentDelete: {
      type: Sequelize.BOOLEAN,

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
          await isNotRelated(entity);
          await roleValidation.onDeleteValidations(entity);
        } else {
          roleValidation.isFormComplete(entity);
          roleValidation.isNotUnique(entity);
          await roleValidation.onSaveValidations(entity);
        }
      },

      beforeDestroy: async (entity, options) => {
        await roleValidation.onDeleteValidations(entity);
      }
    },
    validate: {
      havePermissionActive() {
        var keys = Object.keys(dbcontext.role.attributes);
        var permissionKeys = keys.filter(
          (key) =>
            dbcontext.role.attributes[key].type.key == 'BOOLEAN' &&
            dbcontext.role.attributes[key].fieldName != 'deleted' &&
            dbcontext.role.attributes[key].fieldName != 'active'
        );
        var permissions = permissionKeys.map(
          (permissionKey) => this[permissionKey]
        );
        if (permissions.every((x) => x == false)) {
          throw new ErrorEnums.Enums.RoleNotHaveActivePermissions();
        }
      },
      async repeatName() {
        if (!this.deleted) {
          let self = this;
          await dbcontext.role
            .findAll({
              where: {
                deleted: false,
                name: this.name
              }
            })
            .then(function(roles) {
              if (roles.length > 1) {
                throw new ErrorEnums.Enums.RoleNameIsAlreadyTaken();
              }
              if (roles.length == 1 && roles[0].id != self.id) {
                throw new ErrorEnums.Enums.RoleNameIsAlreadyTaken();
              }
            });
        }
      },
      allRequiredFieldsAreFilled() {
        const requiredFields = ['code', 'name'];
        if (utils.isAnyFieldNullOrEmpty(this, requiredFields)) {
          throw new ErrorEnums.Enums.IncompleteFrom();
        }
      },
      validations() {}
    },
    freezeTableName: true,
    tableName: 'role'
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
    const count = await dbcontext.role.count({ where: whereClause });
    if (count > 0) {
      throw new ErrorEnums.Enums.ElementNotUnique().setMessageVars(displays[i]);
    }
  }
}

async function isNotRelated(entity) {
  const count = await dbcontext.role.count({
    where: {
      id: entity.id
    },
    include: [
      {
        model: dbcontext.user,
        as: 'roles',
        where: {
          deleted: false
        },
        required: true
      }
    ]
  });
  if (count > 0) {
    throw new ErrorEnums.Enums.RoleRelatedToUser();
  }
}

dbcontext.role = role;

role.belongsTo(dbcontext.user, { as: 'createdBy', constraints: false });
role.belongsTo(dbcontext.user, { as: 'updatedBy', constraints: false });
