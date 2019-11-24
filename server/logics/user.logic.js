var _ = require('underscore');
const q = require('q');
const Sequelize = require('sequelize');
const Readable = require('stream').Readable;
const moment = require('moment-timezone');
const mailer = require('../lib/mailer');
const utils = require('../utils/utils');
const ErrorEnums = require('../lib/enums/error');

class ListAttributes {
  constructor(where, as) {
    this.where = where;
    this.model = dbcontext.user;
    this.as = as;
    this.order = [];
    this.attributes = [
      'id',
      'username',
      'password',
      'firstName',
      'lastName',
      'email',
      'active'
    ];
    this.include = [
      {
        model: dbcontext.role,
        as: 'roles',
        through: { attributes: [] }
      }
    ];
  }

  toJSON() {
    return {
      include: this.include,
      attributes: this.attributes,
      where: this.where,
      model: this.model,
      as: this.as,
      required: false,
      order: this.order
    };
  }
}

/**
 * user middleware
 */
const getByIdPromise = async (id, res) => {
  const user = await dbcontext.user.findOne({
    attributes: [
      'id',
      'username',
      'firstName',
      'lastName',
      'email',
      'active',
      'imageId',
      'createdAt',
      'updatedAt',
      'createdById',
      [
        Sequelize.fn(
          'concat',
          Sequelize.col('createdBy.firstName'),
          ' ',
          Sequelize.col('createdBy.lastName')
        ),
        'createdByString'
      ],
      [
        Sequelize.fn(
          'concat',
          Sequelize.col('updatedBy.firstName'),
          ' ',
          Sequelize.col('updatedBy.lastName')
        ),
        'updatedByString'
      ]
    ],
    where: {
      id: id,
      deleted: false
    },
    include: [
      {
        model: dbcontext.role,
        as: 'roles',
        through: { attributes: [] }
      },
      {
        model: dbcontext.user,
        as: 'createdBy',
        attributes: []
      },
      {
        model: dbcontext.user,
        as: 'updatedBy',
        attributes: []
      }
    ]
  });

  if (res) res.locals.user = user;
  return user;
};

/**
 * FindOne by where query
 */
const findOnePromise = async (whereQuery) => {
  return await dbcontext.user.findOne({
    where: whereQuery,
    include: [
      {
        model: dbcontext.role,
        as: 'roles',
        through: { attributes: [] }
      },
      {
        model: dbcontext.user,
        as: 'createdBy',
        attributes: []
      },
      {
        model: dbcontext.user,
        as: 'updatedBy',
        attributes: []
      }
    ]
  });
};

/**
 * List of users
 */
const listPromise = async (additionalWhere) => {
  let where = [];

  if (additionalWhere) {
    where = where.concat(
      dbcontext.helper.searchHelper(additionalWhere, dbcontext.user)
    );
  }

  return await dbcontext.user.findAll(
    new ListAttributes({
      deleted: false,
      [Sequelize.Op.and]: where
    }).toJSON()
  );
};

/**
 * Create a user
 */
const createPromise = async (user, link) => {
  var roles = user.roles ? _.pluck(user.roles, 'id') : [];
  const userEntity = await dbcontext.user.create(user);

  var promises = [];
  const userroles = userEntity.setRoles(roles);
  promises.push(userroles);
  await Promise.all(promises);
  return userEntity;
};

/**
 * Update a user
 */
const updatePromise = async (user, old_user, link) => {
  user = _.extend(old_user, user);

  if (!user.save) {
    user = dbcontext.user.build(user);
    user.isNewRecord = false;
  }

  var rolesToSet = user.roles ? _.pluck(user.roles, 'id') : [];

  const userEntity = await user.save();
  var promises = [];
  const rolePromise = user.setRoles(rolesToSet);
  promises.push(rolePromise);
  await Promise.all(promises);
  return userEntity;
};

/**
 * Delete a user
 */
const deletePromise = async (user, link) => {
  try {
    // notification Info
    await utils.validateDestroy(user);
    user.deleted = true;
    const result = user.save();
    return result;
  } catch (error) {
    return error;
  }
};

/**
 * Load user form
 */
const loadFormPromise = async (user) => {
  let userForm = {};
  userForm.user = user
    ? user
    : {
        active: 1
      };

  let userRelationships = [];
  userRelationships.push(
    dbcontext.role.findAll({
      where: {
        deleted: false
      }
    })
  );

  const results = await q.all(userRelationships);

  userForm.roles = results.shift();
  return userForm;
};

/**
 * Search users by filter
 */
const advanceSearchPromise = async (search) => {
  var tableName = dbcontext.user.name;
  let where = [];

  where.push(
    Sequelize.where(Sequelize.col(tableName + '.deleted'), {
      [Sequelize.Op.eq]: false
    })
  );

  if (search.username != null) {
    where.push(
      Sequelize.where(
        Sequelize.fn('lower', Sequelize.col(tableName + '.username')),
        {
          [Sequelize.Op.like]: '%' + search.username.toLowerCase() + '%'
        }
      )
    );
  }
  if (search.firstName != null) {
    where.push(
      Sequelize.where(
        Sequelize.fn('lower', Sequelize.col(tableName + '.firstName')),
        {
          [Sequelize.Op.like]: '%' + search.firstName.toLowerCase() + '%'
        }
      )
    );
  }
  if (search.lastName != null) {
    where.push(
      Sequelize.where(
        Sequelize.fn('lower', Sequelize.col(tableName + '.lastName')),
        {
          [Sequelize.Op.like]: '%' + search.lastName.toLowerCase() + '%'
        }
      )
    );
  }
  if (search.email != null) {
    where.push(
      Sequelize.where(
        Sequelize.fn('lower', Sequelize.col(tableName + '.email')),
        {
          [Sequelize.Op.like]: '%' + search.email.toLowerCase() + '%'
        }
      )
    );
  }

  return await dbcontext.user
    .findAll({
      where: {
        [Sequelize.Op.and]: where
      },
      attributes: ['id', 'username', 'firstName', 'lastName', 'email'],
      include: [
        {
          model: dbcontext.user,
          as: 'createdBy'
        },
        {
          model: dbcontext.user,
          as: 'updatedBy',
          attributes: []
        }
      ]
    })
    .then((users) => {
      users = users.map((x) => x.toJSON());
      return users.filter((x) => true);
    });
};

const roleRelationshipListPromise = async (additionalWhere) => {
  const tableName = dbcontext.role.name;
  const where = [];

  if (additionalWhere) {
    where = where.concat(
      dbcontext.helper.searchHelper(additionalWhere, dbcontext.branch)
    );
  }

  where.push(
    Sequelize.where(Sequelize.col(tableName + '.deleted'), {
      [Sequelize.Op.eq]: false
    })
  );

  return await dbcontext.role.findAll({
    where: {
      [Sequelize.Op.and]: where
    },
    attributes: ['id', 'name'],
    order: [['name', 'ASC']]
  });
};

exports.allowedToRecoverPassword = async (username, question, answer) => {
  const user = await dbcontext.user.findOne({
    where: { username }
  });

  if (user) {
    if (user.recoveryCounter >= 3) {
      user.active = false;
      user.save();
      throw new Error(
        'Máximo de intentos alcanzados. Comunicarse al Departamento de Sistemas.'
      );
    }
    const authorization = await user.allowedToRecoverPassword(question, answer);
    if (!authorization) {
      user.recoveryCounter += 1;
    } else {
      user.recoveryCounter = 0;
    }
    if (user.recoveryCounter === 3) {
      user.active = false;
    }
    user.save();
    return authorization;
  } else {
    throw new Error('Usuario no encontrado.');
  }
};

exports.resetPassword = async (username, password) => {
  const user = await dbcontext.user.findOne({
    where: { username }
  });

  user.password = password;
  return await user.save();
};

exports.generatePassword = async (username, password, link) => {
  const user = await dbcontext.user.findOne({
    where: { username }
  });

  user.password = password;

  try {
    const result = await user.save();
    return mailer.sendMail(user, 'Nueva Contraseña', password, 4, link);
  } catch (error) {
    return error;
  }
};

exports.changePassword = async (user, passwords) => {
  const userEntity = await dbcontext.user.findOne({
    where: {
      id: user.id,
      deleted: false
    }
  });

  if (userEntity == null) {
    throw new ErrorEnums.Enums.UserNotFound();
  }

  const result = await userEntity.authenticate(passwords.password);

  if (result) {
    userEntity.password = passwords.newPassword;
    return await userEntity.save();
  } else {
    throw new ErrorEnums.Enums.CurrentPasswordNotMatch();
  }
};
module.exports.getRoles = function(user) {
  const roles = user.roles;
  const condensedRole = {};
  if (user.roles[0]) {
    Object.keys(roles[0].dataValues).forEach((x) => {
      condensedRole[x] = _.some(roles, function(role) {
        return role[x];
      });
    });
  }
  return condensedRole;
};

// * START - Export modules * //
exports.getById = getByIdPromise;

exports.list = listPromise;
exports.findOne = findOnePromise;

exports.ListAttributes = ListAttributes;

exports.create = createPromise;

exports.update = updatePromise;

exports.delete = deletePromise;

exports.loadForm = loadFormPromise;

// * END - Export modules * //
