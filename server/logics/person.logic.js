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
    this.model = dbcontext.person;
    this.as = as;
    this.order = [];
    this.attributes = ['id', 'dob', 'firstName', 'lastName', 'name'];
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
 * person middleware
 */
const getByIdPromise = async (id, res) => {
  const person = await dbcontext.person.findOne({
    attributes: [
      'id',
      'dob',
      'firstName',
      'lastName',
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

  person.name = `null`;
  if (res) res.locals.person = person;
  return person;
};

/**
 * FindOne by where query
 */
const findOnePromise = async (whereQuery) => {
  return await dbcontext.person.findOne({
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
 * List of people
 */
const listPromise = async (additionalWhere) => {
  let where = [];

  if (additionalWhere) {
    where = where.concat(
      dbcontext.helper.searchHelper(additionalWhere, dbcontext.person)
    );
  }

  return await dbcontext.person.findAll(
    new ListAttributes({
      deleted: false,
      [Sequelize.Op.and]: where
    }).toJSON()
  );
};

/**
 * Create a person
 */
const createPromise = async (person, link) => {
  const personEntity = await dbcontext.person.create(person);

  var promises = [];
  await Promise.all(promises);
  return personEntity;
};

/**
 * Update a person
 */
const updatePromise = async (person, old_person, link) => {
  person = _.extend(old_person, person);

  if (!person.save) {
    person = dbcontext.person.build(person);
    person.isNewRecord = false;
  }

  const personEntity = await person.save();
  var promises = [];
  await Promise.all(promises);
  return personEntity;
};

/**
 * Delete a person
 */
const deletePromise = async (person, link) => {
  try {
    // notification Info
    await utils.validateDestroy(person);
    person.deleted = true;
    const result = person.save();
    return result;
  } catch (error) {
    return error;
  }
};

/**
 * Load person form
 */
const loadFormPromise = async (person) => {
  let personForm = {};
  personForm.person = person ? person : {};

  let personRelationships = [];

  const results = await q.all(personRelationships);

  return personForm;
};

/**
 * Search people by filter
 */
const advanceSearchPromise = async (search) => {
  var tableName = dbcontext.person.name;
  let where = [];

  where.push(
    Sequelize.where(Sequelize.col(tableName + '.deleted'), {
      [Sequelize.Op.eq]: false
    })
  );

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

  return await dbcontext.person
    .findAll({
      where: {
        [Sequelize.Op.and]: where
      },
      attributes: ['id', 'firstName'],
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
    .then((people) => {
      people = people.map((x) => x.toJSON());
      return people.filter((x) => true);
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
