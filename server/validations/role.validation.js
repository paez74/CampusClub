const Sequelize = require('sequelize');
const moment = require('moment');
const utils = require('../utils/utils');
const ErrorEnums = require('../lib/enums/error');

exports.isNotUnique = async (entity) => {
  const uniqueFields = ['code'];
  const uniqueLabels = ['Perfil'];
  for (let i = 0; i < uniqueFields.length; i++) {
    let whereClause = {
      id: { [Sequelize.Op.not]: entity.id },
      deleted: false
    };
    whereClause[uniqueFields[i]] = entity[uniqueFields[i]];
    const count = await dbcontext.role.count({ where: whereClause });
    if (count > 0) {
      throw new ErrorEnums.Enums.ElementNotUnique().setMessageVars(
        uniqueLabels[i]
      );
    }
  }
};

exports.onSaveValidations = (entity) => {};

exports.onDeleteValidations = (entity) => {};

exports.isFormComplete = (entity) => {
  const requiredFields = ['code', 'name'];
  if (utils.isAnyFieldNullOrEmpty(entity, requiredFields)) {
    throw new ErrorEnums.Enums.IncompleteFrom();
  }
};
