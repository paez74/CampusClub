
"use strict";
const nodemailer = require("nodemailer");
const moment = require("moment-timezone"); 
var fs = require("fs");
var config = require('./config');
var _ = require('underscore');

let transporter = nodemailer.createTransport({

  host: config.notification.host, 
  port: config.notification.port, 
  secure: false, 
  auth: {
    user: config.notification.email, 
    pass: config.notification.password 
  }
});

let statusMap = new Map([
  [1, 'se creo un nuevo'],
  [2, 'se actualizo un'],
  [3, 'se elimino un'],
  [4, 'su nueva contraseña es'],
]);

module.exports.sendMail = function(user, subject, item, status,link) {
  return new Promise((resolve, reject) => {
      var message = {
        from: config.notification.email,
        to:  user.email,
        subject: subject,
        html: "<body> <p> Hola " + user.firstName+ ", " 
              + statusMap.get(status) + " " + item 
              + "</p> <a href=" + link + "> Click Aqui </a></body>"
      };
      transporter.sendMail(message, function(err, info) {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    });
  
};
