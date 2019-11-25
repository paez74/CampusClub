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
    this.model = dbcontext.role;
    this.as = as;
    this.order = [];
    this.attributes = [
      'id',
      'code',
      'name',
      'description',
      'active',
      'facultyCreate',
      'facultyRead',
      'facultyUpdate',
      'facultyDelete',
      'studentfromCreate',
      'studentfromRead',
      'studentfromUpdate',
      'studentfromDelete',
      'studentCreate',
      'studentRead',
      'studentUpdate',
      'studentDelete',
      'personCreate',
      'personRead',
      'personUpdate',
      'personDelete',
      'roleCreate',
      'roleRead',
      'roleUpdate',
      'roleDelete',
      'userCreate',
      'userRead',
      'userUpdate',
      'userDelete',
      'campusClubCreate',
      'campusClubRead',
      'campusClubUpdate',
      'campusClubDelete',
      'departmentCreate',
      'departmentRead',
      'departmentUpdate',
      'departmentDelete'
    ];
    this.include = [];
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
 * role middleware
 */
const getByIdPromise = async (id, res) => {
  const role = await dbcontext.role.findOne({
    attributes: [
      'id',
      'code',
      'name',
      'description',
      'active',
      'facultyCreate',
      'facultyRead',
      'facultyUpdate',
      'facultyDelete',
      'studentfromCreate',
      'studentfromRead',
      'studentfromUpdate',
      'studentfromDelete',
      'studentCreate',
      'studentRead',
      'studentUpdate',
      'studentDelete',
      'personCreate',
      'personRead',
      'personUpdate',
      'personDelete',
      'roleCreate',
      'roleRead',
      'roleUpdate',
      'roleDelete',
      'userCreate',
      'userRead',
      'userUpdate',
      'userDelete',
      'campusClubCreate',
      'campusClubRead',
      'campusClubUpdate',
      'campusClubDelete',
      'departmentCreate',
      'departmentRead',
      'departmentUpdate',
      'departmentDelete',
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

  if (res) res.locals.role = role;
  return role;
};

/**
 * FindOne by where query
 */
const findOnePromise = async (whereQuery) => {
  return await dbcontext.role.findOne({
    where: whereQuery,
    include: [
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
 * List of roles
 */
const listPromise = async (additionalWhere) => {
  let where = [];

  if (additionalWhere) {
    where = where.concat(
      dbcontext.helper.searchHelper(additionalWhere, dbcontext.role)
    );
  }

  return await dbcontext.role.findAll(
    new ListAttributes({
      deleted: false,
      [Sequelize.Op.and]: where
    }).toJSON()
  );
};

/**
 * Create a role
 */
const createPromise = async (role, link) => {
  const roleEntity = await dbcontext.role.create(role);

  var promises = [];
  await Promise.all(promises);
  return roleEntity;
};

/**
 * Update a role
 */
const updatePromise = async (role, old_role, link) => {
  role = _.extend(old_role, role);

  if (!role.save) {
    role = dbcontext.role.build(role);
    role.isNewRecord = false;
  }

  const roleEntity = await role.save();
  var promises = [];
  await Promise.all(promises);
  return roleEntity;
};

/**
 * Delete a role
 */
const deletePromise = async (role, link) => {
  try {
    // notification Info
    await utils.validateDestroy(role);
    role.deleted = true;
    const result = role.save();
    return result;
  } catch (error) {
    return error;
  }
};

/**
 * Load role form
 */
const loadFormPromise = async (role) => {
  let roleForm = {};
  roleForm.role = role
    ? role
    : {
        active: 1
      };

  let roleRelationships = [];

  const results = await q.all(roleRelationships);

  return roleForm;
};

/**
 * Search roles by filter
 */
const advanceSearchPromise = async (search) => {
  var tableName = dbcontext.role.name;
  let where = [];

  where.push(
    Sequelize.where(Sequelize.col(tableName + '.deleted'), {
      [Sequelize.Op.eq]: false
    })
  );

  if (search.code != null) {
    where.push(
      Sequelize.where(
        Sequelize.fn('lower', Sequelize.col(tableName + '.code')),
        {
          [Sequelize.Op.like]: '%' + search.code.toLowerCase() + '%'
        }
      )
    );
  }
  if (search.name != null) {
    where.push(
      Sequelize.where(
        Sequelize.fn('lower', Sequelize.col(tableName + '.name')),
        {
          [Sequelize.Op.like]: '%' + search.name.toLowerCase() + '%'
        }
      )
    );
  }
  if (search.active != null) {
    where.push(
      Sequelize.where(
        Sequelize.fn('lower', Sequelize.col(tableName + '.active')),
        {
          [Sequelize.Op.like]: '%' + search.active.toLowerCase() + '%'
        }
      )
    );
  }

  return await dbcontext.role
    .findAll({
      where: {
        [Sequelize.Op.and]: where
      },
      attributes: ['id', 'code', 'name', 'active'],
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
    .then((roles) => {
      roles = roles.map((x) => x.toJSON());
      return roles.filter((x) => true);
    });
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
