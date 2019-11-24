
const SuccessEnums = require('../lib/enums/success');
const notificationLogic = require('../logics/notification.logic');

/**
 * Notification middleware
 */
exports.notificationByID = function(req, res, next, id) {
	dbcontext.sequelize.transaction(function(transaction){
		return notificationLogic	
			 .getById(id,transaction)
			 .then(function(notification){
				 res.locals.notification = notification;
				 next();
			 })
			 .catch(next);
	})
};

/**
 * Create a Notification
 */
exports.create = function(req, res,next) {

	dbcontext.sequelize.transaction(function(transaction) {
		var notification = req.body;
		return notificationLogic
		  .create(notification, transaction)
		  .then((results) =>
			next(new SuccessEnums.Enums.CreateSucceeded().setData(results))
		  ) 
		  .catch(next);
	  });
	};


/**
 * Read a Notification
 */
exports.read = function(req, res, next) {
	const old_notification = res.locals.notification;
  const notification = old_notification;
  notification.read = true;

  dbcontext.sequelize.transaction(function(transaction) {

    return notificationLogic
      .update(notification, old_notification, transaction)
      .then((results) =>
        next(new SuccessEnums.Enums.UpdateSucceded().setData(results))
      )
      .catch(next);
  });

};

/**
 * Delete a Notification
 */
exports.delete = function(req, res,next) {
	var notification = res.locals.notification;

	dbcontext.sequelize.transaction(function(transaction) {
	  
	  return notificationLogic
		.delete(notification, transaction)
		.then((results) => next(results))
		.catch(next);
	});
};

/**
 * List of Notifications
 */
exports.list = function(req, res,next) {
	user = res.locals.currentUser;
	dbcontext.sequelize.transaction(function(transaction) {
		return notificationLogic
		  .list(transaction,user)
		  .then((results) => next(results))
		  .catch(next);
	  });
};

/**
 * Amount of Unread Notifications
 */
exports.unread = function(req, res,next) {
	user = res.locals.currentUser;
	dbcontext.sequelize.transaction(function(transaction) {
		return notificationLogic
		  .unread(transaction,user)
		  .then((results) => next(results))
		  .catch(next);
	  });
};

