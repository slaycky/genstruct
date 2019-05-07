const Sequelize = require('sequelize');
const config = require('./config.json').development;

var sequelize = new Sequelize(config.database,config.username,config.password,{...config});

module.exports = sequelize;