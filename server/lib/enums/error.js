class ErrorMessage extends Error {
  constructor(code, message, statusCode, fieldKey) {
    super(message);
    this.code = code;
    this.message = message;
    this.statusCode = statusCode;
    this.fieldKey = fieldKey;
  }

  setMessageVars(...vars) {
    var format = function() {
      var args = arguments;
      return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
      });
    };
    this.message = format.call(this.message, ...vars);
    return this;
  }
}
exports.ErrorMessage = ErrorMessage;

exports.Enums = Object.freeze({
  ServerError: ErrorMessage.bind(
    this,
    'SERVER_ERROR',
    'Algo salio muy mal',
    500
  ),
  ExpiredSession: ErrorMessage.bind(
    this,
    'EXPIRED_SESSION',
    'La sesión es inválida, intenta iniciando sesión nuevamente.',
    401
  ),
  CredentialError: ErrorMessage.bind(
    this,
    'CREDENTIAL_ERROR',
    'Usuario y/o password no valido, favor de verificar',
    401
  ),
  UserNotFound: ErrorMessage.bind(
    this,
    'USER_NOT_FOUND',
    'Usuario no encontrado, favor de verificarlo con el adminsitrador',
    404
  ),
  TokenNotFound: ErrorMessage.bind(
    this,
    'TOKEN_NOT_FOUND',
    'El enlace para recuperar contraseña parece no estar disponible o ya fue usado, inténtalo nuevamente mas tarde.',
    404
  ),
  CantCreatePassword: ErrorMessage.bind(
    this,
    'CANT_CREATE_PASSWORD',
    'No se pudo generar una nueva contraseña.',
    400
  ),
  CantSendRestorePasswordLink: ErrorMessage.bind(
    this,
    'CANT_SEND_RESTORE_PASSWORD_LINK',
    'No se pudo enviar el correo de recuperación, inténtalo mas tarde.',
    406
  ),
  PasswordConfirmationNotMatch: ErrorMessage.bind(
    this,
    'PASSWORD_CONFIRMATION_NOT_MATCH',
    'El password nuevo no coincide con su confirmación, favor de verificar.',
    400
  ),
  CurrentPasswordNotMatch: ErrorMessage.bind(
    this,
    'CURRENT_PASSWORD_NOT_MATCH_WITH',
    'El password actual no coincide con el del usuario, favor de intentarlo nuevamente.',
    400
  ),
  IncompleteFrom: ErrorMessage.bind(
    this,
    'INCOMPLETE_FORM',
    'Debe de llenar todos los campos',
    400
  ),
  VariablesNotMatch: ErrorMessage.bind(
    this,
    'VARIABLES_NOT_MATCH',
    'Una o varias variables no conciden con el tipo de variable',
    400
  ),
  UniqueField: ErrorMessage.bind(
    this,
    'UNIQUE_FIELD',
    'Uno o más de los valores en la forma ya estan asignados',
    400
  ),
  UniqueCode: ErrorMessage.bind(
    this,
    'UNIQUE_CODE',
    'El código ya se encuentra registrado',
    400
  ),
  UniqueAlias: ErrorMessage.bind(
    this,
    'UNIQUE_ALIAS',
    'Ese usuario ya está registrado.',
    400
  ),
  UniqueEmail: ErrorMessage.bind(
    this,
    'UNIQUE_EMAIL',
    'Ese correo electrónico ya está registrado.',
    400
  ),
  ConflictRoleAttached: ErrorMessage.bind(
    this,
    'CONFLICT_ROLE_ATTACHED',
    'El rol tiene usuarios registrados.',
    400
  ),

  RoleNotHaveActivePermissions: ErrorMessage.bind(
    this,
    'ROLE_HOT_HAVE_PERMISSIONS',
    'El rol requiere como mínimo un permiso configurado',
    406
  ),
  RoleNameIsAlreadyTaken: ErrorMessage.bind(
    this,
    'ROLE_NAME_IS_ALREADY_TAKEN',
    'El nombre del rol ya esta registrado',
    406,
    'name'
  ),
  RoleRelatedToUser: ErrorMessage.bind(
    this,
    'ROLE_RELATED_TO_USER',
    'Este rol esta relacionado con uno o más usuarios',
    406
  ),

  CreateError: ErrorMessage.bind(
    this,
    'CREATE_ERROR',
    'Ocurrió un problema al guardar el registro.',
    500
  ),
  ReadError: ErrorMessage.bind(
    this,
    'READ_ERROR',
    'Ocurrió un problema al traer el registro.',
    404
  ),
  UpdateError: ErrorMessage.bind(
    this,
    'UPDATE_ERROR',
    'Ocurrió un problema al editar el registro.',
    500
  ),
  DeleteError: ErrorMessage.bind(
    this,
    'DELETE_ERROR',
    'Ocurrió un problema al eliminar el registro.',
    500
  ),

  Confict: ErrorMessage.bind(this, 'CONFICT', 'Confict', 409),
  Unauthorized: ErrorMessage.bind(
    this,
    'UNAUTHORIZED',
    'Usuario no Autorizado',
    403
  ),
  NotAcceptable: ErrorMessage.bind(this, 'NOT_ACCEPTABLE', 'Inaceptable', 406),
  NotDataToExport: ErrorMessage.bind(
    this,
    'NOT_DATA_TO_EXPORT',
    'No hay datos para exportar',
    400
  ),
  NotImplemented: ErrorMessage.bind(
    this,
    'NOT_IMPLEMENTED',
    'Metodo no implementado',
    500
  ),

  RegexDoesntMatch: ErrorMessage.bind(
    this,
    'REGEX_DOESNT_MATCH',
    'El patrón del campo no coincide.',
    400
  ),
  ValidationError: ErrorMessage.bind(
    this,
    'VALIDATION_ERROR',
    'Error de validación',
    400
  ),
  CantDeleteCurrentUser: ErrorMessage.bind(
    this,
    'CANT_DELETE_CURRENT_USER',
    'No se puede eliminar el usuario activo.',
    400
  ),
  ElementNotUnique: ErrorMessage.bind(
    this,
    'ELEMENT_NOT_UNIQUE',
    'El campo {0} esta repetido.',
    400
  )
});
