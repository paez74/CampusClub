const campusClub = require('../controllers/campusClub.controller');

module.exports = function(app) {
  // Cross access
  app.route('/api/campusClub/facultylist').get(campusClub.facultyList);

  // Routes
  app.route('/api/campusClub/form').get(campusClub.loadCampusClubForm);
  app
    .route('/api/campusClub/form/:campusClubId')
    .get(campusClub.loadCampusClubForm);
  app.route('/api/campusClub/search').get(campusClub.searchCampusClub);
  app
    .route('/api/campusClub/')
    .get(campusClub.campusClubList)
    .post(campusClub.createCampusClub);
  app
    .route('/api/campusClub/:campusClubId')
    .get(campusClub.readCampusClub)
    .put(campusClub.updateCampusClub)
    .delete(campusClub.deleteCampusClub);

  // Entity catch middleware
  app.param('campusClubId', campusClub.campusClubByID);
};
