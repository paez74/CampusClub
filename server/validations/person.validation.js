const Sequelize = require('sequelize');
const moment = require('moment');
const utils = require('../utils/utils');
const ErrorEnums = require('../lib/enums/error');

exports.onSaveValidations = (entity) => {};

exports.onDeleteValidations = (entity) => {};

exports.isFormComplete = (entity) => {
  const requiredFields = ['dob', 'firstName', 'lastName'];
  if (utils.isAnyFieldNullOrEmpty(entity, requiredFields)) {
    throw new ErrorEnums.Enums.IncompleteFrom();
  }
};
