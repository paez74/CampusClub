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
    this.model = dbcontext.studentfrom;
    this.as = as;
    this.order = [];
    this.attributes = ['id'];
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
 * studentfrom middleware
 */
const getByIdPromise = async (id, res) => {
  const studentfrom = await dbcontext.studentfrom.findOne({
    attributes: [
      'id',
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
        model: dbcontext.studentfrom,
        as: 'descendents',
        hierarchy: true
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

  if (res) res.locals.studentfrom = studentfrom;
  return studentfrom;
};

/**
 * FindOne by where query
 */
const findOnePromise = async (whereQuery) => {
  return await dbcontext.studentfrom.findOne({
    where: whereQuery,
    include: [
      {
        model: dbcontext.studentfrom,
        as: 'descendents',
        hierarchy: true
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
 * List of studentfroms
 */
const listPromise = async (additionalWhere) => {
  let where = [];

  if (additionalWhere) {
    where = where.concat(
      dbcontext.helper.searchHelper(additionalWhere, dbcontext.studentfrom)
    );
  }

  return await dbcontext.studentfrom.findAll(
    new ListAttributes({
      deleted: false,
      hierarchyLevel: 1,
      [Sequelize.Op.and]: where
    }).toJSON()
  );
};

/**
 * Create a studentfrom
 */
const createPromise = async (studentfrom, link) => {
  var children = studentfrom.children ? studentfrom.children : [];
  const studentfromEntity = await dbcontext.studentfrom.create(studentfrom);

  var promises = [];
  const childrenPromise = children.map((child) => {
    child.parentId = studentfromEntity.id;
    if (!child.hierarchyLevel) {
      studentfrom.addChildren(child);
    }
    return dbcontext.studentfrom.create(child);
  });
  promises.push(...childrenPromise);
  await Promise.all(promises);
  return studentfromEntity;
};

/**
 * Update a studentfrom
 */
const updatePromise = async (studentfrom, old_studentfrom, link) => {
  studentfrom = _.extend(old_studentfrom, studentfrom);

  var children = studentfrom.children ? studentfrom.children : [];

  if (!studentfrom.save) {
    studentfrom = dbcontext.studentfrom.build(studentfrom);
    studentfrom.isNewRecord = false;
  }

  const studentfromEntity = await studentfrom.save();
  var promises = [];
  const childrenPromise = children.map((child) => {
    child.parentId = studentfrom.id;
    if (!child.hierarchyLevel) {
      studentfrom.addChildren(child);
    }
    return !!child.id
      ? dbcontext.studentfrom.update(child, { where: { id: child.id } })
      : dbcontext.studentfrom.create(child);
  });

  promises.push(...childrenPromise);
  await Promise.all(promises);
  return studentfromEntity;
};

/**
 * Delete a studentfrom
 */
const deletePromise = async (studentfrom, link) => {
  try {
    // notification Info
    await utils.validateDestroy(studentfrom);
    studentfrom.deleted = true;
    const result = studentfrom.save();
    return result;
  } catch (error) {
    return error;
  }
};

/**
 * Load studentfrom form
 */
const loadFormPromise = async (studentfrom) => {
  let studentfromForm = {};
  studentfromForm.studentfrom = studentfrom ? studentfrom : {};

  let studentfromRelationships = [];

  const results = await q.all(studentfromRelationships);

  return studentfromForm;
};

/**
 * Search studentfroms by filter
 */
const advanceSearchPromise = async (search) => {
  var tableName = dbcontext.studentfrom.name;
  let where = [];

  where.push(
    Sequelize.where(Sequelize.col(tableName + '.deleted'), {
      [Sequelize.Op.eq]: false
    })
  );

  return await dbcontext.studentfrom
    .findAll({
      where: {
        [Sequelize.Op.and]: where
      },
      attributes: ['id'],
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
    .then((studentfroms) => {
      studentfroms = studentfroms.map((x) => x.toJSON());
      return studentfroms.filter((x) => true);
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
