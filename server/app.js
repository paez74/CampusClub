var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var config = require('./lib/config');
var jwt = require('express-jwt');
var routeAuth = require('./lib/routeAuth');
var _envelope = require('./lib/envelope');
var directory = require('serve-index');

var app = express();
var envelope = new _envelope.Enveloper();
app.use(cors());

// set database context
global.dbcontext = {};
require('./lib/database');

// authentication
routeAuth.setOtherPermissionsPaths(config.otherPermissionsPaths);
routeAuth.setFreePermissionsPaths(config.freePermissionsPaths);
app.use(
  jwt({
    secret: config.secret
  }).unless({
    path: config.exceptionPaths
  })
);

// Authentication
app.use(function(req, res, next) {
  routeAuth.isAllowed(req, res, next);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: false, limit: '2mb' }));
app.use(cookieParser());
app.use('/', express.static('./clients/client'));
app.use('/desktop', express.static('./desktop'));
app.use('/desktop', directory('./desktop'));
// define routes
require('./routes/app.router')(app);
require('./routes/login.router')(app);
require('./routes/fileStorage.router')(app);
require('./routes/role.router')(app);
require('./routes/user.router')(app);
require('./routes/notification.router')(app);
require('./routes/reports.router')(app);
require('./routes/faculty.router')(app);
require('./routes/student.router')(app);
require('./routes/person.router')(app);
require('./routes/role.router')(app);
require('./routes/user.router')(app);
require('./routes/campusClub.router')(app);
require('./routes/department.router')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
