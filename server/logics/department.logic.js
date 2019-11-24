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
    this.model = dbcontext.department;
    this.as = as;
    this.order = [];
    this.attributes = ['id', 'code', 'name'];
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
 * department middleware
 */
const getByIdPromise = async (id, res) => {
  const department = await dbcontext.department.findOne({
    attributes: [
      'id',
      'code',
      'name',
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

  if (res) res.locals.department = department;
  return department;
};

/**
 * FindOne by where query
 */
const findOnePromise = async (whereQuery) => {
  return await dbcontext.department.findOne({
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
 * List of departments
 */
const listPromise = async (additionalWhere) => {
  let where = [];

  if (additionalWhere) {
    where = where.concat(
      dbcontext.helper.searchHelper(additionalWhere, dbcontext.department)
    );
  }

  return await dbcontext.department.findAll(
    new ListAttributes({
      deleted: false,
      [Sequelize.Op.and]: where
    }).toJSON()
  );
};

/**
 * Create a department
 */
const createPromise = async (department, link) => {
  const departmentEntity = await dbcontext.department.create(department);

  var promises = [];
  await Promise.all(promises);
  return departmentEntity;
};

/**
 * Update a department
 */
const updatePromise = async (department, old_department, link) => {
  department = _.extend(old_department, department);

  if (!department.save) {
    department = dbcontext.department.build(department);
    department.isNewRecord = false;
  }

  const departmentEntity = await department.save();
  var promises = [];
  await Promise.all(promises);
  return departmentEntity;
};

/**
 * Delete a department
 */
const deletePromise = async (department, link) => {
  try {
    // notification Info
    await utils.validateDestroy(department);
    department.deleted = true;
    const result = department.save();
    return result;
  } catch (error) {
    return error;
  }
};

/**
 * Load department form
 */
const loadFormPromise = async (department) => {
  let departmentForm = {};
  departmentForm.department = department ? department : {};

  let departmentRelationships = [];

  const results = await q.all(departmentRelationships);

  return departmentForm;
};

/**
 * Search departments by filter
 */
const advanceSearchPromise = async (search) => {
  var tableName = dbcontext.department.name;
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

  return await dbcontext.department
    .findAll({
      where: {
        [Sequelize.Op.and]: where
      },
      attributes: ['id', 'code', 'name'],
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
    .then((departments) => {
      departments = departments.map((x) => x.toJSON());
      return departments.filter((x) => true);
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

exports.search = advanceSearchPromise;

// * END - Export modules * //
