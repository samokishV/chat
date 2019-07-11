const Sequelize = require('sequelize');

const config = require('config');

const username = config.get('dbConfig.username');
const password = config.get('dbConfig.password');
const dbName = config.get('dbConfig.dbName');
const host = config.get('dbConfig.host');
const driver = config.get('dbConfig.dbDriver');

const sequelize = new Sequelize(dbName, username, password, {
  dialect: driver,
  host
});

module.exports = sequelize;
