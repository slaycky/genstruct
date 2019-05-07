'use strict';
var user = require("./UsersService");

module.exports.usersAll = (event, context, callback) => {
  user.getAll(event, context, callback);
};

module.exports.createuser = (event, context, callback) => {
  user.create(event, context, callback )
};

module.exports.updateuser = (event, context, callback) => {
  user.update(event, context, callback )
}