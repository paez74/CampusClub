var chalk = require('chalk');
var config = require('./config');
var datainit = require('./datainit');
var sequelizeHelper = require('./sequelize-helper');
var Sequelize = require('sequelize');
var cls = require('cls-hooked');
var _envelope = require('./envelope');

var envelope = new _envelope.Enveloper();
// Creatig Continuation Local Storage
var namespace = cls.createNamespace('r4');
Sequelize.useCLS(namespace);

// Sequelize plugins
require('sequelize-hierarchy')(Sequelize);

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },

    logging: config.db.logging,
    operatorsAliases: false
  }
);

dbcontext.sequelize = sequelize;

dbcontext.helper = sequelizeHelper;

sequelize
  .authenticate()
  .then(() => {
    console.log(chalk.default.green('Connected to postgres!'));
  })
  .catch((error) => {
    console.error(chalk.default.red('Could not connect to postgres!'));
    console.error(error);
  });

// Transactions
dbcontext.initTransaction = function(closure, req, res, next) {
  return dbcontext.sequelize
    .transaction((transaction) => {
      return closure();
    })
    .then((data) => {
      if (next) next();
      else {
        data = envelope.evaluate(data);
        // render the error page
        res.status(data.statusCode || data.status || 500).send(data);
      }
    })
    .catch((error) => {
      error = envelope.evaluate(error);
      res.status(400).send({ message: error.message });
    });
};

// Include all models
require('../domain/user');
require('../domain/role');
require('../domain/notification');
require('../domain/fileStorage');
require('../domain/dbupdateHistory');
require('./../domain/faculty');
require('./../domain/studentfrom');
require('./../domain/student');
require('./../domain/person');
require('./../domain/role');
require('./../domain/user');
require('./../domain/campusClub');
require('./../domain/department');

// Relationships
dbcontext.faculty.belongsTo(dbcontext.department, {
  as: 'worksIn',
  onDelete: 'RESTRICT'
});
dbcontext.student.belongsToMany(dbcontext.campusClub, {
  as: 'memberOfs',
  onDelete: 'RESTRICT',
  through: 'studentcampusClub'
});
dbcontext.campusClub.belongsToMany(dbcontext.student, {
  as: 'memberOfs',
  onDelete: 'RESTRICT',
  through: 'studentcampusClub'
});
dbcontext.student.belongsTo(dbcontext.department, {
  as: 'major',
  onDelete: 'RESTRICT'
});
dbcontext.user.belongsTo(dbcontext.fileStorage, {
  as: 'image',
  onDelete: 'RESTRICT'
});
dbcontext.user.belongsToMany(dbcontext.role, {
  as: 'roles',
  onDelete: 'RESTRICT',
  through: 'userrole'
});
dbcontext.role.belongsToMany(dbcontext.user, {
  as: 'roles',
  onDelete: 'RESTRICT',
  through: 'userrole'
});
dbcontext.campusClub.belongsTo(dbcontext.faculty, {
  as: 'advisor',
  onDelete: 'RESTRICT'
});

sequelize
  .sync({ force: config.db.delete })
  .then(() => {
    datainit.initialize();
  })
  .catch((error) => {
    console.error(chalk.default.red(error));
  });
