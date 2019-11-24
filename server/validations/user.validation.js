const Sequelize = require('sequelize');
const moment = require('moment');
const utils = require('../utils/utils');
const ErrorEnums = require('../lib/enums/error');

exports.isNotUnique = async (entity) => {
  const uniqueFields = ['username', 'email'];
  const uniqueLabels = ['Usuario', 'Correo'];
  for (let i = 0; i < uniqueFields.length; i++) {
    let whereClause = {
      id: { [Sequelize.Op.not]: entity.id },
      deleted: false
    };
    whereClause[uniqueFields[i]] = entity[uniqueFields[i]];
    const count = await dbcontext.user.count({ where: whereClause });
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
  const requiredFields = ['username', 'email'];
  if (utils.isAnyFieldNullOrEmpty(entity, requiredFields)) {
    throw new ErrorEnums.Enums.IncompleteFrom();
  }
};

exports.isCurrentUser = async (req, res, next) => {
  const currentUserId = res.locals.currentUser.userId;
  if (req.params.userId === currentUserId) {
    next(new ErrorEnums.Enums.CantDeleteCurrentUser());
  }
  next();
};
