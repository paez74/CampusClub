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
    this.model = dbcontext.campusClub;
    this.as = as;
    this.order = [];
    this.attributes = [
      'id',
      'name',
      'locationLatitude',
      'locationLongitude',
      'phone'
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
 * campusClub middleware
 */
const getByIdPromise = async (id, res) => {
  const campusClub = await dbcontext.campusClub.findOne({
    attributes: [
      'id',
      'name',
      'locationLatitude',
      'locationLongitude',
      'phone',
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

  if (res) res.locals.campusClub = campusClub;
  return campusClub;
};

/**
 * FindOne by where query
 */
const findOnePromise = async (whereQuery) => {
  return await dbcontext.campusClub.findOne({
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
 * List of campusClubs
 */
const listPromise = async (additionalWhere) => {
  let where = [];

  if (additionalWhere) {
    where = where.concat(
      dbcontext.helper.searchHelper(additionalWhere, dbcontext.campusClub)
    );
  }

  return await dbcontext.campusClub.findAll(
    new ListAttributes({
      deleted: false,
      [Sequelize.Op.and]: where
    }).toJSON()
  );
};

/**
 * Create a campusClub
 */
const createPromise = async (campusClub, link) => {
  const campusClubEntity = await dbcontext.campusClub.create(campusClub);

  var promises = [];
  await Promise.all(promises);
  return campusClubEntity;
};

/**
 * Update a campusClub
 */
const updatePromise = async (campusClub, old_campusClub, link) => {
  campusClub = _.extend(old_campusClub, campusClub);

  if (!campusClub.save) {
    campusClub = dbcontext.campusClub.build(campusClub);
    campusClub.isNewRecord = false;
  }

  const campusClubEntity = await campusClub.save();
  var promises = [];
  await Promise.all(promises);
  return campusClubEntity;
};

/**
 * Delete a campusClub
 */
const deletePromise = async (campusClub, link) => {
  try {
    // notification Info
    await utils.validateDestroy(campusClub);
    campusClub.deleted = true;
    const result = campusClub.save();
    return result;
  } catch (error) {
    return error;
  }
};

/**
 * Load campusClub form
 */
const loadFormPromise = async (campusClub) => {
  let campusClubForm = {};
  campusClubForm.campusClub = campusClub ? campusClub : {};

  let campusClubRelationships = [];

  const results = await q.all(campusClubRelationships);

  return campusClubForm;
};

/**
 * Search campusClubs by filter
 */
const advanceSearchPromise = async (search) => {
  var tableName = dbcontext.campusClub.name;
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
  if (search.phone != null) {
    where.push(
      Sequelize.where(
        Sequelize.fn('lower', Sequelize.col(tableName + '.phone')),
        {
          [Sequelize.Op.like]: '%' + search.phone.toLowerCase() + '%'
        }
      )
    );
  }

  return await dbcontext.campusClub
    .findAll({
      where: {
        [Sequelize.Op.and]: where
      },
      attributes: ['id', 'name', 'phone'],
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
    .then((campusClubs) => {
      campusClubs = campusClubs.map((x) => x.toJSON());
      return campusClubs.filter((x) => true);
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
