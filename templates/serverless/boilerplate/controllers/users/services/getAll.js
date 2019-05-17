const sequelize = require('../../../config/database');
const Sequelize = require('sequelize');
const User = require("../../../models/user")(sequelize, Sequelize);