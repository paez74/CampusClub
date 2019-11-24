module.exports = {
  version: '1.0',
  secret: '123',
  db: {
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'postgres',
    database: 'campusClub',
    delete: false,
    logging: false
  },
  notification: {
    email: 'paez74@live.com.mx',
    password: 'TavoPaez3',
    port: '587',
    host: 'smtp.live.com',
    allowEmailNotifications: false
  },
  exceptionPaths: [
    '/api/login',
    '/desktop',
    '/api/app/version',
    new RegExp('^/*(?!api)', 'i'),
    new RegExp('/workspaces.*', 'i')
  ],
  otherPermissionsPaths: [],
  freePermissionsPaths: [
    '/api/app',
    'api/user/changepassword/',
    '/api/fileStorage',
    '/api/notification'
  ]
};
