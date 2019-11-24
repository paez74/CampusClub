var chalk = require('chalk');
const ErrorEnums = require('../lib/enums/error');
const SuccessEnums = require('../lib/enums/success');

exports.Enveloper = class Enveloper {
	evaluate(data) {
		if (data instanceof Error) {
			return this.error(data);
		} else {
			return this.success(data);
		}
	}

	success(data) {
		if (data instanceof SuccessEnums.SuccessMessage) {
			return data;
		}
		return {
			success: SuccessEnums.Enums.RequestSucceeded,
			message: SuccessEnums.Enums.RequestSucceeded.message,
			data: data,
			statusCode: 200
		};
	}

	error(data) {
		console.error(chalk.default.red(data.message));
		console.error(chalk.default.red(data.stack));

		const envelop = {};

		const validate = this.validateError(data);

		envelop.error = validate.enum;
		envelop.message = validate.message ? validate.message : null;
		envelop.statusCode = validate.statusCode ? validate.statusCode : 500;
		if (validate.validationErrors) {
			envelop.validationErrors = validate.validationErrors;
		}

		return envelop;
	}

	validateError(error) {
		if (error.name === 'SequelizeValidationError') {
			const validationErrors = error.errors.filter(
				(x) => x.type !== 'notNull Violation'
			);
			return {
				enum: new ErrorEnums.Enums.NotAcceptable(),
				message: validationErrors[0].message,
				statusCode: new ErrorEnums.Enums.NotAcceptable().statusCode,
				validationErrors: validationErrors.map((x) => {
					return {
						message: x.message,
						code: x.__raw.code,
						fieldKey: x.__raw.fieldKey
					};
				})
			};
		}

		if (
			error.name === 'SequelizeUniqueConstraintError' &&
			error.fields &&
			error.fields.email
		) {
			return {
				enum: ErrorEnums.Enums.UniqueField,
				message: Object['entries'](error.fields).reduce((message, [k, v]) => {
					message += `El correo "${v}" ya está asignado favor de utilizar otro.\n `;
					return message;
				}, ''),
				statusCode: 400
			};
		}

		if (
			error.name === 'SequelizeUniqueConstraintError' &&
			error.fields &&
			error.fields.alias
		) {
			return {
				enum: ErrorEnums.Enums.UniqueField,
				message: Object['entries'](error.fields).reduce((message, [k, v]) => {
					message += `El alias "${v}" ya está asignado favor de utilizar otro.\n `;
					return message;
				}, ''),
				statusCode: 400
			};
		}

		if (error.name === 'SequelizeUniqueConstraintError') {
			return {
				enum: ErrorEnums.Enums.UniqueField,
				message: Object['entries'](error.fields).reduce((message, [k, v]) => {
					message += `El valor ${v} ya está asignado favor de utilizar otro valor.\n `;
					return message;
				}, ''),
				statusCode: 400
			};
		}

		if (
			error.name === 'SequelizeForeignKeyConstraintError' &&
			(error.fields
				? error.fields.includes('createdById') ||
				  error.fields.includes('updatedById')
				: false)
		) {
			return {
				enum: ErrorEnums.Enums.UniqueField,
				message: `La sesión actual expiro o es inválida, ingresa nuevamente.\n `,
				statusCode: 401
			};
		}

		return {
			enum: error ? error : ErrorEnums.Enums.ServerError,
			message: error ? error.message : ErrorEnums.Enums.ServerError.message,
			statusCode: error
				? error.statusCode
				: ErrorEnums.Enums.ServerError.statusCode
		};
	}
};
