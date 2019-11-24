class SuccessMessage {
	constructor(code, message, data, statusCode) {
		this.code = code;
		this.message = message;
		this.statusCode = statusCode ? statusCode : 200;
		this.data = data;
	}

	setData(data) {
		this.data = data;
		return this;
	}
}

exports.SuccessMessage = SuccessMessage;

exports.Enums = Object.freeze({
	RequestSucceeded: SuccessMessage.bind(
		this,
		'REQUEST_SUCCEEDED',
		'La petición se ha completado exitosamente.'
	),
	NewPasswordCreated: SuccessMessage.bind(
		this,
		'NEW_PASSWORD_CREATED',
		'La nueva contraseña se a enviado a tu cuenta de correo electrónico.'
	),
	RestorePasswordMailSended: SuccessMessage.bind(
		this,
		'RESTORE_PASSWORD_MAIL_SENDED',
		'Las instrucciones para restablecer tu contraseña se han enviado a tu cuenta de correo electrónico.'
	),
	PasswordUpdated: SuccessMessage.bind(
		this,
		'PASSWORD_UPDATED',
		'La contraseña se ha actualizado correctamente.'
	),

	CreateSucceeded: SuccessMessage.bind(
		this,
		'CREATE_SUCCEEDED',
		'Se creó exitosamente.'
	),
	UpdateSucceded: SuccessMessage.bind(
		this,
		'UPDATE_SUCCEEDED',
		'Se editó exitosamente.'
	),
	DeleteSucceeded: SuccessMessage.bind(
		this,
		'DELETE_SUCCEEDED',
		'Se eliminó exitosamente.'
	)
});
