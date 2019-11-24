var _ = require('underscore');
var config = require('../lib/config');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var userLogic = require('../logics/user.logic');
const SuccessEnums = require('../lib/enums/success');

exports.login = function(req, res) {
  var login = req.body;

  dbcontext.user
    .findOne({
      where: {
        username: login.username,
        deleted: false
      },
      include: [
        {
          model: dbcontext.role,
          through: 'userrole',
          as: 'roles',
          where: {
            active: true
          },
          required: false
        }
      ]
    })
    .then(function(user) {
      if (!user) {
        res.status(401).send('Usuario no existe.');
        return;
      }
      if (!user.active) {
        res.status(401).send('Usuario bloqueado.');
        return;
      }
      user.authenticate(login.password).then((result) => {
        if (result) {
          user.active = true;
          user.recoveryCounter = 0;
          user.save();
          res.json({
            token: jwt.sign({ userId: user.id }, config.secret),
            userId: user.id,
            credentials: getCredentials(user)
          });
        } else {
          res.status(401).send('No autorizado.');
        }
      });
    })
    .catch(function(error) {
      res.status(401).send(error);
    });
};

// Login helpers
function getCredentials(user) {
  const condensedRole = {};
  if (user.roles[0]) {
    Object.keys(user.roles[0].dataValues).forEach((x) => {
      condensedRole[x] = _.some(user.roles, function(role) {
        return role[x];
      });
    });
  }
  return JSON.stringify(condensedRole);
}

exports.generatePassword = function(req, res, next) {
  var email = req.body.email;
  console.log(email);
  return dbcontext.user
    .findOne({
      where: {
        email: email,
        deleted: false,
        active: true
      }
    })
    .then(function(user) {
      if (!user) {
        res.status(401).send('Este correo no esta ligado a ningun usuario.');
        return;
      }
      if (!user.active) {
        res.status(401).send('Este usuario esta bloqueado.');
        return;
      }

      var newpass =
        Math.random()
          .toString(36)
          .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15);
      user.password = newpass;
      dbcontext.sequelize.transaction(function(transaction) {
        const link = req.headers.origin + '/#/login';
        return userLogic
          .generatePassword(user.username, newpass, link)
          .then((results) => {
            return res.json({
              message: 'Contraseña Actualizada correctamente'
            });
          });
      });
    })
    .catch(function(error) {
      res.status(401).send(error);
    });
};
