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
    this.model = dbcontext.faculty;
    this.as = as;
    this.order = [];
    this.attributes = ['id', 'name', 'rank'];
    this.include = [
      {
        model: dbcontext.department,
        as: 'worksIn'
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
 * faculty middleware
 */
const getByIdPromise = async (id, res) => {
  const faculty = await dbcontext.faculty.findOne({
    attributes: [
      'id',
      'name',
      'rank',
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
        model: dbcontext.department,
        as: 'worksIn'
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

  if (res) res.locals.faculty = faculty;
  return faculty;
};

/**
 * FindOne by where query
 */
const findOnePromise = async (whereQuery) => {
  return await dbcontext.faculty.findOne({
    where: whereQuery,
    include: [
      {
        model: dbcontext.department,
        as: 'worksIn'
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
 * List of faculties
 */
const listPromise = async (additionalWhere) => {
  let where = [];

  if (additionalWhere) {
    where = where.concat(
      dbcontext.helper.searchHelper(additionalWhere, dbcontext.faculty)
    );
  }

  return await dbcontext.faculty.findAll(
    new ListAttributes({
      deleted: false,
      [Sequelize.Op.and]: where
    }).toJSON()
  );
};

/**
 * Create a faculty
 */
const createPromise = async (faculty, link) => {
  const facultyEntity = await dbcontext.faculty.create(faculty);

  var promises = [];
  await Promise.all(promises);
  return facultyEntity;
};

/**
 * Update a faculty
 */
const updatePromise = async (faculty, old_faculty, link) => {
  faculty = _.extend(old_faculty, faculty);

  if (!faculty.save) {
    faculty = dbcontext.faculty.build(faculty);
    faculty.isNewRecord = false;
  }

  const facultyEntity = await faculty.save();
  var promises = [];
  await Promise.all(promises);
  return facultyEntity;
};

/**
 * Delete a faculty
 */
const deletePromise = async (faculty, link) => {
  try {
    // notification Info
    await utils.validateDestroy(faculty);
    faculty.deleted = true;
    const result = faculty.save();
    return result;
  } catch (error) {
    return error;
  }
};

/**
 * Load faculty form
 */
const loadFormPromise = async (faculty) => {
  let facultyForm = {};
  facultyForm.faculty = faculty ? faculty : {};

  let facultyRelationships = [];
  facultyRelationships.push(worksInRelationshipListPromise());

  const results = await q.all(facultyRelationships);

  facultyForm.worksIns = results.shift();
  return facultyForm;
};

/**
 * Search faculties by filter
 */
const advanceSearchPromise = async (search) => {
  var tableName = dbcontext.faculty.name;
  let where = [];

  where.push(
    Sequelize.where(Sequelize.col(tableName + '.deleted'), {
      [Sequelize.Op.eq]: false
    })
  );

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
  if (search.rank != null) {
    where.push(
      Sequelize.where(
        Sequelize.fn('lower', Sequelize.col(tableName + '.rank')),
        {
          [Sequelize.Op.like]: '%' + search.rank.toLowerCase() + '%'
        }
      )
    );
  }

  if (search.worksIn != null) {
    where.push(
      Sequelize.where(Sequelize.col('worksIn.id'), {
        [Sequelize.Op.eq]: search.worksIn
      })
    );
  }

  return await dbcontext.faculty
    .findAll({
      where: {
        [Sequelize.Op.and]: where
      },
      attributes: ['id', 'name', 'rank'],
      include: [
        {
          model: dbcontext.department,
          as: 'worksIn',

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
    .then((faculties) => {
      faculties = faculties.map((x) => x.toJSON());
      return faculties.filter((x) => true);
    });
};

const worksInRelationshipListPromise = async (additionalWhere) => {
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
