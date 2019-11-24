var _ = require('underscore');
var config = require('../lib/config');
const Sequelize = require('sequelize');
const mailer = require('../lib/mailer');
const userLogic = require('../logics//user.logic.js');
const ErrorEnums = require('../lib/enums/error');

class ListAttributes {
  constructor(where, as) {
    this.where = where;
    this.model = dbcontext.notification;
    this.as = as;
    this.attributes = [
        'id',
         'title', 
         'content',
          'link',
          'read',
          'createdAt',
          [
            Sequelize.fn(
              'concat',
              Sequelize.col('assignedTo.firstName'),
              ' ',
              Sequelize.col('assignedTo.lastName')
            ),
            'assignedToString'
          ]
        ];
    this.include = [{
        model: dbcontext.user,
        as: 'assignedTo',
        attributes: [],
      }];
    this.order = [
        ['read', 'ASC'],
        ['createdAt', 'DESC']
      ]
  }

  toJSON() {
    return {
      include: this.include,
      attributes: this.attributes,
      order:this.order,
      where: this.where,
      model: this.model,
      as: this.as,
      limit:8,
      required: false
    };
  }
}

// * START - Export modules * //
exports.getById = function(id, transaction) {
  return getByIdPromise(id, transaction);
};

exports.list = function(transaction, user) {
  return listPromise(transaction, user);
};

exports.unread = function(transaction,user){
    return unreadPromise(transaction,user);
}

exports.update = function(notification, old_notification, transaction) {
  return updatePromise(notification, old_notification, transaction);
};


exports.ListAttributes = ListAttributes;

exports.create = function(notification, transaction) {
  return createPromise(notification, transaction);
};



exports.delete = function(notification, transaction) {
  return deletePromise(notification, transaction);
};

exports.loadForm = function(notification, transaction) {
  return loadFormPromise(notification, transaction);
};

// * END - Export modules * //

/**
 * notification middleware
 */
function getByIdPromise(id, transaction) {
  return dbcontext.notification
    .findOne({
      attributes: [
        'id',
         'title', 
         'content',
          'link',
          'read',
          'createdAt',
        'assignedToId',
      ],
      where: {
        id: id
      },
      include: [
        {
          model: dbcontext.user,
          as: 'createdBy',
          attributes: []
        },
        {
          model: dbcontext.user,
          as: 'assignedTo',
          attributes: []
        }
      ]
    })
    .then(function(notification) {
      return notification;
    });
}



  // create a notifications
  function createPromise(mailInfo, transaction) {
    let notifuser = null;
  let viewRole = false;
  return dbcontext.user
    .findOne({
      where: {
        id: mailInfo.createdById,
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
    .then(function(founduser) {
      notifuser = founduser;
      roles = userLogic.getRoles(notifuser);
      viewRole = roles[mailInfo.text + 'Read']
      mailInfo.link = mailInfo.link +
      (viewRole && mailInfo.objectId != 0 ? '/' + mailInfo.text + 'detail/' + mailInfo.objectId 
      : '/' + mailInfo.text + 'list')
      var notification = {
        title:mailInfo.title,
        content:mailInfo.content,
        link: mailInfo.link,
        createdById:mailInfo.updatedById,
        assignedToId:mailInfo.createdById
    }
     
      return dbcontext.notification
      .create(notification, { transaction: transaction })
      .then(function(notification) {
        var promises = [];
        if(config.notification.allowEmailNotifications == true){
        promises.push(
          mailer.sendMail(
            notifuser,
            mailInfo.title,
            mailInfo.text,
            mailInfo.status,
            mailInfo.link 
          )
        );}
  
        return Promise.all(promises).then(() => {
          return notification;
        });
      });
    })
    .catch(function(error) {
      console.log(error);
    });
 
    
  }
/**
 * List of notifications
 */
function listPromise(transaction,user) {

  return dbcontext.notification
    .findAll(
      new ListAttributes({
        deleted: false,
        assignedToId:user.userId
      }).toJSON()
    )
    .then(function(notifications) {
      return notifications;
    });
}

/**
 * Update a notification
 */
function updatePromise(notification, old_notification, transaction) {


  notification = _.extend(old_notification, notification);

  
  if (!notification.save) {
    notification = dbcontext.notification.build(notification);
    holidays.isNewRecord = false;
  }
  return notification.save({ transaction: transaction }).then(function(notifications) {
    promises = [];
    return Promise.all(promises).then(() => {
      return notification;
    });
  });
}
function unreadPromise(transaction,user) {
    return dbcontext.notification
    .count(
        { where: 
            {
                'read': {[Sequelize.Op.eq]: false},
                'assignedToId':{[Sequelize.Op.eq]: user.userId}
            }
     })
      .then(function(notifications) {
        return {count: notifications};
      });
  }



/**
 * Delete a notification
 */
function deletePromise(notification, transaction) {
  
    var notification = notification;
    notification.deleted = true;

  dbcontext.user
    .findOne({
      where: {
        id: notification.createdById,
        deleted: false
      }
    })
    .then(function(founduser) {
      notifuser = founduser;
    })
    .catch(function(error) {
      console.log(error);
    });

  return dbcontext.notification
    .findOne({
      where: { id: notification.id },
      transaction: transaction
    })
    .then(function(notification) {
      return notification.destroy({
        transaction: transaction,
        force: true
      });
    });
}

