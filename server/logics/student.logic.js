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
    this.model = dbcontext.student;
    this.as = as;
    this.order = [];
    this.attributes = ['id', 'status'];
    this.include = [
      {
        model: dbcontext.campusClub,
        as: 'memberOfs',
        through: { attributes: [] }
      },
      {
        model: dbcontext.department,
        as: 'major'
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
 * student middleware
 */
const getByIdPromise = async (id, res) => {
  const student = await dbcontext.student.findOne({
    attributes: [
      'id',
      'status',
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
        model: dbcontext.campusClub,
        as: 'memberOfs',
        through: { attributes: [] }
      },
      {
        model: dbcontext.department,
        as: 'major'
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

  if (res) res.locals.student = student;
  return student;
};

/**
 * FindOne by where query
 */
const findOnePromise = async (whereQuery) => {
  return await dbcontext.student.findOne({
    where: whereQuery,
    include: [
      {
        model: dbcontext.campusClub,
        as: 'memberOfs',
        through: { attributes: [] }
      },
      {
        model: dbcontext.department,
        as: 'major'
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
 * List of students
 */
const listPromise = async (additionalWhere) => {
  let where = [];

  if (additionalWhere) {
    where = where.concat(
      dbcontext.helper.searchHelper(additionalWhere, dbcontext.student)
    );
  }

  return await dbcontext.student.findAll(
    new ListAttributes({
      deleted: false,
      [Sequelize.Op.and]: where
    }).toJSON()
  );
};

/**
 * Create a student
 */
const createPromise = async (student, link) => {
  var memberOfs = student.memberOfs ? _.pluck(student.memberOfs, 'id') : [];
  const studentEntity = await dbcontext.student.create(student);

  var promises = [];
  const studentmemberOfs = studentEntity.setMemberOfs(memberOfs);
  promises.push(studentmemberOfs);
  await Promise.all(promises);
  return studentEntity;
};

/**
 * Update a student
 */
const updatePromise = async (student, old_student, link) => {
  student = _.extend(old_student, student);

  if (!student.save) {
    student = dbcontext.student.build(student);
    student.isNewRecord = false;
  }

  var memberOfsToSet = student.memberOfs
    ? _.pluck(student.memberOfs, 'id')
    : [];

  const studentEntity = await student.save();
  var promises = [];
  const memberOfPromise = student.setMemberOfs(memberOfsToSet);
  promises.push(memberOfPromise);
  await Promise.all(promises);
  return studentEntity;
};

/**
 * Delete a student
 */
const deletePromise = async (student, link) => {
  try {
    // notification Info
    await utils.validateDestroy(student);
    student.deleted = true;
    const result = student.save();
    return result;
  } catch (error) {
    return error;
  }
};

/**
 * Load student form
 */
const loadFormPromise = async (student) => {
  let studentForm = {};
  studentForm.student = student ? student : {};

  let studentRelationships = [];
  studentRelationships.push(
    dbcontext.campusClub.findAll({
      where: {
        deleted: false
      }
    })
  );
  studentRelationships.push(majorRelationshipListPromise());

  const results = await q.all(studentRelationships);

  studentForm.memberOfs = results.shift();
  studentForm.majors = results.shift();
  return studentForm;
};

/**
 * Search students by filter
 */
const advanceSearchPromise = async (search) => {
  var tableName = dbcontext.student.name;
  let where = [];

  where.push(
    Sequelize.where(Sequelize.col(tableName + '.deleted'), {
      [Sequelize.Op.eq]: false
    })
  );

  if (search.status != null) {
    where.push(
      Sequelize.where(
        Sequelize.fn('lower', Sequelize.col(tableName + '.status')),
        {
          [Sequelize.Op.like]: '%' + search.status.toLowerCase() + '%'
        }
      )
    );
  }

  if (search.major != null) {
    where.push(
      Sequelize.where(Sequelize.col('major.id'), {
        [Sequelize.Op.eq]: search.major
      })
    );
  }

  return await dbcontext.student
    .findAll({
      where: {
        [Sequelize.Op.and]: where
      },
      attributes: ['id', 'status'],
      include: [
        {
          model: dbcontext.department,
          as: 'major',

          attributes: ['name']
        },
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
    .then((students) => {
      students = students.map((x) => x.toJSON());
      return students.filter((x) => true);
    });
};

const memberOfRelationshipListPromise = async (additionalWhere) => {
  const tableName = dbcontext.campusClub.name;
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

  return await dbcontext.campusClub.findAll({
    where: {
      [Sequelize.Op.and]: where
    },
    attributes: ['id', 'name', 'phone'],
    order: [['name', 'ASC'], ['phone', 'ASC']]
  });
};
const majorRelationshipListPromise = async (additionalWhere) => {
  const tableName = dbcontext.department.name;
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

  return await dbcontext.department.findAll({
    where: {
      [Sequelize.Op.and]: where
    },
    attributes: ['id', 'name'],
    order: [['name', 'ASC']]
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
