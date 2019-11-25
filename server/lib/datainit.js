const _ = require('underscore');
const bcrypt = require('bcrypt');
const q = require('q');

module.exports.initialize = async function() {
  dbcontext.user
    .findAll()
    .then(function(users) {
      if (!users.length) {
        var user = {
          username: 'admin',
          password: 'admin',
          firstName: 'Administrador',
          lastName: 'Ochoa',
          email: 'admin@bluepeople.com',
          active: true
        };

        var role = {
          code: 'A-01',
          name: 'Administrador',
          description: 'Administrador',
          active: true,
          facultyCreate: true,
          facultyRead: true,
          facultyUpdate: true,
          facultyDelete: true,
          studentfromCreate: true,
          studentfromRead: true,
          studentfromUpdate: true,
          studentfromDelete: true,
          studentCreate: true,
          studentRead: true,
          studentUpdate: true,
          studentDelete: true,
          personCreate: true,
          personRead: true,
          personUpdate: true,
          personDelete: true,
          roleCreate: true,
          roleRead: true,
          roleUpdate: true,
          roleDelete: true,
          userCreate: true,
          userRead: true,
          userUpdate: true,
          userDelete: true,
          campusClubCreate: true,
          campusClubRead: true,
          campusClubUpdate: true,
          campusClubDelete: true,
          departmentCreate: true,
          departmentRead: true,
          departmentUpdate: true,
          departmentDelete: true
        };

        dbcontext.role
          .create(role)
          .then(function(role) {
            console.log('Rol administrador creado');

            dbcontext.user
              .create(user)
              .then(function(user) {
                console.log('Usuario administrador Creado');
                user
                  .addRole(role)
                  .then(function(user) {
                    console.log(
                      'Rol administrador asignado a Usuario administrador'
                    );
                  })
                  .catch(function(error) {
                    console.error(
                      'Error al asignar rol administrador a usuario administrador\n' +
                        error
                    );
                  });
              })
              .catch(function(error) {
                console.error('Error al crear usuario administrador\n' + error);
              });
          })
          .catch(function(error) {
            console.error('Error al crear rol administrador\n' + error);
          });
      }
    })
    .catch(function(error) {
      console.log('Error while writing initial data.\n' + error);
    });

  const promises = [];

  return await Promise.all(promises);
};
